'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { highlight, tokenize, SugarHigh } from 'sugar-high'
import { Editor } from 'codice'

const defaultColorPlateColors = {
  class: '#8d85ff',
  identifier: '#354150',
  sign: '#8996a3',
  entity: '#249a97',
  jsxliterals: '#bf7db6',
  string: '#00a99a',
  keyword: '#f47067',
  comment: '#a19595',
  break: '#ffffff',
  space: '#ffffff',
}

function debounce(func, timeout = 200){
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
  .sort((a, b) => a - b)

const DEFAULT_LIVE_CODE = `\
export default function App() {
  return (
    <>
      <div>
        <span>text</span>
      </div>
      <div ref={refs.setFloating} style={floatingStyles} />
    </>
  )
}

`

function useTextTypingAnimation(targetText, delay, onReady) {
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  
  const typeText = useCallback((index) => {
    if (text.length === targetText.length) {
      setIsTyping(false)
      onReady()
      return
    }

    setText(targetText.substring(0, index + 1))
    setTimeout(() => typeText(index + 1), delay / targetText.length)
  }, [targetText, text])
  
  useEffect(() => {
    if (!text.length) {
      typeText(0)
    }
  }, [targetText, text])

  return { text, isTyping, setText }
}

const DEFAULT_LIVE_CODE_KEY = '$saved-live-code'
function useDefaultLiveCode() {
  const [defaultCode, setCode] = useState('')

  useEffect(() => {
    if (defaultCode) return

    setCode(
      window.localStorage.getItem(DEFAULT_LIVE_CODE_KEY) || DEFAULT_LIVE_CODE
    )
  }, [defaultCode])

  const setDefaultLiveCode = (code) =>
    window.localStorage.setItem(DEFAULT_LIVE_CODE_KEY, code)

  return {
    defaultLiveCode: defaultCode,
    setDefaultLiveCode,
  }
}

export default function LiveEditor() {
  const editorRef = useRef()
  const [colorPlateColors, setColorPlateColors] = useState(defaultColorPlateColors)
  const isDebug = process.env.NODE_ENV === 'development'

  const { defaultLiveCode, setDefaultLiveCode } = useDefaultLiveCode()
  const { text: liveCode, setText: setLiveCode, isTyping } = useTextTypingAnimation(defaultLiveCode, 1000, () => {
    if (editorRef.current) {
      // focus needs to be delayed
      setTimeout(() => {
        editorRef.current.focus()
      })
    }
  })


  const [liveCodeTokens, setLiveCodeTokens] = useState([])
  const debouncedTokenizeRef = useRef(debounce((c) => {
    const tokens = tokenize(c)
    setLiveCodeTokens(tokens)
  }))
  const debouncedTokenize = debouncedTokenizeRef.current

  return (
    <div className={`max-width-container live-editor-section`}>
      <style>{`
        ${`
        .live-editor-section {
          --sh-class: ${colorPlateColors.class};
          --sh-identifier: ${colorPlateColors.identifier};
          --sh-sign: ${colorPlateColors.sign};
          --sh-entity: ${colorPlateColors.entity};
          --sh-string: ${colorPlateColors.string};
          --sh-keyword: ${colorPlateColors.keyword};
          --sh-comment: ${colorPlateColors.comment};
          --sh-jsxliterals: ${colorPlateColors.jsxliterals};
        }
        `}`
      }</style>

      <div className='flex live-editor'>
        <Editor
          ref={editorRef}
          className='codice-editor flex-1'
          highlight={highlight}
          value={liveCode}
          onChange={(newCode) => {
            setLiveCode(newCode)
            !isTyping && setDefaultLiveCode(newCode)
            debouncedTokenize(newCode)
          }}
        />

        <ul className='live-editor__color'>
          <h3>Color palette</h3>
          {customizableColors.map(([tokenType, tokenTypeName]) => {
            const inputId = `live-editor-color__input--${tokenTypeName}`
            return (
              <li key={tokenType} className='live-editor__color__item'>
                <label htmlFor={inputId} className='flex align-center'>
                  <span className={`live-editor__color__item__indicator live-editor__color__item__indicator--${tokenTypeName}`} style={{ color: colorPlateColors[tokenTypeName] }} />
                  {tokenTypeName}
                </label>
                <input
                  type='color'
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
      {isDebug &&
        <div className='editor-tokens'>
          <pre>
            {liveCodeTokens.map(([tokenType, token], i) => {
              const tokenTypeName = SugarHigh.TokenTypes[tokenType]
              return (
                <div key={i}>{tokenTypeName}{' '.repeat(12 - tokenTypeName.length)} {token}</div>
              )
            })}
          </pre>
        </div>
      }
    </div>
  )
}

