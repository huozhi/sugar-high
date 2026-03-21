'use client'

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { SugarHigh } from 'sugar-high'
import { Editor } from 'codice'
import { CopyButton } from './components/copy-button'

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

export type LiveEditorProps = {
  enableTypingAnimation?: boolean
  defaultCode?: string
  persistEditorDraft?: boolean
  /** Merged onto the outer `live-editor-section` (e.g. `live-editor-section--github-preview`). */
  className?: string
  /** Controlled source; use together with `onChange`. */
  value?: string
  onChange?: (code: string) => void
  /** When false, use default syntax palette and hide theme / color rail (compact embeds). */
  showThemeControls?: boolean
}

export default function LiveEditor({
  enableTypingAnimation = false,
  defaultCode = DEFAULT_LIVE_CODE,
  persistEditorDraft = true,
  className = '',
  value,
  onChange,
  showThemeControls = true,
}: LiveEditorProps) {
  const isControlled = value !== undefined && onChange !== undefined

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
    if (!showThemeControls) return
    setColorPlateColors(themes[currentThemeIndex].colors)
  }, [currentThemeIndex, showThemeControls])

  const toggleTextareaColor = () => {
    setTextareaColor((prev) =>
      prev === 'transparent' ? '#66666682' : 'transparent'
    )
  }

  const isInspecting = textareaColor !== 'transparent'
  const buttonText = isInspecting ? 'Matching' : 'Matched'

  const { defaultLiveCode, setDefaultLiveCode } = useDefaultLiveCode(
    defaultCode,
    persistEditorDraft && !isControlled
  )

  const animationTarget = isControlled ? value : defaultLiveCode
  const {
    text: animatedCode,
    setText: setAnimatedCode,
    isTyping,
  } = useTextTypingAnimation(
    animationTarget,
    1000,
    enableTypingAnimation && !isControlled,
    () => {
      if (editorRef.current) {
        setTimeout(() => {
          editorRef.current.focus()
        })
      }
    }
  )

  const displayCode = isControlled ? value : animatedCode

  const handleEditorChange = useCallback(
    (newCode) => {
      if (isControlled) {
        onChange(newCode)
      } else {
        setAnimatedCode(newCode)
        if (!isTyping && persistEditorDraft) setDefaultLiveCode(newCode)
      }
    },
    [
      isControlled,
      onChange,
      setAnimatedCode,
      isTyping,
      persistEditorDraft,
      setDefaultLiveCode,
    ]
  )

  const activePlateColors = showThemeControls
    ? colorPlateColors
    : defaultColorPlateColors

  const customizableColorsString = useMemo(() => {
    return customizableColors
      .map(([_tokenType, tokenTypeName]) => {
        return `--sh-${tokenTypeName}: ${activePlateColors[tokenTypeName]};`
      })
      .join('\n')
  }, [activePlateColors])

  const textareaTint = showThemeControls ? textareaColor : 'transparent'

  const sectionClass =
    `live-editor-section${className ? ` ${className}` : ''}`.trim()

  return (
    <div className={sectionClass}>
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

      {showThemeControls && (
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
      <div className="live-editor-layout">
        <div className="live-editor-editor-col">
          {showThemeControls && process.env.NODE_ENV === 'development' && (
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
              value={displayCode}
              fontSize={14}
              lineNumbersWidth='2rem'
              onChange={handleEditorChange}
            />
          </div>
        </div>

        {showThemeControls && (
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
