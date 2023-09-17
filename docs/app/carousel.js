'use client'

import { useState } from 'react'
import { Editor } from 'codice'
import { highlight } from 'sugar-high'

const EXAMPLE_PAIRS = [
  [
    'install.js',
    `\
// npm i -S sugar-high

import { highlight } from 'sugar-high'

const html = highlight(code)

document.querySelector('pre > code').innerHTML = html
  `
  ],

  [
    `app.jsx`,
  `\
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
  `\
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
    `\
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
    `\
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

        <Editor
          className='codice-editor'
          highlight={highlight}
          value={code}
          disabled
        />
      </div>
    )
  }


export default function Carousel() {
  const examples = EXAMPLE_PAIRS
  const [selected, setSelected] = useState(0)

  return (
    <div className="carousel max-width-container">
      <style>
        {`
        ${examples.reduce((r, c, i) => {
          const mid = Math.floor(examples.length / 2)
          const dis = selected - mid
          const index = (i - dis + examples.length) % examples.length

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
            ${index !== mid ? `cursor: pointer; user-select: none;` : ''}
          }`

          return r
        }, '')}

        `}
      </style>
      <>
        {examples.map((_, i) => (
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
      <div className='align-start'>
        <h1>Showcase</h1>
        <p>Code highlight examples built with sugar-high</p>
      </div>
      <div className="cards">
        {examples.map(([name, code], i) => (
          <label key={i} htmlFor={`item-${i}`} className={`code-label`} id={`code-${i}`}>
            <CodeFrame code={code} title={name} />
          </label>
        ))}
      </div>
    </div>
  )
}
