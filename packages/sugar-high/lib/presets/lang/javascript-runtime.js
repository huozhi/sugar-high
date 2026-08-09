// @ts-check

import {
  T_BREAK, T_CLASS as T_CLS_NUMBER, T_COMMENT, T_ENTITY, T_IDENTIFIER,
  T_JSX_LITERALS, T_KEYWORD, T_PROPERTY, T_SIGN, T_SPACE, T_STRING,
} from '../../shared.js'

const JSXBrackets = new Set(['<', '>', '{', '}', '[', ']'])
const Keywords_Js = new Set([
  'for', 'do', 'while', 'if', 'else', 'return', 'function', 'var', 'let', 'const',
  'true', 'false', 'undefined', 'this', 'new', 'delete', 'typeof', 'in', 'instanceof',
  'void', 'break', 'continue', 'switch', 'case', 'default', 'throw', 'try', 'catch',
  'finally', 'debugger', 'with', 'yield', 'async', 'await', 'class', 'extends', 'super',
  'import', 'export', 'from', 'static',
])

const Keywords_Ts = new Set([
  ...Keywords_Js,
  'type', 'interface', 'enum', 'implements', 'readonly', 'abstract', 'declare',
  'namespace', 'module', 'private', 'protected', 'public', 'override', 'keyof', 'infer',
  'is', 'asserts', 'satisfies', 'as', 'unknown', 'never', 'any', 'number', 'string',
  'boolean', 'bigint', 'symbol', 'object',
])

const Signs = new Set([
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
  ...JSXBrackets,
])

const DefaultOptions = {
  keywords: Keywords_Js,
  onCommentStart: isCommentStart_Js,
  onCommentEnd: isCommentEnd_Js,
  jsx: true,
  regex: true,
  templateStrings: true,
}

/**
 * Apply caller overrides to the JavaScript-compatible defaults.
 * @param {HighlightOptions | undefined} options
 * @returns {HighlightOptions}
 */
function resolveHighlightOptions(options) {
  return {
    ...DefaultOptions,
    ...options,
  }
}

/**
 * Fast, heuristic TS detection. It intentionally prefers speed over full parsing.
 * @param {string} code
 * @returns {boolean}
 */
function isLikelyTypeScript(code) {
  let tsScore = 0

  // TS-only declarations and operators.
  if (/\binterface\s+[A-Za-z_$][\w$]*/.test(code)) tsScore += 2
  if (/\btype\s+[A-Za-z_$][\w$]*\s*=/.test(code)) tsScore += 2
  if (/\benum\s+[A-Za-z_$][\w$]*/.test(code)) tsScore += 2
  if (/\b(?:implements|readonly|declare|namespace|satisfies|infer|keyof|asserts)\b/.test(code)) tsScore += 2

  // Common TS annotations/signatures.
  if (/:\s*[A-Za-z_$][\w$]*(?:<[^>\n]+>)?(?:\[\])?(?=\s*[,)=;{])/m.test(code)) tsScore += 1
  if (/\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*:\s*/.test(code)) tsScore += 1
  if (/\)\s*:\s*[A-Za-z_$][\w$]*(?:<[^>\n]+>)?(?:\[\])?\s*(?:=>|\{)/.test(code)) tsScore += 1

  return tsScore >= 2
}

/**
 * Detects `<T, U = ...>(` style generic parameter lists so they are not
 * treated as JSX tags.
 * @param {string} code
 * @param {number} startIndex
 * @returns {boolean}
 */
function isTypeParameterListStart(code, startIndex) {
  if (code[startIndex] !== '<') return false

  let depth = 0
  let sawIdentifierStart = false

  for (let i = startIndex; i < code.length; i++) {
    const ch = code[i]

    if (ch === '<') {
      depth++
      continue
    }
    if (ch === '>') {
      depth--
      if (depth === 0) {
        let next = i + 1
        while (next < code.length && /\s/.test(code[next])) next++
        if (!(sawIdentifierStart && code[next] === '(')) return false

        // Focus this heuristic on generic arrow functions:
        // const fn = <T>(arg) => ...
        const tail = code.slice(next, next + 320)
        return /\)\s*(?::[\s\S]{0,120}?)?=>/.test(tail)
      }
      continue
    }
    if (depth === 0) continue

    if (/[$A-Za-z_]/.test(ch)) {
      sawIdentifierStart = true
      continue
    }
    if (/[\s,\.\=\?\:\|\&\[\]]/.test(ch)) continue

    return false
  }

  return false
}

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
function isSpaces(str) {
  return /^[^\S\r\n]+$/g.test(str)
}

