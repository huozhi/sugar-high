// @ts-check
import { doubleQuoted, singleQuoted, strings } from '../presets/strings.js'
import { onCommentStart, onCommentEnd } from '../presets/clike-base.js'

export const typeKeywords = new Set([
  'bool', 'byte', 'complex64', 'complex128', 'error', 'float32', 'float64', 'int',
  'int8', 'int16', 'int32', 'int64', 'rune', 'string', 'uint', 'uint8', 'uint16',
  'uint32', 'uint64', 'uintptr',
])

export const keywords = new Set([
  'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else',
  'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface', 'map',
  'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var',
])

export { onCommentStart, onCommentEnd }

// Raw strings in backticks have no escapes and may span lines.
export const string = strings(/`[^`]*`?/, doubleQuoted, singleQuoted)
