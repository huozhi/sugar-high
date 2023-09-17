'use client'

import { useState, useRef } from 'react'
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
  return "hello world"
}
`
export default function LiveEditor() {
  const [colorPlateColors, setColorPlateColors] = useState(defaultColorPlateColors)
  const isLineNumberEnabled = true
  const isDebug = false
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
        .sh__line::before {
          counter-increment: sh-line-number 1;
          content: counter(sh-line-number);
          width: 24px;
          display: inline-block;
          margin-right: 18px;
          margin-left: -42px;
          text-align: right;
          color: #a4a4a4;
        }
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
        `}
        code {
          padding-left: 48px;
        }`
      }</style>

      <div className='flex live-editor'>
        <Editor
          className='flex-1'
          highlight={highlight}
          value={liveCode}
          onChange={(newCode) => {
            setLiveCode(newCode)
            debouncedTokenize(newCode)
          }}
        />

        <ul className='live-editor__color'>
          <div>

          <h3>
            Color palette{' '}
            <svg style={{width: 14}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512">
          <g>
            <path d="M483.8,354.8l-13.5,14.3l-13.4,14.4c1.4,1.3,2.9,3.5,4.1,6.3c1.1,2.8,1.8,6.2,1.8,9.4c0,3-0.5,5.7-1.5,8.1
              c-1,2.3-2.2,4.2-4.1,5.8c-21.7,19.3-48.1,34.2-77.3,44.3c-29.1,10.1-60.8,15.2-92.8,15.2h-2c-32-0.2-64.1-5.6-94.1-16.2
              c-30-10.6-57.7-26.3-81.2-47c-23.7-20.9-41.2-45-52.9-70.6c-11.7-25.6-17.5-52.7-17.5-79.9c0-27.1,5.8-54.3,17.5-79.9
              c11.7-25.6,29.2-49.7,52.9-70.6c25.7-22.8,55.3-40.1,86.5-51.6c31.2-11.6,64-17.4,95.9-17.4c27.3,0,54,4.3,78.5,12.7
              c24.5,8.5,46.9,21.1,65.8,37.7c12.3,10.9,21.3,23.2,27.2,36.3c6,13.1,8.9,26.9,8.9,40.8c0,13.8-3,27.7-8.9,40.8
              c-6,13.1-15,25.5-27.2,36.3l-37.3,33.1c-6.2,5.5-11.1,11.9-14.6,19c-3.4,7.1-5.3,14.9-5.3,22.7c0,7.8,1.8,15.6,5.3,22.7
              c3.4,7.1,8.4,13.5,14.6,19l-0.1-0.1c2.4,2.2,4.9,4.2,7.7,6.2c2.1,1.5,4.3,2.8,6.7,4c3.5,1.8,7.3,3.2,11.1,4.3
              c3.9,1.1,7.8,1.9,12.2,2.6h-0.1c2.6,0.4,5.1,0.8,7.3,1.3c3.4,0.7,6.3,1.5,8.5,2.3c1.1,0.4,2,0.9,2.7,1.3c0.7,0.4,1.2,0.8,1.7,1.2
              l-0.1-0.1l13.5-14.4l13.4-14.5c-3.5-3.2-7.3-5.7-11-7.7c-5.6-2.9-11.1-4.6-16.1-5.8s-9.5-1.9-13.3-2.6c-3.2-0.5-5.6-1-7.4-1.5
              c-1.4-0.4-2.4-0.7-3.2-1c-1.2-0.5-2-0.9-3-1.6c-1.1-0.7-2.4-1.8-4.3-3.5c-2.6-2.3-4.3-4.6-5.2-6.6c-1-2-1.3-3.8-1.3-5.6
              c0-1.8,0.4-3.5,1.3-5.6c1-2,2.6-4.3,5.2-6.6l37.3-33.1c16.3-14.4,28.7-31.3,37-49.5s12.5-37.6,12.5-57.1s-4.2-38.9-12.5-57.1
              s-20.7-35.1-37-49.5c-23.1-20.3-50.1-35.4-79-45.4C354.5,4.9,323.6,0,292.2,0c-36.7,0-74,6.7-109.5,19.8
              c-35.6,13.2-69.4,32.9-99,59.1C56,103.4,35,132,21,162.7C7,193.4,0,226.1,0,258.9s7,65.5,21,96.2s35,59.3,62.7,83.8
              c27.6,24.4,59.9,42.6,94.2,54.7c34.3,12.1,70.7,18.2,106.9,18.5h0.1h2.2c36.2,0,72.2-5.8,105.7-17.4c33.5-11.6,64.5-28.9,90.6-52.1
              l-0.1,0.1c6.6-5.9,11.5-13,14.5-20.5s4.4-15.3,4.4-22.9c0-8.3-1.6-16.4-4.6-24C494.6,367.8,490.1,360.7,483.8,354.8z"/>
            <circle cx="118.2" cy="196.9" r="39.4"/>
            <circle cx="128" cy="323.7" r="39.4"/>
            <circle cx="216.6" cy="118.2" r="39.4"/>
            <circle cx="256" cy="392.6" r="59.1"/>
            <circle cx="344.6" cy="118.2" r="39.4"/>
          </g>
          </svg>
          </h3>

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

