// @ts-check
import { tokenize as tokenizeJavaScript } from './javascript-runtime.js'

export const tokenize = (code, options) => tokenizeJavaScript(code, {
  ...options,
  typescript: true,
})
