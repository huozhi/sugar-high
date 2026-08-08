'use client'

import { useState } from 'react'
import { Editor } from '@sugar-high/react'

const initialCode = `import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`

export function ReactDemo() {
  const [code, setCode] = useState(initialCode)
  const [title, setTitle] = useState('counter.tsx')
  const [lineNumbers, setLineNumbers] = useState(true)

  return (
    <div className="react-demo">
      <div className="react-demo__toolbar">
        <span>Live editor</span>
        <label>
          <input
            type="checkbox"
            checked={lineNumbers}
            onChange={(event) => setLineNumbers(event.target.checked)}
          />
          line numbers
        </label>
      </div>
      <Editor
        className="react-demo__editor"
        lang="typescript"
        title={title}
        value={code}
        lineNumbers={lineNumbers}
        onChange={setCode}
        onChangeTitle={setTitle}
      />
      <div className="react-demo__status">
        <span>{title}</span>
        <span>{code.split('\n').length} lines · {code.length} characters</span>
      </div>
    </div>
  )
}
