import { Composition } from 'remotion'
import { FPS, HERO_FRAMES, OUTRO_FRAMES, STACK_FRAMES, THEME_FRAMES, TOTAL_FRAMES } from './constants'
import { Main } from './main'

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  )
}

export const sectionFrames = {
  hero: HERO_FRAMES,
  stack: STACK_FRAMES,
  theme: THEME_FRAMES,
  outro: OUTRO_FRAMES,
}
