import { describe, expect, it, vi } from 'vitest'
import remarkSugarHigh, { highlight } from '.'

const tree = (lang = 'javascript', meta?: string, value = 'const ready = true') => ({
  type: 'root',
  children: [{ type: 'code', lang, meta, value }],
})

describe('@sugar-high/remark', () => {
  it('exports the plugin as both default and highlight', () => {
    expect(remarkSugarHigh).toBe(highlight)
  })

  it('normalizes fence aliases and highlights selected lines', () => {
    const output = highlight()(tree('bash', '{2}', 'echo one\necho two'))
    const pre = output.children[0]
    const code = pre.children[0]

    expect(pre.properties.className).toBe('sh-lang--shell')
    expect(code.properties['data-sh-language']).toBe('shell')
    expect(code.children[1].properties.className).toContain('sh__line--highlighted')
  })

  it('composes semantic annotations and display hooks', () => {
    const mark = vi.fn((token) => {
      if (token.type === 'sign') token.properties['data-sign'] = true
    })
    const markLine = vi.fn((line) => {
      if (line.annotations.includes('diff-add')) line.className += ' added'
    })
    const output = highlight({ cx: { sign: 'punctuation' }, mark, markLine })(
      tree('diff', undefined, '+ added')
    )
    const line = output.children[0].children[0].children[0]

    expect(line.properties.className).toBe('sh__line sh__line--diff-add added')
    expect(line.children[0].properties.className).toContain('punctuation')
    expect(line.children[0].properties['data-sign']).toBe(true)
    expect(mark).toHaveBeenCalled()
    expect(markLine).toHaveBeenCalled()
  })
})
