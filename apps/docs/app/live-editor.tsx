'use client'

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Suspense,
} from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SugarHigh } from 'sugar-high'
import { Editor } from 'codice'
import { CopyButton } from './components/copy-button'
import { fetchGithubSource } from './github-source'

// Original colorful theme
const defaultColorPlateColors = {
  class: '#8d85ff',
  identifier: '#354150',
  sign: '#8996a3',
  entity: '#6eafad',
  property: '#4e8fdf',
  jsxliterals: '#bf7db6',
  string: '#00a99a',
  keyword: '#f47067',
  comment: '#a19595',
  break: '#ffffff',
  space: '#ffffff',
}

// Minimal gray theme with 3 colors
const minimalGrayTheme = {
  name: 'Minimal Gray',
  colors: {
    primary: '#2d2d2d',    // Dark gray for keywords, class
    secondary: '#6b6b6b',  // Medium gray for identifiers, properties
    tertiary: '#9a9a9a',  // Light gray for comments, signs
  }
}

// Map token types to minimal gray theme colors
function getMinimalThemeColors() {
  const { primary, secondary, tertiary } = minimalGrayTheme.colors
  return {
    class: primary,
    identifier: secondary,
    sign: tertiary,
    entity: secondary,
    property: secondary,
    jsxliterals: primary,
    string: secondary,
    keyword: primary,
    comment: tertiary,
    break: '#ffffff',
    space: '#ffffff',
  }
}

const themes = [
  { name: 'Stylish', colors: defaultColorPlateColors },
  { name: 'Minimal', colors: getMinimalThemeColors() },
]

const customizableColors = Object.entries(SugarHigh.TokenTypes)
  .filter(([, tokenTypeName]) => tokenTypeName !== 'break' && tokenTypeName !== 'space')
  .sort((a, b) => Number(a) - Number(b))

const DEFAULT_LIVE_CODE = `\
export default function App() {
  return (
    <>
      <h1 id="title">
        Hello
        <span> world</span>
      </h1>
      <div style={styles.bar} />
    </>
  )
}

`

/** Notable OSS files for one-click preview (TS/TSX, CSS). */
const GITHUB_QUICK_EXAMPLES = [
  {
    label: 'swr',
    file: 'use-swr.ts',
    url: 'https://github.com/vercel/swr/blob/main/src/index/use-swr.ts',
  },
  {
    label: 'zustand',
    file: 'vanilla.ts',
    url: 'https://github.com/pmndrs/zustand/blob/main/src/vanilla.ts',
  },
  {
    label: 'normalize',
    file: 'normalize.css',
    url: 'https://github.com/necolas/normalize.css/blob/master/normalize.css',
  },
  {
    label: 'next.js',
    file: 'page.tsx',
    url: 'https://github.com/vercel/next.js/blob/canary/examples/hello-world/app/page.tsx',
  },
] as const

function useTextTypingAnimation(targetText, delay, enableTypingAnimation, onReady) {
  const [text, setText] = useState(enableTypingAnimation ? '' : targetText)
  const [isTyping, setIsTyping] = useState(enableTypingAnimation)
  const animationDuration = delay / targetText.length
  let timeoutId = useRef(null)

  useEffect(() => {
    if (!enableTypingAnimation) {
      setText(targetText)
      setIsTyping(false)
      return
    }

    setText('')
    setIsTyping(true)
  }, [enableTypingAnimation, targetText])

  useEffect(() => {
    if (!enableTypingAnimation) return

    if (isTyping && targetText.length) {
      if (text.length < targetText.length) {
        const nextText = targetText.substring(0, text.length + 1)
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
          timeoutId.current = null
        }
        timeoutId.current = setTimeout(() => {
          setText(nextText)
        }, animationDuration)
      } else if (text.length === targetText.length) {
        setIsTyping(false)
        onReady()
      }
    }
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [enableTypingAnimation, targetText, text, animationDuration, onReady])

  return { text, isTyping, setText }
}

