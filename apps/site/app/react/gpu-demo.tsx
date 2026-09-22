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
const sample = `export function transform(items: Array<{ id: number; label: string }>) {
  // Filter a batch, keeping its original order.
  const selected = items.filter(item => item.id % 2 === 0);
  return selected.map(({ id, label }) => ({ id, label: label.toUpperCase() }));
}

`

export function GpuDemo() {
  const { palette } = useReactTheme()
  const [code, setCode] = useState(initialCode)
  const [size, setSize] = useState('example')

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
        <span>{code.split('\n').length.toLocaleString()} lines · {code.length.toLocaleString()} characters</span>
        <select aria-label="GPU editor document size" value={size} onChange={event => {
          const size = event.target.value
          setSize(size)
          const length = Number(size) * 1024
          setCode(size === 'example' ? initialCode : sample.repeat(Math.ceil(length / sample.length)).slice(0, length))
        }}>
          <option value="example">Example</option>
          <option value="64">64 KiB</option>
          <option value="256">256 KiB</option>
          <option value="1024">1 MiB</option>
        </select>
      </div>
    </div>
  )
}
