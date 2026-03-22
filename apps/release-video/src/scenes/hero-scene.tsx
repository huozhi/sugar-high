import type { CSSProperties } from 'react'
import { interpolate } from 'remotion'
import { DecodedLines } from '../components/decoded-lines'
import { DOCS_FONT_SANS, DOCS_MUTED, DOCS_TEXT } from '../docs-ui'
import { STYLISH_LIGHT } from '../plates'
import { plateToShVars, SH_TOKEN_INLINE_CSS } from '../plate-css'

const CODE_LINES = [
  '/* super tiny syntax highlighter */',
  "import { highlight } from 'sugar-high'",
  "const code = highlight('const text = 1')",
]

type Props = {
  relFrame: number
}

/** Decode + grayscale — shorter than the live site (~450ms at 30fps). */
export function HeroScene({ relFrame }: Props) {
  const decodeStart = 10
  const decodeDur = 12
  const decodeProgress = interpolate(
    relFrame,
    [decodeStart, decodeStart + decodeDur],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const grayscaleOff = interpolate(
    relFrame,
    [decodeStart, decodeStart + decodeDur],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const tokenStyle = plateToShVars(STYLISH_LIGHT) as CSSProperties

  return (
    <div style={root}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      <div style={titleBlock}>
        <h1 style={h1}>
          <span style={bigTitle}>Sugar High</span>
        </h1>
        <p style={tagline}>Super lightweight syntax highlighter</p>
      </div>

      <div
        style={{
          ...codeOuter,
          filter: `grayscale(${grayscaleOff})`,
        }}
      >
        <div style={codeCenter}>
          <DecodedLines
            lines={CODE_LINES}
            progress={decodeProgress}
            frame={relFrame}
            fontSize={54}
            style={{
              ...tokenStyle,
              background: 'transparent',
              padding: '12px 0',
              margin: '0 auto',
              width: 'fit-content',
              maxWidth: 'min(1180px, 88vw)',
              alignSelf: 'center',
            }}
          />
        </div>
      </div>
    </div>
  )
}

const root: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 4%',
  boxSizing: 'border-box',
  background: 'transparent',
  color: DOCS_TEXT,
  fontFamily: DOCS_FONT_SANS,
}

const titleBlock: CSSProperties = {
  textAlign: 'center',
  marginBottom: 44,
  width: '100%',
  maxWidth: 1680,
}

const h1: CSSProperties = {
  margin: 0,
  fontFamily: DOCS_FONT_SANS,
}

const bigTitle: CSSProperties = {
  fontSize: 152,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: 1.05,
}

const tagline: CSSProperties = {
  fontSize: 48,
  color: DOCS_MUTED,
  marginTop: 28,
  marginBottom: 0,
  fontFamily: DOCS_FONT_SANS,
}

const codeOuter: CSSProperties = {
  width: '100%',
  maxWidth: 1680,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'filter 0.26s ease',
}

const codeCenter: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}