const DEFAULT_LIVE_CODE_KEY = '$saved-live-code'

function useDefaultLiveCode(defaultCodeText, restoreFromStorage = true) {
  const [defaultCode, setCode] = useState(() =>
    restoreFromStorage ? defaultCodeText || '' : (defaultCodeText ?? '')
  )

  useEffect(() => {
    if (!restoreFromStorage) return
    if (defaultCode) return

    setCode(window.localStorage.getItem(DEFAULT_LIVE_CODE_KEY) || DEFAULT_LIVE_CODE)
  }, [defaultCode, restoreFromStorage])

  const setDefaultLiveCode = useCallback((code) => {
    window.localStorage.setItem(DEFAULT_LIVE_CODE_KEY, code)
  }, [])

  return {
    defaultLiveCode: defaultCode,
    setDefaultLiveCode,
  }
}

/** Syncs `?github=` with the browser and loads from the URL when it changes (shareable links). */
function GithubPreviewUrlSync({
  registerSync,
  lastLoadedRef,
  loadRef,
  setGithubUrlInput,
}: {
  registerSync: (fn: ((url: string) => void) | null) => void
  lastLoadedRef: React.MutableRefObject<string | null>
  loadRef: React.MutableRefObject<(url: string) => Promise<void>>
  setGithubUrlInput: React.Dispatch<React.SetStateAction<string>>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const githubParam = searchParams.get('github')?.trim() || ''

  useEffect(() => {
    const sync = (url: string) => {
      const q = new URLSearchParams()
      q.set('github', url)
      router.replace(`${pathname}?${q.toString()}`, { scroll: false })
    }
    registerSync(sync)
    return () => registerSync(null)
  }, [pathname, router, registerSync])

  useEffect(() => {
    if (!githubParam) {
      lastLoadedRef.current = null
      return
    }
    if (lastLoadedRef.current === githubParam) return
    setGithubUrlInput(githubParam)
    void loadRef.current(githubParam)
  }, [githubParam, lastLoadedRef, loadRef, setGithubUrlInput])

  return null
}

export default function LiveEditor({
  enableTypingAnimation = false,
  defaultCode = DEFAULT_LIVE_CODE,
  showGithubLoader = false,
  initialGithubUrl = '',
  persistEditorDraft = true,
}) {
  const editorRef = useRef(null)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [colorPlateColors, setColorPlateColors] = useState(() => themes[0].colors)
  const [textareaColor, setTextareaColor] = useState('transparent')

  const currentTheme = themes[currentThemeIndex]
  const isMinimalMode = currentThemeIndex === 1

  const toggleTheme = () => {
    setCurrentThemeIndex((prev) => (prev === 0 ? 1 : 0))
  }

  useEffect(() => {
    if (showGithubLoader) return
    setColorPlateColors(themes[currentThemeIndex].colors)
  }, [currentThemeIndex, showGithubLoader])

  const toggleTextareaColor = () => {
    setTextareaColor(prev => prev === 'transparent' ? '#66666682' : 'transparent')
  }

  const isInspecting = textareaColor !== 'transparent'
  const buttonText = isInspecting ? 'Matching' : 'Matched'

  const restoreFromStorage = !showGithubLoader
  const { defaultLiveCode, setDefaultLiveCode } = useDefaultLiveCode(
    defaultCode,
    restoreFromStorage
  )
  const {
    text: liveCode,
    setText: setLiveCode,
    isTyping,
  } = useTextTypingAnimation(defaultLiveCode, 1000, enableTypingAnimation, () => {
    if (editorRef.current) {
      // focus needs to be delayed
      setTimeout(() => {
        editorRef.current.focus()
      })
    }
  })

  const [githubUrlInput, setGithubUrlInput] = useState(
    () => initialGithubUrl?.trim() || ''
  )
  const [githubLoadError, setGithubLoadError] = useState<string | null>(null)
  const [githubLoading, setGithubLoading] = useState(false)

  const lastGithubLoadedUrlRef = useRef<string | null>(null)
  const githubUrlSyncFnRef = useRef<((url: string) => void) | null>(null)
  const registerGithubUrlSync = useCallback(
    (fn: ((url: string) => void) | null) => {
      githubUrlSyncFnRef.current = fn
    },
    []
  )

  const applyLoadedSource = useCallback((text) => {
    setLiveCode(text)
    if (persistEditorDraft) setDefaultLiveCode(text)
  }, [persistEditorDraft, setDefaultLiveCode, setLiveCode])

  const loadFromGithub = useCallback(
    async (url) => {
      const trimmed = url.trim()
      if (!trimmed) {
        setGithubLoadError('Paste a GitHub file URL.')
        return
      }
      setGithubLoadError(null)
      setGithubLoading(true)
      try {
        const { text } = await fetchGithubSource(trimmed)
        applyLoadedSource(text)
        lastGithubLoadedUrlRef.current = trimmed
        githubUrlSyncFnRef.current?.(trimmed)
      } catch (e) {
        setGithubLoadError(e instanceof Error ? e.message : 'Failed to load.')
      } finally {
        setGithubLoading(false)
      }
    },
    [applyLoadedSource]
  )

  const loadFromGithubRef = useRef(loadFromGithub)
  loadFromGithubRef.current = loadFromGithub

  const activePlateColors = showGithubLoader ? defaultColorPlateColors : colorPlateColors

  const customizableColorsString = useMemo(() => {
    return customizableColors
      .map(([_tokenType, tokenTypeName]) => {
        return `--sh-${tokenTypeName}: ${activePlateColors[tokenTypeName]};`
      })
      .join('\n')
  }, [activePlateColors])

  const textareaTint = showGithubLoader ? 'transparent' : textareaColor

  return (
    <div
      className={
        showGithubLoader
          ? 'live-editor-section live-editor-section--github-preview'
          : 'live-editor-section'
      }
    >
      <style>{`
        ${`
        .live-editor-section {
          --sh-class: ${activePlateColors.class};
          --sh-identifier: ${activePlateColors.identifier};
          --sh-sign: ${activePlateColors.sign};
          --sh-property: ${activePlateColors.property};
          --sh-entity: ${activePlateColors.entity};
          --sh-string: ${activePlateColors.string};
          --sh-keyword: ${activePlateColors.keyword};
          --sh-comment: ${activePlateColors.comment};
          --sh-jsxliterals: ${activePlateColors.jsxliterals};
        }
        .live-editor-section .live-editor textarea {
          color: ${textareaTint} !important;
        }
        `}`}</style>

      {!showGithubLoader && (
        <div className="container-720 live-editor__top-bar">
          <div className="top-controls">
            <button
              onClick={toggleTheme}
              className={`theme-mode-button theme-mode-button--mobile ${isMinimalMode ? 'theme-mode-button--minimal' : 'theme-mode-button--stylish'}`}
              aria-label={isMinimalMode ? 'Switch to Stylish theme' : 'Switch to Minimal theme'}
            >
              {currentTheme.name}
            </button>
          </div>
        </div>
      )}
      {showGithubLoader && (
        <Suspense fallback={null}>
          <GithubPreviewUrlSync
            registerSync={registerGithubUrlSync}
            lastLoadedRef={lastGithubLoadedUrlRef}
            loadRef={loadFromGithubRef}
            setGithubUrlInput={setGithubUrlInput}
          />
        </Suspense>
      )}
      {showGithubLoader && (
        <div className="container-720 github-source-loader github-source-loader--minimal">
          <div className="github-source-loader__row">
            <div className="github-source-loader__input-wrap">
              <input
                id="github-file-url"
                type="url"
                className="github-source-loader__input github-source-loader__input--underline"
                placeholder="https://github.com/…/blob/…/file"
                value={githubUrlInput}
                disabled={githubLoading}
                onChange={(e) => setGithubUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loadFromGithub(githubUrlInput)
                }}
              />
            </div>
            <button
              type="button"
              className="github-source-loader__button github-source-loader__button--minimal"
              disabled={githubLoading}
              onClick={() => loadFromGithub(githubUrlInput)}
            >
              {githubLoading ? '…' : 'Load'}
            </button>
          </div>
          {githubLoadError && (
            <p className="github-source-loader__error" role="alert">
              {githubLoadError}
            </p>
          )}
          <div
            className="github-source-loader__hint github-source-loader__hint--compact github-source-loader__examples"
            role="group"
            aria-labelledby="github-quick-examples-heading"
          >
            <p
              id="github-quick-examples-heading"
              className="github-source-loader__examples-label"
            >
              Examples
            </p>
            <ul className="github-source-loader__examples-list">
              {GITHUB_QUICK_EXAMPLES.map((ex) => (
                <li key={ex.url} className="github-source-loader__examples-item">
                  <button
                    type="button"
                    className="github-source-loader__example-load"
                    disabled={githubLoading}
                    aria-label={`Load example: ${ex.url}`}
                    onClick={() => {
                      setGithubUrlInput(ex.url)
                      void loadFromGithub(ex.url)
                    }}
                  >
                    {ex.label}
                    {' - '}
                    <span className="github-source-loader__example-file">{ex.file}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="live-editor-layout">
        <div className="live-editor-editor-col">
          {!showGithubLoader && process.env.NODE_ENV === 'development' && (
            <div className="textarea-color-toggle-container">
              <button
                type="button"
                onClick={toggleTextareaColor}
                className={`textarea-color-toggle ${isInspecting ? 'textarea-color-toggle--active' : ''}`}
              >
                {buttonText}
              </button>
            </div>
          )}
          <div className="live-editor">
            <Editor
              ref={editorRef}
              className="codice editor flex-1"
              controls={false}
              value={liveCode}
              fontSize={14}
              lineNumbersWidth='2rem'
              onChange={(newCode) => {
                setLiveCode(newCode)
                if (!isTyping && persistEditorDraft) setDefaultLiveCode(newCode)
              }}
            />
          </div>
        </div>

        {!showGithubLoader && (
          <ul className="live-editor__color">
            <li className="live-editor__color__theme">
              <div className="color-theme-title">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`theme-mode-button ${isMinimalMode ? 'theme-mode-button--minimal' : 'theme-mode-button--stylish'}`}
                  aria-label={isMinimalMode ? 'Switch to Stylish theme' : 'Switch to Minimal theme'}
                >
                  <span className="theme-mode-button__full">{currentTheme.name}</span>
                </button>
                <CopyButton codeSnippet={customizableColorsString} />
              </div>
            </li>
            {customizableColors.map(([tokenType, tokenTypeName]) => {
              const inputId = `live-editor-color__input--${tokenTypeName}`
              return (
                <li key={tokenType} className="live-editor__color__item">
                  <label htmlFor={inputId} className="flex align-center" title={tokenTypeName}>
                    <span
                      className={`live-editor__color__item__indicator live-editor__color__item__indicator--${tokenTypeName}`}
                      style={{ color: colorPlateColors[tokenTypeName] }}
                    />
                    <span className='live-editor__color__item__name'>{tokenTypeName}</span>
                    <span className='live-editor__color__item__color'>{colorPlateColors[tokenTypeName]}</span>
                  </label>

                  <input
                    type="color"
                    defaultValue={colorPlateColors[tokenTypeName]}
                    id={inputId}
                    onChange={(e) => {
                      setColorPlateColors({
                        ...colorPlateColors,
                        [tokenTypeName]: e.target.value,
                      })
                    }}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
