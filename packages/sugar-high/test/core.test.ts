import { describe, expect, it } from 'vitest'
import { highlight } from 'sugar-high'
import { generate, parse, render, tokenize, extendConfig, type DisplayOptions, SugarHigh } from 'sugar-high/core'
import * as javascript from '../lib/lang/javascript.js'
import * as python from '../lib/lang/python.js'
import * as typescript from '../lib/lang/typescript.js'
import * as c from '../lib/lang/c.js'
import * as cpp from '../lib/lang/cpp.js'

const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}

function encode(value: string) {
  return value.replace(/[&<>"']/g, character => entities[character])
}

function attributes(values: Record<string, any>) {
  const style = Object.entries(values.style || {})
    .map(([key, value]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${value}`).join(';')
  const properties = Object.entries(values)
    .filter(([key, value]) => /^[\w:-]+$/.test(key) && key !== 'className' && key !== 'style' && value !== false && value != null)
    .map(([key, value]) => value === true ? key : `${key}="${encode(String(value))}"`).join(' ')
  return `class="${encode(values.className || '')}"${style ? ` style="${encode(style)}"` : ''}${properties ? ` ${properties}` : ''}`
}

function toHtml(lines: ReturnType<typeof generate>) {
  return lines.map(line => {
    const children = line.children.map(token => (
      `<${token.tagName} ${attributes(token.properties)}>${encode(token.children[0].value)}</${token.tagName}>`
    )).join('')
    return `<${line.tagName} ${attributes(line.properties)}>${children}</${line.tagName}>`
  }).join('\n')
}

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

  it('keeps parser configuration exclusive to core — highlight() does not forward parse options', () => {
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

  it('renders the same markup as serialized generated nodes', () => {
    const parsed = parse('const view = <Button title="Save">Save</Button>', typescript)
    expect(render(parsed)).toBe(toHtml(generate(parsed)))

    const annotated = parse('const', {
      keywords: new Set(['const']),
      annotateLine(line) {
        line.annotations.push('quoted"annotation')
      },
    })
    expect(render(annotated)).toBe(toHtml(generate(annotated)))

    const options: DisplayOptions = {
      cx: { keyword: 'bold', entity: 'tag' },
      markLine(line) {
        line.properties['data-line'] = line.index + 1
      },
      mark(token) {
        if (token.type === 'string') token.style.fontWeight = 600
      },
    }

    expect(render(parsed, options)).toBe(toHtml(generate(parsed, options)))
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


describe('extendConfig', () => {
  it('unions extra keywords into the base preset without mutating it', () => {
    const glsl = extendConfig(c, {
      keywords: ['uniform', 'attribute'],
    })

    // Extra keywords are recognized
    expect(glsl.keywords?.has('uniform')).toBe(true)
    expect(glsl.keywords?.has('attribute')).toBe(true)

    // Base keywords are still present
    expect(glsl.keywords?.has('return')).toBe(true)
    expect(glsl.keywords?.has('for')).toBe(true)

    // Original config is NOT mutated
    expect(c.keywords.has('uniform')).toBe(false)
  })

  it('unions extra typeKeywords into the base preset without mutating it', () => {
    const glsl = extendConfig(c, {
      typeKeywords: ['vec2', 'vec3', 'vec4', 'mat4', 'sampler2D'],
    })

    expect(glsl.typeKeywords?.has('vec3')).toBe(true)
    expect(glsl.typeKeywords?.has('sampler2D')).toBe(true)

    // Base typeKeywords are still present
    expect(glsl.typeKeywords?.has('int')).toBe(true)
    expect(glsl.typeKeywords?.has('float')).toBe(true)

    // Original config is NOT mutated
    expect(c.typeKeywords.has('vec3')).toBe(false)
  })

  it('highlights GLSL shader code with C rules + custom keywords', () => {
    const glsl = extendConfig(c, {
      keywords: ['uniform', 'attribute', 'varying'],
      typeKeywords: ['vec2', 'vec3', 'vec4', 'mat4', 'sampler2D'],
    })

    const tokens = tokenize('uniform vec3 color;', glsl)
    const types = tokens.map(([type]) => SugarHigh.TokenTypes[type])
    const values = tokens.map(([, value]) => value)

    expect(values[0]).toBe('uniform')
    expect(types[0]).toBe('keyword')

    expect(values[2]).toBe('vec3')
    expect(types[2]).toBe('class')  // typeKeywords render as class
  })

  it('works with both keywords and typeKeywords together', () => {
    const glsl = extendConfig(cpp, {
      keywords: ['uniform'],
      typeKeywords: ['vec4'],
    })

    const html = render(parse('uniform vec4 color;', glsl))
    expect(html).toContain('sh__token--keyword')   // uniform
    expect(html).toContain('sh__token--class')     // vec4
  })

  it('accepts an iterable (array) as well as a Set', () => {
    const ext = extendConfig(c, {
      keywords: ['custom1', 'custom2'],
      typeKeywords: ['MyType'],
    })
    expect(ext.keywords?.has('custom1')).toBe(true)
    expect(ext.keywords?.has('custom2')).toBe(true)
    expect(ext.typeKeywords?.has('MyType')).toBe(true)
  })

  it('returns a valid config when overrides are empty', () => {
    const copy = extendConfig(c, {})
    expect(copy.keywords?.has('return')).toBe(true)
    expect(copy.typeKeywords?.has('int')).toBe(true)
    expect(copy).not.toBe(c)  // must be a copy, not the same reference
  })

  it('works on a config with no base keywords', () => {
    const ext = extendConfig({}, { keywords: ['foo'] })
    expect(ext.keywords?.has('foo')).toBe(true)
  })
})
