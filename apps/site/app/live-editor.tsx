'use client'

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type CSSProperties,
} from 'react'
import { SugarHigh } from 'sugar-high/core'
import { Editor } from '@sugar-high/react'
import { CopyButton } from './components/copy-button'
import {
  SYNTAX_PRESET_SELECT_OPTIONS,
  fileExtensionFromSyntaxSelect,
  syntaxPresetSelectValue,
} from './syntax-highlight-presets'
import {
  LIVE_EDITOR_THEME_PRESETS,
  buildCodiceThemeCopySnippet,
  buildFlatVarsCopySnippet,
  type LiveEditorColorPlate,
} from './live-editor-presets'

const themes = LIVE_EDITOR_THEME_PRESETS

const defaultColorPlateColors: LiveEditorColorPlate = themes[0].colors

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
  colorPlate?: boolean
  /** Show a language control, using local state unless `onFileExtensionChange` is provided. */
  languageSwitcher?: boolean
  /**
   * Passed to Codice as `extension` so sugar-high presets apply (e.g. `py` → Python `#` comments).
   */
  fileExtension?: string
  /**
   * When set, shows a language control (top-right of the editor) so users can override highlighting
   * after pasting code. Use with controlled `fileExtension`.
   */
  onFileExtensionChange?: (extension: string | undefined) => void
}

export default function LiveEditor({
  enableTypingAnimation = false,
  defaultCode = DEFAULT_LIVE_CODE,
  persistEditorDraft = true,
  className = '',
  value,
  onChange,
  colorPlate = true,
  languageSwitcher = false,
  fileExtension,
  onFileExtensionChange,
}: LiveEditorProps) {
  const isControlled = value !== undefined && onChange !== undefined
  const [localFileExtension, setLocalFileExtension] = useState<string | undefined>(
    fileExtension
  )
  const showLanguageSwitcher = languageSwitcher || Boolean(onFileExtensionChange)
  const activeFileExtension = languageSwitcher && !onFileExtensionChange
    ? localFileExtension
    : fileExtension

  const editorRef = useRef(null)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [colorPlateColors, setColorPlateColors] = useState(
    () => themes[0].colors
  )

  const [textareaColor, setTextareaColor] = useState('transparent')

  const currentTheme = themes[currentThemeIndex]
  const isMinimalMode = currentTheme.id === 'minimal-gray'
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length]

  const toggleTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % themes.length)
  }

  useEffect(() => {
    if (!colorPlate) return
    setColorPlateColors(themes[currentThemeIndex].colors)
  }, [currentThemeIndex, colorPlate])

  const toggleTextareaColor = () => {
    setTextareaColor((prev) =>
      prev === 'transparent' ? '#66666682' : 'transparent'
    )
  }

  const isInspecting = textareaColor !== 'transparent'

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

  const activePlateColors = colorPlate
    ? colorPlateColors
    : defaultColorPlateColors

  const customizableColorsString = useMemo(() => {
    const t = themes[currentThemeIndex]
    if (t.codiceHighlightTheme && t.colorsDark) {
      return buildCodiceThemeCopySnippet(
        t.codiceHighlightTheme,
        activePlateColors,
        t.colorsDark
      )
    }
    return buildFlatVarsCopySnippet(activePlateColors)
  }, [activePlateColors, currentThemeIndex])

  const textareaTint = colorPlate ? textareaColor : 'transparent'
  const editorStyle = useMemo(
    () =>
      ({
        '--sh-class': activePlateColors.class,
        '--sh-identifier': activePlateColors.identifier,
        '--sh-sign': activePlateColors.sign,
        '--sh-property': activePlateColors.property,
        '--sh-entity': activePlateColors.entity,
        '--sh-string': activePlateColors.string,
        '--sh-keyword': activePlateColors.keyword,
        '--sh-comment': activePlateColors.comment,
        '--sh-jsxliterals': activePlateColors.jsxliterals,
        '--live-editor-textarea-color': textareaTint,
      }) as CSSProperties,
    [activePlateColors, textareaTint]
  )

  const sectionClass =
    `live-editor-section${className ? ` ${className}` : ''}`.trim()

  const languageControl = showLanguageSwitcher ? (
    <div className="live-editor__syntax-toolbar">
      <select
        className="live-editor__syntax-toolbar-select"
        aria-label="Syntax language"
        title="Syntax language"
        value={syntaxPresetSelectValue(activeFileExtension)}
        onChange={(e) => {
          const nextExtension = fileExtensionFromSyntaxSelect(e.target.value)
          if (onFileExtensionChange) {
            onFileExtensionChange(nextExtension)
          } else {
            setLocalFileExtension(nextExtension)
          }
        }}
      >
        {SYNTAX_PRESET_SELECT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  ) : null

  return (
    <div className={sectionClass}>
      <div className="live-editor-layout">
        <div className="live-editor-editor-col">
          <div
            style={editorStyle}
            className={
              'live-editor' +
              (colorPlate ? ' live-editor--with-header' : '') +
              (!colorPlate && showLanguageSwitcher
                ? ' live-editor--with-syntax-toolbar'
                : '')
            }
          >
            {colorPlate && (
              <div className="live-editor__header">
                <button
                  type="button"
                  onClick={toggleTextareaColor}
                  className={`textarea-color-toggle ${isInspecting ? 'textarea-color-toggle--active' : ''}`}
                  aria-label={isInspecting ? 'Hide alignment overlay' : 'Show alignment overlay'}
                  aria-pressed={isInspecting}
                  title={isInspecting ? 'Hide alignment overlay' : 'Show alignment overlay'}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                  </svg>
                </button>
                {languageControl}
              </div>
            )}
            {!colorPlate && languageControl}
            <Editor
              ref={editorRef}
              className="codice editor flex-1"
              controls={false}
              value={displayCode}
              fontSize={15}
              extension={activeFileExtension}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        {colorPlate && (
          <ul className="live-editor__color">
            <li className="live-editor__color__theme">
              <div className="color-theme-title">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`theme-mode-button ${isMinimalMode ? 'theme-mode-button--minimal' : 'theme-mode-button--stylish'}`}
                  aria-label={`Next syntax theme (${nextTheme.name})`}
                >
                  <span className="theme-mode-button__full">{currentTheme.name}</span>
                </button>
                <CopyButton
                  codeSnippet={customizableColorsString}
                  aria-label="Copy color theme"
                  title="Copy color theme"
                />
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
                    key={`${currentTheme.id}-${tokenTypeName}`}
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
