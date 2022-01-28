// @ts-check

const keywords = new Set([
  'for',
  'while',
  'if',
  'else',
  'return',
  'function',
  'var',
  'let',
  'const',
  'true',
  'false',
  'null',
  'undefined',
  'NaN',
  'Infinity',
  'this',
  'new',
  'delete',
  'typeof',
  'in',
  'instanceof',
  'void',
  'break',
  'continue',
  'switch',
  'case',
  'default',
  'throw',
  'try',
  'catch',
  'finally',
  'debugger',
  'with',
  'yield',
  'async',
  'await',
  'class',
  'extends',
  'super',
  'import',
  'export',
  'from',
  'static',
])

const signs = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '=',
  '!',
  '>',
  '<',
  '&',
  '|',
  '^',
  '~',
  '!',
  '?',
  ':',
  '.',
  ',',
  `'`,
  '"',
  '.',
  '{',
  '}',
  '(',
  ')',
  '[',
  ']',
  '#',
  '\\',
])

function encode(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function isIdentifierChar(chr) {
  return /[a-zA-Z0-9_$]/.test(chr)
}

function isQuotationMark(chr) {
  return chr === '"' || chr === "'" || chr === '`'
}

/** 
 * @param {string} code 
 * @return {Array<string>}
 */
export function tokenize(code) {
  let current = ''
  const tokens = []
  const string = { entered: false }
  const comment = { entered: false, type: 0 }
  for (let i = 0; i < code.length; i++) {
    if (!string.entered && isQuotationMark(code[i])) {
      string.entered = true
      if (current) tokens.push(current)
      current = code[i]
    } else if (string.entered) {
      current += code[i]
      if (isQuotationMark(code[i])) {
        string.entered = false
        tokens.push(current)
        current = ''
      }
    } else if (
      !comment.entered && 
      code[i] === '/' && 
      (code[i + 1] === '/' || code[i + 1] === '*')
    ) {
      comment.type = code[i + 1] === '/' ? 0 : 1
      comment.entered = true
      if (current) tokens.push(current)
      current = code[i]
    } else if (comment.entered) {
      current += code[i]
      if (comment.type === 0 && code[i + 1] === '\n') {
        comment.entered = false
        tokens.push(current)
        current = ''
      } else if (comment.type === 1 && code[i] === '*' && code[i + 1] === '/') {
        comment.entered = false
        tokens.push(current)
        current = ''
        tokens.push(code[i])
        tokens.push(code[i + 1])
        i++
      }
    } else if (code[i] === ' ' || code[i] === '\n') {
      if (current.length > 0) {
        tokens.push(current)
        current = ''
      }
      tokens.push(code[i])
    } else {
      if (isIdentifierChar(code[i]) !== isIdentifierChar(current[current.length - 1])) {
        if (current) tokens.push(current)
        current = code[i]
      } else {
        current += code[i]
      }
    } 
  }
  if (current) {
    tokens.push(current)
    current = ''
  }

  return tokens
}


function classify(token) {
  if (token[0] === '/' && (token[1] === '*' || token[1] === '/')) {
    return 'comment'
  } else if (keywords.has(token)) {
    return 'keyword'
  } else if (token === '\n') {
    return 'linebreak'
  } else if (isQuotationMark(token[0]) && !isQuotationMark(token[1])) {
    return 'string'
  } else if (token === ' ') {
    return 'space'
  } else if (signs.has(token[0])) {
    return 'sign'
  } else {
    return 'identifier'
  }
}

/** 
 * @param {Array<string>} tokens 
 * @return {Array<string>}
 */
export function generate(tokens) {
  let output = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const type = classify(token)
    if (type === 'linebreak') {
      output.push('<br>')
    } else if (type === 'space') {
      output.push(`<span class="space">&nbsp;</span>`)
    } else {
      output.push(`<span class="${type}">${encode(token)}</span>`)
    }
  }
  return output
}

