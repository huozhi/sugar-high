import { Code } from '@sugar-high/react/code'
import Link from 'next/link'
import { ReactDemo } from './react-demo'
import '../product-page.css'
import './page.css'

const editorCode = `import { Editor } from '@sugar-high/react'

<Editor
  lang="typescript"
  title="app.tsx"
  value={code}
  onChange={setCode}
/>`

const codeBlockCode = `import { Code } from '@sugar-high/react/code'

<Code
  lang="python"
  title="main.py"
  lineNumbers
  highlightLines={[2]}
>
  {source}
</Code>`

const pythonCode = `def greet(name):
    message = f"Hello, {name}!"
    return message

print(greet("Sugar High"))`

function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="product-card">
      <div className="product-card__bar">
        <span className="product-card__title">{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function ReactPage() {
  return (
    <div className="product-page react-product">
      <div className="product-shell">
        <nav className="product-nav" aria-label="Product navigation">
          <Link className="product-nav__brand" href="/">Sugar High</Link>
          <div className="product-nav__links">
            <Link href="/remark">Remark</Link>
            <a href="https://github.com/huozhi/sugar-high/tree/main/packages/react">Source ↗</a>
          </div>
        </nav>

        <header className="product-hero">
          <div className="product-eyebrow">React components</div>
          <h1>Code that feels<br />at home.</h1>
          <p className="product-lede">
            The Codice editor and code block now live next to Sugar High: lightweight React
            primitives for presenting and editing highlighted code.
          </p>
          <div className="product-install"><code>npm install @sugar-high/react sugar-high</code></div>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Edit in place.</h2>
            <p>
              A controlled editor with highlighted text, editable filenames, line numbers, and the
              same markup contract as the static code component.
            </p>
          </div>
          <Window title="counter.tsx"><ReactDemo /></Window>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Two primitives,<br />one visual system.</h2>
            <p>Use the editor for interaction and the code block for presentation. Both resolve languages through Sugar High.</p>
          </div>
          <div className="product-grid react-api-grid">
            <Window title="editor.tsx">
              <Code className="product-code" lang="typescript">{editorCode}</Code>
            </Window>
            <Window title="code-block.tsx">
              <Code className="product-code" lang="typescript">{codeBlockCode}</Code>
            </Window>
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Presentation included.</h2>
            <p>Titles, controls, highlighted lines, and line numbers are opt-in props—not a separate rendering layer.</p>
          </div>
          <Window title="main.py">
            <Code
              className="react-code-preview"
              lang="python"
              lineNumbers
              highlightLines={[2]}
            >
              {pythonCode}
            </Code>
          </Window>
        </section>

        <section className="product-grid" aria-label="React package features">
          <div className="product-note"><h3>Small by composition</h3><p>Bring the React surface you need while Sugar High remains the highlighting engine underneath.</p></div>
          <div className="product-note"><h3>Migration without a rewrite</h3><p>Existing Codice data attributes and CSS variables remain available for current themes and integrations.</p></div>
        </section>
      </div>
    </div>
  )
}
