'use client'

import {
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import domToImage from 'dom-to-image'
import { Code } from 'codice'
import { copyImageDataUrl } from './lib/copy-image'
import {
  LIVE_EDITOR_THEME_PRESETS,
  plateToThemedDocsVars,
} from './live-editor-presets'
import { SyntaxThemeContext } from './syntax-theme-context'

/* Stack order: index 0 = back of pile, last = front (JS/TS on top; Rust/Python behind) */
const EXAMPLE_PAIRS = [
  [
    `lib.rs`,
    `\
use std::fmt::Display;

pub fn label<T: Display>(x: T, y: T) -> String {
    // format pair
    format!("({}, {})", x, y)
}

fn main() {
    println!("{}", label(1, 2));
}
`,
    {
      highlightedLines: [4],
    },
  ],

  [
    `main.py`,
    `\
def greet(names):
    # one name per line
    for n in names:
        print("hello, " + n)

if __name__ == "__main__":
    greet(["ada", "linus"])
`,
    {
      highlightedLines: [4],
    },
  ],

  [
    `theme.css`,
    `\
:root {
  --accent: #2d5e9d;
}

@media (prefers-color-scheme: dark) {
  .card {
    background: hsl(220 14% 12%);
  }
}

/* keyframes */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
`,
    {
      highlightedLines: [6],
    },
  ],

  [
    `literals.js`,
    `\
export const matchBoundary = (s) => /^[/][\\w-]+[/]$/u.test(s)

// Slashes in comments are not regex delimiters
// path: /usr/local/bin

/** @see https://example.com/docs/foo/bar */
const afterBlock = /foo/g.exec('foo')?.[0]

// Regex vs division (tokenizer stress test)
const mixed = 12 / /\\d+/.test('3') ? 1 : 0
const expr = 100 - /50/.test('5') + 25
`,
    {
      highlightedLines: [10],
    },
  ],

  [
    `geometry.ts`,
    `\
type Point = { readonly x: number; y: number }

interface Cluster {
  center: Point
  members: ReadonlyArray<Point>
}

export const origin = { x: 0, y: 0 } as const satisfies Point

export function nearest<T extends Point>(
  items: readonly T[],
  ref: Point
): T | undefined {
  return items.reduce<T | undefined>((best, item) => {
    if (!best) return item
    const db = (best.x - ref.x) ** 2 + (best.y - ref.y) ** 2
    const di = (item.x - ref.x) ** 2 + (item.y - ref.y) ** 2
    return di < db ? item : best
  }, undefined)
}
`,
    {
      highlightedLines: [8],
    },
  ],
] as const

function CodeFrame(
  {
    code,
    title = 'Untitled',
    index,
    highlightedLines = [],
  }: {
    code: string
    title: string
    index: number
    highlightedLines: readonly number[] | number[]
  }) {
  return (
    <div className="code-frame" id={`code-frame-${index}`}>
      <style>
        {highlightedLines.map(line =>
          `.showcase-card--${index} .code-frame .sh__line:nth-child(${line}) {
            background: var(--showcase-line-highlight, #fcf5dc);
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tappedIndex, setTappedIndex] = useState<number | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const plateColors =
    syntaxThemeCtx?.colorPlateColors ?? LIVE_EDITOR_THEME_PRESETS[0].colors

  const showcaseStyle = useMemo(() => {
    const base = plateToThemedDocsVars(plateColors)
    return {
      ...base,
      '--showcase-line-highlight': `color-mix(in srgb, ${plateColors.keyword} 14%, #fffef6)`,
    } as CSSProperties
  }, [plateColors])

  const n = examples.length

  const activeIndex = hoveredIndex ?? tappedIndex
  const isolating = activeIndex !== null

  function copyImageForFrame(exampleIndex: number) {
    const domNode = document.querySelector(`#code-frame-${exampleIndex}`)
    if (!domNode) return Promise.resolve(false)
    return domToImage.toPng(domNode).then((dataUrl) => {
      return copyImageDataUrl(dataUrl).then(
        () => true,
        () => false
      )
    })
  }

  useEffect(() => {
    if (tappedIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTappedIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tappedIndex])

  useEffect(() => {
    if (tappedIndex === null) return
    const onDocDown = (e: MouseEvent) => {
      const el = stackRef.current
      const t = e.target
      if (el && t instanceof Node && !el.contains(t)) {
        setTappedIndex(null)
      }
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [tappedIndex])

  return (
    <div className="showcase-section carousel container-showcase" style={showcaseStyle}>
      <div
        ref={stackRef}
        className={`showcase-stack${isolating ? ' showcase-stack--isolating' : ''}`}
        style={
          {
            '--showcase-count': String(n),
          } as CSSProperties
        }
      >
        {examples.map(([name, code, config], exampleIndex) => {
          const position = exampleIndex
          const depthFromFront = n - 1 - position
          const depthOpacity =
            n <= 1 ? 1 : 0.38 + (position / (n - 1)) * 0.52

          const stackStyle = {
            '--showcase-back-shift': String(depthFromFront),
            '--showcase-top-step': String(position),
            '--showcase-opacity': String(depthOpacity),
            '--showcase-z': String(10 + position),
          } as CSSProperties

          const isActive = activeIndex === exampleIndex

          return (
            <div
              key={exampleIndex}
              className={`showcase-card showcase-card--stack showcase-card--${exampleIndex}${
                isActive ? ' showcase-card--stack-active' : ''
              }`}
              style={stackStyle}
              onMouseEnter={() => setHoveredIndex(exampleIndex)}
              onMouseLeave={(e) => {
                const rt = e.relatedTarget
                if (rt instanceof Node && e.currentTarget.contains(rt)) return
                const nextCard =
                  rt instanceof Element
                    ? rt.closest('.showcase-card--stack')
                    : null
                if (nextCard && nextCard !== e.currentTarget) return
                setHoveredIndex(null)
              }}
            >
              <div
                className="showcase-card-hit"
                role="button"
                tabIndex={0}
                aria-label={`${name} example — hover or tap to expand`}
                aria-expanded={isActive}
                onClick={() =>
                  setTappedIndex((prev) =>
                    prev === exampleIndex ? null : exampleIndex
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setTappedIndex((prev) =>
                      prev === exampleIndex ? null : exampleIndex
                    )
                  }
                }}
              >
                <CodeFrame
                  code={code}
                  title={name}
                  index={exampleIndex}
                  highlightedLines={config.highlightedLines}
                />
              </div>
              <CopyImageButton
                onCopy={() => copyImageForFrame(exampleIndex)}
                stopPropagation
              />
            </div>
          )
        })}
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


function CopyImageButton({
  onCopy,
  stopPropagation = false,
}: {
  onCopy: () => Promise<boolean>
  stopPropagation?: boolean
}) {
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
      className="code-copy-pic-button"
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation()
        }
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