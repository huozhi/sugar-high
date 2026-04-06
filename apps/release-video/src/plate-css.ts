import { interpolateColors } from 'remotion'
import type { ColorPlate } from './plates'
import { STYLISH_DARK, STYLISH_LIGHT } from './plates'

/**
 * `--sh-*` custom properties for sugar-high HTML output.
 * `mix` 0 = light plate, 1 = dark plate (theme preview animation).
 */
export function plateMixToShVars(mix: number): Record<string, string> {
  const keys = Object.keys(STYLISH_LIGHT) as (keyof ColorPlate)[]
  const o: Record<string, string> = {}
  for (const k of keys) {
    o[`--sh-${k}`] = interpolateColors(mix, [0, 1], [
      STYLISH_LIGHT[k],
      STYLISH_DARK[k],
    ])
  }
  return o
}

export function plateToShVars(p: ColorPlate): Record<string, string> {
  return {
    '--sh-class': p.class,
    '--sh-identifier': p.identifier,
    '--sh-sign': p.sign,
    '--sh-entity': p.entity,
    '--sh-property': p.property,
    '--sh-jsxliterals': p.jsxliterals,
    '--sh-string': p.string,
    '--sh-keyword': p.keyword,
    '--sh-comment': p.comment,
    '--sh-break': p.break,
    '--sh-space': p.space,
  }
}

export const SH_TOKEN_INLINE_CSS = `
.sh__line { display: block; line-height: inherit; margin: 0; padding: 0; }
.sh__token--class { color: var(--sh-class); }
.sh__token--identifier { color: var(--sh-identifier); }
.sh__token--sign { color: var(--sh-sign); }
.sh__token--entity { color: var(--sh-entity); }
.sh__token--property { color: var(--sh-property); }
.sh__token--jsxliterals { color: var(--sh-jsxliterals); }
.sh__token--string { color: var(--sh-string); }
.sh__token--keyword { color: var(--sh-keyword); }
.sh__token--comment { color: var(--sh-comment); }
.sh__token--break { color: var(--sh-break); }
.sh__token--space { color: var(--sh-space); }
`
