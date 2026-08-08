'use client'

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { CopyButton } from './copy-button'
import { Code } from '@sugar-high/react'
import { highlight } from 'sugar-high'
import './install-banner.css'
import Link from 'next/link'
import {
  LIVE_EDITOR_THEME_PRESETS,
  buildInstallBannerColorCss,
  darkPlateForPresetIndex,
  formatPlateAsCssVars,
  plateToDocsUiVarMap,
  plateToShVarMap,
} from '../live-editor-presets'
import { SyntaxThemeContext } from '../syntax-theme-context'

const lineHighlightCss = `\
.sh__line:nth-child(5),
.sh__line--highlighted {
  background: #fff8c5;
}`

const presetByTitleExample = `\
import { highlight } from 'sugar-high'
import { lang } from 'sugar-high/lang'

const languageForTitle = (title) => lang(title.split('.').pop())

highlight('.card { color: red; }', { lang: languageForTitle('theme.css') })
highlight('def hi():\\n    print("ok")', { lang: languageForTitle('main.py') })`

const cPresetSample = `\
#include <stdint.h> /* fixed-width ints */
#define MIX(x,y) (((x) & 0xffu) ^ ((y) >> 8) | (0xab00u)) // bit ops
typedef struct { uint16_t a; uint32_t b; } hdr_t; // packed header fields
static inline uint32_t rot(uint32_t x, int n) { return (x << n) | (x >> (32 - n)); } // rotate
`

const javaPresetSample = `\
// FQCN-heavy lines: generics, streams, method refs (no extra imports)
java.util.List<java.util.Map<String, Integer>> rows = java.util.List.of(java.util.Map.of("a", 1), java.util.Map.of("b", 2));
java.util.stream.Stream.of("x", "y").map(String::toUpperCase).filter(s -> !s.isEmpty()).forEach(System.out::println);
`

const pythonPresetSample = `\
from __future__ import annotations  # postponed annotations
from itertools import chain, groupby  # stdlib
RE = r"(?x) ^\\s* (?P<name> [A-Za-z_]\\w* ) \\s* = \\s* (?P<val> .+ ) $ "  # verbose regex
def windows(xs: list[int], n: int) -> list[list[int]]: return [xs[i : i + n] for i in range(0, len(xs), n)]  # slices
`

const goPresetSample = `\
package main
import "encoding/json"; import "fmt"; import "strings" // one line, three imports
type Row struct { ID string \`json:"id"\`; Tags []string \`json:"tags,omitempty"\` } // struct tags
func (r Row) Label() string { return fmt.Sprintf("%s [%s]", r.ID, strings.Join(r.Tags, ",")) } // Sprintf + Join
var _ json.Marshaler = (*Row)(nil) // interface satisfaction
`

const diffPresetSample = `\
  export const theme = {
-   accent: '#f47067',
+   accent: '#2876db',
    surface: '#ffffff',
  }
`

