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
  const [lineNumbers, setLineNumbers] = useState(true)

  return (
    <div className="react-demo">
      <Editor
        className="react-demo__editor"
        lang="typescript"
        title={null}
        controls={false}
        value={code}
        lineNumbers={lineNumbers}
        onChange={setCode}
      />
      <div className="react-demo__status">
        <label>
          <input
            type="checkbox"
            checked={lineNumbers}
            onChange={(event) => setLineNumbers(event.target.checked)}
          />
          line numbers
        </label>
        <span>{code.split('\n').length} lines · {code.length} characters</span>
      </div>
    </div>
  )
}
