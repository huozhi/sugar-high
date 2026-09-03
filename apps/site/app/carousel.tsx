'use client'

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
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

pub fn label<T: Display>(x: T, y: T) -> String {
    format!("({}, {})", x, y)
}
fn main() {
    let point = label(3, 4);
    println!("point: {point}");
}
`,
    {
      highlightedLines: [4],
    },
  ],


  [
    `theme.css`,
    `\
:root {
  --surface: #f6f8fa;
  --text: #24292f;
}

.card { color: var(--text); background: var(--surface); }
@media (prefers-color-scheme: dark) {
  :root { --surface: #202124; --text: #f5f5f5; }
}
`,
    {
      highlightedLines: [8],
    },
  ],
  [
    `geometry.ts`,
    `\
type Point = { readonly x: number; y: number }

const origin: Point = { x: 0, y: 0 }

const distance = (a: Point, b: Point) =>
  Math.hypot(a.x - b.x, a.y - b.y)

const target = { x: 3, y: 4 }
console.log(distance(origin, target))
`,
    {
      highlightedLines: [5],
    },
  ],
  [
    `literals.js`,
    `\
const path = /^[/][\\w-]+[/]$/u

// Slashes in comments are not regex delimiters
const afterBlock = /foo/g.exec('foo')?.[0]

// Regex vs division (tokenizer stress test)
const mixed = 12 / /\\d+/.test('3') ? 1 : 0

console.log(path.test('/docs/'), afterBlock, mixed)
`,
    {
      highlightedLines: [7],
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
active = Filter("status", "open")
query = f"{active.field} = :{active.field}"
print(query)
`,
    {
      highlightedLines: [7],
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
  { x: -370, y: 18, rotate: -7 },
  { x: -216, y: -16, rotate: 12 },
  { x: -78, y: 27, rotate: -4 },
  { x: 114, y: -12, rotate: 9 },
  { x: 246, y: 25, rotate: -15 },
  { x: 350, y: -4, rotate: 5 },
] as const

const SHOWCASE_Z_ORDER = [14, 12, 18, 16, 10, 15] as const

function CodeFrame(
  {
    code,
    title = 'Untitled',
    index,
    highlightedLines = [],
    typing,
  }: {
    code: string
    title: string
    index: number
    highlightedLines: readonly number[] | number[]
    typing: boolean
  }) {
  const typedCode = useTypedCode(code, typing, index * 90)
  const isDiff = title.endsWith('.diff')
  const codeContent = isDiff ? highlight(typedCode, { lang: 'diff' }) : typedCode

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
        data-typing={typedCode.length < code.length}
        aria-busy={typedCode.length < code.length}
        asMarkup={isDiff}
        preformatted={isDiff}
      >
        {codeContent}
      </Code>
    </div>
  )
}

function useTypedCode(code: string, typing: boolean, delay: number) {
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (!typing) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 680px)').matches
    if (reducedMotion || mobile) {
      setLength(code.length)
      return
    }

    let frame = 0
    let timer = 0
    let cancelled = false
    const initialDuration = Math.min(2200, Math.max(900, code.length * 3.2))
    const trimmedEnd = code.trimEnd().length
    const lastLineStart = code.lastIndexOf('\n', trimmedEnd - 1)
    const previousLineStart = code.lastIndexOf('\n', lastLineStart - 1)
    const editStart = Math.max(0, previousLineStart + 1)

    const wait = (duration: number, next: () => void) => {
      timer = window.setTimeout(next, duration)
    }

    const animate = (from: number, to: number, duration: number, done: () => void) => {
      let startedAt = 0
      let lastLength = from
      setLength(from)

      const step = (now: number) => {
        if (cancelled) return
        if (!startedAt) startedAt = now

        const progress = Math.min(1, (now - startedAt) / duration)
        const nextLength = Math.round(from + (to - from) * progress)
        if (nextLength !== lastLength) {
          lastLength = nextLength
          setLength(nextLength)
        }

        if (progress < 1) frame = requestAnimationFrame(step)
        else done()
      }

      frame = requestAnimationFrame(step)
    }

    const replayEdit = () => {
      animate(code.length, editStart, Math.max(450, (code.length - editStart) * 18), () => {
        wait(350, () => {
          animate(editStart, code.length, Math.max(650, (code.length - editStart) * 25), () => {
            wait(4200 + delay * 3, replayEdit)
          })
        })
      })
    }

    timer = window.setTimeout(() => {
      animate(0, code.length, initialDuration, () => {
        wait(3600 + delay * 4, replayEdit)
      })
    }, delay)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [code, delay, typing])

  return code.slice(0, length)
}


