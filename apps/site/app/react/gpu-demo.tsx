'use client'

import { useState } from 'react'
import { Editor } from '@sugar-high/react/gpu'
import { useReactTheme } from '../components/react-themes'

const initialCode = `import { Editor } from '@sugar-high/react/gpu'

export function LargeEditor({ source }) {
  return (
    <Editor
      value={source}
      onChange={saveSource}
      lineNumbers
    />
  )
}`

export function GpuDemo() {
  const { palette } = useReactTheme()
  const [code, setCode] = useState(initialCode)

  return (
    <div className="react-demo">
      <Editor
        className="react-demo__editor"
        theme={palette}
        title={null}
        controls={false}
        value={code}
        onChange={setCode}
      />
      <div className="react-demo__status">
        <span>{code.split('\n').length} lines · {code.length} characters</span>
        <span>WebGPU · language agnostic</span>
      </div>
    </div>
  )
}
