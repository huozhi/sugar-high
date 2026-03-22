import type { CSSProperties } from 'react'
import { DOCS_FONT_MONO, DOCS_FONT_SANS, DOCS_TEXT, LIGHT_PAGE_BG } from './docs-ui'

/** Shared chrome for stack + theme (no shadow, no border). */
export const codeCardShell: CSSProperties = {
  borderRadius: 8,
  overflow: 'hidden',
}

export const codeTitleBarBase: CSSProperties = {
  fontFamily: DOCS_FONT_SANS,
  fontSize: 34,
  padding: '15px 24px',
  fontWeight: 600,
}

export function codeSurface(): CSSProperties {
  return {
    background: LIGHT_PAGE_BG,
    color: DOCS_TEXT,
  }
}

/** Shared `<pre>` for stack + theme highlighted HTML (not hero — see decoded-lines). */
export const preHighlighted: CSSProperties = {
  margin: 0,
  padding: '28px 30px 34px',
  fontSize: 30,
  lineHeight: 1.48,
  fontFamily: DOCS_FONT_MONO,
  whiteSpace: 'pre',
  overflow: 'hidden',
}
