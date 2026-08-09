'use client'

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { Code } from '@sugar-high/react'
import { highlight } from 'sugar-high'
import {
  LIVE_EDITOR_THEME_PRESETS,
  plateToThemedDocsVars,
} from './live-editor-presets'
import { SyntaxThemeContext } from './syntax-theme-context'

/* Stack order: index 0 = back of pile, last = front. */
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
      highlightedLines: [8],
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
    `query.py`,
    `\
from dataclasses import dataclass

@dataclass(frozen=True)
class Filter:
    field: str
    value: str

def build_where(filters: list[Filter]) -> str:
    if not filters:
        return "1 = 1"
    parts = [f"{f.field} = :{f.field}" for f in filters]
    return " AND ".join(parts)

print(build_where([Filter("status", "open"), Filter("owner", "me")]))
`,
    {
      highlightedLines: [8],
    },
  ],
  [
    `release.diff`,
    `\
diff --git a/config/release.json b/config/release.json
@@ -1,5 +1,5 @@
 {
-  "channel": "beta",
+  "channel": "stable",
   "region": "eu-central"
 }
`,
    {
      highlightedLines: [5],
    },
  ],
] as const

const SHOWCASE_SPREAD = [
  { x: -342, y: 18, rotate: -7 },
  { x: -198, y: -16, rotate: 12 },
  { x: -72, y: 27, rotate: -4 },
  { x: 104, y: -12, rotate: 9 },
  { x: 224, y: 25, rotate: -15 },
  { x: 318, y: -4, rotate: 5 },
] as const

const SHOWCASE_Z_ORDER = [14, 12, 18, 16, 10, 15] as const

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
  const isDiff = title.endsWith('.diff')
  const codeContent = isDiff ? highlight(code, { lang: 'diff' }) : code

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
        asMarkup={isDiff}
        preformatted={isDiff}
      >
        {codeContent}
      </Code>
    </div>
  )
}


export default function Carousel() {
  const examples = EXAMPLE_PAIRS
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hasSpreadStack, setHasSpreadStack] = useState(false)
  const stackRef = useRef<HTMLDivElement>(null)
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const previewMode = syntaxThemeCtx?.previewMode ?? 'light'
  const activePreset = LIVE_EDITOR_THEME_PRESETS[syntaxThemeCtx?.themeIndex ?? 0]
  const plateColors = previewMode === 'dark'
    ? activePreset.colorsDark ?? activePreset.colors
    : syntaxThemeCtx?.colorPlateColors ?? activePreset.colors

  const showcaseStyle = useMemo(() => {
    const base = plateToThemedDocsVars(plateColors)
    return {
      ...base,
      '--showcase-card-bg': previewMode === 'dark' ? '#383838' : '#f6f6f6',
      '--showcase-line-highlight': `color-mix(in srgb, ${plateColors.keyword} 14%, ${previewMode === 'dark' ? '#383838' : '#fffef6'})`,
      '--codice-title-color': previewMode === 'dark' ? '#a8a8a8' : '#707070',
      '--codice-control-color': previewMode === 'dark' ? '#8b8b8b' : '#a4a4a4',
    } as CSSProperties
  }, [plateColors, previewMode])

  const n = examples.length

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      setHasSpreadStack(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setHasSpreadStack(true)
        observer.disconnect()
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.28,
      }
    )

    observer.observe(stack)

    return () => observer.disconnect()
  }, [])

  function switchTheme() {
    syntaxThemeCtx?.setThemeIndex(index =>
      (index + 1) % LIVE_EDITOR_THEME_PRESETS.length
    )
  }

  return (
    <div className="showcase-section carousel container-showcase" style={showcaseStyle}>
      <div
        ref={stackRef}
        className={`showcase-stack${
          hasSpreadStack ? ' showcase-stack--spread' : ''
        }${hoveredIndex !== null ? ' showcase-stack--isolating' : ''}`}
        style={
          {
            '--showcase-count': String(n),
          } as CSSProperties
        }
      >
        {examples.map(([name, code, config], exampleIndex) => {
          const spread = SHOWCASE_SPREAD[exampleIndex % SHOWCASE_SPREAD.length]
          const zIndex = SHOWCASE_Z_ORDER[exampleIndex % SHOWCASE_Z_ORDER.length]

          const stackStyle = {
            '--showcase-final-x': `${spread.x}px`,
            '--showcase-final-y': `${spread.y}px`,
            '--showcase-final-rotate': `${spread.rotate}deg`,
            '--showcase-z': String(zIndex),
          } as CSSProperties

          return (
            <div
              key={exampleIndex}
              className={`showcase-card showcase-card--stack showcase-card--${exampleIndex}${
                hoveredIndex === exampleIndex ? ' showcase-card--hovered' : ''
              }`}
              style={stackStyle}
              onMouseEnter={() => setHoveredIndex(exampleIndex)}
              onMouseLeave={() => setHoveredIndex(current =>
                current === exampleIndex ? null : current
              )}
            >
              <div className="showcase-card-lift">
                <div
                  className="showcase-card-hit"
                  role="button"
                  tabIndex={0}
                  aria-label={`Switch syntax theme from the ${name} example`}
                  onClick={switchTheme}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      switchTheme()
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
