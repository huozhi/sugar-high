import type { CSSProperties } from 'react'
import { highlight } from 'sugar-high'
import { compactHighlightedHtml } from '../compact-highlight-html'
import { COMPOSE_ITEM_INTERVAL, COMPOSE_TITLE_FRAMES } from '../constants'
import { DOCS_FONT_MONO, DOCS_FONT_SANS, DOCS_TEXT } from '../docs-ui'
import { STYLISH_LIGHT } from '../plates'
import { plateToShVars, SH_TOKEN_INLINE_CSS } from '../plate-css'

const ROWS = [
  { title: 'Core', code: `parse(code, language)`, meta: 'gzip  1.74 kB core · 8.59 kB full' },
  { title: 'React', code: `<Editor />  <Code />`, meta: '@sugar-high/react' },
  { title: 'Remark', code: `remark().use(sugarHigh)`, meta: '@sugar-high/remark' },
]

export function ComposeScene({ relFrame }: { relFrame: number }) {
  if (relFrame < COMPOSE_TITLE_FRAMES) return <div style={titleBeat}>API to integrations</div>

  return (
    <div style={root}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      <div style={rows}>
        {ROWS.map((item, index) => relFrame >= COMPOSE_TITLE_FRAMES + index * COMPOSE_ITEM_INTERVAL && (
          <section key={item.title} style={row}>
            <h3 style={rowTitle}>{item.title}</h3>
            <pre
              style={{ ...code, ...plateToShVars(STYLISH_LIGHT) as CSSProperties }}
              dangerouslySetInnerHTML={{ __html: compactHighlightedHtml(highlight(item.code, { lang: 'typescript' })) }}
            />
            <div style={meta}>{item.meta}</div>
          </section>
        ))}
      </div>
    </div>
  )
}

const root: CSSProperties = { width: '100%', height: '100%', boxSizing: 'border-box', padding: '60px 80px', fontFamily: DOCS_FONT_SANS, color: DOCS_TEXT, display: 'flex', alignItems: 'center' }
const titleBeat: CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DOCS_FONT_SANS, color: DOCS_TEXT, fontSize: 132, fontWeight: 750, letterSpacing: '-0.05em' }
const rows: CSSProperties = { width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }
const row: CSSProperties = { height: 245, display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr) 520px', alignItems: 'center', padding: '0 46px', background: '#eef2f5', borderRadius: 16, boxSizing: 'border-box' }
const rowTitle: CSSProperties = { margin: 0, color: '#111', fontSize: 60, letterSpacing: '-0.04em' }
const code: CSSProperties = { margin: 0, minWidth: 0, color: '#111', fontFamily: DOCS_FONT_MONO, fontSize: 44, whiteSpace: 'nowrap' }
const meta: CSSProperties = { color: '#6f7982', fontSize: 30, textAlign: 'right', whiteSpace: 'nowrap' }
