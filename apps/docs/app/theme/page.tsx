'use client'

import { Code } from '@sugar-high/react'
import Link from 'next/link'
import { CopyButton } from '../components/copy-button'
import { cssRecipe, tailwindRecipe } from './recipes'
import '../product-page.css'
import './page.css'

const example = `type Theme = {
  name: string
  quiet: boolean
}

export function label(theme: Theme) {
  // Presentation stays separate from parsing.
  return theme.quiet ? theme.name.toLowerCase() : theme.name
}`

const emphasis = {
  keyword: 'theme-token-strong',
  class: 'theme-token-strong',
  comment: 'theme-token-comment',
} as const

const cssUsage = `<Code className="sh-theme" lang="typescript">
  {source}
</Code>`

const tailwindUsage = `import { Code } from '@sugar-high/react'
import type { ComponentProps } from 'react'

type CodeProps = ComponentProps<typeof Code>

export function ThemedCode({ className = '', ...props }: CodeProps) {
  return <Code {...props} className={\`sh-theme font-mono ${'${className}'}\`} />
}

<ThemedCode lang="typescript">{source}</ThemedCode>`

const cssAgentCommand = `mkdir -p src/styles && curl -fsSL \\
  https://sugar-high.vercel.app/theme/sugar-high.css \\
  -o src/styles/sugar-high.css`

const tailwindAgentCommand = `curl -fsSL \\
  https://sugar-high.vercel.app/theme/sugar-high.tailwind.css \\
  -o src/sugar-high-theme.css`

function Window({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`product-card theme-window ${className}`}>
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
      <span className="theme-agent__label">Agent setup</span>
      <div className="theme-agent__command">
        <code>{command}</code>
        <CopyButton codeSnippet={command} aria-label="Copy agent setup command" />
      </div>
    </div>
  )
}

function Result({ className, cx }: { className: string; cx?: typeof emphasis }) {
  return (
    <Window title="result.ts">
      <Code className={`theme-result ${className}`} lang="typescript" cx={cx}>{example}</Code>
    </Window>
  )
}

export default function ThemePage() {
  return (
    <div className="product-page theme-product">
      <div className="product-shell">
        <nav className="product-nav" aria-label="Product navigation">
          <Link className="product-nav__brand" href="/">Sugar High</Link>
          <div className="product-nav__links">
            <Link href="/react">React</Link>
            <Link href="/remark">Remark</Link>
          </div>
        </nav>

        <header className="product-hero theme-hero">
          <div className="product-eyebrow">customize</div>
          <h1>Themes</h1>
          <p className="product-lede">
            Set token colors with scoped CSS variables. Add bold, italic, or decoration with CSS
            or <code>cx</code>. Fonts and layout stay yours.
          </p>
        </header>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Comfortable by default.</h2>
            <p>Three calm light palettes adapted from the themes used by Codice.</p>
          </div>
          <div className="theme-preview-grid">
            <Window title="sugar-high" className="theme-palette--sugar">
              <Code className="theme-preview" lang="typescript">{example}</Code>
            </Window>
            <Window title="github-light" className="theme-palette--github">
              <Code className="theme-preview" lang="typescript" cx={emphasis}>{example}</Code>
            </Window>
            <Window title="soft-minimal" className="theme-palette--minimal">
              <Code className="theme-preview" lang="typescript" cx={emphasis}>{example}</Code>
            </Window>
          </div>
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Plain CSS.</h2>
            <p>Import one local file and scope the theme with a class.</p>
          </div>
          <div className="theme-usage">
            <div className="theme-usage__source">
              <Snippet title="sugar-high.css" code={cssRecipe} />
              <Snippet title="usage.tsx" code={cssUsage} lang="javascript" />
            </div>
            <div className="theme-usage__result"><Result className="sh-theme" /></div>
          </div>
          <AgentSetup command={cssAgentCommand} />
        </section>

        <section className="product-section">
          <div className="product-section__head">
            <h2>Tailwind.</h2>
            <p>Compose a small component with Tailwind's CSS theme variables.</p>
          </div>
          <div className="theme-usage">
            <div className="theme-usage__source">
              <Snippet title="sugar-high-theme.css" code={tailwindRecipe} />
              <Snippet title="usage.tsx" code={tailwindUsage} lang="javascript" />
            </div>
            <div className="theme-usage__result"><Result className="theme-palette--tailwind" cx={emphasis} /></div>
          </div>
          <AgentSetup command={tailwindAgentCommand} />
        </section>
      </div>
    </div>
  )
}
