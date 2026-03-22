import type { CSSProperties } from 'react'
import { highlight } from 'sugar-high'
import { interpolate, interpolateColors } from 'remotion'
import {
  codeCardShell,
  codeTitleBarBase,
  preHighlighted,
} from '../code-block-styles'
import { compactHighlightedHtml } from '../compact-highlight-html'
import { THEME_LIGHT_TO_DARK_FRAMES } from '../constants'
import {
  DARK_PAGE_BG,
  DOCS_FONT_SANS,
  DOCS_TEXT,
  LIGHT_PAGE_BG,
} from '../docs-ui'
import { plateMixToShVars, SH_TOKEN_INLINE_CSS } from '../plate-css'

const THEME_CODE = `import { highlight } from 'sugar-high'
export const matchBoundary = (s) => /^[/][\\w-]+[/]$/u.test(s)
const mixed = 12 / /\\d+/.test('3') ? 1 : 0
const flags = ['g', 'i', 'm'].filter(Boolean).join('')
const re = new RegExp('\\\\d+', flags)
export function pickDelim(str) {
  const i = str.indexOf('/')
  return i < 0 ? str : str.slice(0, i) + str.slice(i + 1)
}
console.log(mixed, re.test('99'))`

type Props = {
  relFrame: number
}

export function ThemeScene({ relFrame }: Props) {
  const mix = interpolate(
    relFrame,
    [0, THEME_LIGHT_TO_DARK_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const tokenVars = plateMixToShVars(mix) as CSSProperties
  const raw = highlight(THEME_CODE)
  const html = compactHighlightedHtml(raw)

  const panelBg = interpolateColors(mix, [0, 1], [LIGHT_PAGE_BG, DARK_PAGE_BG])
  const tabTitleColor = interpolateColors(mix, [0, 1], [DOCS_TEXT, '#e6edf3'])
  const sectionHeadingColor = interpolateColors(mix, [0, 1], [DOCS_TEXT, '#e6edf3'])

  return (
    <div style={root}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      <h2 style={{ ...sectionTitle, color: sectionHeadingColor }}>Light / dark theme</h2>
      <div style={stage}>
        <div style={column}>
          <div
            style={{
              ...codeCardShell,
              background: panelBg,
            }}
          >
            <div
              style={{
                ...codeTitleBarBase,
                background: panelBg,
                color: tabTitleColor,
              }}
            >
              literals.js
            </div>
            <pre
              style={{
                ...preHighlighted,
                ...tokenVars,
                background: panelBg,
                fontSize: 32,
                padding: '30px 34px 38px',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const root: CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '100%',
  boxSizing: 'border-box',
  padding: '44px 48px 48px',
  background: 'transparent',
  fontFamily: DOCS_FONT_SANS,
  display: 'flex',
  flexDirection: 'column',
}

const sectionTitle: CSSProperties = {
  position: 'absolute',
  top: 40,
  left: 48,
  margin: 0,
  fontSize: 44,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  zIndex: 3,
}

const stage: CSSProperties = {
  position: 'relative',
  width: '100%',
  flex: 1,
  marginTop: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const column: CSSProperties = {
  width: 'min(1200px, 94%)',
  maxWidth: 1200,
}
