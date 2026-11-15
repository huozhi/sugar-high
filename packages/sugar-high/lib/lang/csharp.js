// @ts-check
import { doubleQuoted, singleQuoted, strings } from '../presets/strings.js'
import { onCommentEnd, onCommentStart } from '../presets/clike-base.js'

export const keywords = new Set([
  'abstract', 'as', 'async', 'await', 'base', 'break', 'case', 'catch', 'checked',
  'class', 'const', 'continue', 'default', 'delegate', 'do', 'else', 'enum', 'event',
  'explicit', 'extern', 'false', 'finally', 'fixed', 'for', 'foreach', 'from', 'get',
  'global', 'goto', 'if', 'implicit', 'in', 'init', 'interface', 'internal', 'into', 'is',
  'join', 'let', 'lock', 'namespace', 'new', 'null', 'on', 'operator', 'orderby', 'out',
  'override', 'params', 'partial', 'private', 'protected', 'public', 'readonly', 'record',
  'ref', 'remove', 'required', 'return', 'sealed', 'select', 'set', 'sizeof', 'stackalloc',
  'static', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'unchecked',
  'unsafe', 'using', 'value', 'virtual', 'volatile', 'when', 'where', 'while', 'with', 'yield',
])

export const typeKeywords = new Set([
  'bool', 'byte', 'char', 'decimal', 'double', 'dynamic', 'float', 'int', 'long', 'nint',
  'nuint', 'object', 'sbyte', 'short', 'string', 'uint', 'ulong', 'ushort', 'void',
])

export { onCommentEnd, onCommentStart }

// Raw `"""` strings close at a run of the same length; verbatim `@"` strings escape `"` as `""`.
export const string = strings(
  /\$*("{3,})[\s\S]*?(?:\1|$)/, /\$*@\$*"(?:""|[^"])*"?/, doubleQuoted, singleQuoted,
)
