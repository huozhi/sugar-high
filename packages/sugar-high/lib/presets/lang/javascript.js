// @ts-check
import { tokenize as tokenizeJavaScript } from './javascript-runtime.js'

// JavaScript includes JSX and preserves the lightweight TypeScript heuristic used by the default
// highlighter. Use the TypeScript preset to force TS/TSX behavior for ambiguous snippets.
export const tokenize = tokenizeJavaScript
