'use client'

import { Code } from '@sugar-high/react'
import { useMemo, useState } from 'react'
import { CopyButton } from '../components/copy-button'
import { ProductNav } from '../product-nav'
import { ProductStrike } from '../product-strike'
import '../product-page.css'
import './page.css'

const sugarExample = `const message = 'Small code, bright ideas'
const packageName = 'sugar-high'

export function greet(name: string) {
  // JavaScript works without configuration.
  return \`${'${message}'} from ${'${name}'} with ${'${packageName}'}\`
}`

const oneLightExample = `type Theme = {
  name: string
  quiet: boolean
}

export function label(theme: Theme) {
  // Presentation stays separate from parsing.
  return theme.quiet ? theme.name.toLowerCase() : theme.name
}`

const minimalExample = `from dataclasses import dataclass

@dataclass
class Theme:
    name: str
    quiet: bool = True

def label(theme: Theme) -> str:
    return theme.name.lower() if theme.quiet else theme.name`

const emphasis = {
  keyword: 'theme-token-strong',
  class: 'theme-token-strong',
  comment: 'theme-token-comment',
} as const

const tailwindUsage = `import { Code } from '@sugar-high/react'
import type { ComponentProps } from 'react'

type CodeProps = ComponentProps<typeof Code>

export function ThemedCode({ className = '', ...props }: CodeProps) {
  return <Code {...props} className={\`sh-theme font-mono ${'${className}'}\`} />
}

<ThemedCode lang="typescript">{source}</ThemedCode>`

const tailwindAgentCommand = `curl -fsSL https://sugar-high.vercel.app/themes/sugar-high.tailwind.css -o src/sugar-high-theme.css`

export type ThemeOption = {
  id: string
  label: string
  file: string
  className: string
  dark: boolean
  css: string
}

function Window({ title, children, className = '', mode }: { title: string; children: React.ReactNode; className?: string; mode?: 'light' | 'dark' }) {
  return (
    <div className={`product-card theme-window ${className}`} data-theme={mode}>
      <div className="product-card__bar">
        <span className="product-card__title">{title}</span>
      </div>
      {children}
    </div>
  )
}

function Snippet({ title, code, lang = 'css' }: { title: string; code: string; lang?: 'css' | 'javascript' }) {
  return (
    <div className="theme-snippet">
      <Window title={title}>
        <Code className="product-code" lang={lang}>{code}</Code>
      </Window>
      <CopyButton codeSnippet={code} aria-label={`Copy ${title}`} />
    </div>
  )
}

function AgentSetup({ command }: { command: string }) {
  return (
    <div className="theme-agent">
      <div className="theme-agent__command">
        <code>{command}</code>
        <CopyButton codeSnippet={command} aria-label="Copy agent setup command" />
      </div>
    </div>
  )
}

function Result({ className, mode, cx }: { className: string; mode?: 'light' | 'dark'; cx?: typeof emphasis }) {
  return (
    <Window title="result.ts" className={className} mode={mode}>
      <Code className="theme-result" lang="typescript" cx={cx}>{sugarExample}</Code>
    </Window>
  )
}

