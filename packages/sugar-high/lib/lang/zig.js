// @ts-check
import { doubleQuoted, singleQuoted, strings } from '../presets/strings.js'

export const keywords = new Set([
  'addrspace', 'align', 'allowzero', 'and', 'anyframe', 'anytype', 'asm', 'async', 'await', 'break',
  'callconv', 'catch', 'comptime', 'const', 'continue', 'defer', 'else', 'enum', 'errdefer', 'error',
  'export', 'extern', 'false', 'fn', 'for', 'if', 'inline', 'linksection', 'noalias', 'noinline',
  'nosuspend', 'null', 'opaque', 'or', 'orelse', 'packed', 'pub', 'resume', 'return', 'struct',
  'suspend', 'switch', 'test', 'threadlocal', 'true', 'try', 'undefined', 'union', 'unreachable',
  'usingnamespace', 'var', 'volatile', 'while',
])

export const typeKeywords = new Set([
  'anyerror', 'anyopaque', 'bool', 'c_char', 'c_int', 'c_long', 'c_longdouble', 'c_longlong',
  'c_short', 'c_uint', 'c_ulong', 'c_ulonglong', 'c_ushort', 'comptime_float', 'comptime_int',
  'f16', 'f32', 'f64', 'f80', 'f128', 'i8', 'i16', 'i32', 'i64', 'i128', 'isize', 'noreturn',
  'type', 'u8', 'u16', 'u32', 'u64', 'u128', 'usize', 'void',
])

export const onCommentStart = (curr, next) => curr + next === '//' ? 1 : 0
export const onCommentEnd = (_prev, curr) => curr === '\n' ? 1 : 0

// A `\\` line string starts a line and runs to its end.
export const string = strings(/\\\\(?<=(?:^|\n)[^\S\n]*\\\\)[^\n]*/, doubleQuoted, singleQuoted)
