// @ts-check

import {
  generate as generateCore,
  highlight as highlightCore,
  SugarHigh,
  tokenize as tokenizeCore,
} from './core.js'
import { languages } from './languages.js'

/** @param {HighlightOptions | undefined} options */
function optionsFor(options) {
  const language = options?.lang
    ? languages.find(({ id }) => id === options.lang)
    : languages.find(({ id }) => id === 'javascript')

  return {
    ...language?.config,
    ...options,
  }
}

/** @param {string} code @param {HighlightOptions | undefined} options */
function highlight(code, options) {
  return highlightCore(code, optionsFor(options))
}

/** @param {string} code @param {HighlightOptions | undefined} options */
function tokenize(code, options) {
  return tokenizeCore(code, optionsFor(options))
}

/** @param {Array<[number, string]>} tokens @param {HighlightOptions | undefined} options */
function generate(tokens, options) {
  return generateCore(tokens, optionsFor(options))
}

export { generate, highlight, SugarHigh, tokenize }

/**
 * @typedef {import('./core.js').HighlightOptions & { lang?: string }} HighlightOptions
 */
