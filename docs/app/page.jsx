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
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <style jsx global>{`
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
        ${isLineNumberEnabled ? `padding-left: 48px;` : ''}
      }

      ${fullExample.reduce((r, c, i) => {
        const mid = Math.floor(fullExample.length / 2)
        const dis = selected - mid
        const index = (i - dis + fullExample.length) % fullExample.length
        
        let translate = '0%, 0%'
        let scale = 1
        let opacity = 1
        if (index < mid) {
          translate = '-40%, 60px'
          scale = '0.8'
          opacity = '.2' 
        } else if (index > mid) {
          translate = '40%, 60px'
          scale = '0.8'
          opacity = '.2'
        } 
        r += `.code-label#code-${i} {
          transform: translate(${translate}) scale(${scale});
          opacity: ${opacity};
          z-index: ${index === mid ? 1 : 0};
          height: ${index === mid ? 'auto' : '300px'};
          overflow: ${index === mid ? 'auto' : 'hidden'};
          box-shadow: -5px 5px 89px rgba(0, 0, 0, 0.5);
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }`

        return r
      }, '')}

      `}</style>

      <div className="github-corner" aria-label="View source on GitHub">
        <a href="https://github.com/huozhi/sugar-high" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
          <svg width="80" height="80" viewBox="0 0 250 250" style={{ fill: '#151513', color: '#fff', position: 'absolute', top: 0, border: 0, right: 0 }} aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
          </svg>
        </a>
      </div>


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

      <div className="carousel">
        <>
          {fullExample.map((_, i) => (
            <input
              key={i}
              type="radio"
              name="slider"
              className={`item`}
              id={`item-${i}`}
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
          ))}
        </>
        <div className="cards">
          {fullExample.map(([name, code], i) => (
            <label key={i} htmlFor={`item-${i}`} className={`code-label`} id={`code-${i}`}>
              <CodeFrame code={code} title={name} />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
