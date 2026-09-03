'use client'

import {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { SugarHigh } from 'sugar-high/core'
import { Editor } from '@sugar-high/react'
import { CopyButton } from './components/copy-button'
import { copyImageDataUrl } from './lib/copy-image'
import {
  SYNTAX_PRESET_SELECT_OPTIONS,
  exampleFromSyntaxSelect,
  fileExtensionFromSyntaxSelect,
  syntaxPresetSelectValue,
} from './syntax-highlight-presets'
import { LANGUAGE_EXAMPLES } from './language-examples'
import {
  LIVE_EDITOR_THEME_PRESETS,
  buildCodiceThemeCopySnippet,
  buildFlatVarsCopySnippet,
  type LiveEditorColorPlate,
} from './live-editor-presets'
import { SyntaxThemeContext } from './syntax-theme-context'

const themes = LIVE_EDITOR_THEME_PRESETS

const defaultColorPlateColors: LiveEditorColorPlate = themes[0].colors

const customizableColors = Object.entries(SugarHigh.TokenTypes)
  .filter(([, tokenTypeName]) => tokenTypeName !== 'break' && tokenTypeName !== 'space')
  .sort((a, b) => Number(a) - Number(b))

const DEFAULT_LIVE_CODE = LANGUAGE_EXAMPLES.javascript
const DEFAULT_LIVE_EDITOR_MIN_HEIGHT = `${
  DEFAULT_LIVE_CODE.split('\n').length * 1.35 + 1.5
}rem`

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
  const captureRef = useRef<HTMLDivElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureFilename, setCaptureFilename] = useState('example.js')
  const [capturePadding, setCapturePadding] = useState<20 | 36 | 56>(36)
  const [editorSize, setEditorSize] = useState<{ width: number }>({
    width: 640,
  })
  const [localThemeIndex, setLocalThemeIndex] = useState(0)
  const [localIsDarkTheme, setLocalIsDarkTheme] = useState(false)
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const currentThemeIndex = syntaxThemeCtx?.themeIndex ?? localThemeIndex
  const isDarkTheme = syntaxThemeCtx
    ? syntaxThemeCtx.previewMode === 'dark'
    : localIsDarkTheme

  const [textareaColor, setTextareaColor] = useState('transparent')

  const currentTheme = themes[currentThemeIndex]
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length]
  const colorPlateColors =
    isDarkTheme && currentTheme.colorsDark
      ? currentTheme.colorsDark
      : currentTheme.colors

  const toggleTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length
    if (syntaxThemeCtx) syntaxThemeCtx.setThemeIndex(nextIndex)
    else setLocalThemeIndex(nextIndex)
  }

  const toggleAppearance = () => {
    if (syntaxThemeCtx) {
      syntaxThemeCtx.setPreviewMode(isDarkTheme ? 'light' : 'dark')
    } else {
      setLocalIsDarkTheme(value => !value)
    }
  }

  const toggleTextareaColor = () => {
    setTextareaColor((prev) =>
      prev === 'transparent' ? '#66666682' : 'transparent'
    )
  }

  const isInspecting = textareaColor !== 'transparent'

  const captureScreenshot = useCallback(async () => {
    if (!captureRef.current || isCapturing) return

    setIsCapturing(true)
    try {
      const { default: domToImage } = await import('dom-to-image')
      const node = captureRef.current
      const rect = node.getBoundingClientRect()
      const dataUrl = await domToImage.toPng(node, {
        width: node.scrollWidth,
        height: node.scrollHeight,
        bgcolor: isDarkTheme ? '#3a3d42' : '#eef1f3',
      })

      const preview = document.createElement('img')
      preview.src = dataUrl
      preview.alt = ''
      preview.className = 'live-editor__screenshot-preview'
      preview.style.left = `${rect.left}px`
      preview.style.top = `${rect.top}px`
      preview.style.width = `${rect.width}px`
      preview.style.height = `${rect.height}px`
      document.body.appendChild(preview)
      requestAnimationFrame(() => preview.classList.add('live-editor__screenshot-preview--minimized'))
      preview.addEventListener('animationend', () => preview.remove(), { once: true })

      await copyImageDataUrl(dataUrl)
    } finally {
      setIsCapturing(false)
    }
  }, [isCapturing, isDarkTheme])

  const startResize = useCallback(
    (edge: 'right' | 'left', event: ReactPointerEvent) => {
      event.preventDefault()
      const target = event.currentTarget as HTMLElement
      const editor = target.parentElement
      if (!editor) return

      target.setPointerCapture(event.pointerId)
      const rect = editor.getBoundingClientRect()
      const startX = event.clientX

      const onMove = (moveEvent: PointerEvent) => {
        const horizontalDelta = moveEvent.clientX - startX
        const widthDelta = edge === 'left' ? -horizontalDelta : horizontalDelta

        setEditorSize({
          width: Math.max(360, rect.width + widthDelta * 2),
        })
      }

      const onEnd = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onEnd)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onEnd, { once: true })
    },
    []
  )

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
        '--live-editor-window-surface': isDarkTheme ? '#242629' : '#ffffff',
        '--live-editor-canvas-surface': isDarkTheme ? '#3a3d42' : '#eef1f3',
        '--live-editor-window-border': isDarkTheme ? '#34373b' : '#e4e7e9',
        '--live-editor-preset-min-height': DEFAULT_LIVE_EDITOR_MIN_HEIGHT,
      }) as CSSProperties,
    [activePlateColors, isDarkTheme, textareaTint]
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
          const selectValue = e.target.value
          const nextExtension = fileExtensionFromSyntaxSelect(selectValue)
          if (onFileExtensionChange) {
            onFileExtensionChange(nextExtension)
          } else {
            setLocalFileExtension(nextExtension)
            const example = exampleFromSyntaxSelect(selectValue)
            if (example) {
              setAnimatedCode(example.code)
              setCaptureFilename(example.filename)
              if (persistEditorDraft) setDefaultLiveCode(example.code)
            }
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
                : '') +
              (languageSwitcher && !isControlled
                ? ' live-editor--preset-height'
                : '')
            }
          >
            {colorPlate && (
              <div
                className="live-editor__header"
                role="toolbar"
                aria-label="Syntax theme"
              >
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="live-editor__theme-button"
                  aria-label={`Next syntax theme (${nextTheme.name})`}
                  title={`Theme: ${currentTheme.name}`}
                >
                  <span className="live-editor__theme-name">{currentTheme.name}</span>
                  <span className="live-editor__swatches" aria-hidden="true">
                    {customizableColors.map(([tokenType, tokenTypeName]) => (
                      <span
                        key={tokenType}
                        className="live-editor__swatch-dot"
                        style={{ backgroundColor: colorPlateColors[tokenTypeName] }}
                      />
                    ))}
                  </span>
                </button>
                <button
                  type="button"
                  className="live-editor__appearance-toggle"
                  onClick={toggleAppearance}
                  aria-label={isDarkTheme ? 'Use light code theme' : 'Use dark code theme'}
                  aria-pressed={isDarkTheme}
                  title={isDarkTheme ? 'Light theme' : 'Dark theme'}
                >
                  <span aria-hidden="true" />
                </button>
              </div>
            )}
            {!colorPlate && languageControl}
            <div
              className="live-editor__capture-area"
              ref={captureRef}
              style={{ padding: capturePadding }}
            >
              <div className="live-editor__window" style={{ width: editorSize.width }}>
                <div className="live-editor__window-header">
                  <div className="live-editor__window-buttons" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <input
                    className="live-editor__filename"
                    value={captureFilename}
                    onChange={(event) => setCaptureFilename(event.target.value)}
                    aria-label="Screenshot filename"
                    spellCheck={false}
                  />
                  <span className="live-editor__window-header-spacer" aria-hidden="true" />
                </div>
                <Editor
                  ref={editorRef}
                  className="codice editor flex-1"
                  controls={false}
                  value={displayCode}
                  fontSize="0.9rem"
                  extension={activeFileExtension}
                  onChange={handleEditorChange}
                />
                {(['right', 'left'] as const).map((edge) => (
                  <div
                    key={edge}
                    className={`live-editor__resize-handle live-editor__resize-handle--${edge}`}
                    onPointerDown={(event) => startResize(edge, event)}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            {colorPlate && (
              <div
                className="live-editor__footer"
                role="toolbar"
                aria-label="Code appearance and export"
              >
                <div className="live-editor__toolbar-actions">
                  <select
                    className="live-editor__padding-select"
                    value={capturePadding}
                    onChange={(event) =>
                      setCapturePadding(Number(event.target.value) as 20 | 36 | 56)
                    }
                    aria-label="Screenshot background padding"
                    title="Screenshot background padding"
                  >
                    <option value={20}>Compact</option>
                    <option value={36}>Balanced</option>
                    <option value={56}>Spacious</option>
                  </select>
                  <CopyButton
                    codeSnippet={customizableColorsString}
                    aria-label="Copy color theme"
                    title="Copy color theme"
                  />
                  <button
                    type="button"
                    onClick={toggleTextareaColor}
                    className={`textarea-color-toggle ${isInspecting ? 'textarea-color-toggle--active' : ''}`}
                    aria-label={isInspecting ? 'Hide alignment overlay' : 'Show alignment overlay'}
                    aria-pressed={isInspecting}
                    title={isInspecting ? 'Hide alignment overlay' : 'Show alignment overlay'}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                    </svg>
                  </button>
                  {languageControl}
                  <button
                    type="button"
                    className="live-editor__screenshot-button"
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                    aria-label="Copy code screenshot"
                    title="Copy code screenshot"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 5.5 10 3.5h4l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h3.5Z" />
                      <circle cx="12" cy="12.5" r="3.5" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
