import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  parse: vi.fn(),
}))

vi.mock('gpu-lexer', () => ({ parse: mocks.parse }))

import { highlight, parse } from '../lib/gpu.js'

describe('gpu highlighting', () => {
  beforeEach(() => mocks.parse.mockReset())

  it('adapts GPU spans to Sugar High tokens and preserves source gaps', async () => {
    const code = 'const answer = 42\nrun("ok")'
    mocks.parse.mockResolvedValue([
      { type: 'keyword', start: 0, end: 5 },
      { type: 'plain', start: 6, end: 12 },
      { type: 'operator', start: 13, end: 14 },
      { type: 'number', start: 15, end: 17 },
      { type: 'function', start: 18, end: 21 },
      { type: 'operator', start: 21, end: 22 },
      { type: 'string', start: 22, end: 26 },
      { type: 'operator', start: 26, end: 27 },
    ])

    await expect(parse(code)).resolves.toEqual({
      value: code,
      lines: [
        {
          index: 0,
          value: 'const answer = 42',
          tokens: [
            { type: 'keyword', value: 'const' },
            { type: 'space', value: ' ' },
            { type: 'identifier', value: 'answer' },
            { type: 'space', value: ' ' },
            { type: 'sign', value: '=' },
            { type: 'space', value: ' ' },
            { type: 'class', value: '42' },
          ],
          annotations: [],
        },
        {
          index: 1,
          value: 'run("ok")',
          tokens: [
            { type: 'entity', value: 'run' },
            { type: 'sign', value: '(' },
            { type: 'string', value: '"ok"' },
            { type: 'sign', value: ')' },
          ],
          annotations: [],
        },
      ],
    })
  })

  it('renders escaped HTML with the regular display hooks', async () => {
    mocks.parse.mockResolvedValue([
      { type: 'keyword', start: 0, end: 5 },
      { type: 'plain', start: 5, end: 6 },
      { type: 'string', start: 6, end: 11 },
    ])

    const html = await highlight('const "<x>"', {
      cx: { keyword: 'bold' },
    })

    expect(html).toContain('class="sh__token--keyword bold"')
    expect(html).toContain('&quot;&lt;x&gt;&quot;')
  })
})
