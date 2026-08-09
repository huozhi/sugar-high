import { type HighlightOptions } from 'sugar-high'
import { parse, generate } from 'sugar-high/core'
import { lang as canonicalizeLang, languages } from 'sugar-high/lang'
import { map as unistMap } from 'unist-util-map'

type HighlightRange = number | [number, number]

/**
 * Parses highlight information from the `meta` field of a Remark code block node.
 * @param meta The `meta` string containing highlight information, e.g., "{1,3-5}".
 * @returns An array of highlight ranges. Single numbers represent single lines, and tuples represent ranges.
 */
function parseHighlightMeta(meta?: string): HighlightRange[] {
  if (!meta) return []

  const highlightRegex = /{([\d,-]+)}/ // Matches {1,3-5}
  const match = meta.match(highlightRegex)

  if (!match) return []

  const ranges = match[1].split(',').map((range) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number)
      return [start, end] as [number, number]
    }
    return Number(range)
  })

  return ranges
}

const h = (type, attrs, children) => {
  return {
    type: 'element',
    tagName: type,
    data: {
      hName: type,
      hProperties: attrs,
      hChildren: children,
    },
    properties: attrs,
    children,
  }
}

export type RemarkSugarHighOptions = {
  cx?: HighlightOptions['cx']
  mark?: HighlightOptions['mark']
  markLine?: HighlightOptions['markLine']
}

const highlight = ({ cx, mark, markLine }: RemarkSugarHighOptions = {}) => (tree) => {
  return unistMap(tree, (node) => {
    const { type, tagName } = node
    if (tagName !== 'code' && type !== 'code') return node

    const language = String(node.lang || '').match(/^[a-zA-Z\d-]*/)?.[0] || 'unknown'

    const highlightRanges = parseHighlightMeta(node.meta)
    const highlightLineNumbers = new Set<number>()
    highlightRanges.forEach((range) => {
      if (Array.isArray(range)) {
        for (let i = range[0]; i <= range[1]; i++) {
          highlightLineNumbers.add(i)
        }
      } else {
        highlightLineNumbers.add(range)
      }
    })

    const canonicalLang = canonicalizeLang(language)
    const outputLang = canonicalLang || language
    const codeText =
      node.value ||
      node.children
        .filter(({ type }) => type === 'text')
        .map(({ value }) => value)
        .pop()

    const config = languages.find(({ id }) => id === (canonicalLang || 'javascript'))?.config
    const parsed = parse(codeText, config)
    const childrenLines = generate(parsed, {
      cx,
      mark,
      markLine(line) {
        markLine?.(line)
        if (highlightLineNumbers.has(line.index + 1)) {
          line.className += ' sh__line--highlighted'
        }
      },
    })

    for (let i = 0; i < childrenLines.length; i++) {
      const line = childrenLines[i]
      
      for (let j = 0; j < line.children.length; j++) {
        const token = line.children[j]
        // normalize token's style object to string
        if (token.properties && typeof token.properties.style === 'object') {
          let styleString = ''
          for (const [key, value] of Object.entries(token.properties.style)) {
            const property = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
            styleString += `${property}:${value};`
          }
          if (styleString) {
            token.properties.style = styleString
          }
        }
      }

      // add line break
      line.children.push(
        h(
          'span',
          {
            className: `sh__token--line`,
          },
          [{ type: 'text', value: '\n' }]
        )
      )

    }

    const code = h(
      'code',
      {
        className: `sh-lang--${outputLang}`,
        ['data-sh-language']: `${outputLang}`,
      },
      childrenLines
    )

    const pre = h(
      'pre',
      {
        className: `sh-lang--${outputLang}`,
      },
      [code]
    )

    return pre
  })
}

export { highlight }
export default highlight
