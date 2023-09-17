'use client'

import { useState, useEffect, useRef } from 'react'
import { highlight, tokenize, SugarHigh } from 'sugar-high'
import { Editor } from 'codice'

const defaultColorPlateColors = {
  class: '#8d85ff',
  identifier: '#354150',
  sign: '#8996a3',
  string: '#00a99a',
  keyword: '#f47067',
  comment: '#a19595',
  jsxliterals: '#6266d1',
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

const defaultLiveCode = `\
export default function App() {
  return <p>hello world<p>
}`

function useTextTypingAnimation(targetText, delay, onReady) {
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeoutId

    const typeText = (index) => {
      if (index === targetText.length) {
        setIsTyping(false)
        onReady()
        return
      }

      setText(targetText.substring(0, index + 1))
      timeoutId = setTimeout(() => typeText(index + 1), delay / targetText.length)
    }

    typeText(0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [targetText, delay])

  return { text, isTyping, setText }
}


export default function LiveEditor() {
  const editorRef = useRef()
  const [colorPlateColors, setColorPlateColors] = useState(defaultColorPlateColors)
  const isDebug = process.env.NODE_ENV === 'development'

  const { text: liveCode, setText: setLiveCode } = useTextTypingAnimation(defaultLiveCode, 1000, () => {
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

