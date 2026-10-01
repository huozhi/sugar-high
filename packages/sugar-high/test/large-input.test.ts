import { describe, expect, it } from 'vitest'
import { tokenize } from '../lib/core.js'
import * as css from '../lib/lang/css.js'
import * as html from '../lib/lang/html.js'

const repeat = (block: (index: number) => string, count: number) =>
  Array.from({ length: count }, (_, index) => block(index)).join('')

const join = (tokens: Array<[number, string]>) => tokens.map(([, value]) => value).join('')

describe('large inputs', () => {
  it('keeps every dashed CSS name in a large stylesheet', () => {
    const input = repeat((index) => `.btn-${index} { background-color: #fff; margin-top: -${index}px; }\n`, 20000)
    const tokens = tokenize(input, css)

    expect(join(tokens)).toBe(input)
    expect(tokens.filter(([, value]) => value === 'background-color')).toHaveLength(20000)
  })

  it('tokenizes large HTML without overflowing the call stack', () => {
    const markup = repeat((index) => `<p class="a">text ${index}</p>\n`, 40000)
    const script = `<script>${'a=1;'.repeat(60000)}</script>`

    expect(join(tokenize(markup, html))).toBe(markup)
    expect(join(tokenize(script, html))).toBe(script)
  })

  it('tokenizes many unclosed script tags', () => {
    const input = '<script>'.repeat(40000)

    expect(join(tokenize(input, html))).toBe(input)
  })
})
