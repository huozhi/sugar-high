import type { CSSProperties } from 'react'
import { highlight, type LanguageName } from 'sugar-high'
import { interpolate } from 'remotion'
import { compactHighlightedHtml } from '../compact-highlight-html'
import { THEME_ITEM_FRAMES, THEME_TITLE_FRAMES } from '../constants'
import { DOCS_FONT_MONO, DOCS_FONT_SANS } from '../docs-ui'
import { SH_TOKEN_INLINE_CSS } from '../plate-css'

const THEMES: { name: string; lang: LanguageName; code: string; bg: string; text: string; keyword: string; string: string; property: string; comment: string }[] = [
  { name: 'Sugar High', lang: 'typescript', code: `type Theme = 'light' | 'dark'\n\nconst release = {\n  name: 'sugar-high',\n  version: 2,\n  languages: 25,\n}\n\nconst label = \`\${release.name} v\${release.version}\``, bg: '#f8f9fa', text: '#354150', keyword: '#f47067', string: '#00a99a', property: '#4e8fdf', comment: '#a19595' },
  { name: 'Quiet Light', lang: 'python', code: `def highlight(source, language):\n    tokens = parse(source)\n    theme = "quiet-light"\n    result = render(tokens, theme)\n    return result\n\ncode = "print('hello')"\nprint(highlight(code, "python"))`, bg: '#f5f5f5', text: '#333333', keyword: '#7a3e9d', string: '#448c27', property: '#006ab1', comment: '#aaaaaa' },
  { name: 'GitHub Dark', lang: 'rust', code: `fn main() {\n    let name = "sugar-high";\n    let version = 2;\n    let tiny = true;\n\n    println!("{name} v{version}");\n    println!("tiny: {tiny}");\n}`, bg: '#0d1117', text: '#e6edf3', keyword: '#ff7b72', string: '#a5d6ff', property: '#79c0ff', comment: '#8b949e' },
  { name: 'Gruvbox', lang: 'css', code: `code[data-theme] {\n  --theme: gruvbox;\n  --accent: #fb4934;\n\n  color: var(--foreground);\n  background: var(--surface);\n  font-family: ui-monospace;\n}`, bg: '#282828', text: '#ebdbb2', keyword: '#fb4934', string: '#b8bb26', property: '#83a598', comment: '#928374' },
  { name: 'One Dark', lang: 'javascript', code: `export function render(source) {\n  const options = {\n    lang: 'javascript',\n  }\n\n  const html = highlight(source, options)\n  document.body.innerHTML = html\n  return html\n}`, bg: '#282c34', text: '#abb2bf', keyword: '#c678dd', string: '#98c379', property: '#61afef', comment: '#5c6370' },
]

export function ThemeScene({ relFrame }: { relFrame: number }) {
  const contentFrame = Math.max(0, relFrame - THEME_TITLE_FRAMES)
  const slot = THEME_ITEM_FRAMES
  const index = Math.min(THEMES.length - 1, Math.floor(contentFrame / slot))
  const theme = THEMES[index]
  const pop = interpolate(contentFrame % slot, [0, 3, slot - 2, slot], [.97, 1, 1, .985], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const vars = {
    '--sh-class': theme.property, '--sh-identifier': theme.text, '--sh-sign': theme.text,
    '--sh-entity': theme.property, '--sh-property': theme.property, '--sh-jsxliterals': theme.keyword,
    '--sh-string': theme.string, '--sh-keyword': theme.keyword, '--sh-comment': theme.comment,
    '--sh-break': theme.bg, '--sh-space': theme.bg,
  } as CSSProperties

  if (relFrame < THEME_TITLE_FRAMES) {
    return <div style={{ ...titleBeat, background: theme.bg, color: theme.text }}>Themes</div>
  }

  return (
    <div style={{ ...root, background: theme.bg, color: theme.text }}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      <div style={themeName}>{theme.name}</div>
      <div style={codeCenter}>
        <pre style={{ ...pre, ...vars, scale: pop }} dangerouslySetInnerHTML={{ __html: compactHighlightedHtml(highlight(theme.code, { lang: theme.lang })) }} />
      </div>
      <div style={steps}>{THEMES.map((item, i) => <span key={item.name} style={{ ...step, background: i === index ? theme.keyword : theme.comment, opacity: i === index ? 1 : .3 }} />)}</div>
    </div>
  )
}

const root: CSSProperties = { width: '100%', height: '100%', boxSizing: 'border-box', padding: '50px 84px', fontFamily: DOCS_FONT_SANS, position: 'relative' }
const titleBeat: CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DOCS_FONT_SANS, fontSize: 132, fontWeight: 750, letterSpacing: '-0.05em' }
const themeName: CSSProperties = { position: 'absolute', right: 84, top: 58, fontSize: 34, fontWeight: 650, opacity: .68 }
const codeCenter: CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const pre: CSSProperties = { width: 'fit-content', maxWidth: 1540, margin: 0, padding: 0, fontFamily: DOCS_FONT_MONO, fontSize: 60, lineHeight: 1.32, whiteSpace: 'pre' }
const steps: CSSProperties = { position: 'absolute', bottom: 26, left: '50%', translate: '-50% 0', display: 'flex', gap: 10 }
const step: CSSProperties = { display: 'block', width: 44, height: 5, borderRadius: 99 }
