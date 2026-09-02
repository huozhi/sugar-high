// @ts-check

const TokenTypes = /** @type {const} */ ('identifier keyword string class property entity jsxliterals sign comment break space'.split(' '))
const [
  T_IDENTIFIER, T_KEYWORD, T_STRING, T_CLASS, T_PROPERTY, T_ENTITY,
  T_JSX_LITERALS, T_SIGN, T_COMMENT, T_BREAK, T_SPACE,
] = TokenTypes.map((_, index) => index)

const SugarHigh = /** @type {const} */ ({
  TokenTypes,
  TokenMap: new Map(TokenTypes.map((type, index) => [type, index])),
})

/** @param {string} value @param {Array<[number, string]>} tokens */
function assemble(value, tokens) {
  const lines = []
  let lineIndex = 0
  /** @type {Array<[number, string]>} */
  const lineTokens = []
  let lastWasBreak = false

  /** @param {Array<[number, string]>} tokens */
  function flushLine(tokens) {
    lines.push({
      index: lineIndex++,
      value: tokens.map(([, tokenValue]) => tokenValue).join(''),
      tokens: tokens.map(([type, tokenValue]) => ({
        type: TokenTypes[type],
        value: tokenValue,
      })),
      annotations: [],
    })
  }

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const [type, value] = token
    if (type !== T_BREAK) {
      if (value.includes('\n')) {
        const values = value.split('\n')
        for (let part = 0; part < values.length; part++) {
          lineTokens.push([type, values[part]])
          if (part < values.length - 1) {
            flushLine(lineTokens)
            lineTokens.length = 0
          }
        }
      } else {
        lineTokens.push(token)
      }
      lastWasBreak = false
    } else {
      if (lastWasBreak) flushLine([])
      else {
        flushLine(lineTokens)
        lineTokens.length = 0
      }
      if (index === tokens.length - 1) flushLine([])
      lastWasBreak = true
    }
  }

  if (lineTokens.length) flushLine(lineTokens)
  return { value, lines }
}

/**
 * @param {import('./core.js').ParsedLine} parsedLine
 * @param {import('./core.js').DisplayOptions['markLine']} markLine
 */
function createLine(parsedLine, markLine) {
  const line = {
    index: parsedLine.index,
    value: parsedLine.value,
    tokens: parsedLine.tokens,
    annotations: parsedLine.annotations,
    className: `sh__line${parsedLine.annotations.map(annotation => ` sh__line--${annotation}`).join('')}`,
    style: {},
    properties: {},
  }
  markLine?.(line)
  return line
}

/**
 * @param {import('./core.js').ParsedToken} parsedToken
 * @param {import('./core.js').DisplayOptions['cx']} cx
 * @param {import('./core.js').DisplayOptions['mark']} mark
 */
function createToken({ type, value }, cx, mark) {
  const extraClassName = cx?.[type]
  const token = {
    type,
    value,
    className: `sh__token--${type}${extraClassName ? ` ${extraClassName}` : ''}`,
    style: { color: `var(--sh-${type})` },
    properties: {},
  }
  mark?.(token)
  return token
}

/**
 * @param {import('./core.js').ParsedCode} parsed
 * @param {import('./core.js').DisplayOptions | undefined} options
 */
function generate(parsed, options) {
  const cx = options?.cx
  const mark = options?.mark
  const markLine = options?.markLine

  return parsed.lines.map((parsedLine) => {
    const line = createLine(parsedLine, markLine)

    return {
      type: 'element',
      tagName: 'span',
      children: parsedLine.tokens.map((parsedToken) => {
        const token = createToken(parsedToken, cx, mark)
        return {
          type: 'element',
          tokenType: token.type,
          tagName: 'span',
          children: [{ type: 'text', value: token.value }],
          properties: {
            ...token.properties,
            className: token.className,
            style: token.style,
          },
        }
      }),
      properties: {
        ...line.properties,
        className: line.className,
        style: line.style,
      },
    }
  })
}

/**
 * Render parsed lines directly while preserving generate()'s markup and mutable display hooks.
 * @param {import('./core.js').ParsedCode} parsed
 * @param {import('./core.js').DisplayOptions | undefined} options
 */
function render(parsed, options) {
  const cx = options?.cx
  const mark = options?.mark
  const markLine = options?.markLine

  if (!cx && !mark && !markLine) {
    return parsed.lines.map((line) => {
      const className = `sh__line${line.annotations.map(annotation => ` sh__line--${annotation}`).join('')}`
      const children = line.tokens.map(({ type, value }) => (
        `<span class="sh__token--${type}" style="color:var(--sh-${type})">${encode(value)}</span>`
      )).join('')
      return `<span class="${encode(className)}">${children}</span>`
    }).join('\n')
  }

  return parsed.lines.map((parsedLine) => {
    const line = createLine(parsedLine, markLine)

    const children = parsedLine.tokens.map((parsedToken) => {
      const token = createToken(parsedToken, cx, mark)
      return `<span ${attributes({
        ...token.properties,
        className: token.className,
        style: token.style,
      })}>${encode(token.value)}</span>`
    }).join('')

    return `<span ${attributes({
      ...line.properties,
      className: line.className,
      style: line.style,
    })}>${children}</span>`
  }).join('\n')
}

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
/** @param {string} value */
const encode = (value) => value.replace(/[&<>"']/g, character => entities[character])

/** @param {Record<string, any>} values */
function attributes(values) {
  const style = Object.entries(values.style || {})
    .map(([key, value]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${value}`).join(';')
  const properties = Object.entries(values)
    .filter(([key, value]) => /^[\w:-]+$/.test(key) && key !== 'className' && key !== 'style' && value !== false && value != null)
    .map(([key, value]) => value === true ? key : `${key}="${encode(String(value))}"`).join(' ')
  return `class="${encode(values.className || '')}"${style ? ` style="${encode(style)}"` : ''}${properties ? ` ${properties}` : ''}`
}

export {
  assemble, encode, generate, render, SugarHigh, TokenTypes, T_BREAK, T_CLASS, T_COMMENT, T_ENTITY, T_IDENTIFIER,
  T_JSX_LITERALS, T_KEYWORD, T_PROPERTY, T_SIGN, T_SPACE, T_STRING,
}
