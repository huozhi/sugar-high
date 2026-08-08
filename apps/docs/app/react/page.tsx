import { Code } from '@sugar-high/react/code'
import Link from 'next/link'
import { ReactDemo } from './react-demo'
import '../product-page.css'
import './page.css'

const codeBlockExample = `import { Code } from '@sugar-high/react/code'
import { highlight } from 'sugar-high'

function renderMarkup() {
  const code = "return 'long live sugar-high'"
  return highlight(code)
}

const markup = renderMarkup()
console.log(markup)

render(
  <div>
    <Code
      controls
      title="app/index.js"
      lineNumbers
      highlightLines={[1, [14, 19]]}
    >
      {'<div>Hello World</div>'}
    </Code>
  </div>
)`

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
          <div className="product-eyebrow">@sugar-high/react</div>
          <h1>Code editor & block</h1>
          <p className="product-lede">
            Edit and present highlighted code with two lightweight React components.
          </p>
          <div className="product-install"><code>npm install @sugar-high/react sugar-high</code></div>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>{'<Editor />'}</h2>
            <p>A controlled, highlighted editor with optional line numbers.</p>
          </div>
          <Window title="editor-example.tsx"><ReactDemo /></Window>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>{'<Code />'}</h2>
            <p>Present code with optional line numbers and marked lines.</p>
          </div>
          <Window title="code-example.tsx">
            <Code
              className="react-code-preview"
              lang="typescript"
              lineNumbers
              padding="0"
              highlightLines={[1, [14, 19]]}
            >
              {codeBlockExample}
            </Code>
          </Window>
        </section>

      </div>
    </div>
  )
}
