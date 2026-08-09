// @ts-check

import {
  parse,
  render,
} from './core.js'
import { registry } from './registry.js'

/** @param {string | undefined} name */
function configFor(name) {
  return registry.find(({ id }) => id === (name || 'javascript'))?.config
}

/** @param {string} code @param {HighlightOptions | undefined} options */
function highlight(code, options) {
  const { lang, cx, mark, markLine, ...config } = options || {}
  const parsed = parse(code, { ...configFor(lang), ...config })
  return render(parsed, { cx, mark, markLine })
}

export { highlight }

/**
 * @typedef {import('./core.js').DisplayOptions & { lang?: string }} HighlightOptions
 */