export default function Carousel() {
  const examples = EXAMPLE_PAIRS
  const [hasSpreadStack, setHasSpreadStack] = useState(false)
  const [poppedCard, setPoppedCard] = useState<number | null>(null)
  const [activeCard, setActiveCard] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('left')
  const [autoplayCycle, setAutoplayCycle] = useState(0)
  const stackRef = useRef<HTMLDivElement>(null)
  const popTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitDirectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasInteractedRef = useRef(false)
  const swipeStartRef = useRef<{
    pointerId: number
    x: number
    y: number
  } | null>(null)
  const suppressClickRef = useRef(false)
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const previewMode = syntaxThemeCtx?.previewMode ?? 'light'
  const activePreset = LIVE_EDITOR_THEME_PRESETS[syntaxThemeCtx?.themeIndex ?? 0]
  const plateColors = previewMode === 'dark'
    ? activePreset.colorsDark ?? activePreset.colors
    : activePreset.colors

  const showcaseStyle = useMemo(() => {
    const base = plateToThemedDocsVars(plateColors)
    return {
      ...base,
      '--showcase-card-bg': previewMode === 'dark' ? '#383838' : '#f6f6f6',
      '--showcase-line-highlight': `color-mix(in srgb, ${plateColors.keyword} 14%, ${previewMode === 'dark' ? '#383838' : '#fffef6'})`,
      '--sh-title-color': previewMode === 'dark' ? '#a8a8a8' : '#707070',
      '--sh-control-color': previewMode === 'dark' ? '#8b8b8b' : '#a4a4a4',
      '--showcase-dim-bg': previewMode === 'dark' ? '#34373a' : '#e9ecee',
    } as CSSProperties
  }, [plateColors, previewMode])

  const n = examples.length

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 680px)')
    const update = () => setIsMobile(mobile.matches)
    update()
    mobile.addEventListener('change', update)
    return () => mobile.removeEventListener('change', update)
  }, [])

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

  function popCard(index: number) {
    if (popTimerRef.current) clearTimeout(popTimerRef.current)
    setPoppedCard(index)
    popTimerRef.current = setTimeout(() => setPoppedCard(null), 720)
  }

  useEffect(() => () => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current)
    if (exitDirectionTimerRef.current) clearTimeout(exitDirectionTimerRef.current)
  }, [])

  function showCard(index: number) {
    setActiveCard(index)
  }

  function pauseAutoplay() {
    hasInteractedRef.current = true
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pauseAutoplay()
    if (!isMobile) return
    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    suppressClickRef.current = false
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = swipeStartRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return
    if (Math.abs(deltaX) > 8) suppressClickRef.current = true
    setDragOffset(deltaX)
  }

  function finishSwipe(event: ReactPointerEvent<HTMLDivElement>, cancelled = false) {
    const start = swipeStartRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    swipeStartRef.current = null
    setIsDragging(false)
    setDragOffset(0)
    hasInteractedRef.current = false
    setAutoplayCycle(cycle => cycle + 1)

    if (!cancelled && Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      setExitDirection(deltaX < 0 ? 'left' : 'right')
      setActiveCard(current => (current + 1) % n)
      if (exitDirectionTimerRef.current) clearTimeout(exitDirectionTimerRef.current)
      exitDirectionTimerRef.current = setTimeout(() => setExitDirection('left'), 560)
    }

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false
      })
    }
  }

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!isMobile || reducedMotion.matches) return

    const interval = window.setInterval(() => {
      if (hasInteractedRef.current) return
      setActiveCard(current => (current + 1) % n)
    }, 3600)

    return () => window.clearInterval(interval)
  }, [autoplayCycle, isMobile, n])

  return (
    <div className="showcase-section carousel container-showcase" style={showcaseStyle}>
      <div
        ref={stackRef}
        className={`showcase-stack${
          hasSpreadStack ? ' showcase-stack--spread' : ''
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={(event) => finishSwipe(event, true)}
        style={
          {
            '--showcase-count': String(n),
          } as CSSProperties
        }
      >
        {examples.map(([name, code, config], exampleIndex) => {
          const spread = SHOWCASE_SPREAD[exampleIndex % SHOWCASE_SPREAD.length]
          const zIndex = SHOWCASE_Z_ORDER[exampleIndex % SHOWCASE_Z_ORDER.length]
          const mobileDistance = (exampleIndex - activeCard + n) % n
          const mobilePosition = mobileDistance === 0
            ? 'active'
            : mobileDistance === 1
              ? 'next'
              : mobileDistance === 2
                ? 'after-next'
                : mobileDistance === n - 1
                  ? 'previous'
                  : 'hidden'

          const stackStyle = {
            '--showcase-final-x': `${spread.x}px`,
            '--showcase-final-y': `${spread.y}px`,
            '--showcase-final-rotate': `${spread.rotate}deg`,
            '--showcase-z': String(zIndex),
            '--showcase-drag-x': exampleIndex === activeCard ? `${dragOffset}px` : '0px',
          } as CSSProperties

          return (
            <div
              key={exampleIndex}
              className={`showcase-card showcase-card--stack showcase-card--${exampleIndex}${
                poppedCard === exampleIndex ? ' showcase-card--popped' : ''
              } showcase-card--mobile-${mobilePosition}${
                isDragging && exampleIndex === activeCard ? ' showcase-card--dragging' : ''
              }${
                mobilePosition === 'previous' && exitDirection === 'right'
                  ? ' showcase-card--exit-right'
                  : ''
              }`}
              style={stackStyle}
            >
              <div className="showcase-card-lift">
                <div
                  className="showcase-card-hit"
                  role="button"
                  tabIndex={isMobile && exampleIndex !== activeCard ? -1 : 0}
                  aria-hidden={isMobile && exampleIndex !== activeCard ? true : undefined}
                  aria-label={`Switch syntax theme from the ${name} example`}
                  onClick={() => {
                    if (suppressClickRef.current) return
                    switchTheme()
                    popCard(exampleIndex)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      switchTheme()
                      popCard(exampleIndex)
                    }
                  }}
                >
                  <CodeFrame
                    code={code}
                    title={name}
                    index={exampleIndex}
                    highlightedLines={config.highlightedLines}
                    typing={hasSpreadStack}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="showcase-pagination" aria-label="Code examples">
        {examples.map(([name], index) => (
          <button
            key={name}
            type="button"
            className="showcase-pagination__dot"
            aria-label={`Show ${name}`}
            aria-current={activeCard === index ? 'true' : undefined}
            onClick={() => {
              showCard(index)
              setAutoplayCycle(cycle => cycle + 1)
            }}
          />
        ))}
      </div>
    </div>
  )
}
