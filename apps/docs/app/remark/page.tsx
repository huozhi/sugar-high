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
          <div className="product-eyebrow">@sugar-high/remark</div>
          <h1>Remark plugin.</h1>
          <p className="product-lede">
            Highlight fenced code blocks with Sugar High during your Markdown build.
          </p>
          <div className="product-install"><code>npm install @sugar-high/remark</code></div>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Markdown in.<br />Highlighted HTML out.</h2>
            <p>Transform fenced code into highlighted HTML.</p>
          </div>
          <div className="product-grid remark-demo-grid">
            <Window title="readme.md"><div className="remark-source"><pre>{previewMarkdown}</pre></div></Window>
            <Window title="preview.html"><MarkdownPreview /></Window>
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>One plugin.</h2>
            <p>Add it before your HTML compiler.</p>
          </div>
          <Window title="remark-plugin.js">
            <Code className="product-code" title="remark-plugin.js" lang="javascript">{usageCode}</Code>
          </Window>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Across languages.</h2>
            <p>Use every language supported by Sugar High.</p>
          </div>
          <div className="product-grid">
            <Window title="script.js"><CodeExample filename="script.js" code={jsCode} /></Window>
            <Window title="mod.rs"><CodeExample filename="mod.rs" code={rustCode} /></Window>
          </div>
        </section>

      </div>
    </div>
  )
}
