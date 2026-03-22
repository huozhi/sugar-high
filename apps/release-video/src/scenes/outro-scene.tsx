import type { CSSProperties } from 'react'
import { DOCS_HOST } from '../constants'
import { DOCS_FONT_SANS, DOCS_TEXT } from '../docs-ui'

type OutroProps = { relFrame?: number }

export function OutroScene(_: OutroProps) {
  return (
    <div style={root}>
      <div style={{ ...urlOnly, color: DOCS_TEXT }}>{DOCS_HOST}</div>
    </div>
  )
}

const root: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  boxSizing: 'border-box',
  padding: '48px 5%',
}

const urlOnly: CSSProperties = {
  fontFamily: DOCS_FONT_SANS,
  fontSize: 96,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  textAlign: 'center',
  maxWidth: '92%',
  wordBreak: 'break-word',
}
