import type { CSSProperties } from 'react'
import { highlight, type LanguageName } from 'sugar-high'
import { Easing, interpolate } from 'remotion'
import { compactHighlightedHtml } from '../compact-highlight-html'
import { STACK_CARD_INTERVAL, STACK_FRAMES, STACK_TITLE_FRAMES } from '../constants'
import { DOCS_FONT_MONO, DOCS_FONT_SANS, DOCS_TEXT } from '../docs-ui'
import { STYLISH_LIGHT } from '../plates'
import { plateToShVars, SH_TOKEN_INLINE_CSS } from '../plate-css'

const CARDS: { lang: LanguageName; label: string; code: string }[] = [
  { lang: 'typescript', label: 'TypeScript', code: `type Release = { version: number }\n\nconst release: Release = { version: 2 }\nconst message = \`sugar-high v\${release.version}\`\nconsole.log(message)` },
  { lang: 'python', label: 'Python', code: `def highlight(source, language):\n    tokens = parse(source, language)\n    return render(tokens)\n\nprint(highlight(code, "python"))` },
  { lang: 'rust', label: 'Rust', code: `fn highlight(source: &str) -> String {\n    let tokens = parse(source);\n    render(tokens)\n}\n\nprintln!("{}", highlight(code));` },
  { lang: 'go', label: 'Go', code: `func Highlight(code string) string {\n    tokens := Parse(code)\n    return Render(tokens)\n}\n\nfmt.Println(Highlight(source))` },
  { lang: 'shell', label: 'Shell', code: `#!/bin/sh\n\nfor file in ./src/*; do\n  echo "highlighting $file"\n  sugar-high "$file"\ndone` },
  { lang: 'css', label: 'CSS', code: `:root {\n  --keyword: #f47067;\n  --string: #00a99a;\n}\n\ncode { color: var(--keyword); }` },
]
const ROTATIONS = [-2.4, 1.6, -1.1, 2.2, -1.8, 1.2]
const TOPS = [115, 285, 150, 330, 92, 245]

export function StackScene({ relFrame }: { relFrame: number }) {
  if (relFrame < STACK_TITLE_FRAMES) return <TitleBeat>Multi Languages</TitleBeat>

  return (
    <div style={root}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      {CARDS.map((card, index) => {
        const start = STACK_TITLE_FRAMES + index * STACK_CARD_INTERVAL
        return (
          <div key={card.label} style={{
            ...snippet,
            ...plateToShVars(STYLISH_LIGHT) as CSSProperties,
            left: 70 + index * 228,
            top: TOPS[index] + 120,
            zIndex: index,
            rotate: `${ROTATIONS[index]}deg`,
            opacity: interpolate(relFrame, [start, start + 3, STACK_FRAMES - 5, STACK_FRAMES], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            translate: `${interpolate(relFrame, [start, start + 14], [1250, 0], { easing: Easing.bezier(.16, 1, .3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px 0`,
          }}>
            <div style={cardLabel}>{card.label}</div>
            <pre style={pre} dangerouslySetInnerHTML={{ __html: compactHighlightedHtml(highlight(card.code, { lang: card.lang })) }} />
          </div>
        )
      })}
    </div>
  )
}

function TitleBeat({ children }: { children: string }) {
  return <div style={titleBeat}>{children}</div>
}

const root: CSSProperties = { width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: DOCS_FONT_SANS, color: DOCS_TEXT }
const titleBeat: CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DOCS_FONT_SANS, color: DOCS_TEXT, fontSize: 132, fontWeight: 750, letterSpacing: '-0.05em' }
const snippet: CSSProperties = { position: 'absolute', width: 670, height: 420, overflow: 'hidden', borderRadius: 18, background: '#eef2f5', boxShadow: '0 20px 60px rgba(53,65,80,.14)' }
const cardLabel: CSSProperties = { padding: '25px 32px 10px', color: '#75818c', fontSize: 31, fontWeight: 650 }
const pre: CSSProperties = { margin: 0, padding: '30px 32px', fontFamily: DOCS_FONT_MONO, fontSize: 28, lineHeight: 1.58, whiteSpace: 'pre-wrap' }
