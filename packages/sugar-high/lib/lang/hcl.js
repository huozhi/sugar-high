// @ts-check
export const keywords = new Set([
  'data', 'false', 'for', 'if', 'in', 'locals', 'module', 'null', 'output', 'provider', 'resource',
  'terraform', 'true', 'variable',
])
export const keys = '='
export const onCommentStart = (curr, next) => curr === '#' ? 1 : curr + next === '//' ? 1 : curr + next === '/*' ? 2 : 0
export const onCommentEnd = (prev, curr) => curr === '\n' ? 1 : prev + curr === '*/' ? 2 : 0
