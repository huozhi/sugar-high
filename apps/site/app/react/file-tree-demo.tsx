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

export function FileTreeDemo() {
  const { palette } = useReactTheme()
  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState('src/index.tsx')
  const [readOnly, setReadOnly] = useState(false)
  const [lineNumbers, setLineNumbers] = useState(true)
  const code = files[activeFile]

  return (
    <div className="product-card react-demo filetree-demo" data-mode={readOnly ? 'code' : 'editor'}>
      <div className="product-card__bar">
        <span className="product-card__title">{activeFile}</span>
      </div>
      <div className="react-demo__files">
        <FileTree paths={Object.keys(files)} activeFile={activeFile}
          onActiveFileChange={setActiveFile} theme={palette} />
        <div className="react-demo__document" style={{ background: palette.background, color: palette.foreground }}>
          {readOnly ? (
            <Code className="filetree-demo__source" extension={activeFile.split('.').pop()}
              controls={false} fontSize={13} theme={palette} lineNumbers={lineNumbers}>{code}</Code>
          ) : (
            <Editor className="filetree-demo__source" title={null} extension={activeFile.split('.').pop()}
              theme={palette} fontSize={13} fontFamily="ui-monospace, monospace" controls={false} value={code} lineNumbers={lineNumbers}
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
