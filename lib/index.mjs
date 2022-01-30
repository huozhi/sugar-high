// @ts-check

const jsxBrackets = new Set(['<', '>', '{', '}', '[', ']'])
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

  ...jsxBrackets,
  // '<',
  // '>',
  // '{',
  // '}',
  
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
  
  '(',
  ')',
  '[',
  ']',
  '#',
  '\\',
])

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
const [
  T_COMMENT,
  T_KEYWORD,
  T_BREAK,
  T_STRING,
  T_SPACE,
  T_SIGN,
  T_IDENTIFIER,
  T_CLS_NUMBER,
] = Array(8).fill().map((_, i) => i)

function isSpaces(str) {
  return /^[^\S\r\n]+$/g.test(str)
}

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

function isStringQuotation(chr) {
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
 * @return {Array<[number, string]>}
 */
export function tokenize(code) {
  let current = ''
  let type = -1
  /** @type {Array<[number, string]>} */
  const tokens = []
  // string.type = 0 for string or string template
  // string.type = 1 for regex
  const string = { entered: false, type: 0 }
  
  // comment.type = 0 for single line comments
  // comment.type = 1 for multi-line comments
  const comment = { entered: false, type: 0 }

  // jsx.tag for entering open or closed tag
  // jsx.child for entering children
  /** @type {{ tag: boolean; child: boolean; expr: boolean }} */
  const jsx = { tag: false, child: false, expr: false }

  function classify(token) {
    if (isCommentStart(token[0] + token[1])) {
      return T_COMMENT
    } else if (keywords.has(token)) {
      return T_KEYWORD
    } else if (token === '\n') {
      return T_BREAK
    } else if (
       (
        // is quoted string
        (isStringQuotation(token[0]) && !isStringQuotation(token[1])) ||
        // is regex
        (!jsx.tag && isRegexStart(token[0] + token[1]) && token[token.length - 1] === '/')
      )
    ) {
      return T_STRING
    } else if (token === ' ') {
      return T_SPACE
    } else if (signs.has(token[0])) {
      return T_SIGN
    } else if (
      token[0] === token[0].toUpperCase() ||
      token === 'null'
    ) {
      return T_CLS_NUMBER
    } else {
      return T_IDENTIFIER
    }
  }

  const append = () => {
    if (current) {
      type = classify(current)
      tokens.push([type, current])
    }
    current = ''
  }
  for (let i = 0; i < code.length; i++) {
    const curr = code[i]
    const prev = code[i - 1]
    const next = code[i + 1]
    const c_n = curr + next // current and next
    const p_c = prev + curr // previous and current

    if (jsx.tag) {
      const isOpenElementEnd = curr === '>' 
      const isCloseElementEnd = p_c === '/>'
      jsx.child = !isCloseElementEnd && !isCloseElementEnd
      jsx.tag = !(isOpenElementEnd || isCloseElementEnd)
    }
    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (!jsx.tag && !string.entered && (curr === '<' && isIdentifierChar(next) || c_n === '</')) {
      jsx.tag = true
      jsx.child = false
    }
    
    if (jsx.child && curr === '{') {
      jsx.expr = true
    }
    if (jsx.child && jsx.expr && curr === '}') {
      jsx.expr = false
    }

    if (
      !string.entered && 
      (isStringQuotation(curr) || !jsx.tag && isRegexStart(c_n))
    ) {
      string.entered = true
      string.type = isStringQuotation(curr) ? 0 : 1
      append()
      current = curr
    } else if (string.entered) {
      current += curr
      if (string.type === 0 && isStringQuotation(curr)) {
        string.entered = false
        append()
      } else if (string.type === 1 && prev !== '\\' && curr === '/') {
        string.entered = false
        append()
      }
    } else if (
      !comment.entered && 
      isCommentStart(c_n)
    ) {
      comment.type = next === '/' ? 0 : 1
      comment.entered = true
      append()
      current = c_n
      i++
    } else if (comment.entered) {
      current += curr
      if (comment.type === 0 && next === '\n') {
        comment.entered = false
        append()
      } else if (comment.type === 1 && (c_n === '*/')) {
        comment.entered = false
        current += '/'
        append()
        i++
      }
    } else if (curr === ' ' || curr === '\n') {
      if (
        curr === ' ' &&
        (
          (isSpaces(current) || !current) ||
          jsx.child && !jsx.expr
        )
      ) {
        current += curr
      } else {
        append()
        current = curr
        append()
      }
    } else {
      if (
        (jsx.child && !jsx.expr && !jsxBrackets.has(curr)) ||
        isIdentifierChar(curr) === isIdentifierChar(current[current.length - 1]) &&
        !signs.has(curr)
      ) {
        current += curr
      } else {
        append()
        current = curr
        if (c_n === '</') {
          current = c_n
          append()
          i++
        }
        else if (jsxBrackets.has(curr)) append()
      }
    }
  }

  append()

  return tokens
}

/** 
 * @param {Array<[number, string]>} tokens 
 * @return {Array<string>}
 */
function generate(tokens) {
  let output = []
  for (let i = 0; i < tokens.length; i++) {
    const [type, token] = tokens[i]
    if (type === T_BREAK) {
      output.push('<br>')
    } else {
      output.push(`<span class="sh__${type}">${encode(token)}</span>`)
    }
  }
  return output
}

export function highlight(code) {
  const tokens = tokenize(code)
  const output = generate(tokens).join('')
  return output
}