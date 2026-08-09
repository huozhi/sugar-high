import { Code } from '@sugar-high/react'
import { renderMarkdown } from './markdown'
import { ProductNav } from '../product-nav'
import { ProductStrike } from '../product-strike'
import { code as jsCode } from './languages/javascript'
import { code as rustCode } from './languages/rust'
import './page.css'
import '../product-page.css'

const usageCode = `import { remark } from 'remark'
import { highlight } from '@sugar-high/remark'
import html from 'remark-html'

const result = await remark()
  .use(highlight)
  .use(html, { sanitize: false })
  .process(markdown)

return result.toString()`

const previewMarkdown = `# Built for Markdown

Sugar High turns fenced code into lightweight, highlighted HTML.

\`\`\`typescript
const message = 'Small API, bright code'
console.log(message)
\`\`\``

function Window({
  title,
  controls = false,
  children,
}: {
  title?: string
  controls?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="product-card">
      <div className="product-card__bar">
        {controls && (
          <span className="product-card__controls" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
        {title ? <span className="product-card__title">{title}</span> : null}
      </div>
      {children}
    </div>
  )
}

async function MarkdownPreview() {
  const html = await renderMarkdown(previewMarkdown)
  return <div className="remark-preview" dangerouslySetInnerHTML={{ __html: html }} />
}

async function CodeExample({ filename, code }: { filename: string; code: string }) {
  const html = await renderMarkdown(code)
  return (
    <Code className="product-code" title={filename} preformatted={false} asMarkup>
      {html}
    </Code>
  )
}

export default function RemarkPage() {
  return (
    <div className="product-page remark-product">
      <div className="product-shell">
        <ProductNav active="remark" source="https://github.com/huozhi/sugar-high/tree/main/packages/remark" />

        <header className="product-hero">
          <h1>
            Remark plugin.
            <ProductStrike />
          </h1>
          <div className="product-install">
            <code>npm install @sugar-high/remark</code>
          </div>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>
              Markdown in
              <br />
              Highlighted HTML out
            </h2>
            <p>Transform fenced code into highlighted HTML.</p>
          </div>
          <div className="product-grid remark-demo-grid">
            <Window title="readme.md">
              <div className="remark-source">
                <pre>{previewMarkdown}</pre>
              </div>
            </Window>
            <Window controls>
              <MarkdownPreview />
            </Window>
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Usage</h2>
          </div>
          <Window title="remark-plugin.js">
            <Code className="product-code" title="remark-plugin.js" lang="javascript">
              {usageCode}
            </Code>
          </Window>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Across languages</h2>
            <p>Use every language supported by Sugar High.</p>
          </div>
          <div className="product-grid">
            <Window title="script.js">
              <CodeExample filename="script.js" code={jsCode} />
            </Window>
            <Window title="mod.rs">
              <CodeExample filename="mod.rs" code={rustCode} />
            </Window>
          </div>
        </section>
      </div>
    </div>
  )
}
