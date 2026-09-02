import { Code } from '@sugar-high/react'
import { tokyoNight } from '@sugar-high/react/themes'
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

const stylingExample = `import { Editor } from '@sugar-high/react'
import { tokyoNight } from '@sugar-high/react/themes'

<Editor theme={tokyoNight} value={source} onChange={setSource} />`

const styleVariables = [
  ['--sh-editor-text-color', 'Editor', 'transparent', 'Textarea text; transparent over highlighted code.'],
  ['--sh-editor-background-color', 'Editor', 'transparent', 'Textarea background.'],
  ['--sh-caret-color', 'Both', 'inherit', 'Editor and editable-title caret.'],
  ['--sh-font-family', 'Both', 'Editor monospace; Code inherited', 'Code, textarea, and title font.'],
  ['--sh-font-size', 'Both', 'inherit', 'Code and textarea font size.'],
  ['--sh-padding', 'Both', '1rem', 'Content and header spacing.'],
  ['--sh-line-number-width', 'Both', '2.5rem / auto', 'Line-number gutter width.'],
  ['--sh-control-color', 'Both', 'unset', 'Header control-dot color.'],
  ['--sh-title-color', 'Both', 'unset', 'Header filename color.'],
  ['--sh-line-number-color', 'Both', 'unset', 'Line-number color.'],
  ['--sh-line-highlight-color', 'Both', 'unset', 'Highlighted-line background.'],
] as const

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

        <section className="product-section react-api">
          <div className="product-section__head">
            <h2>Themes</h2>
            <p>Import a JavaScript theme or pass your own token colors.</p>
          </div>
          <Code
            className="react-style-example"
            lang="typescript"
            title="editor-theme.tsx"
            theme={tokyoNight}
          >
            {stylingExample}
          </Code>
          <div className="react-api__table-wrap react-style-variables">
            <table>
              <thead><tr><th>Variable</th><th>Scope / default</th><th>Purpose</th></tr></thead>
              <tbody>
                {styleVariables.map(([name, scope, defaultValue, purpose]) => (
                  <tr key={name}>
                    <td><code>{name}</code></td>
                    <td>{scope}<br /><code>{defaultValue}</code></td>
                    <td>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="react-style-note">
            A single palette stays consistent in every color scheme. Paired themes inherit the
            standard CSS <code>color-scheme</code>. Set it to <code>light dark</code> for the system
            preference, or <code>light</code> / <code>dark</code> on an ancestor to force a mode. The
            variables below remain available as low-level overrides.
          </p>
        </section>

        <section className="product-section react-api">
          <div className="product-section__head">
            <h2>API</h2>
            <p>Props at a glance. Both components also accept standard div attributes.</p>
          </div>
          <div className="react-api__component">
            <h3>{'<Editor />'}</h3>
            <div className="react-api__table-wrap">
              <table>
                <thead><tr><th>Prop</th><th>Type / default</th><th>Purpose</th></tr></thead>
                <tbody>
                  <tr><td><code>value</code></td><td><code>string · ''</code></td><td>Controlled source text.</td></tr>
                  <tr><td><code>onChange</code></td><td><code>(code) =&gt; void</code></td><td>Runs when the source changes.</td></tr>
                  <tr><td><code>title</code></td><td><code>string | null</code></td><td>Editable filename and language hint.</td></tr>
                  <tr><td><code>onChangeTitle</code></td><td><code>(title) =&gt; void</code></td><td>Makes the title editable.</td></tr>
                  <tr><td><code>lang</code></td><td><code>LanguageName</code></td><td>Canonical language; overrides the title.</td></tr>
                  <tr><td><code>theme</code></td><td><code>Theme</code></td><td>JavaScript token and component colors.</td></tr>
                  <tr><td><code>extension</code></td><td><code>string</code></td><td>Legacy language hint when no lang is set.</td></tr>
                  <tr><td><code>controls</code></td><td><code>boolean · true</code></td><td>Shows the header controls.</td></tr>
                  <tr><td><code>lineNumbers</code></td><td><code>boolean · true</code></td><td>Shows one-based line numbers.</td></tr>
                  <tr><td><code>lineNumbersWidth</code></td><td><code>string</code></td><td>Sets the line-number gutter width.</td></tr>
                  <tr><td><code>cx</code></td><td><code>HighlightOptions['cx']</code></td><td>Maps token types to classes.</td></tr>
                  <tr><td><code>mark</code></td><td><code>HighlightOptions['mark']</code></td><td>Mutates generated token properties.</td></tr>
                  <tr><td><code>padding</code></td><td><code>string</code></td><td>Sets editor content padding.</td></tr>
                  <tr><td><code>fontSize</code></td><td><code>string | number</code></td><td>Sets the editor font size.</td></tr>
                  <tr><td><code>fontFamily</code></td><td><code>string</code></td><td>Sets the editor font family.</td></tr>
                  <tr><td><code>textareaRef</code></td><td><code>Ref&lt;HTMLTextAreaElement&gt;</code></td><td>Accesses the underlying textarea.</td></tr>
                  <tr><td><code>ref</code></td><td><code>Ref&lt;HTMLDivElement&gt;</code></td><td>Accesses the editor root.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="react-api__component">
            <h3>{'<Code />'}</h3>
            <div className="react-api__table-wrap">
              <table>
                <thead><tr><th>Prop</th><th>Type / default</th><th>Purpose</th></tr></thead>
                <tbody>
                  <tr><td><code>children</code></td><td><code>string · required</code></td><td>Source or generated markup to render.</td></tr>
                  <tr><td><code>lang</code></td><td><code>LanguageName</code></td><td>Canonical language; overrides the title.</td></tr>
                  <tr><td><code>theme</code></td><td><code>Theme</code></td><td>JavaScript token and component colors.</td></tr>
                  <tr><td><code>title</code></td><td><code>string</code></td><td>Filename shown in the header and used as a language hint.</td></tr>
                  <tr><td><code>extension</code></td><td><code>string</code></td><td>Legacy language hint when no lang is set.</td></tr>
                  <tr><td><code>controls</code></td><td><code>boolean · false</code></td><td>Shows header controls.</td></tr>
                  <tr><td><code>lineNumbers</code></td><td><code>boolean · false</code></td><td>Shows one-based line numbers.</td></tr>
                  <tr><td><code>highlightLines</code></td><td><code>(number | [number, number])[]</code></td><td>Highlights lines and inclusive ranges.</td></tr>
                  <tr><td><code>cx</code></td><td><code>HighlightOptions['cx']</code></td><td>Maps token types to classes.</td></tr>
                  <tr><td><code>mark</code></td><td><code>HighlightOptions['mark']</code></td><td>Mutates generated token properties.</td></tr>
                  <tr><td><code>markLine</code></td><td><code>HighlightOptions['markLine']</code></td><td>Mutates generated line properties.</td></tr>
                  <tr><td><code>preformatted</code></td><td><code>boolean · true</code></td><td>Uses a pre and code wrapper.</td></tr>
                  <tr><td><code>asMarkup</code></td><td><code>boolean · false</code></td><td>Treats children as highlighted HTML.</td></tr>
                  <tr><td><code>lineNumbersWidth</code></td><td><code>string</code></td><td>Sets the line-number gutter width.</td></tr>
                  <tr><td><code>padding</code></td><td><code>string</code></td><td>Sets code content padding.</td></tr>
                  <tr><td><code>fontSize</code></td><td><code>string | number</code></td><td>Sets the code font size.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <a
            className="react-api__link"
            href="https://github.com/huozhi/sugar-high/blob/main/packages/react/README.md"
          >
            Read the full React API on GitHub ↗
          </a>
        </section>

      </div>
    </div>
  )
}
