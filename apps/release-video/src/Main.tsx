import type { ReactNode } from 'react'
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from 'remotion'
import {
  HERO_FRAMES,
  OUTRO_FRAMES,
  STACK_FRAMES,
  THEME_FRAMES,
  THEME_LIGHT_TO_DARK_FRAMES,
} from './constants'
import { DARK_PAGE_BG, LIGHT_PAGE_BG } from './docs-ui'
import { HeroScene } from './scenes/hero-scene'
import { OutroScene } from './scenes/outro-scene'
import { StackScene } from './scenes/stack-scene'
import { ThemeScene } from './scenes/theme-scene'

export function Main() {
  const frame = useCurrentFrame()
  const hEnd = HERO_FRAMES
  const sEnd = hEnd + STACK_FRAMES
  const tEnd = sEnd + THEME_FRAMES

  const themeStart = sEnd
  const inTheme = frame >= themeStart && frame < tEnd
  const relTheme = frame - themeStart

  const pageMix = inTheme
    ? interpolate(relTheme, [0, THEME_LIGHT_TO_DARK_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  const fillBg = inTheme
    ? interpolateColors(pageMix, [0, 1], [LIGHT_PAGE_BG, DARK_PAGE_BG])
    : LIGHT_PAGE_BG

  let body: ReactNode
  if (frame < hEnd) {
    body = <HeroScene relFrame={frame} />
  } else if (frame < sEnd) {
    body = <StackScene relFrame={frame - hEnd} />
  } else if (frame < tEnd) {
    body = <ThemeScene relFrame={relTheme} />
  } else {
    body = <OutroScene relFrame={frame - tEnd} />
  }

  return <AbsoluteFill style={{ backgroundColor: fillBg }}>{body}</AbsoluteFill>
}
