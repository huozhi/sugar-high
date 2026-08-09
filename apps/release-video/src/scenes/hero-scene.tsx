import type { CSSProperties } from 'react'
import { highlight } from 'sugar-high'
import { interpolate } from 'remotion'
import { DOCS_FONT_MONO_HERO, DOCS_FONT_SANS, DOCS_MUTED, DOCS_TEXT } from '../docs-ui'
import { STYLISH_LIGHT } from '../plates'
import { plateToShVars, SH_TOKEN_INLINE_CSS } from '../plate-css'
import { RELEASE } from '../release'

export const API_LINE = `highlight(code, { lang: 'typescript' })`
export const TYPE_START = 24
export const TYPE_END = 64

type Props = { relFrame: number }

export function HeroScene({ relFrame }: Props) {
  const count = Math.floor(
    interpolate(relFrame, [TYPE_START, TYPE_END], [0, API_LINE.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )
  const typed = API_LINE.slice(0, count)

  return (
    <div style={root}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      <h1 style={h1}>
        {RELEASE.name}<span style={version}>{RELEASE.version}</span>
      </h1>
      <p style={tagline}>{RELEASE.tagline}</p>
      <div style={{ ...api, ...plateToShVars(STYLISH_LIGHT) as CSSProperties }}>
        <span style={typedText} dangerouslySetInnerHTML={{ __html: highlight(typed, { lang: 'typescript' }) }} />
        <span style={{ ...cursor, opacity: relFrame % 16 < 9 ? 1 : 0 }}>▌</span>
      </div>
    </div>
  )
}

const root: CSSProperties = {
  width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
  color: DOCS_TEXT, fontFamily: DOCS_FONT_SANS,
}
const h1: CSSProperties = { margin: 0, fontSize: 184, fontWeight: 800, letterSpacing: '-0.05em' }
const version: CSSProperties = { marginLeft: 30, color: '#f47067', fontSize: 70, verticalAlign: 'top' }
const tagline: CSSProperties = { margin: '18px 0 94px', color: DOCS_MUTED, fontSize: 42 }
const api: CSSProperties = {
  display: 'flex', alignItems: 'baseline', width: 'fit-content', maxWidth: '92vw',
  fontFamily: DOCS_FONT_MONO_HERO, fontSize: 50, whiteSpace: 'nowrap',
}
const typedText: CSSProperties = { display: 'inline', whiteSpace: 'nowrap' }
const cursor: CSSProperties = { display: 'inline-block', flex: '0 0 auto', color: '#f47067', marginLeft: 2 }
