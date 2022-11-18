'use client'

import { useState } from 'react'
import { highlight } from 'sugar-high'
import { Editor } from 'codice'

const fullExample = [
[
  'install.js',
  `
// npm i -S sugar-high

import { highlight } from 'sugar-high'

const codeHTML = highlight(code)

document.querySelector('pre > code').innerHTML = codeHTML
`
],

[
  `app.jsx`,
`
const element = (
  <>
    <Food
      season={{
        sault: <p a={[{}]} />
      }}>
    </Food>
    {/* jsx comment */}
    <h1 className="title" data-title="true">
      Read{' '}
      <Link href="/posts/first-post">
        <a>this page! - {Date.now()}</a>
      </Link>
    </h1>
  </>
)
`],
[
  `hello.js`,
`
const nums = [
  1000_000_000, 1.2e3, 0x1f, .14, 1n
].filter(Boolean)

function* foo(index) {
  do {
    yield index++;
    return void 0
  } while (index < 2)
}
`],

[
  `klass.js`,
  `
/**
 * @param {string} names
 * @return {Promise<string[]>}
 */
async function notify(names) {
  const tags = []
  for (let i = 0; i < names.length; i++) {
    tags.push('@' + names[i])
  }
  await ping(tags)
}

class SuperArray extends Array {
  static core = Object.create(null)

  constructor(...args) { super(...args); }

  bump(value) {
    return this.map(
      x => x == undefined ? x + 1 : 0
    ).concat(value)
  }
}
`],

[
  `regex.js`,
  `
export const test = (str) => /^\\/[0-5]\\/$/g.test(str)

// This is a super lightweight javascript syntax highlighter npm package

// This is a inline comment / <- a slash
/// <reference path="..." /> // reference comment
/* This is another comment */ alert('good') // <- alerts

// Invalid calculation: regex and numbers
const _in = 123 - /555/ + 444;
const _iu = /* evaluate */ (19) / 234 + 56 / 7;
`]
].map(([name, code]) => [name, code.trim()])

function CodeFrame({ code, title = 'Untitled' }) {
  return (
    <div className='code-frame'>
      <div className='code-header'>
        <div className='code-controls'>
          <div className='code-control' />
          <div className='code-control' />
          <div className='code-control' />
        </div>
        <div className='code-title'>{title}</div>
      </div>

      <Editor className='editor' highlight={highlight} value={code} disabled />
    </div>
  )
}

export default function Page() {
  const [isLineNumberEnabled, setLineNumberEnabled] = useState(true)
  const [isDev, setIsDev] = useState(false)

  return (
    <div>
      <style jsx global>{`
      :root {
        --sh-class: #2d5e9d;
        --sh-identifier: #354150;
        --sh-sign: #8996a3;
        --sh-string: #00a99a;
        --sh-keyword: #f47067;
        --sh-comment: #a19595;
        --sh-jsxliterals: #6266d1;
        --editor-background-color: transparent;
      }

      * {
        box-sizing: border-box;
      }
      html {
        font-family: "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif
      }
      body {
        max-width: 690px;
        margin: auto;
        padding: 0 10px 40px;
      }
      .features {
        margin: 16px 0;
      }
      .header {
        padding: 0 8px;
      }
      .header h1 {
        font-size: 64px;
        font-weight: 800;
      }
      .editor {
        position: relative;
        overflow-y: scroll;
      }
      code, textarea {
        font-family: Consolas, Monaco, monospace;
        padding: 16px;
        background-color: #f6f6f6;
        border: none;
        font-size: 16px;
        line-height: 1.25em;
        caret-color: #333;
        outline: none;
      }
      textarea {
        padding-left: 54px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        pointer-events: none; // disable text area
      }

      .code-snippets {

      }
      code {
        counter-reset: sh-line-number;
        width: 100%;
        height: 100%;
      }
      .code-frame {
        position: relative;
        padding: 12px 0;
      }
      .code-header {
        position: relative;
        display: flex;
        background-color: #f6f6f6;
        padding: 16px 22px;
      }
      .code-control {
        display: flex;
        width: 12px;
        height: 12px;
        margin: 4px;
        background-color: hsl(0deg 0% 0% / 34%);
        border-radius: 50%;
      }
      .code-controls {
        position: absolute;
        top: 50%;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(16px, -50%);
      }
      .code-title {
        flex: 1 0;
        text-align: center;
        color: hsl(0deg 0% 0% / 34%);
      }

      :root {
        --editor-text-color: ${isDev ? '#f8515163' : 'transparent'};
      }
      ${isLineNumberEnabled ? `
        .sh__line::before {
          counter-increment: sh-line-number 1;
          content: counter(sh-line-number);
          width: 24px;
          display: inline-block;
          margin-right: 18px;
          margin-left: -42px;
          text-align: right;
          color: #a4a4a4;
        }` : ''
      }
      code {
        ${isLineNumberEnabled ? `padding-left: 54px;` : ''}
      }
      `}</style>
      <div className="header">
        <h1>Sugar High</h1>
        <p>Super lightweight syntax highlighter for JSX, <b>1KB</b> after minified and gizpped.</p>
        {process.env.NODE_ENV === 'development' &&
          <div className="features">
            <span>
              <input type="checkbox" checked={isLineNumberEnabled} onChange={(e) => setLineNumberEnabled(e.target.checked)} />line number
            </span>

            <span>
              <input type="checkbox" checked={isDev} onChange={(e) => setIsDev(e.target.checked)} />matching text
            </span>
          </div>
        }
      </div>


      <div className='code-snippets'>
        {fullExample.map(([name, code], i) => (
          <CodeFrame key={i} code={code} title={name} />
        ))}
      </div>
    </div>
  )
}