function isSign(ch) {
  return Signs.has(ch)
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

/** @returns {0|1|2}  */
function isCommentStart_Js(curr, next) {
  const str = curr + next
  if (str === '/*') return 2
  return str === '//' ? 1 : 0
}

/** @returns {0|1|2}  */
function isCommentEnd_Js(prev, curr) {
  return (prev + curr) === '*/'
    ? 2
    : curr === '\n' ? 1 : 0
}

function isRegexStart(str) {
  return str[0] === '/' && !isCommentStart_Js(str[0], str[1])
}

function isPropertyKey(code, quoteEnd) {
  let i = quoteEnd + 1
  while (i < code.length && /\s/.test(code[i])) i++
  return code[i] === ':'
}

/**
 * @param {string} code
 * @param {HighlightOptions | undefined} options
 * Optional `onQuote(curr, i, code)` at `code[i] === "'"`: return length to consume from `i` (>= 1),
 * or null/undefined/below 1 for default JS single-quoted strings. No substring allocation.
 * @return {Array<[number, string]>}
 */
function tokenize(code, options) {
  const mergedOptions = resolveHighlightOptions(options)
  const hasCustomKeywords = mergedOptions.keywords !== DefaultOptions.keywords
  const isTs = typeof mergedOptions.typescript === 'boolean'
    ? mergedOptions.typescript
    : isLikelyTypeScript(code)
  const resolvedKeywords = hasCustomKeywords
    ? mergedOptions.keywords
    : (isTs ? Keywords_Ts : Keywords_Js)

  const {
    onCommentStart,
    onCommentEnd,
  } = mergedOptions

  const resolvedTypeKeywords =
    mergedOptions.typeKeywords instanceof Set ? mergedOptions.typeKeywords : null
  const supportsJsx = mergedOptions.jsx !== false
  const supportsRegex = mergedOptions.regex !== false
  const supportsTemplateStrings = mergedOptions.templateStrings !== false
  const normalizeKeyword = mergedOptions.caseInsensitive
    ? (token) => token.toLowerCase()
    : (token) => token
  const isTemplateQuote = (chr) => supportsTemplateStrings && isStrTemplateChr(chr)

  let current = ''
  let type = -1
  /** @type {[number, string]} */
  let last = [-1, '']
  /** @type {[number, string]} */
  let beforeLast = [-2, '']
  /** @type {Array<[number, string]>} */
  const tokens = []

  /**
   * TS generics (`Map<string>`) and JSX (`<div>`) share the same `<Name …>` lexical shape. We use
   * one tag-lexer mode (__jsxTag + __jsxStack) for both when we enter it; isTsTypeArgStart and
   * isTypeParameterListStart only decide when *not* to enter (e.g. `foo<T>`, `<T>(x)=>`).
   * __jsxEnter gates that mode so a latched __jsxTag (from `<` in `"a<b"`) does not run the tag
   * lexer until we are in real JSX/TSX surface (not inside strings).
   * @type {boolean}
   */
  let __jsxEnter = false
  /** @type {0 | 1 | 2} 0 = none; 1 = inside `<open`; 2 = inside `</close` */
  let __jsxTag = 0
  let __jsxExpr = false

  /** Nested `<open>…</open>` depth (content between tags, including nested elements). */
  let __jsxStack = 0

  const __jsxChild = () => __jsxEnter && !__jsxExpr && !__jsxTag
  // < __content__ >
  const inJsxTag = () => __jsxTag && !__jsxChild()
  // {'__content__'}
  const inJsxLiterals = () => !__jsxTag && __jsxChild() && !__jsxExpr && __jsxStack > 0

  /** @type {string | null} */
  let __strQuote = null
  let __strTokenStart = 0
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
    if (inStringQuotes() || inStrTemplateLiterals()) {
      return T_STRING
    } else if (resolvedTypeKeywords && resolvedTypeKeywords.has(normalizeKeyword(token))) {
      return last[1] === '.' ? T_IDENTIFIER : T_CLS_NUMBER
    } else if (resolvedKeywords.has(normalizeKeyword(token))) {
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
   * @param {number | undefined} [type_]
   * @param {string | undefined} [token_]
   */
  const append = (type_, token_) => {
    if (token_) {
      current = token_
    }
    if (current) {
      type = typeof type_ === 'number' ? type_ : classify(current)
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

    // onQuote(curr, i, code): length from i; end = i + len (capped).
    if (
      typeof mergedOptions.onQuote === 'function' &&
      curr === "'" &&
      !inStringQuotes() &&
      !inJsxLiterals() &&
      !inStrTemplateLiterals()
    ) {
      const rawLen = mergedOptions.onQuote(curr, i, code)
      if (
        typeof rawLen === 'number' &&
        rawLen >= 1 &&
        !Number.isNaN(rawLen)
      ) {
        const len = Math.min(rawLen, code.length - i)
        const end = i + len
        append()
        current = code.slice(i, end)
        append(T_IDENTIFIER)
        i = end - 1
        continue
      }
    }

    // Determine string quotation outside of jsx literals and template literals.
    // Inside jsx literals or template literals, string quotation is still part of it.
    if (isSingleQuotes(curr) && !inJsxLiterals() && !inStrTemplateLiterals()) {
      append()
      let isStringClose = false
      if (prev !== `\\`) {
        if (__strQuote && curr === __strQuote) {
          __strQuote = null
          isStringClose = true
        } else if (!__strQuote) {
          __strQuote = curr
          __strTokenStart = tokens.length
        }
      }

      append(T_STRING, curr)
      if (mergedOptions.quotedKeys && isStringClose && isPropertyKey(code, i)) {
        for (let tokenIndex = __strTokenStart; tokenIndex < tokens.length; tokenIndex++) {
          tokens[tokenIndex][0] = T_PROPERTY
        }
      }
      continue
    }

    if (!inStrTemplateLiterals()) {
      if (prev !== '\\n' && isTemplateQuote(curr)) {
        append()
        append(T_STRING, curr)
        __strTemplateQuoteStack++
        continue
      }
    }

    if (inStrTemplateLiterals()) {
      if (prev !== '\\n' && isTemplateQuote(curr)) {
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
        // `-` in data-prop / aria-label. Consume the complete attribute as one property.
        if (curr === '-' && current && !inStringContent() && !inJsxLiterals()) {
          let end = i + 1
          while (end < code.length && /[$\w-]/.test(code[end])) end++
          append(T_PROPERTY, current + code.slice(i, end))
          i = end - 1
          continue
        }
        // `=` in property=<value>
        if (next === '=' && !inStringContent()) {
          // if current is not a space, ensure `prop` is a property
          if (!isSpaces(curr)) {
            // If there're leading spaces, append them first
            if (isSpaces(current)) {
              append()
            }

            // Now check if the accumulated token is a property
            const prop = current + curr
            if (isIdentifier(prop)) {
              append(T_PROPERTY, prop)
              continue
            }
          }
        }
      }
    }

    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (supportsJsx && !__jsxTag && (curr === '<' && isIdentifierChar(next) || c_n === '</')) {
      let prevNonSpace = i - 1
      while (prevNonSpace >= 0 && /\s/.test(code[prevNonSpace])) prevNonSpace--
      const prevChar = prevNonSpace >= 0 ? code[prevNonSpace] : ''

      const [lastType, lastTok] = last
      // Without a space before `<`, the LHS is often still in `current` (not flushed), so `last` is stale.
      let typeArgFromPending = false
      let jsxFromPending = false
      if (current && !isSpaces(current)) {
        const w = current
        // Unflushed LHS before `<`: numbers/null/Upper (isCls), and booleans, behave like `foo<` (type
        // args / `<`). Any other keyword (`return`, `void`, …) is JSX-friendly — no keyword allowlist.
        if (isCls(w) || w === 'true' || w === 'false') {
          typeArgFromPending = true
        } else if (resolvedKeywords.has(w) && isIdentifier(w)) {
          jsxFromPending = true
        } else if (isIdentifier(w)) {
          typeArgFromPending = true
        }
      }

      const isTsTypeArgStart =
        curr === '<' &&
        /[$\w\]\)]/.test(prevChar) &&
        (typeArgFromPending ||
          (!jsxFromPending &&
            (lastType === T_IDENTIFIER ||
              lastType === T_CLS_NUMBER ||
              (lastType === T_SIGN && (lastTok === ')' || lastTok === ']')))))
      const isTsGenericStart = curr === '<' && isTypeParameterListStart(code, i)
      if (!isTsTypeArgStart && !isTsGenericStart) {
        __jsxTag = next === '/' ? 2 : 1
      }

      if (curr === '<' && (next === '/' || isAlpha(next))) {
        if (
          !isTsTypeArgStart &&
          !isTsGenericStart &&
          !inStringContent() &&
          !inJsxLiterals() &&
          !inRegexQuotes()
        ) {
          __jsxEnter = true
        }
      }
    }

    const isQuotationChar = isSingleQuotes(curr) || isTemplateQuote(curr)
    const isStringTemplateLiterals = inStrTemplateLiterals()
    const isRegexChar = supportsRegex && !__jsxEnter && isRegexStart(c_n)
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

      // `/` is literal inside regex character classes, e.g. `[/]`.
      let inCharClass = false

      // traverse to find closing regex slash
      for (; !isEol(); i++) {
        const ch = code[i]
        const escaped = code[i - 1] === '\\'
        if (!escaped && ch === '[') inCharClass = true
        if (!escaped && ch === ']') inCharClass = false
        if (ch === '/' && !inCharClass && !escaped) {
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
    } else if (onCommentStart(curr, next, i, code)) {
      append()
      const start = i
      const startCommentType = onCommentStart(curr, next, i, code)

      // just match the comment, commentType === true
      // inline comment, commentType === 1
      // block comment, commentType === 2
      if (startCommentType) {
        for (; i < code.length; i++) {
          const endCommentType = onCommentEnd(code[i - 1], code[i], i, code)
          if (endCommentType == startCommentType) break
        }
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
        let end = i + 1
        while (code[end] === ' ') end++
        current += code.slice(i, end)
        i = end - 1
        if (code[end] === '<') {
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
        (isJsxLiterals && !JSXBrackets.has(curr)) ||
        // it's template literal content (including quotes)
        inStrTemplateLiterals() ||
        // same type char as previous one in current token
        ((isWord(curr) === isWord(current[current.length - 1]) || __jsxChild()) && !Signs.has(curr))
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
        else if (JSXBrackets.has(curr)) append()
      }
    }
  }

  append()

  return tokens
}

export { tokenize }

/**
 * @typedef {Object} HighlightOptions
 * @property {Set<string>} [keywords]
 * @property {Set<string>} [typeKeywords]
 * @property {(curr: string, next: string, index: number, code: string) => number | boolean} [onCommentStart]
 * @property {(prev: string, curr: string, index: number, code: string) => number | boolean} [onCommentEnd]
 * @property {(curr: string, i: number, code: string) => number | null | undefined} [onQuote]
 * @property {boolean} [quotedKeys]
 * @property {boolean} [jsx] Whether JSX tag parsing is enabled.
 * @property {boolean} [regex] Whether JavaScript-style regular expressions are enabled.
 * @property {boolean} [templateStrings] Whether JavaScript template strings are enabled.
 * @property {boolean} [caseInsensitive] Whether keyword matching ignores case.
 * @property {boolean} [typescript] Override heuristic TypeScript detection.
 * @property {(line: import('../../core.js').AnnotateLine) => void} [annotateLine]
 */
