import { Audio } from '@remotion/media'
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import {
  COMPOSE_FRAMES,
  COMPOSE_ITEM_INTERVAL,
  COMPOSE_TITLE_FRAMES,
  HERO_FRAMES,
  OUTRO_FRAMES,
  STACK_FRAMES,
  STACK_CARD_INTERVAL,
  STACK_TITLE_FRAMES,
  THEME_FRAMES,
  THEME_LIGHT_TO_DARK_FRAMES,
  THEME_ITEM_FRAMES,
  THEME_TITLE_FRAMES,
} from './constants'
import { DARK_PAGE_BG, LIGHT_PAGE_BG } from './docs-ui'
import { API_LINE, HeroScene, TYPE_END, TYPE_START } from './scenes/hero-scene'
import { ComposeScene } from './scenes/compose-scene'
import { OutroScene } from './scenes/outro-scene'
import { StackScene } from './scenes/stack-scene'
import { ThemeScene } from './scenes/theme-scene'

export function Main() {
  const frame = useCurrentFrame()
  const hEnd = HERO_FRAMES
  const sEnd = hEnd + STACK_FRAMES
  const cEnd = sEnd + COMPOSE_FRAMES
  const tEnd = cEnd + THEME_FRAMES

  const themeStart = cEnd
  const inTheme = frame >= themeStart
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

  return (
    <AbsoluteFill style={{ backgroundColor: fillBg }}>
      <Sequence durationInFrames={HERO_FRAMES}>
        <HeroScene relFrame={frame} />
      </Sequence>
      <Sequence from={hEnd} durationInFrames={STACK_FRAMES}>
        <StackScene relFrame={frame - hEnd} />
      </Sequence>
      <Sequence from={sEnd} durationInFrames={COMPOSE_FRAMES}>
        <ComposeScene relFrame={frame - sEnd} />
      </Sequence>
      <Sequence from={cEnd} durationInFrames={THEME_FRAMES}>
        <ThemeScene relFrame={relTheme} />
      </Sequence>
      <Sequence from={tEnd} durationInFrames={OUTRO_FRAMES}>
        <OutroScene relFrame={frame - tEnd} />
      </Sequence>

      {Array.from({ length: Math.ceil(API_LINE.length / 2) }, (_, index) => (
        <Sequence
          key={index}
          from={TYPE_START + Math.round(index * (TYPE_END - TYPE_START) / (API_LINE.length / 2))}
          durationInFrames={2}
          layout="none"
        >
          <Audio
            src={staticFile('audio/mechanical-key.wav')}
            playbackRate={[0.96, 1, 1.04][index % 3]}
            volume={0.46}
          />
        </Sequence>
      ))}

      {Array.from({ length: 6 }, (_, index) => (
        <Sequence
          key={`wind-${index}`}
          from={hEnd + STACK_TITLE_FRAMES + index * STACK_CARD_INTERVAL}
          durationInFrames={8}
          layout="none"
        >
          <Audio src={staticFile('audio/wind.wav')} playbackRate={0.9 + index * 0.025} volume={0.12} />
        </Sequence>
      ))}

      {Array.from({ length: 3 }, (_, index) => (
        <Sequence
          key={`integration-pop-${index}`}
          from={sEnd + COMPOSE_TITLE_FRAMES + index * COMPOSE_ITEM_INTERVAL}
          durationInFrames={8}
          layout="none"
        >
          <Audio src={staticFile('audio/bubble.wav')} playbackRate={0.96 + index * 0.05} volume={0.24} />
        </Sequence>
      ))}

      {Array.from({ length: 5 }, (_, index) => (
        <Sequence
          key={`theme-pop-${index}`}
          from={cEnd + THEME_TITLE_FRAMES + index * THEME_ITEM_FRAMES}
          durationInFrames={8}
          layout="none"
        >
          <Audio src={staticFile('audio/bubble.wav')} playbackRate={0.92 + index * 0.035} volume={0.2} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
