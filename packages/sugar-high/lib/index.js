// @ts-check

import {
  parse,
  render,
  SugarHigh,
} from './core.js'
import { languages } from './lang.js'

/** @param {string | undefined} name */
function configFor(name) {
  return languages.find(({ id }) => id === (name || 'javascript'))?.config
}

/** @param {string} code @param {HighlightOptions | undefined} options */
function highlight(code, options) {
  const { lang, cx, mark, markLine, ...config } = options || {}
  const parsed = parse(code, { ...configFor(lang), ...config })
  return render(parsed, { cx, mark, markLine })
}

export { highlight, SugarHigh }

/**
 * @typedef {import('./core.js').DisplayOptions & { lang?: string }} HighlightOptions
 */
