import { useEffect, useState } from 'react'
import { tokenize, highlight } from '../../lib/index.mjs'

const fullExample = `
// hello-world.js

import { planet } from '../space'

export const test = (str) => /^\\/[0-5]\\/$/g.test(str)

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

async function query() {
  return await db.query()
}

const nums = [
  1000_000_000, 1.2e3, 0x1f, .14, 1n
].filter(Boolean)


function* foo(index) {
  do {
    yield index;
    index++;
    return void 0
  } while (index < 2)
}

/**
 * @param {string} name
 * @return {void}
 */
function foo(name, callback) {
  for (let i = 0; i < name.length; i++) {
    callback(name[i])
  }
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

// This is a inline comment / <- a slash
/// <reference path="..." /> // reference comment
/* This is another comment */ alert('good') // <- alerts

// Invalid calculation: regex and numbers
const _in = 123 - /555/ + 444;
const _iu = /* evaluate */ (19) / 234 + 56 / 7;


`.trim()


const debugExample = ``

// `
// /**
//  * @param {string} name
//  * @return {void}
//  */
// function foo(name, callback) {
//   for (let i = 0; i < name.length; i++) {
//     callback(name[i])
//   }
// }
// `
const example = process.env.NODE_ENV === 'development' && debugExample
  ? debugExample
  : fullExample

export default function Page() {
  const [text, setText] = useState(example)
  const [isLineNumberEnabled, setLineNumbleEnabled] = useState(true)
  const [output, setOutput] = useState(highlight(text))

  function debug(code) {
    const highlighted = highlight(code)
    setText(code)
    setOutput(highlighted)

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        tokenize(code)
          .map(t => t[1])
      )
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        tokenize(code)
          .map(t => t[1])
      )
    }
  }

  function onChange(event) {
    const code = event.target.value || ''
    debug(code)
  }

  useEffect(() => {
    debug(example)
  }, [])

  return (
    <div>
      <style jsx global>{`
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
      .sh__class {
        color: #2d5e9d;
      }
      .sh__identifier {
        color: #354150;
      }
      .sh__sign {
        color: #8996a3;
      }
      .sh__string {
        color: #00a99a;
      }
      .sh__keyword {
        color: #f47067;
      }
      .sh__comment {
        color: #a19595;
      }
      .sh__jsxliterals {
        color: #03066e;
      }
      ${isLineNumberEnabled ? `
        .sh__line::before {
          content: attr(data-line-number);
          width: 24px;
          display: inline-block;
          margin-right: 20px;
          text-align: right;
          color: #a4a4a4;
        }` : ''
      }`}</style>
      <style jsx>{`
      .editor {
        position: relative;
        min-height: 100px;
        display: flex;
      }

      .features {
        margin: 16px 0;
      }
      .absolute-full {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      .pad {
        overflow-wrap: break-word;
        display: inline-block;
        padding: 16px 12px;
        background-color: #f6f6f6;
        border: none;
        border-radius: 12px;
        font-family: Consolas, Monaco, monospace;
        font-size: 16px;
        line-height: 1.25em;
        caret-color: #333;
      }
      .header {
        padding: 0 8px;
      }
      .header h1 {
        font-size: 64px;
        font-weight: 800;
      }
      .pre {
        margin: 0;
        flex: 1 0;
        white-space: pre-wrap;
      }
      .pre code {
        width: 100%;
        min-height: 100px;
      }
      .code-input {
        resize: none;
        display: block;
        width: 100%;
        background-color: transparent;
        color: transparent;
        ${isLineNumberEnabled ? `padding-left: 54px;` : ''}
      }
      `}</style>
      <div className="header">
        <h1>Sugar High</h1>
        <p>Super lightweight syntax highlighter for JSX, <b>1KB</b> after minified and gizpped.</p>
        <div className="features">
          <span>
            <input type="checkbox" checked={isLineNumberEnabled} onChange={(e) => setLineNumbleEnabled(e.target.checked)} />line number
          </span>
        </div>
      </div>
      <div className="flex">
        <div className="editor">
          <pre className="pre">
            <code className="pad" dangerouslySetInnerHTML={{ __html: output }}></code>
          </pre>
          <textarea className="pad absolute-full code-input" value={text} onChange={onChange}></textarea>
        </div>
      </div>
    </div>
  )
}
