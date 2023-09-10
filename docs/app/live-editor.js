'use client'

import { useState, useRef } from 'react'
import { highlight, tokenize, types as TOKEN_TYPES } from 'sugar-high'
import { Editor } from 'codice'

function debounce(func, timeout = 200){
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}


const defaultLiveCode = `\
export default function App() {
  return "hello world"
}
`
export default function LiveEditor() {
  const [isLineNumberEnabled, setLineNumberEnabled] = useState(true)
  const [isDebug, setIsDebug] = useState(false)
  const [liveCode, setLiveCode] = useState(defaultLiveCode)
  const [liveCodeTokens, setLiveCodeTokens] = useState([])
  const debouncedTokenizeRef = useRef(debounce((c) => {
    const tokens = tokenize(c)
    setLiveCodeTokens(tokens)
  }))
  const debouncedTokenize = debouncedTokenizeRef.current

  return (
    <div className={`live-editor-section ${isDebug ? `live-editor-section--debug` : 'live-editor-section--default'}`}>
      <style>{`
        .live-editor {
          --editor-text-color: ${isDebug ? '#2c7ea163' : 'transparent'};
        }
        ${isLineNumberEnabled ? `
          .sh__line::before {
            counter-increment: sh-line-number 1;
            content: counter(sh-line-number);
            width: 24px;
            display: inline-block;
            margin-right: 18px;
            margin-left: -42px;
            text-align: right;
            color: #a4a4a4;
          }` : ''
        }
        code {
          ${isLineNumberEnabled ? `padding-left: 48px;` : ''}
        }`
      }</style>
      <h3>Try it out!</h3>
      <div className="features">
        <div className="features__control">
          <input type="checkbox" checked={isLineNumberEnabled} onChange={(e) => setLineNumberEnabled(e.target.checked)} /> Show line number
        </div>
        <div className="features__control">
          <input type="checkbox" checked={isDebug} onChange={(e) => setIsDebug(e.target.checked)} /> Show highlighting info
        </div>
      </div>

      <div className='flex live-editor'>
        <Editor
          highlight={highlight}
          value={liveCode}
          onChange={(newCode) => {
            setLiveCode(newCode)
            debouncedTokenize(newCode)
          }}
        />
        <ul className='live-editor-color-plate'>
          {Object.entries(TOKEN_TYPES).sort((a, b) => a - b).map(([tokenType, tokenTypeName]) => (
            <li key={tokenType} className='live-editor-color'>
              <span className={`live-editor-color-plate-block sh__token--${tokenTypeName}`} /> {tokenTypeName}
            </li>
          ))}
        </ul>
      </div>
      {isDebug &&
        <div>
          <div className='editor-tokens'>
            <pre>
              {liveCodeTokens.map(([tokenType, token], i) => {
                const tokenTypeName = TOKEN_TYPES[tokenType]
                return (
                  <div key={i}>{tokenTypeName}{' '.repeat(12 - tokenTypeName.length)} {token}</div>
                )
              })}
            </pre>
          </div>
        </div>
      }
    </div>
  )
}

