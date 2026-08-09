import { Code } from '@sugar-high/react'
import { ReactDemo } from './react-demo'
import { ProductNav } from '../product-nav'
import { ProductStrike } from '../product-strike'
import '../product-page.css'
import './page.css'

const codeBlockExample = `import { Code } from '@sugar-high/react'
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
        <ProductNav
          active="react"
          source="https://github.com/huozhi/sugar-high/tree/main/packages/react"
        />

        <header className="product-hero">
          <h1>Editor & Code<ProductStrike /></h1>
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
