// @ts-check
import { tokenize as tokenizeJavaScript } from '../presets/javascript-runtime.js'

export const tokenize = (code, options) => tokenizeJavaScript(code, {
  ...options,
  typescript: true,
})
