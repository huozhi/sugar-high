// @ts-check

import {
  generate as generateCore,
  parse as parseCore,
  render,
  SugarHigh,
  tokenize as tokenizeCore,
} from './core.js'
import { languages } from './lang.js'
import { parseTokens } from './shared.js'

/** @param {string | undefined} name */
function configFor(name) {
  return languages.find(({ id }) => id === (name || 'javascript'))?.config
}

/** @param {string} code @param {{ lang?: string } | undefined} options */
function parse(code, options) {
  const { lang, ...config } = options || {}
  return parseCore(code, { ...configFor(lang), ...config })
}

/** @param {string} code @param {HighlightOptions | undefined} options */
function highlight(code, options) {
  const { lang, cx, mark, markLine, ...config } = options || {}
  const parsed = parseCore(code, { ...configFor(lang), ...config })
  return render(parsed, { cx, mark, markLine })
}

/** @param {string} code @param {{ lang?: string } | undefined} options */
function tokenize(code, options) {
  const { lang, ...config } = options || {}
  return tokenizeCore(code, { ...configFor(lang), ...config })
}

/**
 * @param {import('./core.js').ParsedCode | Array<[number, string]>} parsed
 * @param {import('./core.js').DisplayOptions | undefined} options
 */
function generate(parsed, options) {
  if (Array.isArray(parsed)) {
    const value = parsed.map(([, tokenValue]) => tokenValue).join('')
    return generateCore(parseTokens(value, parsed), options)
  }
  return generateCore(parsed, options)
}

export { generate, highlight, parse, render, SugarHigh, tokenize }

/**
 * @typedef {import('./core.js').DisplayOptions & { lang?: string }} HighlightOptions
 */
