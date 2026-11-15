// @ts-check
import { doubleQuoted, strings } from '../presets/strings.js'
import { onCommentEnd, onCommentStart } from '../presets/hash-comment-base.js'

export const keywords = new Set([
  'case', 'coproc', 'do', 'done', 'elif', 'else', 'esac', 'export', 'fi', 'for',
  'function', 'if', 'in', 'local', 'readonly', 'return', 'select', 'then', 'time',
  'until', 'while',
])

export { onCommentEnd, onCommentStart }

// Single quotes have no escapes.
export const string = strings(doubleQuoted, /'[^']*'?/)
