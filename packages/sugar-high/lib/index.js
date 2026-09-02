// @ts-check

import {
  parse,
  render,
} from './core.js'
import { configs } from './presets/configs.js'

/** @param {string | undefined} name */
function configFor(name) {
  return configs[name || 'javascript']
}

/** @param {string} code @param {HighlightOptions | undefined} options */
function highlight(code, options) {
  const { lang, cx, mark, markLine } = options || {}
  const parsed = parse(code, configFor(lang))
  return render(parsed, { cx, mark, markLine })
}

export { highlight }

/**
 * @typedef {import('./core.js').DisplayOptions & { lang?: string }} HighlightOptions
 */
