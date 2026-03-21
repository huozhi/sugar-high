'use client'

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { tokenize, SugarHigh } from 'sugar-high'
import * as langPresets from 'sugar-high/presets'
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

function debounce(func, timeout = 200) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

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

function highlightOptionsForFilePath(filePath: string) {
  const p = filePath.toLowerCase()
  if (p.endsWith('.css')) return { ...langPresets.css }
  if (p.endsWith('.py')) return { ...langPresets.python }
  if (p.endsWith('.rs')) return { ...langPresets.rust }
  return undefined
}

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

const EXAMPLE_GITHUB_FILE =
  'https://github.com/vercel/swr/blob/main/src/index/use-swr.ts'

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
    setColorPlateColors(themes[currentThemeIndex].colors)
  }, [currentThemeIndex])

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

  const [liveCodeTokens, setLiveCodeTokens] = useState([])
  const highlightOptionsRef = useRef(undefined)
  const [githubUrlInput, setGithubUrlInput] = useState(
    () => initialGithubUrl?.trim() || ''
  )
  const [githubLoadError, setGithubLoadError] = useState<string | null>(null)
  const [githubLoading, setGithubLoading] = useState(false)

  const debouncedTokenizeRef = useRef(
    debounce((c) => {
      const tokens = tokenize(c, highlightOptionsRef.current)
      setLiveCodeTokens(tokens)
    })
  )
  const debouncedTokenize = debouncedTokenizeRef.current

  const applyLoadedSource = useCallback((text, filePath) => {
    const opts = highlightOptionsForFilePath(filePath)
    highlightOptionsRef.current = opts
    setLiveCode(text)
    setLiveCodeTokens(tokenize(text, opts))
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
        const { text, path } = await fetchGithubSource(trimmed)
        applyLoadedSource(text, path)
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

  useEffect(() => {
    if (!showGithubLoader || !initialGithubUrl?.trim()) return
    loadFromGithubRef.current(initialGithubUrl)
  }, [showGithubLoader, initialGithubUrl])

  const customizableColorsString = useMemo(() => {
    return customizableColors
      .map(([_tokenType, tokenTypeName]) => {
        return `--sh-${tokenTypeName}: ${colorPlateColors[tokenTypeName]};`
      })
      .join('\n')
  }, [colorPlateColors])

  return (
    <div className="live-editor-section">
      <style>{`
        ${`
        .live-editor-section {
          --sh-class: ${colorPlateColors.class};
          --sh-identifier: ${colorPlateColors.identifier};
          --sh-sign: ${colorPlateColors.sign};
          --sh-property: ${colorPlateColors.property};
          --sh-entity: ${colorPlateColors.entity};
          --sh-string: ${colorPlateColors.string};
          --sh-keyword: ${colorPlateColors.keyword};
          --sh-comment: ${colorPlateColors.comment};
          --sh-jsxliterals: ${colorPlateColors.jsxliterals};
        }
        .live-editor-section .live-editor textarea {
          color: ${textareaColor} !important;
        }
        `}`}</style>

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
      {showGithubLoader && (
        <div className="container-720 github-source-loader">
          <label className="github-source-loader__label" htmlFor="github-file-url">
            Open a GitHub file
          </label>
          <div className="github-source-loader__row">
            <input
              id="github-file-url"
              type="url"
              className="github-source-loader__input"
              placeholder={EXAMPLE_GITHUB_FILE}
              value={githubUrlInput}
              disabled={githubLoading}
              onChange={(e) => setGithubUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') loadFromGithub(githubUrlInput)
              }}
            />
            <button
              type="button"
              className="github-source-loader__button"
              disabled={githubLoading}
              onClick={() => loadFromGithub(githubUrlInput)}
            >
              {githubLoading ? 'Loading…' : 'Load'}
            </button>
          </div>
          {githubLoadError && (
            <p className="github-source-loader__error" role="alert">
              {githubLoadError}
            </p>
          )}
          <p className="github-source-loader__hint">
            Paste a <code>github.com/…/blob/…</code> link (example:{' '}
            <a href={EXAMPLE_GITHUB_FILE}>{EXAMPLE_GITHUB_FILE}</a>
            ) or a{' '}
            <code>raw.githubusercontent.com</code> URL. You can also open{' '}
            <a href={`/editor?github=${encodeURIComponent(EXAMPLE_GITHUB_FILE)}`}>
              /editor?github=…
            </a>{' '}
            with a URL-encoded link.
          </p>
        </div>
      )}
      <div className="live-editor-layout">
        <div className="live-editor-editor-col">
          {process.env.NODE_ENV === 'development' && (
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
                debouncedTokenize(newCode)
                if (!isTyping && persistEditorDraft) setDefaultLiveCode(newCode)
              }}
            />
          </div>
        </div>

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
      </div>
      {/* show tokens */}
      <div className="container-720">
        <div className="editor-tokens">
        {liveCodeTokens.map(([tokenType, token], index) => {
          const tokenTypeName = SugarHigh.TokenTypes[tokenType]
          if (
            tokenTypeName === 'break' ||
            tokenTypeName === 'space' ||
            token === '\n' ||
            token.trim() === ''
          ) return null
          return (
            <span className={`editor-token editor-token--${tokenTypeName}`} key={index}>
              {token}{` `}
            </span>
          )
        })}
        </div>
      </div>
    </div>
  )
}
