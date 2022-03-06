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

export const types = [
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
  return /^[\w_$]$/.test(chr)
}

function isIdentifier(str) {
  return /[a-zA-Z_$]/.test(str[0]) && (str.length === 1 || /^[\w_$]+$/.test(str.slice(1)))
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
  let last = [null, null]
  /** @type {Array<[number, string]>} */
  const tokens = []

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
    } else if (isSpaces(token)) {
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
      return isIdentifier(token) ? T_IDENTIFIER : T_STRING
    }
  }

  const append = () => {
    if (current) {
      type = classify(current)
      /** @type [number, string]  */
      const pair = [type, current]
      if (type !== T_SPACE && type !== T_BREAK) {
        last = pair
      }
      tokens.push(pair)
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
      const [lastType, lastToken] = last
      if (!((lastType === T_SIGN && !'()[]'.includes(lastToken)) || lastType === T_COMMENT)) {
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
    } else if (isCommentStart(c_n)) {
      const start = i
      if (next === '/') {
        for (; i < code.length && code[i] !== '\n'; i++);
      } else {
        for (; i < code.length && code[i - 1] + code[i] !== '*/'; i++);
      }
      current = code.slice(start, i + 1)
      append()
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