export default function ThemeGuide({ themes, tailwindRecipe }: { themes: ThemeOption[]; tailwindRecipe: string }) {
  const variants = useMemo(() => themes.flatMap(theme => [
    { key: `${theme.id}:light`, label: `${theme.label} — Light`, theme, mode: 'light' as const },
    ...(theme.dark ? [{ key: `${theme.id}:dark`, label: `${theme.label} — Dark`, theme, mode: 'dark' as const }] : []),
  ]), [themes])
  const [variantKey, setVariantKey] = useState('sugar-high:light')
  const [previewKeys, setPreviewKeys] = useState([
    'sugar-high:light',
    'gruvbox:dark',
    'soft-minimal:light',
  ])
  const [randomTick, setRandomTick] = useState(0)
  const selected = variants.find(variant => variant.key === variantKey) ?? variants[0]
  const cssUsage = `<Code className="${selected.theme.className}"${selected.mode === 'dark' ? ' data-theme="dark"' : ''} lang="typescript">
  {source}
</Code>`
  const cssAgentCommand = `curl -fsSL https://sugar-high.vercel.app/themes/${selected.theme.file} -o src/${selected.theme.file}`

  const randomTheme = () => {
    const choices = variants.filter(variant => variant.key !== selected.key)
    const next = choices[Math.floor(Math.random() * choices.length)] ?? selected
    setVariantKey(next.key)
    setRandomTick(tick => tick + 1)
  }

  const randomizePreview = (index: number) => {
    const choices = variants.filter(variant => variant.key !== previewKeys[index])
    const next = choices[Math.floor(Math.random() * choices.length)]
    if (!next) return
    setPreviewKeys(current => current.map((key, currentIndex) => currentIndex === index ? next.key : key))
  }

  const previewContent = [
    { code: sugarExample, lang: 'typescript' as const },
    { code: oneLightExample, lang: 'typescript' as const },
    { code: minimalExample, lang: 'python' as const },
  ]

  return (
    <div className="product-page theme-product">
      <div className="product-shell">
        <ProductNav
          active="theme"
          source="https://github.com/huozhi/sugar-high/tree/main/apps/docs/app/theme"
        />

        <header className="product-hero theme-hero">
          <h1>Themes<ProductStrike /></h1>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Comfortable by default</h2>
            <p>Three calm light palettes adapted from the themes used by Codice.</p>
          </div>
          <div className="theme-preview-grid">
            {previewKeys.map((key, index) => {
              const variant = variants.find(item => item.key === key) ?? variants[index]
              const content = previewContent[index]
              return (
                <div
                  className="theme-preview-action"
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-label={`Randomize ${variant.label} preview`}
                  onClick={() => randomizePreview(index)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      randomizePreview(index)
                    }
                  }}
                >
                  <Window title={variant.label.toLowerCase()} className={variant.theme.className} mode={variant.mode}>
                    <Code className="theme-preview" lang={content.lang} cx={index === 0 ? undefined : emphasis}>{content.code}</Code>
                  </Window>
                </div>
              )
            })}
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head theme-section-head">
            <div>
              <h2>Plain CSS</h2>
              <p>Import one local file and scope the theme with a class.</p>
            </div>
            <div className="theme-switcher">
              <select
                aria-label="Theme"
                value={selected.key}
                onChange={event => setVariantKey(event.target.value)}
              >
                {variants.map(variant => <option key={variant.key} value={variant.key}>{variant.label}</option>)}
              </select>
              <button className="theme-random" type="button" onClick={randomTheme} aria-label="Choose a random theme">
                <svg key={randomTick} viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="4" r="1.5" className="theme-random__dot" />
                </svg>
              </button>
            </div>
            <p className="theme-agent-catalog">
              Coding agents: fetch https://sugar-high.vercel.app/themes/index.json to discover every
              hosted theme, its CSS filename, selector class, and whether it provides a dark variant.
              Download the selected CSS file into the application and apply its class to the Sugar High
              code wrapper; use data-theme=&quot;dark&quot; only for catalog entries marked dark.
            </p>
          </div>
          <div className="theme-usage">
            <div className="theme-usage__result"><Result className={selected.theme.className} mode={selected.mode} /></div>
            <div className="theme-stage-label theme-stage-label--setup">Agent Setup</div>
            <AgentSetup command={cssAgentCommand} />
            <div className="theme-stage-label">Manual Setup</div>
            <div className="theme-usage__source">
              <Snippet title={selected.theme.file} code={selected.theme.css} />
              <Snippet title="usage.tsx" code={cssUsage} lang="javascript" />
            </div>
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Tailwind CSS</h2>
            <p>Compose a small component with Tailwind's CSS theme variables.</p>
          </div>
          <div className="theme-usage">
            <div className="theme-usage__result"><Result className="theme-palette--tailwind" cx={emphasis} /></div>
            <div className="theme-stage-label theme-stage-label--setup">Agent Setup</div>
            <AgentSetup command={tailwindAgentCommand} />
            <div className="theme-stage-label">Manual Setup</div>
            <div className="theme-usage__source">
              <Snippet title="sugar-high-theme.css" code={tailwindRecipe} />
              <Snippet title="usage.tsx" code={tailwindUsage} lang="javascript" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
