import { describe, expect, it } from 'vitest'
import { highlight } from 'sugar-high'
import { generate, parse, render, tokenize } from 'sugar-high/core'
import * as javascript from '../lib/lang/javascript.js'
import * as python from '../lib/lang/python.js'
import * as typescript from '../lib/lang/typescript.js'

describe('composable core export', () => {
  it('returns structured lines and semantic tokens from parse', () => {
    const parsed = parse('const ready = true', javascript)

    expect(parsed.value).toBe('const ready = true')
    expect(parsed.lines).toHaveLength(1)
    expect(parsed.lines[0].index).toBe(0)
    expect(parsed.lines[0].value).toBe('const ready = true')
    expect(parsed.lines[0].tokens[0]).toEqual({
      type: 'keyword',
      value: 'const',
    })
  })

  it('composes a selected preset without the built-in registry API', () => {
    const source = '# note\ndef greet(name):\n  return "Hi " + name'
    expect(render(parse(source, python))).toBe(
      highlight(source, { lang: 'python' })
    )
  })

  it('keeps parser configuration exclusive to core', () => {
    const html = highlight('custom', {
      keywords: new Set(['custom']),
    } as any)

    expect(html).toContain('sh__token--identifier')
    expect(html).not.toContain('sh__token--keyword')
  })

  it('retains the JavaScript defaults when no preset is supplied', () => {
    const source = 'const answer = 42'
    expect(tokenize(source).map(([, value]) => value).join('')).toBe(source)
  })

  it('composes JavaScript with JSX as one preset', () => {
    const source = 'const view = <Button aria-label="Save">Save</Button>'
    expect(render(parse(source, javascript))).toBe(
      highlight(source, { lang: 'javascript' })
    )
  })

  it('composes TypeScript with TSX as one preset', () => {
    const source = 'interface Props { label: string }\nconst View = (p: Props) => <div>{p.label}</div>'
    expect(render(parse(source, typescript))).toBe(
      highlight(source, { lang: 'typescript' })
    )
  })

  it('lets render mutate lines without changing the parsed result', () => {
    const parsed = parse('first\nsecond')
    const html = render(parsed, {
      markLine(line) {
        if (line.index === 1) {
          line.className += ' selected'
          line.style.fontWeight = 700
          line.properties['data-line'] = 2
        }
      },
    })

    expect(html).toContain('class="sh__line selected"')
    expect(html).toContain('style="font-weight:700"')
    expect(html).toContain('data-line="2"')
    expect(parsed.lines[1].annotations).toEqual([])
  })

  it('keeps syntax-tree and semantic token types separate', () => {
    const [line] = generate(parse('const ready = true', javascript))

    expect(line.type).toBe('element')
    expect(line.children[0].type).toBe('element')
    expect(line.children[0].tokenType).toBe('keyword')
  })

  it('runs syntax annotation before line and token display hooks', () => {
    const calls: string[] = []
    const parsed = parse('const', {
      keywords: new Set(['const']),
      annotateLine(line) {
        calls.push('annotateLine')
        line.annotations.push('example')
      },
    })

    generate(parsed, {
      cx: { keyword: 'bold' },
      markLine(line) {
        calls.push('markLine')
        expect(line.className).toContain('sh__line--example')
      },
      mark(token) {
        calls.push('mark')
        expect(token.className).toContain('bold')
      },
    })

    expect(calls).toEqual(['annotateLine', 'markLine', 'mark'])
  })
})
