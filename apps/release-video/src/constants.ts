/** 30 fps timeline — four sections + outro URL. */
export const FPS = 30

/** Trim a couple frames (~66ms @ 30fps) off each segment tail. */
const TAIL_TRIM = 2

/** Hero (title + decode): shorter tail after decode. */
export const HERO_FRAMES = 2 * FPS - TAIL_TRIM
/** Shorter multi-language segment. */
export const STACK_FRAMES = 2 * FPS - TAIL_TRIM
/** Single light→dark ramp — page + panel + tokens (see main.tsx + theme-scene). */
export const THEME_LIGHT_TO_DARK_FRAMES = 18
/** Short beat on full dark, then cut — avoids a long static tail. */
export const THEME_HOLD_AFTER_DARK_FRAMES = 20
/** Total theme segment = ramp + hold (no extra idle after transition). */
export const THEME_FRAMES =
  THEME_LIGHT_TO_DARK_FRAMES + THEME_HOLD_AFTER_DARK_FRAMES
/** URL outro — short hold, no long tail. */
export const OUTRO_FRAMES = 20

export const TOTAL_FRAMES =
  HERO_FRAMES + STACK_FRAMES + THEME_FRAMES + OUTRO_FRAMES

/** Full URL for links; outro displays {@link DOCS_HOST} only. */
export const DOCS_URL = 'https://sugar-high.vercel.app/'

/** No protocol, no trailing slash — matches outro cardless ending. */
export const DOCS_HOST = 'sugar-high.vercel.app'
