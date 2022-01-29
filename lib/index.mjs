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
  'undefined',
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    // matches space but not new line
    .replace(/[^\S\r\n]/g, '&nbsp;')
}

function isIdentifierChar(chr) {
  return /[a-zA-Z0-9_$]/.test(chr)
}

function isQuotationMark(chr) {
  return chr === '"' || chr === "'" || chr === '`'
}

function isCommentStart(str) {
  str = str.slice(0, 2)
  return str === '//' || str === '/*'
}

function isRegexStart(str) {
  return str[0] === '/' && !isCommentStart(str[0] + str[1])
}

/** 
 * @param {string} code 
 * @return {Array<string>}
 */
function tokenize(code) {
  let current = ''
  const tokens = []
  // string.type = 0 for string or string template
  // string.type = 1 for regex
  const string = { entered: false, type: 0 }
  
  // comment.type = 0 for single line comments
  // comment.type = 1 for multi-line comments
  const comment = { entered: false, type: 0 }
  const append = () => {
    if (current) tokens.push(current)
    current = ''
  }
  for (let i = 0; i < code.length; i++) {
    const twoChars = code[i] + code[i + 1]
    if (!string.entered && 
      (isQuotationMark(code[i]) || isRegexStart(twoChars))
    ) {
      string.entered = true
      string.type = isQuotationMark(code[i]) ? 0 : 1
      if (current) tokens.push(current)
      current = code[i]
    } else if (string.entered) {
      current += code[i]
      if (string.type === 0 && isQuotationMark(code[i])) {
        string.entered = false
        append()
      } else if (string.type === 1 && code[i] === '/') {
        string.entered = false
        append()
      }
    } else if (
      !comment.entered && 
      isCommentStart(twoChars)
    ) {
      comment.type = code[i + 1] === '/' ? 0 : 1
      comment.entered = true
      append()
      current = twoChars
      i++
    } else if (comment.entered) {
      current += code[i]
      if (comment.type === 0 && code[i + 1] === '\n') {
        comment.entered = false
        append()
      } else if (comment.type === 1 && (twoChars === '*/')) {
        comment.entered = false
        append()
        tokens.push(twoChars)
        i++
      }
    } else if (code[i] === ' ' || code[i] === '\n') {
      if (current.length > 0) {
        append()
      }
      tokens.push(code[i])
    } else {
      if (isIdentifierChar(code[i]) !== isIdentifierChar(current[current.length - 1])) {
        append()
        current = code[i]
      } else {
        current += code[i]
      }
    } 
  }
  append()

  return tokens
}

/**
 * 
 * 0 - comment
 * 1 - keyword
 * 2 - break
 * 3 - string
 * 4 - space
 * 5 - sign
 * 6 - identifier
 * 
 */

function classify(token) {
  if (isCommentStart(token[0] + token[1])) {
    return 0 // 'comment'
  } else if (keywords.has(token)) {
    return 1 // 'keyword'
  } else if (token === '\n') {
    return 2 // 'break'
  } else if (
    (isQuotationMark(token[0]) && !isQuotationMark(token[1])) ||
    isRegexStart(token[0] + token[1])
  ) {
    return 3 // 'string'
  } else if (token === ' ') {
    return 4 // 'space'
  } else if (signs.has(token[0])) {
    return 5 // 'sign'
  } else {
    return 6 // 'identifier'
  }
}

/** 
 * @param {Array<string>} tokens 
 * @return {Array<string>}
 */
function generate(tokens) {
  let output = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const type = classify(token)
    if (type === 2) {
      output.push('<br>')
    } else {
      output.push(`<span class="sh__${type}">${encode(token)}</span>`)
    }
  }
  return output
}

export function highlight(code) {
  const tokens = tokenize(code)
  console.log(tokens)
  const output = generate(tokens).join('')
  console.log(output)
  return output
}