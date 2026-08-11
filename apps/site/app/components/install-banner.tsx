'use client'

import {
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
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

highlight('const ready = true') // JavaScript is the default
highlight('print("hi")', { lang: 'python' }) // canonical name
highlight('name: sugar-high', { lang: lang('yml') }) // yml → yaml`

export default function InstallBanner({ children }: { children?: ReactNode }) {
  const [localBannerTheme, setLocalBannerTheme] = useState<'light' | 'dark'>('light')
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const bannerTheme = syntaxThemeCtx?.previewMode ?? localBannerTheme
  const themeIndex = syntaxThemeCtx?.themeIndex ?? 0
  const plateColors = LIVE_EDITOR_THEME_PRESETS[themeIndex].colors

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

  const setBannerTheme = (theme: 'light' | 'dark') => {
    setLocalBannerTheme(theme)
    syntaxThemeCtx?.setPreviewMode(theme)
  }

  const presetByTitleMarkup = useMemo(
    () =>
      highlight(presetByTitleExample, {
        markLine: (line) => {
          if (line.index === 1) line.className += ' sh__line--highlighted'
        },
      }),
    []
  )

  const lineHighlightMarkup = useMemo(
    () =>
      highlight(lineHighlightCss, {
        markLine: (line) => {
          if (line.index === 0 || line.index === 1) {
            line.className += ' sh__line--highlighted'
          }
        },
      }),
    []
  )

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

  return (
    <div
      className="install-banner"
      data-install-theme={bannerTheme}
      style={chromeVars as CSSProperties}
    >
      <style>
        {`
        .install-banner__code [data-codice-header] {
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
          <h2>Themes</h2>
          <p>
            Set token colors with scoped CSS variables, then use <code>cx</code> for emphasis.
            Explore the copyable <Link href="/theme">CSS and Tailwind theme guide</Link>.
          </p>
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
            JavaScript works by default. Pass canonical names directly. <code>lang()</code> turns
            aliases and extensions such as <code>py</code> and <code>yml</code> into
            <code>python</code> and <code>yaml</code>.
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
        <div className="install-banner__block">
          <h2>Code block &amp; editor</h2>
          <p>
            Use the <Link href="/react">{`<Editor /> & <Code />`}</Link> to present or edit highlighted code.
          </p>
        </div>
        {children}
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
