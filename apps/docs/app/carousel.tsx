'use client'

import { startTransition, useActionState, useEffect, useState } from 'react'
import domToImage from 'dom-to-image'
import { Code } from 'codice'
import { copyImageDataUrl } from './lib/copy-image'

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

  return (
    <div className="carousel container-960">
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
            overflow-y: ${isSelected ? 'auto' : 'hidden'};
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
      <div className='show-case-title align-start'>
        <h1>Showcase</h1>
        <p>Code highlight examples built with sugar-high</p>
      </div>
      <div className='card-indicator-dots'>
        {examples.map((_, i) => (
          <label
            key={i}
            htmlFor={`item-${i}`}
            className={`card-indicator ${i === selected ? `card-indicator--selected` : ''}`}
          />
        ))}
      </div>
      <div className="cards">
        {examples.map(([name, code, config], i) => {
          function handleCopyImage() {
            const domNode = document.querySelector(`#code-frame-${i}`)
            return domToImage.toPng(domNode).then(dataUrl => {
              return copyImageDataUrl(dataUrl).then(
                () => {
                  return true
                }, () => {
                  return false
                }
              )
            })
          }

          return (
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
              <CopyImageButton onCopy={handleCopyImage} />
            </label>
          )}
        )}
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

function cx(...args: any[]) {
  return args.filter(Boolean).join(' ')
}


function CopyImageButton({ onCopy } : { onCopy: () => Promise<boolean> }) {
  function handleActionState(state, action) {
    if (action === 'copy') {
      return onCopy().then(
        result => result ? 1 : 2,
      )
    } else if (action === 'reset') {
      return 0
    }
    return state
  }
  // 0: idle, 1: success, 2: error
  const [copyState, dispatch, isPending] = useActionState(handleActionState, 0)
  function copy() {
    startTransition(() => {
      dispatch('copy')
    })
  }
  const reset = () => dispatch('reset')

  useEffect(() => {
    if (copyState === 1) {
      const timer = setTimeout(() => {
        reset()
      }, 2000)
      return () => clearTimeout(timer)
    }
  })

  return (
    <button
      className='code-copy-pic-button'
      onClick={() => {
        copy()
      }}
      title={
        isPending ? 'Copying...' :
        copyState === 1 ? 'Copied!' :
        copyState === 2 ? 'Copy failed' : 'Copy image'
      }
    >
      <CameraIcon
        className={cx(
          'code-copy-pic-icon',
          isPending ? 'code-copy-pic-icon--pending' :
          copyState === 1 ? 'code-copy-pic-icon--success' :
          copyState === 2 && 'code-copy-pic-icon--error'
        )}

        width={'1rem'}
        height={'1rem'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </button>
  )
}