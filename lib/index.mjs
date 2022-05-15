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
  '@',
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
  'jsxliterals'
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
 * 8 - jsx literals
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
  T_JSX_LITERALS,
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
}

function isWord(chr) {
  return /^[\w_]+$/.test(chr)
}

function isCls(str) {
  const chr0 = str[0]
  return isWord(chr0) &&
    chr0 === chr0.toUpperCase() ||
    str === 'null'
}

function isIdentifierChar(chr) {
  return /^[a-zA-Z_$]$/.test(chr)
}

function isIdentifier(str) {
  return isIdentifierChar(str[0]) && (str.length === 1 || isWord(str.slice(1)))
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

  // jsx.tag for entering open or closed tags
  // jsx.close for is the closing sign of open or close tags
  // jsx.child for entering children
  // jsx.expr for entering {expression}
  // jsx.end for entering close tag
  // jsx.stack for marking the nested layers of tags
  let __jsxEnter = false
  let __jsxTag = false
  let __jsxChild = false
  let __jsxExpr = false

  // only match paired (open + close) tags, not self-closing tags
  let __jsxStack = 0

  const inJsxTag = () => __jsxTag && !__jsxChild
  const inJsxLiterals = () => !__jsxTag && __jsxChild && !__jsxExpr && __jsxStack > 0

  /**
   *
   * @param {string} token
   * @returns {number}
   */
  function classify(token) {
    if (['with'].some(s => token.includes(s))) {
      console.log('token', token, 'child', __jsxChild, 'stack', __jsxStack, 'enter', __jsxEnter, 'expr', __jsxExpr)
    }
    const isJsxLiterals = inJsxLiterals()
    if (keywords.has(token)) {
      return last[1] === '.' ? T_IDENTIFIER : T_KEYWORD
    } else if (token === '\n') {
      return T_BREAK
    } else if (isSpaces(token)) {
      return T_SPACE
    } else if (token.split('').every(ch => signs.has(ch))) {
      return T_SIGN
    } else if (isJsxLiterals) {
      return T_JSX_LITERALS
    } else if (isCls(token)) {
      return inJsxTag() ? T_IDENTIFIER : T_CLS_NUMBER
    } else {
      return isIdentifier(token) ? T_IDENTIFIER : T_STRING
    }
  }

  const append = (_type) => {
    if (current) {
      type = _type || classify(current)
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
    const p_c = prev + curr // previous and current
    const c_n = curr + next // current and next


    if (__jsxChild) {
      if (curr === '{') {
        append()
        __jsxExpr = true
        current = curr
        append()
        continue
      }
    }

    if (__jsxEnter) {
      if (!__jsxTag && curr === '<') {
        append()
        __jsxTag = true
        current = curr
        if (next === '/') {
          current = c_n
          i++
        }
        append()
        continue
      }
      if (__jsxTag) {
        // >: open tag close sign
        if (curr === '>' && prev !== '/') {
          append()
          __jsxTag = false
          if (!__jsxChild) __jsxChild = true
          __jsxStack++
          current = curr
          append()
          continue
        }

        // >: tag self close sign or close tag sign
        if (c_n === '/>' || c_n === '</') {
          append()
          if (c_n === '/>') {
            __jsxTag = false
          }
          if (c_n === '</') {
            __jsxStack--
          }
          __jsxEnter = __jsxStack > 0
          current = c_n
          i++
          append()
          continue
        }

        // <: open tag sign
        if (curr === '<') {
          append()
          current = curr
          if (next === '/') {
            current = c_n
            i++
          }
          append()
          continue
        }
      }
    }

    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (!__jsxTag && (curr === '<' && isIdentifierChar(next) || c_n === '</')) {
      __jsxTag = true

      if (curr === '<' && next !== '/') {
        __jsxEnter = true
      }
    }

    const isQuotationChar = isStringQuotation(curr)
    const isRegexChar = !__jsxEnter && isRegexStart(c_n)
    const isJsxLiterals = inJsxLiterals()
    if (isQuotationChar || isRegexChar) {
      append()
      const [lastType, lastToken] = last
      // Special cases that are not considered as regex:
      // * (expr1) / expr2: `)` before `/` operator is still in expression
      // * <non comment start>/ expr: non comment start before `/` is not regex
      if (
        isRegexChar &&
        lastType &&
        !(
          (lastType === T_SIGN && ')' !== lastToken) ||
          lastType === T_COMMENT
        )
      ) {
        current = curr
        append()
        continue
      }
      const start = i++
      const leftQuote = code[start]
      let foundClose = false

      // end of line of end of file
      const isEof = () => i >= code.length
      const isEol = () => isEof() || code[i] === '\n'
      // string quotation
      if (isQuotationChar) {
        for (; !isEof(); i++) {
          // handle single quotes
          if ((leftQuote === "'" || leftQuote === '"') && code[i] === '\n') break
          if (isStringQuotation(code[i]) && code[i] === leftQuote) {
            foundClose = true
            break
          }
        }
      } else {
        // regex
        for (; !isEol(); i++) {
          if (code[i] === '/' && code[i - 1] !== '\\') {
            foundClose = true
            // append regex flags
            while (start !== i && /^[a-z]$/.test(code[i + 1]) && !isEol()) {
              i++
            }
            break
          }
        }
      }
      if (start !== i && foundClose) {
        // If current line is fully closed with string quotes or regex slashes,
        // add them to tokens
        current = code.slice(start, i + 1)
        append(T_STRING)
      } else {
        // If it doesn't match any of the above, just leave it as operator and move on
        current = curr
        append()
        i = start
      }
    } else if (isCommentStart(c_n)) {
      append()
      const start = i
      if (next === '/') {
        for (; i < code.length && code[i] !== '\n'; i++);
      } else {
        for (; i < code.length && code[i - 1] + code[i] !== '*/'; i++);
      }
      current = code.slice(start, i + 1)
      append(T_COMMENT)
    } else if (curr === ' ' || curr === '\n') {
      if (
        curr === ' ' &&
        (
          (isSpaces(current) || !current) ||
          isJsxLiterals
        )
      ) {
        current += curr
        if (next === '<') {
          append()
        }
      } else {
        append()
        current = curr
        append()
      }
    } else {
      if (
        // it's jsx literals and is not a jsx bracket
        (isJsxLiterals && !jsxBrackets.has(curr)) ||
        // same type char as previous one in current token
        (isWord(curr) === isWord(current[current.length - 1]) && !signs.has(curr) || __jsxStack > 0)
      ) {
        if (__jsxExpr && curr === '}') {
          append()
          __jsxExpr = false
          current = curr
          append()
        } else {
          current += curr
        }
      } else {
        if (p_c === '</') {
          current = p_c
        }
        append()

        if (p_c !== '</') {
          current = curr

        }
        if ((c_n === '</' || c_n === '/>')) {
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
  const linesHtml = []
  const createLine = (content) => `<span class="sh__line">${content}</span>`

  function flushLine(tokens) {
    linesHtml.push(createLine(
      tokens.map(([type, value]) => (
        `<span style="color: var(--sh-${types[type]})">${encode(value)}</span>`
      ))
      .join('')
    ))
  }
  const lineTokens = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const [type, value] = token
    if (type !== T_BREAK) {
      // Divide multi-line token into multi-line code
      if (value.includes('\n')) {
        const lines = value.split('\n')
        for (let j = 0; j < lines.length; j++) {
          lineTokens.push([type, lines[j]])
          if (j < lines.length - 1) {
            flushLine(lineTokens)
            lineTokens.length = 0
          }
        }
      } else {
        lineTokens.push(token)
      }
    } else {
      lineTokens.push([type, ''])
      flushLine(lineTokens)
      lineTokens.length = 0
    }
  }

  if (lineTokens.length)
    flushLine(lineTokens)

  return linesHtml
}

/**
 *
 * @param {string} code
 * @returns {string}
 */
export function highlight(code) {
  const tokens = tokenize(code)
  const output = generate(tokens).join('\n')
  return output
}