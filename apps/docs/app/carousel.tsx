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

/// Build a short Cartesian label for two displayable values.
pub fn label<T: Display>(x: T, y: T) -> String {
    // format pair
    format!("({}, {})", x, y)
}

pub fn labels<I, T>(pairs: I) -> Vec<String>
where
    I: IntoIterator<Item = (T, T)>,
    T: Display,
{
    pairs.into_iter().map(|(a, b)| label(a, b)).collect()
}

fn main() {
    let pts = vec![(1u32, 2u32), (3, 4)];
    for line in labels(pts) {
        println!("point {line}");
    }
    println!("{}", label("x", "y"));
}
`,
    {
      highlightedLines: [6],
    },
  ],

  [
    `main.py`,
    `\
def greet(names):
    # one name per line
    for n in names:
        print("hello, " + n)


def shout(msg: str, times: int = 2) -> None:
    """Uppercase a message a few times."""
    for _ in range(max(1, times)):
        print(msg.upper())


def chunk(items, size):
    # simple batches for display
    for i in range(0, len(items), size):
        yield items[i : i + size]


if __name__ == "__main__":
    greet(["ada", "linus"])
    shout("sugar-high")
    print(list(chunk([1, 2, 3, 4, 5], 2)))
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
  --surface: #f6f8fa;
  --text: #24292f;
  --radius: 8px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: var(--text);
  background: var(--surface);
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: hsl(220 14% 12%);
    --text: #e6edf3;
  }

  .card {
    background: color-mix(in srgb, var(--surface) 92%, #000);
    border: 1px solid rgb(255 255 255 / 8%);
  }
}

/* motion */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stack-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
`,
    {
      highlightedLines: [28],
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

const flags = ['g', 'i', 'm'].filter(Boolean).join('')
const re = new RegExp('\\\\d+', flags)

export function pickDelim(str) {
  const i = str.indexOf('/')
  return i < 0 ? str : str.slice(0, i) + str.slice(i + 1)
}

// trailing note: / is both operator and literal starter
console.log(mixed, expr, re.test('99'))
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

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function nearest<T extends Point>(
  items: readonly T[],
  ref: Point
): T | undefined {
  return items.reduce<T | undefined>((best, item) => {
    if (!best) return item
    const db = distance(best, ref)
    const di = distance(item, ref)
    return di < db ? item : best
  }, undefined)
}

export function bbox(points: readonly Point[]) {
  if (!points.length) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of points) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }
  return { minX, minY, maxX, maxY }
}
`,
    {
      highlightedLines: [14],
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
  const [hoverFromPointer, setHoverFromPointer] = useState(false)
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

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)')
    const sync = () => setHoverFromPointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const activeIndex =
    hoverFromPointer ? (hoveredIndex ?? tappedIndex) : tappedIndex
  const isolating = activeIndex !== null

  const prevActiveIndexRef = useRef<number | null>(null)

  useEffect(() => {
    const prev = prevActiveIndexRef.current
    if (prev !== null && activeIndex === null) {
      const stack = stackRef.current
      if (stack) {
        const hit = stack.querySelector(
          `.showcase-card--${prev} .showcase-card-hit`
        ) as HTMLElement | null
        if (hit) {
          hit.scrollTop = 0
          hit.scrollLeft = 0
          hit.querySelectorAll('pre, textarea, [data-codice-code-content]').forEach(
            (el) => {
              if (el instanceof HTMLElement) {
                el.scrollTop = 0
                el.scrollLeft = 0
              }
            }
          )
        }
      }
    }
    prevActiveIndexRef.current = activeIndex
  }, [activeIndex])

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
              onMouseEnter={
                hoverFromPointer
                  ? () => setHoveredIndex(exampleIndex)
                  : undefined
              }
              onMouseLeave={
                hoverFromPointer
                  ? (e) => {
                      const rt = e.relatedTarget
                      if (rt instanceof Node && e.currentTarget.contains(rt))
                        return
                      const nextCard =
                        rt instanceof Element
                          ? rt.closest('.showcase-card--stack')
                          : null
                      if (nextCard && nextCard !== e.currentTarget) return
                      setHoveredIndex(null)
                    }
                  : undefined
              }
            >
              <div className="showcase-card-lift">
                <div
                  className="showcase-card-hit"
                  role="button"
                  tabIndex={0}
                  aria-label={
                    hoverFromPointer
                      ? `${name} example — hover or click to expand`
                      : `${name} example — tap to expand or collapse`
                  }
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