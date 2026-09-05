'use client'

import { useState } from 'react'
import { Code, Editor, FileTree } from '@sugar-high/react'
import { useReactTheme } from '../components/react-themes'

const initialFiles: Record<string, string> = {
  'src/index.tsx': `import { Button } from './components/button'
import './styles.css'

export default function App() {
  return <Button>Say hello</Button>
}`,
  'src/components/button.tsx': `import type { ReactNode } from 'react'

export function Button({ children }: { children: ReactNode }) {
  return <button onClick={() => alert('Hello!')}>{children}</button>
}`,
  'src/styles.css': `button {
  border: 1px solid currentColor;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}`,
  'package.json': `{
  "name": "hello-world",
  "private": true
}`,
}

export function ReactDemo() {
  const { palette } = useReactTheme()
  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState('src/index.tsx')
  const [readOnly, setReadOnly] = useState(false)
  const [lineNumbers, setLineNumbers] = useState(true)
  const code = files[activeFile]

  return (
    <div className="react-demo">
      <div className="react-demo__files">
        <FileTree paths={Object.keys(files)} activeFile={activeFile}
          onActiveFileChange={setActiveFile} theme={palette} />
        <div className="react-demo__document">
          {readOnly ? (
            <Code title={activeFile} theme={palette} lineNumbers={lineNumbers}>{code}</Code>
          ) : (
            <Editor className="react-demo__editor" title={activeFile}
              theme={palette} controls={false} value={code} lineNumbers={lineNumbers}
              textareaProps={{ 'aria-label': `Edit ${activeFile}` }}
              onChange={text => setFiles(current => ({ ...current, [activeFile]: text }))} />
          )}
        </div>
      </div>
      <div className="react-demo__status">
        <div className="react-demo__settings">
          <label><input type="checkbox" checked={readOnly} onChange={event => setReadOnly(event.target.checked)} />read only</label>
          <label><input type="checkbox" checked={lineNumbers} onChange={event => setLineNumbers(event.target.checked)} />line numbers</label>
        </div>
        <span>{code.split('\n').length} lines · {code.length} characters</span>
      </div>
    </div>
  )
}
