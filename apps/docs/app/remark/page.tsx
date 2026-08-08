import { Code } from '@sugar-high/react'
import Link from 'next/link'
import { renderMarkdown } from './markdown'
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

function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="product-card">
      <div className="product-card__bar">
        <span className="product-card__dot" />
        <span className="product-card__dot" />
        <span className="product-card__dot" />
        <span className="product-card__title">{title}</span>
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
        <nav className="product-nav" aria-label="Product navigation">
          <Link className="product-nav__brand" href="/">Sugar High</Link>
          <div className="product-nav__links">
            <Link href="/react">React</Link>
            <a href="https://github.com/huozhi/sugar-high/tree/main/packages/remark">Source ↗</a>
          </div>
        </nav>

        <header className="product-hero">
          <div className="product-eyebrow">Markdown integration</div>
          <h1>Remark,<br />with more color.</h1>
          <p className="product-lede">
            A small Remark plugin that turns fenced code blocks into Sugar High markup—without a
            runtime highlighter in the browser.
          </p>
          <div className="product-install"><code>npm install @sugar-high/remark</code></div>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Markdown in.<br />Highlighted HTML out.</h2>
            <p>
              Keep authoring ordinary fenced code. Language aliases are normalized and line metadata
              stays available to the generated markup.
            </p>
          </div>
          <div className="product-grid remark-demo-grid">
            <Window title="readme.md"><div className="remark-source"><pre>{previewMarkdown}</pre></div></Window>
            <Window title="preview.html"><MarkdownPreview /></Window>
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>One plugin.</h2>
            <p>Place it before your HTML compiler. The output uses the same semantic token classes as Sugar High.</p>
          </div>
          <Window title="remark-plugin.js">
            <Code className="product-code" title="remark-plugin.js" lang="javascript">{usageCode}</Code>
          </Window>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Across languages.</h2>
            <p>The plugin delegates language selection to Sugar High, keeping the integration thin.</p>
          </div>
          <div className="product-grid">
            <Window title="script.js"><CodeExample filename="script.js" code={jsCode} /></Window>
            <Window title="mod.rs"><CodeExample filename="mod.rs" code={rustCode} /></Window>
          </div>
        </section>

        <section className="product-grid" aria-label="Remark features">
          <div className="product-note"><h3>Server friendly</h3><p>Generate HTML during your existing Markdown build with no client-side runtime.</p></div>
          <div className="product-note"><h3>Style it once</h3><p>Reuse Sugar High token classes, CSS variables, and your existing code presentation.</p></div>
        </section>
      </div>
    </div>
  )
}
