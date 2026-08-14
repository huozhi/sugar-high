'use client'

import { useState } from 'react'
import { Editor } from '@sugar-high/react'
import type { LanguageName } from 'sugar-high'
import { languages } from 'sugar-high/lang'

const initialCode = `import { useState } from 'react'
import { Editor } from '@sugar-high/react'

const defaultText = 'console.log("hello world")'

export default function Page() {
  const [code, setCode] = useState(defaultText)
  const [title, setTitle] = useState('index.js')

  return (
    <Editor
      value={code}
      title={title}
      onChange={(text) => setCode(text)}
      onChangeTitle={(title) => setTitle(title)}
    />
  )
}`

export function ReactDemo() {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState<LanguageName>('typescript')
  const [lineNumbers, setLineNumbers] = useState(true)

  return (
    <div className="react-demo">
      <Editor
        className="react-demo__editor"
        lang={language}
        title={null}
        controls={false}
        value={code}
        lineNumbers={lineNumbers}
        onChange={setCode}
      />
      <div className="react-demo__status">
        <div className="react-demo__settings">
          <label>
            <span className="sr-only">Language</span>
            <select
              aria-label="Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as LanguageName)}
            >
              {languages.map(({ id }) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={(event) => setLineNumbers(event.target.checked)}
            />
            line numbers
          </label>
        </div>
        <span>{code.split('\n').length} lines · {code.length} characters</span>
      </div>
    </div>
  )
}
