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

/**
 * @param {Array<[number, string]>} tokens
 * @param {{
 *   lineClassName?: (line: string, index: number) => string | null | undefined
 *   cx?: Partial<Record<import('./core.js').TokenType, string>>
 *   mark?: (token: import('./core.js').MarkToken) => void
 * } | undefined} options
 */
function generate(tokens, options) {
  const lines = []
  const lineClassName = typeof options?.lineClassName === 'function' ? options.lineClassName : null
  const cx = options?.cx
  const mark = options?.mark
  let lineIndex = 0
  /** @type {Array<[number, string]>} */
  const lineTokens = []
  let lastWasBreak = false

  /** @param {Array<[number, string]>} tokens */
  function flushLine(tokens) {
    const text = tokens.map(([, value]) => value).join('')
    const extraClassName = lineClassName ? lineClassName(text, lineIndex) : ''
    lineIndex++
    lines.push({
      type: 'element',
      tagName: 'span',
      children: tokens.map(([type, value]) => {
        const tokenType = TokenTypes[type]
        const extraClassName = cx?.[tokenType]
        const token = {
          type: tokenType,
          value,
          className: `sh__token--${tokenType}${extraClassName ? ` ${extraClassName}` : ''}`,
          style: { color: `var(--sh-${tokenType})` },
          properties: {},
        }
        mark?.(token)
        return {
          type: 'element',
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
        className: extraClassName ? `sh__line ${extraClassName}` : 'sh__line',
      },
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
  return lines
}

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
/** @param {string} value */
const encode = (value) => value.replace(/[&<>"']/g, character => entities[character])

/** @param {Array<any>} lines */
function toHtml(lines) {
  return lines.map(line => {
    const children = line.children.map(token => {
      const style = Object.entries(token.properties.style)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${value}`).join(';')
      const properties = Object.entries(token.properties)
        .filter(([key, value]) => /^[\w:-]+$/.test(key) && key !== 'className' && key !== 'style' && value !== false && value != null)
        .map(([key, value]) => value === true ? key : `${key}="${encode(String(value))}"`).join(' ')
      const attributes = `class="${encode(token.properties.className)}" style="${encode(style)}"${properties ? ` ${properties}` : ''}`
      return `<${token.tagName} ${attributes}>${encode(token.children[0].value)}</${token.tagName}>`
    }).join('')
    return `<${line.tagName} class="${line.properties.className}">${children}</${line.tagName}>`
  }).join('\n')
}

export {
  encode, generate, SugarHigh, toHtml, TokenTypes, T_BREAK, T_CLASS, T_COMMENT, T_ENTITY, T_IDENTIFIER,
  T_JSX_LITERALS, T_KEYWORD, T_PROPERTY, T_SIGN, T_SPACE, T_STRING,
}
