import type { CSSProperties } from 'react'
import { Easing, interpolate } from 'remotion'
import { OUTRO_FRAMES } from '../constants'
import { DOCS_FONT_SANS } from '../docs-ui'
import { RELEASE } from '../release'

export function OutroScene({ relFrame = 0 }: { relFrame?: number }) {
  return (
    <div style={root}>
      <div style={{
        ...url,
        opacity: interpolate(relFrame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        scale: interpolate(relFrame, [0, OUTRO_FRAMES], [.76, 1.16], { easing: Easing.bezier(.16, 1, .3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>{RELEASE.host}</div>
    </div>
  )
}

const root: CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }
const url: CSSProperties = { fontFamily: DOCS_FONT_SANS, fontSize: 112, fontWeight: 750, letterSpacing: '-0.045em', color: '#e6edf3', whiteSpace: 'nowrap' }
