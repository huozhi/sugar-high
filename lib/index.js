// @ts-check

const jsxBrackets = new Set(['<', '>', '{', '}', '[', ']'])
const keywords = new Set([
  'for',
  'do',
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
  ...jsxBrackets,
])


/**
 *
 * 0  - identifier
 * 1  - keyword
 * 2  - string
 * 3  - Class, number and null
 * 4  - property
 * 5  - entity
 * 6  - jsx literals
 * 7  - sign
 * 8  - comment
 * 9  - break
 * 10 - space
 *
 */
const types = /** @type {const} */ ([
  'identifier',
  'keyword',
  'string',
  'class',
  'property',
  'entity',
  'jsxliterals',
  'sign',
  'comment',
  'break',
  'space',
])
const [
  T_IDENTIFIER,
  T_KEYWORD,
  T_STRING,
  T_CLS_NUMBER,
  T_PROPERTY,
  T_ENTITY,
  T_JSX_LITERALS,
  T_SIGN,
  T_COMMENT,
  T_BREAK,
  T_SPACE,
] = /** @types {const} */ types.map((_, i) => i)

function isSpaces(str) {
  return /^[^\S\r\n]+$/g.test(str)
}

function isSign(ch) {
  return signs.has(ch)
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
  return /^[\w_]+$/.test(chr) || hasUnicode(chr)
}

function isCls(str) {
  const chr0 = str[0]
  return isWord(chr0) &&
    chr0 === chr0.toUpperCase() ||
    str === 'null'
}

function hasUnicode(s) {
  return /[^\u0000-\u007f]/.test(s);
}

function isAlpha(chr) {
  return /^[a-zA-Z]$/.test(chr)
}

function isIdentifierChar(chr) {
  return isAlpha(chr) || hasUnicode(chr)
}

function isIdentifier(str) {
  return isIdentifierChar(str[0]) && (str.length === 1 || isWord(str.slice(1)))
}

function isStrTemplateChr(chr) {
  return chr === '`'
}

function isSingleQuotes(chr) {
  return chr === '"' || chr === "'"
}