export default function InstallBanner() {
  const [bannerTheme, setBannerTheme] = useState<'light' | 'dark'>('light')
  const [activeLanguageSampleIndex, setActiveLanguageSampleIndex] =
    useState<number | null>(null)
  const [hasSpreadLanguageSamples, setHasSpreadLanguageSamples] =
    useState(false)
  const lastLanguageSampleHoverPoint = useRef<{ x: number; y: number } | null>(
    null
  )
  const languageSampleGridRef = useRef<HTMLDivElement | null>(null)
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const themeIndex = syntaxThemeCtx?.themeIndex ?? 0
  const plateColors =
    syntaxThemeCtx?.colorPlateColors ?? LIVE_EDITOR_THEME_PRESETS[0].colors

  const darkPlate = useMemo(
    () => darkPlateForPresetIndex(themeIndex),
    [themeIndex]
  )

  const cssCode = useMemo(
    () => buildInstallBannerColorCss(plateColors, darkPlate),
    [plateColors, darkPlate]
  )

  const lightThemeCss = useMemo(
    () => `/* light.css */
:root {
${formatPlateAsCssVars(plateColors)}
}`,
    [plateColors]
  )

  const darkThemeCss = useMemo(
    () => `/* dark.css */
:root[data-theme='dark'] {
${formatPlateAsCssVars(darkPlate)}
}`,
    [darkPlate]
  )

  const chromeVars = useMemo(
    () => plateToDocsUiVarMap(plateColors),
    [plateColors]
  )

  const lightCodeShVars = useMemo(() => plateToShVarMap(plateColors), [plateColors])
  const darkCodeShVars = useMemo(() => plateToShVarMap(darkPlate), [darkPlate])
  const codeShVars = bannerTheme === 'light' ? lightCodeShVars : darkCodeShVars

  const languagePresetSamples = useMemo(
    () => [
      { title: 'main.c', markup: highlight(cPresetSample, { lang: 'c' }) },
      { title: 'main.go', markup: highlight(goPresetSample, { lang: 'go' }) },
      { title: 'App.java', markup: highlight(javaPresetSample, { lang: 'java' }) },
      { title: 'main.py', markup: highlight(pythonPresetSample, { lang: 'python' }) },
    ],
    []
  )

  const presetByTitleMarkup = useMemo(
    () =>
      highlight(presetByTitleExample, {
        lineClassName: (_line, index) =>
          index === 1 ? 'sh__line--highlighted' : undefined,
      }),
    []
  )

  const lineHighlightMarkup = useMemo(
    () =>
      highlight(lineHighlightCss, {
        lineClassName: (_line, index) =>
          index === 0 || index === 1 ? 'sh__line--highlighted' : undefined,
      }),
    []
  )

  const activateLanguageSampleFromPointer = (
    index: number,
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === 'touch') return

    const point = { x: event.clientX, y: event.clientY }
    const previousPoint = lastLanguageSampleHoverPoint.current

    if (
      previousPoint &&
      previousPoint.x === point.x &&
      previousPoint.y === point.y
    ) {
      return
    }

    lastLanguageSampleHoverPoint.current = point
    setActiveLanguageSampleIndex(index)
  }

  const activateThemeFromPointer = (
    theme: 'light' | 'dark',
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType !== 'touch') {
      setBannerTheme(theme)
    }
  }

  const activateThemeFromKeyboard = (
    theme: 'light' | 'dark',
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setBannerTheme(theme)
    }
  }

  useEffect(() => {
    const grid = languageSampleGridRef.current
    if (!grid) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      setHasSpreadLanguageSamples(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setHasSpreadLanguageSamples(true)
        observer.disconnect()
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.28,
      }
    )

    observer.observe(grid)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="install-banner"
      data-install-theme={bannerTheme}
      style={chromeVars as CSSProperties}
    >
      <style>
        {`
        .install-banner [data-codice-header] {
          display: none;
        }
        `}
      </style>
      <div className="container-960">
        <div
          className="install-banner__theme-split"
          role="group"
          aria-label="Theme preview"
        >
          <div
            className={`install-banner__theme-pane install-banner__theme-pane--light${
              bannerTheme === 'light'
                ? ' install-banner__theme-pane--active'
                : ''
            }`}
            style={lightCodeShVars as CSSProperties}
            role="button"
            tabIndex={0}
            aria-pressed={bannerTheme === 'light'}
            aria-label="Use light theme preview"
            onPointerEnter={(event) => activateThemeFromPointer('light', event)}
            onClick={() => setBannerTheme('light')}
            onFocus={() => setBannerTheme('light')}
            onKeyDown={(event) => activateThemeFromKeyboard('light', event)}
          >
            <div className="install-banner__theme-pane-label">light.css</div>
            <Code title="light.css">
              {lightThemeCss}
            </Code>
          </div>
          <div
            className={`install-banner__theme-pane install-banner__theme-pane--dark${
              bannerTheme === 'dark' ? ' install-banner__theme-pane--active' : ''
            }`}
            style={darkCodeShVars as CSSProperties}
            role="button"
            tabIndex={0}
            aria-pressed={bannerTheme === 'dark'}
            aria-label="Use dark theme preview"
            onPointerEnter={(event) => activateThemeFromPointer('dark', event)}
            onClick={() => setBannerTheme('dark')}
            onFocus={() => setBannerTheme('dark')}
            onKeyDown={(event) => activateThemeFromKeyboard('dark', event)}
          >
            <div className="install-banner__theme-pane-label">dark.css</div>
            <Code title="dark.css">
              {darkThemeCss}
            </Code>
          </div>
          <div className="install-banner__theme-copy">
            <CopyButton
              codeSnippet={cssCode}
              aria-label="Copy light and dark theme CSS"
            />
          </div>
        </div>

        <div className="install-banner__block">
          <h2>Line highlighting</h2>
          <p>
            Each line is a <code>.sh__line</code>, so target lines with CSS selectors or a custom
            line class.
          </p>
        </div>
        <div
          className="install-banner__code"
          style={codeShVars as CSSProperties}
        >
          <Code title='line-highlight.css' asMarkup preformatted>
            {lineHighlightMarkup}
          </Code>
          <CopyButton codeSnippet={lineHighlightCss} />
        </div>

        <div className="install-banner__block">
          <h2>Languages</h2>
          <p>
            Pass a canonical language name to <code>highlight</code>, or normalize a filename
            extension with <code>sugar-high/lang</code>.
          </p>
        </div>
        <div
          className="install-banner__code"
          style={codeShVars as CSSProperties}
        >
          <Code title="presets.js" asMarkup preformatted>
            {presetByTitleMarkup}
          </Code>
          <CopyButton codeSnippet={presetByTitleExample} />
        </div>
        <div
          ref={languageSampleGridRef}
          className={`install-banner__sample-grid${
            hasSpreadLanguageSamples
              ? ' install-banner__sample-grid--spread'
              : ''
          }`}
        >
          {languagePresetSamples.map((sample, index) => (
            <div
              key={sample.title}
              className={`install-banner__code install-banner__code--sample${
                activeLanguageSampleIndex === index
                  ? ' install-banner__code--sample-active'
                  : ''
              }`}
              style={codeShVars as CSSProperties}
              role="button"
              tabIndex={0}
              aria-pressed={activeLanguageSampleIndex === index}
              aria-label={`Bring ${sample.title} example to the front`}
              onPointerMove={(event) =>
                activateLanguageSampleFromPointer(index, event)
              }
              onPointerDownCapture={() => setActiveLanguageSampleIndex(index)}
              onFocus={() => setActiveLanguageSampleIndex(index)}
              onClick={() => setActiveLanguageSampleIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActiveLanguageSampleIndex(index)
                }
              }}
            >
              <Code title={sample.title} asMarkup preformatted>
                {sample.markup}
              </Code>
            </div>
          ))}
        </div>
        <div className="install-banner__block">
          <h2>Diff examples</h2>
          <p>
            Diff and patch files use <code>lang: 'diff'</code> to mark added, removed, hunk, and
            metadata lines.
          </p>
        </div>
        <div
          className="install-banner__code"
          style={codeShVars as CSSProperties}
        >
          <Code title="theme.diff" asMarkup preformatted>
            {highlight(diffPresetSample, { lang: 'diff' })}
          </Code>
        </div>
        <div className="install-banner__block">
          <h2>Usage with remark.js</h2>
          <p>
            <a href='https://remark.js.org/' target='_blank' rel='noreferrer'>Remark.js</a>{' '}
            is a powerful markdown processor, you can use the <Link href='/remark'>sugar-high remark plugin</Link> with remark.js to highlight code blocks in markdown.
          </p>
        </div>
      </div>
    </div>
  )
}
