// @ts-check
export const keywords = new Set([
  'as', 'break', 'const', 'continue', 'crate', 'else', 'enum', 'extern', 'false', 'fn', 'for',
  'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self',
  'Self', 'static', 'struct', 'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while',
  'async', 'await', 'dyn', 'abstract', 'become', 'box', 'do', 'final', 'macro', 'override',
  'priv', 'typeof', 'unsized', 'virtual', 'yield', 'try',
])

/**
 * @param {string} curr `code[i]` (apostrophe)
 * @param {number} i
 * @param {string} code
 * @returns {number} code units to consume from `i`
 */
export function onQuote(curr, i, code) {
  if (curr !== "'" || i + 1 >= code.length) return 1
  const n1 = code[i + 1]
  if (n1 === '\\') {
    let j = i + 2
    while (j < code.length) {
      if (code[j] === '\\') {
        j += 2
        continue
      }
      if (code[j] === "'") return j - i + 1
      j++
    }
    return code.length - i
  }
  if (n1 === '_') {
    return 2
  }
  if (/[a-zA-Z]/.test(n1)) {
    let j = i + 2
    while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++
    if (j < code.length && code[j] === "'") {
      return j - i + 1
    }
    return j - i
  }
  return 1
}
