'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { highlight, tokenize, SugarHigh } from 'sugar-high'
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
      <h1>
        Hello
        <span className="small"> world</span>
      </h1>
      <div style={styles.bar} />
    </>
  )
}

`

function useTextTypingAnimation(targetText, delay, onReady) {

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

  const customizableColorsString= useMemo(() => {
    return customizableColors.map(([tokenType, tokenTypeName]) => {
      return `--sh-${tokenTypeName}: ${colorPlateColors[tokenTypeName]};`
    }).join('\n')
  },[colorPlateColors])


  return (
    <div className={`max-width-container live-editor-section`}>
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
            debouncedTokenize(newCode)
            if (!isTyping) setDefaultLiveCode(newCode)
          }}
        />

        <ul className='live-editor__color'>
          <div className='color-palette'>
            <h3>Color palette</h3>
            <CopyButton codeSnippet={customizableColorsString}/>
          </div>
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
                <span>{colorPlateColors[tokenTypeName]}</span>
              </li>
            )
          })}
        </ul>
      </div>
      {isDebug &&
        <div className='editor-tokens'>
          <pre>
            {liveCodeTokens.map(([tokenType, token], index) => {
              const tokenTypeName = SugarHigh.TokenTypes[tokenType]
              return (
                <div key={index}>{tokenTypeName}{' '.repeat(12 - tokenTypeName.length)} {token}</div>
              )
            })}
          </pre>
        </div>
      }
    </div>
  )
}

