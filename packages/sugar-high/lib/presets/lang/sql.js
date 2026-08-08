// @ts-check

export const keywords = new Set([
  'add', 'all', 'alter', 'and', 'as', 'asc', 'between', 'by', 'case', 'check',
  'column', 'constraint', 'create', 'cross', 'database', 'default', 'delete', 'desc',
  'distinct', 'drop', 'else', 'end', 'exists', 'foreign', 'from', 'full', 'group',
  'having', 'in', 'index', 'inner', 'insert', 'into', 'is', 'join', 'key', 'left',
  'like', 'limit', 'not', 'null', 'offset', 'on', 'or', 'order', 'outer', 'primary',
  'references', 'right', 'select', 'set', 'table', 'then', 'union', 'unique', 'update',
  'values', 'view', 'when', 'where', 'with',
])

export const typeKeywords = new Set([
  'bigint', 'binary', 'bit', 'blob', 'boolean', 'char', 'date', 'datetime', 'decimal',
  'double', 'float', 'int', 'integer', 'interval', 'json', 'numeric', 'real', 'smallint',
  'text', 'time', 'timestamp', 'uuid', 'varchar',
])

export const caseInsensitive = true

export const onCommentStart = (currentChar, nextChar) => {
  const pair = currentChar + nextChar
  if (pair === '--') return 1
  if (pair === '/*') return 2
  return 0
}

export const onCommentEnd = (prevChar, currChar) => {
  if (currChar === '\n') return 1
  return prevChar + currChar === '*/' ? 2 : 0
}
