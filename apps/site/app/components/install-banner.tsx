'use client'

import {
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { CopyButton } from './copy-button'
import { Code } from '@sugar-high/react'
import { highlight } from 'sugar-high'
import { languages } from 'sugar-high/lang'
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

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript, JSX',
  typescript: 'TypeScript, TSX',
  css: 'CSS, SCSS',
  python: 'Python',
  c: 'C',
  go: 'Go',
  java: 'Java',
  rust: 'Rust',
  json: 'JSON, JSONC',
  diff: 'Diff, patch',
  shell: 'Shell, Bash, Zsh',
  cpp: 'C++',
  csharp: 'C#',
  sql: 'SQL',
  html: 'HTML, XML',
  yaml: 'YAML',
  markdown: 'Markdown, MDX',
  plaintext: 'Plain text',
  ruby: 'Ruby',
  kotlin: 'Kotlin, Kotlin Script',
  swift: 'Swift',
  php: 'PHP',
  toml: 'TOML',
  powershell: 'PowerShell',
  dockerfile: 'Dockerfile',
  graphql: 'GraphQL',
  hcl: 'HCL, Terraform',
  zig: 'Zig',
  lua: 'Lua',
}

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
  const [languagesOpen, setLanguagesOpen] = useState(false)
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
    () => `:root {
${formatPlateAsCssVars(plateColors)}
}`,
    [plateColors]
  )

  const darkThemeCss = useMemo(
    () => `:root[data-theme='dark'] {
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
        <div className="install-banner__section-title">
          <h2>Basics</h2>
        </div>
        <div className="install-banner__block">
          <h2 className="install-banner__mode-heading">
            <button type="button" aria-pressed={bannerTheme === 'light'} onClick={() => setBannerTheme('light')}>Light</button>
            <span aria-hidden="true"> &amp; </span>
            <button type="button" aria-pressed={bannerTheme === 'dark'} onClick={() => setBannerTheme('dark')}>Dark</button>
          </h2>
          <p>
            Match light and dark token palettes for your theme
          </p>
        </div>
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
            onClick={() => setBannerTheme('light')}
          >
            <div className="install-banner__theme-pane-label">light.css</div>
            <Code title={null} lang="css">
              {lightThemeCss}
            </Code>
            <button
              type="button"
              className="install-banner__theme-pane-action"
              aria-label="Use light theme preview"
              aria-pressed={bannerTheme === 'light'}
              onClick={() => setBannerTheme('light')}
            />
          </div>
          <div
            className={`install-banner__theme-pane install-banner__theme-pane--dark${
              bannerTheme === 'dark' ? ' install-banner__theme-pane--active' : ''
            }`}
            style={darkCodeShVars as CSSProperties}
            onClick={() => setBannerTheme('dark')}
          >
            <div className="install-banner__theme-pane-label">dark.css</div>
            <Code title={null} lang="css">
              {darkThemeCss}
            </Code>
            <button
              type="button"
              className="install-banner__theme-pane-action"
              aria-label="Use dark theme preview"
              aria-pressed={bannerTheme === 'dark'}
              onClick={() => setBannerTheme('dark')}
            />
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

        <div className="install-banner__block install-banner__language-description">
          <h2>Languages</h2>
          <p>
            Sugar High includes <a
              className="install-banner__language-toggle"
              href="#all-languages"
              aria-controls="all-languages"
              aria-expanded={languagesOpen}
              onClick={event => {
                event.preventDefault()
                setLanguagesOpen(open => !open)
              }}
            ><strong>{languages.length} languages</strong></a> out of the box—no extra grammars or setup required.
            JavaScript and JSX work by default.
          </p>
          <p>
            Use <code>lang()</code> to resolve filenames, extensions, and aliases to a language name.
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
        <details
          id="all-languages"
          className="install-banner__languages"
          open={languagesOpen}
          onToggle={event => setLanguagesOpen(event.currentTarget.open)}
        >
          <summary>All languages</summary>
          <table>
            <thead><tr><th scope="col">Value</th><th scope="col">Language &amp; relatives</th></tr></thead>
            <tbody>
              {languages.map(language => (
                <tr key={language.id}>
                  <th scope="row"><code>{language.id}</code></th>
                  <td>{languageLabels[language.id] ?? language.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
        <div className="install-banner__section-title">
          <h2>Solution</h2>
        </div>
        <div className="install-banner__block install-banner__solution-item">
          <h2>React Components</h2>
          <p>
            <Link href="/react"><code>@sugar-high/react</code></Link> provides {`<Editor /> & <Code />`} to present or edit highlighted code,
            with built-in themes and custom token colors.
          </p>
        </div>
        <div className="install-banner__block install-banner__solution-item">
          <h2>Themes</h2>
          <p>
            Set token colors with scoped CSS variables, then use <code>cx</code> for emphasis.
            Explore the copyable <Link href="/theme">CSS and Tailwind theme guide</Link>.
          </p>
        </div>
        {children}
        <div className="install-banner__block install-banner__solution-item">
          <h2>Remark plugin</h2>
          <p>
            <a href='https://remark.js.org/' target='_blank' rel='noreferrer'>Remark.js</a>{' '}
            is a powerful markdown processor, you can use the <Link href='/remark'>sugar-high remark plugin</Link> with remark.js to highlight code blocks in markdown.
          </p>
        </div>
      </div>
    </div>
  )
}
