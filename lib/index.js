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

export function tokenize(code) {
  let tokens = []
  let current = ''
  let isStringEntered = false
  for (let i = 0; i < code.length; i++) {
    if (!isStringEntered && isQuotationMark(code[i])) {
      isStringEntered = true
      if (current) tokens.push(current)
      current = code[i]
    } else if (isStringEntered) {
      current += code[i]
      if (isQuotationMark(code[i])) {
        isStringEntered = false
        tokens.push(current)
        current = ''
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
  if (signs.has(token[0]) && !isQuotationMark(token[0])) {
    return 'sign'
  } else if (keywords.has(token)) {
    return 'keyword'
  } else if (token === '\n') {
    return 'linebreak'
  } else if (isQuotationMark(token[0])) {
    return 'string'
  } else if (token === ' ') {
    return 'space'
  } else {
    return 'identifier'
  }
}

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

