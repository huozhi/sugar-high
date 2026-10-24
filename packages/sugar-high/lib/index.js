// @ts-check

import {
  parse,
  render,
  tokenize,
} from './core.js'
import { renderTokens } from './shared.js'
import { configFor } from './presets/configs.js'

/** @param {string} code @param {HighlightOptions | undefined} options */
function highlight(code, options) {
  const { lang, cx, mark, markLine } = options || {}
  const config = configFor(lang)
  if (!cx && !mark && !markLine && !config?.annotateLine) {
    return renderTokens(tokenize(code, config))
  }
  const parsed = parse(code, config)
  return render(parsed, { cx, mark, markLine })
}

export { highlight }

/**
 * @typedef {import('./core.js').DisplayOptions & { lang?: string }} HighlightOptions
 */
