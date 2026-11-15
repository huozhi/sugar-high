// @ts-check
import { strings } from '../presets/strings.js'
import { onCommentEnd, onCommentStart } from '../presets/clike-base.js'

export const keywords = new Set([
  'as', 'break', 'const', 'continue', 'crate', 'else', 'enum', 'extern', 'false', 'fn', 'for',
  'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self',
  'Self', 'static', 'struct', 'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while',
  'async', 'await', 'dyn', 'abstract', 'become', 'box', 'do', 'final', 'macro', 'override',
  'priv', 'typeof', 'unsized', 'virtual', 'yield', 'try',
])

// An apostrophe never opens a string: it starts a char literal (`'z'`, `'\n'`), a lifetime (`'a`), or stands alone.
export const word = /'(?:\\.[^'\n]*'?|\w+'?)?/y

export { onCommentEnd, onCommentStart }

// Raw strings `r#"..."#` close at a matching run of `#`; apostrophes are handled by `word`.
export const string = strings(/[bc]?r(#*)"[\s\S]*?(?:"\1|$)/, /[bc]?"[^\\"]*(?:\\[\s\S][^\\"]*)*\\?"?/)
