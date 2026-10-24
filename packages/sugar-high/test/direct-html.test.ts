import { describe, expect, it } from 'vitest'
import { highlight } from '../lib/index.js'
import { parse, render, type DisplayOptions } from '../lib/core.js'
import { languages } from '../lib/lang.js'
import { configFor } from '../lib/presets/configs.js'
import { assemble, html } from '../lib/shared.js'

const sources = [
  '', '\n', '\r\n', '\n\n', 'value\r', 'value\r\r\n',
  'const value = "&<>\\\"";\n\n// comment\r\n',
  '/* first\r\n\nlast */\nconst text = `one\ntwo\n`;\n',
  'const view = <div title="&quot;">é😀\n{value}</div>',
  '+added\n-removed\n@@ hunk @@\n--- before\n+++ after\n',
]

describe('direct HTML rendering', () => {
  it.each(languages)('preserves structured output for $id', ({ id }) => {
    for (const source of sources) {
      expect(highlight(source, { lang: id })).toBe(render(parse(source, configFor(id))))
    }
  })

  it('preserves default and unknown-language output', () => {
    for (const source of sources) {
      expect(highlight(source)).toBe(render(parse(source, configFor(undefined))))
      expect(highlight(source, { lang: 'unknown' as any })).toBe(render(parse(source)))
    }
  })

  it('preserves newline handling across token boundaries', () => {
    const values = ['', 'a', '\n', '\r', '\r\n', '\n\n', 'a\nb', 'a\r\n', 'a\r\r\n', '\n\r', '&<>"\'', 'é😀']
    const choices: Array<[number, string]> = []
    for (const type of [0, 2, 8, 9, 10]) {
      for (const value of values) choices.push([type, value])
    }
    const tails: Array<Array<[number, string]>> = [[], [[9, '\n']], [[0, '']]]
    for (const first of choices) for (const second of choices) for (const tail of tails) {
      const tokens = [first, second, ...tail]
      expect(html(tokens), JSON.stringify(tokens)).toBe(render(assemble('', tokens)))
    }
  })

  it('preserves each display option independently', () => {
    const source = 'const value = 1\n'
    const cases: DisplayOptions[] = [
      { cx: { keyword: 'custom' } },
      { mark(token) { token.properties.title = '<&>' } },
      { markLine(line) { line.className += ' custom' } },
    ]
    for (const options of cases) {
      expect(highlight(source, options)).toBe(render(parse(source, configFor(undefined)), options))
    }
  })

  it('preserves annotations, custom classes and mutable display hooks', () => {
    const source = '+added\n-removed\n@@ hunk @@\n'
    const run = (direct: boolean) => {
      const calls: unknown[] = []
      const options: DisplayOptions = {
        cx: { identifier: 'extra' },
        markLine(line) {
          calls.push([line.index, line.value, [...line.annotations]])
          line.properties['data-line'] = line.index
        },
        mark(token) {
          calls.push([token.type, token.value])
          token.properties.title = '<&>'
        },
      }
      const html = direct
        ? highlight(source, { lang: 'diff', ...options })
        : render(parse(source, configFor('diff')), options)
      return { html, calls }
    }
    expect(run(true)).toEqual(run(false))
  })
})
