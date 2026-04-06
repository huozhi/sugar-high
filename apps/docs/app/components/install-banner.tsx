'use client'

import { useContext, useMemo, useState, type CSSProperties } from 'react'
import { CopyButton } from './copy-button'
import { Code } from 'codice'
import { highlight } from 'sugar-high'
import { c, java, python } from 'sugar-high/presets'
import './install-banner.css'
import Link from 'next/link'
import {
  LIVE_EDITOR_THEME_PRESETS,
  buildInstallBannerColorCss,
  darkPlateForPresetIndex,
  plateToDocsUiVarMap,
  plateToShVarMap,
} from '../live-editor-presets'
import { SyntaxThemeContext } from '../syntax-theme-context'

const usageCode = `\
import { highlight } from 'sugar-high'
const html = highlight(code)`

const presetByTitleExample = `\
import { highlight } from 'sugar-high'
import * as presets from 'sugar-high/presets'

// Use the file extension from a path or Codice \`title\` (e.g. "theme.css", "main.py")
const presetForTitle = (title) =>
  ({
    c: presets.c,
    go: presets.go,
    java: presets.java,
    css: presets.css,
    py: presets.python,
    rs: presets.rust,
  })[
    title.split('.').pop()
  ]

highlight('.card { color: red; }', presetForTitle('theme.css'))
highlight('int main() { return 0; }', presetForTitle('main.c'))
highlight('package main\\nfunc main() {}', presetForTitle('main.go'))
highlight('class App { public static void main(String[] a) {} }', presetForTitle('App.java'))
highlight('def hi():\\n    print("ok")', presetForTitle('main.py'))`

const cPresetSample = `\
/* add two integers */
int sum(int a, int b) {
  return a + b; // sum
}
int main() {
  return sum(20, 22);
}`

const javaPresetSample = `\
class App {
  // entry point
  static int add(int a, int b) { return a + b; }
  public static void main(String[] args) {
    System.out.println(add(20, 22)); // print result
  }
}`

const pythonPresetSample = `\
def add(a, b):
  return a + b  # sum
if __name__ == "__main__":
  print(add(20, 22))  # demo
`

export default function InstallBanner() {
  const [bannerTheme, setBannerTheme] = useState<'light' | 'dark'>('light')
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

  const chromeVars = useMemo(
    () => plateToDocsUiVarMap(plateColors),
    [plateColors]
  )

  const codePlate = bannerTheme === 'light' ? plateColors : darkPlate
  const codeShVars = useMemo(
    () => plateToShVarMap(codePlate),
    [codePlate]
  )

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
        <div className="install-banner__head">
          <h2 className="install-banner__command install-banner__theme-heading">
            <span className="install-banner__theme-sr">
              Click the dashed file name to switch light or dark preview for the code
              samples below.
            </span>
            Theme:{' '}
            <button
              type="button"
              className="install-banner__theme-toggle"
              onClick={() =>
                setBannerTheme((t) => (t === 'light' ? 'dark' : 'light'))
              }
              aria-label={
                bannerTheme === 'light'
                  ? 'Preview uses light.css. Click to switch to dark.css.'
                  : 'Preview uses dark.css. Click to switch to light.css.'
              }
            >
              {bannerTheme === 'light' ? 'light.css' : 'dark.css'}
            </button>
          </h2>
        </div>
        <div
          className="install-banner__code"
          style={codeShVars as CSSProperties}
        >
          <Code title='install.sh'>
            {usageCode}
          </Code>
          <CopyButton codeSnippet={usageCode} />
        </div>
        <br />
        <div
          className="install-banner__code"
          style={codeShVars as CSSProperties}
        >
          <Code title='color.css'>
            {cssCode}
          </Code>
          <CopyButton codeSnippet={cssCode} />
        </div>

        <div className="install-banner__block">
          <p>
            For <strong>CSS</strong> (and SCSS, Sass, Less), a preset treats <code>/* */</code>{' '}
            comments and <code>@</code>-rules as CSS, not as JS regex or division. For{' '}
            <strong>Python</strong>, the preset uses <code>#</code> line comments and Python
            keywords instead of JS rules. <strong>C</strong>, <strong>Go</strong>, and{' '}
            <strong>Java</strong> use C-like preset profiles with language-specific keyword sets.
          </p>
          <p>
            Pass that preset as the second argument to <code>highlight</code>. With{' '}
            <a href="https://www.npmjs.com/package/codice" target="_blank" rel="noreferrer">
              Codice
            </a>
            , built-in extension mapping covers CSS, Python, and Rust; for other languages call{' '}
            <code>highlight</code> with the preset and pass the HTML to{' '}
            <code>Code</code> using <code>asMarkup</code> (as below). In plain JS, map the path or
            extension yourself the same way.
          </p>
        </div>
        <div
          className="install-banner__code"
          style={codeShVars as CSSProperties}
        >
          <Code title="presets.js">
            {presetByTitleExample}
          </Code>
          <CopyButton codeSnippet={presetByTitleExample} />
        </div>
        <div className="install-banner__block">
          <p>
            SCSS, Sass, and Less use the same CSS preset. Rust uses <code>presets.rust</code>,
            and C-like languages use <code>presets.c</code>, <code>presets.go</code>, or{' '}
            <code>presets.java</code>.
          </p>
        </div>
        <div className="install-banner__sample-grid">
          <div
            className="install-banner__code install-banner__code--sample"
            style={codeShVars as CSSProperties}
          >
            <Code title="main.c" asMarkup preformatted>
              {highlight(cPresetSample, c)}
            </Code>
          </div>
          <div
            className="install-banner__code install-banner__code--sample"
            style={codeShVars as CSSProperties}
          >
            <Code title="App.java" asMarkup preformatted>
              {highlight(javaPresetSample, java)}
            </Code>
          </div>
          <div
            className="install-banner__code install-banner__code--sample"
            style={codeShVars as CSSProperties}
          >
            <Code title="main.py" asMarkup preformatted>
              {highlight(pythonPresetSample, python)}
            </Code>
          </div>
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
