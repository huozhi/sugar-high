'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { tokenize, SugarHigh } from 'sugar-high'
import { Editor } from 'codice'
import { CopyButton } from './components/copy-button'

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

function debounce(func, timeout = 200) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

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
  if (!enableTypingAnimation) {
    return {
      text: targetText,
      isTyping: false,
      setText: () => {},
    }
  }
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const animationDuration = delay / targetText.length
  let timeoutId = useRef(null)

  useEffect(() => {
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
  }, [targetText, text, timeoutId.current])

  return { text, isTyping, setText }
}

const DEFAULT_LIVE_CODE_KEY = '$saved-live-code'
function useDefaultLiveCode(defaultCodeText) {
  const [defaultCode, setCode] = useState(defaultCodeText || '')

  useEffect(() => {
    if (defaultCode) return

    setCode(window.localStorage.getItem(DEFAULT_LIVE_CODE_KEY) || DEFAULT_LIVE_CODE)
  }, [defaultCode])

  const setDefaultLiveCode = (code) => window.localStorage.setItem(DEFAULT_LIVE_CODE_KEY, code)

  return {
    defaultLiveCode: defaultCode,
    setDefaultLiveCode,
  }
}

export default function LiveEditor({
  enableTypingAnimation = true,
  defaultCode = DEFAULT_LIVE_CODE,
}) {
  const editorRef = useRef(null)
  const [colorPlateColors, setColorPlateColors] = useState(defaultColorPlateColors)
  const [textareaColor, setTextareaColor] = useState('transparent')

  const toggleTextareaColor = () => {
    setTextareaColor(prev => prev === 'transparent' ? '#66666682' : 'transparent')
  }

  const isInspecting = textareaColor !== 'transparent'
  const buttonText = isInspecting ? 'Matching' : 'Matched'

  const { defaultLiveCode, setDefaultLiveCode } = useDefaultLiveCode(defaultCode)
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
  const debouncedTokenizeRef = useRef(
    debounce((c) => {
      const tokens = tokenize(c)
      setLiveCodeTokens(tokens)
    })
  )
  const debouncedTokenize = debouncedTokenizeRef.current

  const customizableColorsString = useMemo(() => {
    return customizableColors
      .map(([_tokenType, tokenTypeName]) => {
        return `--sh-${tokenTypeName}: ${colorPlateColors[tokenTypeName]};`
      })
      .join('\n')
  }, [colorPlateColors])

  return (
    <div className={`container-720 live-editor-section`}>
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

        {process.env.NODE_ENV === 'development' && (
          <div className="textarea-color-toggle-container">
            <button
              onClick={toggleTextareaColor}
              className={`textarea-color-toggle ${isInspecting ? 'textarea-color-toggle--active' : ''}`}
            >
              {buttonText}
            </button>
          </div>
        )}
      <div className="flex live-editor">
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
            if (!isTyping) setDefaultLiveCode(newCode)
          }}
        />

        <ul className="live-editor__color">
          <h3>
            Color palette <CopyButton codeSnippet={customizableColorsString} />
          </h3>
          {customizableColors.map(([tokenType, tokenTypeName]) => {
            const inputId = `live-editor-color__input--${tokenTypeName}`
            return (
              <li key={tokenType} className="live-editor__color__item">
                <label htmlFor={inputId} className="flex align-center">
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
  )
}
