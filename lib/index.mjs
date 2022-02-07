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
  '&',
  '|',
  '^',
  '~',
  '!',
  '?',
  ':',
  '.',
  ',',
  ';',
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

const types = [
  'identifier',
  'keyword',
  'string',
  'class',
  'sign',
  'comment',
  'break',
  'space',
]

/**
 * 
 * 0 - identifier
 * 1 - keyword
 * 2 - string
 * 3 - Class, number and null
 * 4 - sign
 * 5 - comment
 * 6 - break
 * 7 - space
 * 
 */
const [
  T_IDENTIFIER,
  T_KEYWORD,
  T_STRING,
  T_CLS_NUMBER,
  T_SIGN,
  T_COMMENT,
  T_BREAK,
  T_SPACE,
] = types.map((_, i) => i)

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
  let nonSpaceType = -1
  /** @type {Array<[number, string]>} */
  const tokens = []

  // comment.type = 0 for single line comments
  // comment.type = 1 for multi-line comments
  const comment = { entered: false, type: 0 }

  // jsx.tag for entering open or closed tag
  // jsx.child for entering children
  // jsx.expr for entering {expression}
  /** @type {{ tag: boolean; child: boolean; expr: boolean }} */
  const jsx = { tag: false, child: false, expr: false }

  const inJsxLiterals = () => !jsx.tag && jsx.child && !jsx.expr

  function classify(token) {
    const [chr0, chr1] = [token[0], token[1]]
    if (isCommentStart(chr0 + chr1)) {
      return T_COMMENT
    } else if (keywords.has(token)) {
      return T_KEYWORD
    } else if (token === '\n') {
      return T_BREAK
    } else if (token === ' ') {
      return T_SPACE
    } else if (token.split('').every(ch => signs.has(ch))) {
      return T_SIGN
    } else if (
      (
       // is quoted string
       (isStringQuotation(chr0) && !isStringQuotation(chr1)) ||
       // is regex
       (!jsx.tag && isRegexStart(chr0 + chr1) && token[token.length - 1] === '/')
     )
   ) {
     return T_STRING
   } else if (
      !inJsxLiterals() && 
      (
        isIdentifierChar(chr0) &&
        chr0 === chr0.toUpperCase() ||
        token === 'null'
      )
    ) {
      return T_CLS_NUMBER
    } else {
      return T_IDENTIFIER
    }
  }

  const append = () => {
    if (current) {
      type = classify(current)
      if (type !== T_SPACE && type !== T_BREAK) nonSpaceType = type
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
    const isJsxLiterals = inJsxLiterals()

    if (jsx.tag) {
      const isOpenElementEnd = curr === '>' 
      const isCloseElementEnd = p_c === '/>'
      jsx.child = !isCloseElementEnd && !isCloseElementEnd
      jsx.tag = !(isOpenElementEnd || isCloseElementEnd)
    }
    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (!jsx.tag && (curr === '<' && isIdentifierChar(next) || c_n === '</')) {
      jsx.tag = true
      jsx.child = false
    }

    if (
      (isStringQuotation(curr) || !jsx.tag && isRegexStart(c_n))
    ) {
      append()
      if (!(nonSpaceType === T_SIGN || nonSpaceType === T_COMMENT)) {
        current = curr
        append()
        continue
      }
      let j = i + 1
      let strEnd = i
      const inString = () => j < code.length && code[j] !== '\n'
      // string quotation
      if (isStringQuotation(curr)) {
        for (; inString(); j++) {
          if (isStringQuotation(code[j])) {
            strEnd = j
            break
          }
        }
      } else {
        // regex
        for (; inString(); j++) {
          if (code[j] === '/' && code[j - 1] !== '\\') {
            strEnd = j
            break
          }
        }
      }
      if (strEnd !== i) {
        current = code.slice(i, strEnd + 1)
        append()
        i = j
      } else {
        current = curr
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
          isJsxLiterals
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
        (isJsxLiterals && !jsxBrackets.has(curr)) ||
        isIdentifierChar(curr) === isIdentifierChar(current[current.length - 1]) &&
        !signs.has(curr)
      ) {
        current += curr
      } else {
        append()
        current = curr
        if (c_n === '</' || c_n === '/>') {
          current = c_n
          append()
          i++
        }
        else if (jsxBrackets.has(curr)) append()
      }
    }

    if (jsx.child && curr === '{') {
      jsx.expr = true
    }
    if (jsx.child && jsx.expr && curr === '}') {
      jsx.expr = false
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
  const output = []
  for (let i = 0; i < tokens.length; i++) {
    const [type, token] = tokens[i]
    output.push(
      type === T_BREAK 
      ? '<br>'
      : `<span class="sh__${types[type]}">${encode(token)}</span>`
    )
  }
  return output
}

/**
 * 
 * @param {string} code 
 * @returns {string}
 */
export function highlight(code) {
  const tokens = tokenize(code)
  const output = generate(tokens).join('')
  return output
}