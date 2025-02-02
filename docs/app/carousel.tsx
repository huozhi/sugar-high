'use client'

import { useEffect, useState } from 'react'
import domToImage from 'dom-to-image'
import { Code } from 'codice'

const EXAMPLE_PAIRS = [
  [
    'install.js',
    `\
// npm i -S sugar-high

import { highlight } from 'sugar-high'

const html = highlight(code)

document.querySelector('pre > code').innerHTML = html
`,
    {
      highlightedLines: [5]
    },
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
`,
    {
      highlightedLines: [7]
    }
  ],
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
`,
    {
      highlightedLines: [2]
    }
  ],

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
`,
    {
      highlightedLines: [7]
    }
  ],

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
`,
    {
      highlightedLines: [9]
    }
  ]
] as const

function CodeFrame(
  { 
    code, 
    title = 'Untitled', 
    index, 
    highlightedLines = [] 
  }: { 
    code: string, 
    title: string, 
    index: number, 
    highlightedLines: readonly number[] | number[]
  }) {
  return (
    <div className='code-frame' id={`code-frame-${index}`}>
      <style>
        {highlightedLines.map(line => 
          `.code-label--${index} .code-frame .sh__line:nth-child(${line}) {
            background: #fcf5dc;
          }`)
          .join('\n') + '\n'
        }
      </style>
      <Code
        controls
        title={title}
        className='codice code-snippet'
        data-disabled="true"
      >
        {code}
      </Code>
    </div>
  )
}


export default function Carousel() {
  const examples = EXAMPLE_PAIRS
  const [selected, setSelected] = useState(Math.ceil(examples.length / 2))

  useEffect(() => {
    const timer = setInterval(() => {
      // setSelected((selected + 1) % examples.length)
    } , 2500)
    return () => clearInterval(timer)
  }, [selected])

  return (
    <div className="carousel max-width-container">
      <style>
        {`
        ${examples.reduce((r, c, i) => {
          const left = (selected - 1 + examples.length) % examples.length
          const right = (selected + 1) % examples.length
          const isAdjacent = i === left || i === right
          const isSelected = i === selected
          const isShown = isAdjacent || isSelected

          let translate = '0%, 0%'
          let scale = '1'
          let opacity = '1'
          if (i == left) {
            translate = '-40%, 60px'
            scale = '0.8'
            opacity = '.2'
          } else if (i === right) {
            translate = '40%, 60px'
            scale = '0.8'
            opacity = '.2'
          }
          r += `.code-label#code-${i} {
            transform: translate(${translate}) scale(${scale});
            opacity: ${isShown ? opacity : 0};
            z-index: ${isSelected ? 1 : 0};
            height: ${isSelected ? 'auto' : '300px'};
            overflow: ${isSelected ? 'auto' : 'hidden'};
            box-shadow: -5px 5px 89px rgba(0, 0, 0, 0.5);
            ${isSelected ? '' : `cursor: pointer; user-select: none;`}
          }`

          if (isAdjacent || i === selected) {
            r += `.code-label#code-${i}:hover {
              transform: translate(${translate}) scale(${Number(scale) * 1.1});
            }`
          }

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
        {examples.map(([name, code, config], i) => (
          
          <label 
            key={i} 
            htmlFor={`item-${i}`}
            className={`code-label code-label--${i} ${i === selected ? `code-label--selected` : 'code-label--non-selected'}`}
            id={`code-${i}`}
          >
            <CodeFrame
              code={code} 
              title={name} 
              index={i} 
              highlightedLines={config.highlightedLines}
            />
            {/* copy button floating on the top right */}
            <button
              className='code-copy-pic-button'
              onClick={async () => {
                const domNode = document.querySelector(`#code-frame-${i}`)
                try {
                  const dataUrl = await domToImage.toPng(domNode)
                  const blob = await (await fetch(dataUrl)).blob();
                  const item = new ClipboardItem({ "image/png": blob });
            
                  await navigator.clipboard.write([item])
                } catch (error) {
                  console.error(error)
                }
              }}
            >
              <CameraIcon
                width={24}
                height={24}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </button>
          </label>
        ))}
      </div>
    </div>
  )
}

function CameraIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18V9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}