function isStringQuotation(chr) {
  return isSingleQuotes(chr) || isStrTemplateChr(chr)
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
function tokenize(code) {
  let current = ''
  let type = -1
  /** @type {[number, string]} */
  let last = [-1, '']
  /** @type {[number, string]} */
  let beforeLast = [-2, '']
  /** @type {Array<[number, string]>} */
  const tokens = []

  /** @type boolean if entered jsx tag, inside <open tag> or </close tag> */
  let __jsxEnter = false
  /**
   * @type {0 | 1 | 2}
   * @example
   * 0 for not in jsx;
   * 1 for open jsx tag;
   * 2 for closing jsx tag;
   **/
  let __jsxTag = 0
  let __jsxExpr = false

  // only match paired (open + close) tags, not self-closing tags
  let __jsxStack = 0
  const __jsxChild = () => __jsxEnter && !__jsxExpr && !__jsxTag
  // < __content__ >
  const inJsxTag = () => __jsxTag && !__jsxChild()
  // {'__content__'}
  const inJsxLiterals = () => !__jsxTag && __jsxChild() && !__jsxExpr && __jsxStack > 0

  /** @type {string | null} */
  let __strQuote = null
  let __regexQuoteStart = false
  let __strTemplateExprStack = 0
  let __strTemplateQuoteStack = 0
  const inStringQuotes = () => __strQuote !== null
  const inRegexQuotes = () => __regexQuoteStart
  const inStrTemplateLiterals = () => (__strTemplateQuoteStack > __strTemplateExprStack)
  const inStrTemplateExpr = () => __strTemplateQuoteStack > 0 && (__strTemplateQuoteStack === __strTemplateExprStack)
  const inStringContent = () => inStringQuotes() || inStrTemplateLiterals()

  /**
   *
   * @param {string} token
   * @returns {number}
   */
  function classify(token) {
    const isLineBreak = token === '\n'
    // First checking if they're attributes values
    if (inJsxTag()) {
      if (inStringQuotes()) {
        return T_STRING
      }

      const [, lastToken] = last
      if (isIdentifier(token)) {
        // classify jsx open tag
        if ((lastToken === '<' || lastToken === '</')) 
          return T_ENTITY
      }
    }
    // Then determine if they're jsx literals
    const isJsxLiterals = inJsxLiterals()
    if (isJsxLiterals) return T_JSX_LITERALS

    // Determine strings first before other types
    if (inStringQuotes()) {
      return T_STRING
    } else if (keywords.has(token)) {
      return last[1] === '.' ? T_IDENTIFIER : T_KEYWORD
    } else if (isLineBreak) {
      return T_BREAK
    } else if (isSpaces(token)) {
      return T_SPACE
    } else if (token.split('').every(isSign)) {
      return T_SIGN
    } else if (isCls(token)) {
      return inJsxTag() ? T_IDENTIFIER : T_CLS_NUMBER
    } else {
      if (isIdentifier(token)) {
        const isLastPropDot = last[1] === '.' && isIdentifier(beforeLast[1])

        if (!inStringContent() && !isLastPropDot) return T_IDENTIFIER
        if (isLastPropDot) return T_PROPERTY
      }
      return T_STRING
    }
  }

  /**
   * 
   * @param {number} type_ 
   * @param {string} token_ 
   */
  const append = (type_, token_) => {
    if (type_ || token_) {
      const nType = types[type_]
    }
    if (token_) {
      current = token_
    }
    if (current) {
      type = type_ || classify(current)
      /** @type [number, string]  */
      const pair = [type, current]
      if (type !== T_SPACE && type !== T_BREAK) {
        beforeLast = last
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

    // Determine string quotation outside of jsx literals.
    // Inside jsx literals, string quotation is still part of it.
    if (isSingleQuotes(curr) && !inJsxLiterals()) {
      append()
      if (prev !== `\\`) {
        if (__strQuote && curr === __strQuote) {
          __strQuote = null
        } else if (!__strQuote) {
          __strQuote = curr
        }
      }

      append(T_STRING, curr)
      continue
    }

    if (!inStrTemplateLiterals()) {
      if (prev !== '\\n' && isStrTemplateChr(curr)) {
        append()
        append(T_STRING, curr)
        __strTemplateQuoteStack++
        continue
      }
    }

    if (inStrTemplateLiterals()) {
      if (prev !== '\\n' && isStrTemplateChr(curr)) {
        if (__strTemplateQuoteStack > 0) {
          append()
          __strTemplateQuoteStack--
          append(T_STRING, curr)
          continue
        }
      }

      if (c_n === '${') {
        __strTemplateExprStack++
        append(T_STRING)
        append(T_SIGN, c_n)
        i++
        continue
      }
    }

    if (inStrTemplateExpr() && curr === '}') {
      append()
      __strTemplateExprStack--
      append(T_SIGN, curr)
      continue
    }

    if (__jsxChild()) {
      if (curr === '{') {
        append()
        append(T_SIGN, curr)
        __jsxExpr = true
        continue
      }
    }

    if (__jsxEnter) {
      // <: open tag sign
      // new '<' not inside jsx
      if (!__jsxTag && curr === '<') {
        append()
        if (next === '/') {
          // close tag
          __jsxTag = 2
          current = c_n
          i++
        } else {
          // open tag
          __jsxTag = 1
          current = curr
        }
        append(T_SIGN)
        continue
      }
      if (__jsxTag) {
        // >: open tag close sign or closing tag closing sign
        // and it's not `=>` or `/>`
        // `curr` could be `>` or `/`
        if ((curr === '>' && !'/='.includes(prev))) {
          append()
          if (__jsxTag === 1) {
            __jsxTag = 0
            __jsxStack++
          } else {
            __jsxTag = 0
            __jsxEnter = false
          }
          append(T_SIGN, curr)
          continue
        }

        // >: tag self close sign or close tag sign
        if (c_n === '/>' || c_n === '</') {
          // if current token is not part of close tag sign, push it first
          if (current !== '<' && current !== '/') {
            append()
          }

          if (c_n === '/>') {
            __jsxTag = 0
          } else {
            // is '</'
            __jsxStack--
          }

          if (!__jsxStack)
            __jsxEnter = false

          current = c_n
          i++
          append(T_SIGN)
          continue
        }

        // <: open tag sign
        if (curr === '<') {
          append()
          current = curr
          append(T_SIGN)
          continue
        }

        // jsx property
        // `-` in data-prop
        if (next === '-'  && !inStringContent() && !inJsxLiterals()) {
          if (current) {
            append(T_PROPERTY, current + curr + next)
            i += 1
            continue
          }
        }
        // `=` in property=<value>
        if (next === '=' && !inStringContent()) {
          // if current is not a space, ensure `prop` is a property
          if (isSpaces(current)) {
            append(T_SPACE, current)
            current = ''
          }
          const prop = current ? (current + curr) : curr
          if (isIdentifier(prop)) {
            current = prop
            append(T_PROPERTY)
          }
          continue
        }
      }
    }

    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (!__jsxTag && (curr === '<' && isIdentifierChar(next) || c_n === '</')) {
      __jsxTag = next === '/' ? 2 : 1

      // current and next char can form a jsx open or close tag
      if (curr === '<' && (next === '/' || isAlpha(next))) {
        if (
          !inStringContent() && 
          !inJsxLiterals() &&
          !inRegexQuotes()
        ) {
          __jsxEnter = true
        }
      }
    }

    const isQuotationChar = isStringQuotation(curr)
    const isStringTemplateLiterals = inStrTemplateLiterals()
    const isRegexChar = !__jsxEnter && isRegexStart(c_n)
    const isJsxLiterals = inJsxLiterals()

    // string quotation
    if (isQuotationChar || isStringTemplateLiterals || isSingleQuotes(__strQuote)) {
      current += curr
    } else if (isRegexChar) {
      append()
      const [lastType, lastToken] = last
      // Special cases that are not considered as regex:
      // * (expr1) / expr2: `)` before `/` operator is still in expression
      // * <non comment start>/ expr: non comment start before `/` is not regex
      if (
        isRegexChar &&
        lastType !== -1 &&
        !(
          (lastType === T_SIGN && ')' !== lastToken) ||
          lastType === T_COMMENT
        )
      ) {
        current = curr
        append()
        continue
      }

      __regexQuoteStart = true
      const start = i++

      // end of line of end of file
      const isEof = () => i >= code.length
      const isEol = () => isEof() || code[i] === '\n'

      let foundClose = false
      
      // traverse to find closing regex slash
      for (; !isEol(); i++) {
        if (code[i] === '/' && code[i - 1] !== '\\') {
          foundClose = true
          // end of regex, append regex flags
          while (start !== i && /^[a-z]$/.test(code[i + 1]) && !isEol()) {
            i++
          }
          break
        }
      }
      __regexQuoteStart = false

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
      if (__jsxExpr && curr === '}') {
        append()
        current = curr
        append()
        __jsxExpr = false
      } else if (
        // it's jsx literals and is not a jsx bracket
        (isJsxLiterals && !jsxBrackets.has(curr)) ||
        // same type char as previous one in current token
        ((isWord(curr) === isWord(current[current.length - 1]) || __jsxChild()) && !signs.has(curr))
      ) {
        current += curr
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
 * @return {Array<any>}
 */
function generate(tokens) {
  const lines = []
  /**
   * @param {any} children
   * @return {{type: string, tagName: string, children: any[], properties: Record<string, string>}}
   */
  const createLine = (children) => 
      ({
        type: 'element',
        tagName: 'span',
        children,
        properties: {
          className: 'sh__line',
        },
      })

  /**
   * @param {Array<[number, string]>} tokens
   * @returns {void}
   */
  function flushLine(tokens) {
    /** @type {Array<any>} */
    const lineTokens = (
      tokens
        .map(([type, value]) => (
          {
            type: 'element',
            tagName: 'span',
            children: [{
              type: 'text',
              value: value, // to encode
            }],
            properties: {
              className: `sh__token--${types[type]}`,
              style: `color: var(--sh-${types[type]})`,
            },
          }
        ))
    )
    lines.push(createLine(lineTokens))
  }
  /** @type {Array<[number, string]>} */
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

  return lines
}

function toHtml(lines) {
  return lines
    .map(line => {
      const { tagName: lineTag } = line
      const tokens = line.children
        .map(child => {
          const { tagName, children, properties } = child
          return `<${tagName} class="${
            properties.className
          }" style="${
            properties.style
          }">${encode(children[0].value)}</${tagName}>`
        })
        .join('')
      return `<${lineTag} class="${line.properties.className}">${tokens}</${lineTag}>`
    })
    .join('\n')
}

/**
 *
 * @param {string} code
 * @returns {string}
 */
function highlight(code) {
  const tokens = tokenize(code)
  const lines = generate(tokens)
  const output = toHtml(lines)
  return output
}

// namespace
const SugarHigh = /** @type {const} */ {
  TokenTypes: types,
  TokenMap: new Map(types.map((type, i) => [type, i])),
}

export {
  highlight,
  tokenize,
  generate,
  SugarHigh,
}
