import { useEffect, useState } from 'react'
import { highlight, tokenize, types } from 'sugar-high'
import { Editor } from 'codice'

const fullExample = `
// npm i -S sugar-high

import { highlight } from 'sugar-high'

const codeHTML = highlight(code)

document.querySelector('pre > code').innerHTML = codeHTML

// jsx
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

const nums = [
  1000_000_000, 1.2e3, 0x1f, .14, 1n
].filter(Boolean)

function* foo(index) {
  do {
    yield index++;
    return void 0
  } while (index < 2)
}

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

  bump() {
    return this.map(
      x => x == undefined ? x + 1 : 0
    )
  }
}

export const test = (str) => /^\\/[0-5]\\/$/g.test(str)

// This is a super lightweight javascript syntax highlighter npm package

// This is a inline comment / <- a slash
/// <reference path="..." /> // reference comment
/* This is another comment */ alert('good') // <- alerts

// Invalid calculation: regex and numbers
const _in = 123 - /555/ + 444;
const _iu = /* evaluate */ (19) / 234 + 56 / 7;
`.trim()


const devExample = `

`.trim()

const example = process.env.NODE_ENV === 'development' && devExample
  ? devExample
  : fullExample


export default function Page() {
  const [isLineNumberEnabled, setLineNumberEnabled] = useState(true)
  const [isDev, setIsDev] = useState(false)
  const [code, setCode] = useState(() => example)

  function debug(code) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        tokenize(code)
          .map(t => [t[1], types[t[0]]])
      )
    }
  }

  function update(_code) {
    debug(_code)
    setCode(_code)
  }

  useEffect(() => {
    update(code)
  }, [])

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
        height: 600px;
        overflow-y: scroll;
        border-radius: 12px;
      }
      code, textarea {
        font-family: Consolas, Monaco, monospace;
        padding: 16px 12px;
        background-color: #f6f6f6;
        border: none;
        font-size: 16px;
        line-height: 1.25em;
        caret-color: #333;
      }
      textarea {
        padding-left: 54px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      code {
        counter-reset: sh-line-number;
        width: 100%;
        height: 100%;
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
      <Editor className="editor" highlight={highlight} value={code} onChange={update} />

      <div className="flex">
      </div>
    </div>
  )
}
