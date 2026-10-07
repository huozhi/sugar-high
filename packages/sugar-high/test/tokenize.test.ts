import { describe, expect, it } from 'vitest'
import * as core from '../lib/core.js'
import * as javascript from '../lib/lang/javascript.js'
import { getTokensAsString } from './testing-utils'

const tokenize = (code, options = {}) =>
  core.tokenize(code, { ...javascript, ...options })

describe('tokenize - JSX boolean props', () => {
  it('classifies the reported props without changing expression tokens', () => {
    const input = `<Code
  title="example.js"
  lang="javascript"
  theme={taffy}
  controls
  lineNumbers
  highlightLines={[1, [5, 6]]}
>`
    const tokens = tokenize(input)
    const actual = getTokensAsString(tokens)
    expect(tokens.map(([, value]) => value).join('')).toBe(input)
    expect(actual.filter((token) => token.endsWith('=> property'))).toEqual([
      'title => property', 'lang => property', 'theme => property',
      'controls => property', 'lineNumbers => property', 'highlightLines => property',
    ])
    expect(actual).toContain('Code => entity')
    expect(actual).toContain('taffy => identifier')
    expect(actual.filter((token) => token.endsWith('=> class'))).toEqual([
      '1 => class', '5 => class', '6 => class',
    ])
  })

  it.each(['<input disabled/>', '<input disabled>', '<input disabled />'])('%s', (input) => {
    expect(getTokensAsString(tokenize(input))).toContain('disabled => property')
  })

  it('keeps nested expression identifiers and member tag names distinct from props', () => {
    const actual = getTokensAsString(tokenize(
      '<UI.Button options={{ value: active }} disabled>{label}</UI.Button>'
    ))
    expect(actual).toContain('active => identifier')
    expect(actual).toContain('disabled => property')
    expect(actual).not.toContain('Button => property')
    expect(actual).toContain('label => identifier')
  })
})

describe('tokenize - nested JSX child expressions', () => {
  it.each([
    ['<div>{{ value: item }.value}</div>', '.value => jsxliterals'],
    ['<div>{items.map(item => ({ id: item.id }))}</div>', ')) => jsxliterals'],
  ])('keeps nested braces inside JavaScript for %s', (input, staleToken) => {
    const tokens = tokenize(input)
    const actual = getTokensAsString(tokens)

    expect(tokens.map(([, value]) => value).join('')).toBe(input)
    expect(actual).not.toContain(staleToken)
    expect(actual).toContain('item => identifier')
  })

  it('keeps JSX attribute classification after nested attribute objects', () => {
    const actual = getTokensAsString(tokenize(
      '<Widget config={{ nested: { value } }} disabled />'
    ))

    expect(actual).toContain('value => identifier')
    expect(actual).toContain('disabled => property')
  })

  it('tracks template interpolation separately from the JSX expression', () => {
    const input = '<div>{`hello ${user.name}`.toUpperCase()}</div>'
    const tokens = tokenize(input)
    const actual = getTokensAsString(tokens)

    expect(tokens.map(([, value]) => value).join('')).toBe(input)
    expect(actual).toContain('user => identifier')
    expect(actual).toContain('toUpperCase => identifier')
    expect(actual.some(token => token.endsWith('=> jsxliterals'))).toBe(false)
  })
})

describe('tokenize - typeKeywords', () => {
  it('classifies typeKeywords as class before keywords', () => {
    const input = 'int x'
    const actual = getTokensAsString(
      tokenize(input, {
        keywords: new Set(['int']),
        typeKeywords: new Set(['int']),
      })
    )
    expect(actual).toEqual(['int => class', 'x => identifier'])
  })
})

describe('tokenize - whitespace', () => {
  it('handles long whitespace runs without rescanning the accumulated token', () => {
    const spaces = ' '.repeat(100_000)

    expect(tokenize(spaces)).toEqual([[10, spaces]])
  })
})

describe('tokenize - customized keywords', () => {
  it('should tokenize the input string with the given keywords', () => {
    const input = 'def f(): return 1'
    const keywords = new Set(['def', 'return'])
    const actual = getTokensAsString(tokenize(input, { keywords }))
    expect(actual).toMatchInlineSnapshot(`
      [
        "def => keyword",
        "f => identifier",
        "( => sign",
        ") => sign",
        ": => sign",
        "return => keyword",
        "1 => class",
      ]
    `)
  })
})


describe('tokenize - customized comment rule', () => {
  it('should tokenize the input string with the given comment rule', () => {
    const input = `\
    # define a function
    def f():
      return 2 # this is a comment
    `
    const keywords = new Set(['def', 'return'])
    const onCommentStart = (curr, next) => {
      return curr === '#'
    }
    const onCommentEnd = (prev, curr) => {
      return curr === '\n'
    }
    const actual = getTokensAsString(tokenize(input, {
      keywords, 
      onCommentStart,
      onCommentEnd
    }))
    expect(actual).toMatchInlineSnapshot(`
      [
        "# define a function => comment",
        "def => keyword",
        "f => identifier",
        "( => sign",
        ") => sign",
        ": => sign",
        "return => keyword",
        "2 => class",
        "# this is a comment => comment",
      ]
    `)
  })
})

describe('tokenize - typescript built-in type names', () => {
  it('classifies primitive type keywords in type positions', () => {
    const input =
      'type Point = { readonly x: number; y: number }\n' +
      'const b: boolean = true\n' +
      'const s: string = ""\n' +
      'const bi: bigint = 0n\n' +
      'const sym: symbol = Symbol()\n' +
      'const o: object = {}'
    const actual = getTokensAsString(tokenize(input))
    expect(actual.filter((t) => /^(number|string|boolean|bigint|symbol|object) =>/.test(t))).toEqual([
      'number => keyword',
      'number => keyword',
      'boolean => keyword',
      'string => keyword',
      'bigint => keyword',
      'symbol => keyword',
      'object => keyword',
    ])
  })
})

describe('tokenize - typescript generic arrow function', () => {
  it('should not treat type parameter lists as jsx tags', () => {
    const input = 'const f = <T = any>(v: T) => v'
    const actual = getTokensAsString(tokenize(input))
    expect(actual).toMatchInlineSnapshot(`
      [
        "const => keyword",
        "f => identifier",
        "= => sign",
        "< => sign",
        "T => class",
        "= => sign",
        "any => identifier",
        "> => sign",
        "( => sign",
        "v => identifier",
        ": => sign",
        "T => class",
        ") => sign",
        "= => sign",
        "> => sign",
        "v => identifier",
      ]
    `)
  })
})

describe('tokenize - wrapped typescript generic arrow callback', () => {
  it('should not treat wrapped generic callbacks as jsx tags', () => {
    const input = '(<T, _>(x: T): T => x)'
    const actual = getTokensAsString(tokenize(input))
    expect(actual).toMatchInlineSnapshot(`
      [
        "( => sign",
        "< => sign",
        "T => class",
        ", => sign",
        "_ => identifier",
        "> => sign",
        "( => sign",
        "x => identifier",
        ": => sign",
        "T => class",
        ") => sign",
        ": => sign",
        "T => class",
        "= => sign",
        "> => sign",
        "x => identifier",
        ") => sign",
      ]
    `)
  })
})

describe('tokenize - identifier characters', () => {
  it.each(['$foo', '_foo', 'foo$bar', 'café', '变量', '𐐨name', 'e\u0301', 'a\u200cb'])('recognizes %s as an identifier', (name) => {
    const input = `const ${name} = 1; ${name}.value`
    const tokens = tokenize(input)
    expect(tokens.map(([, value]) => value).join('')).toBe(input)
    const actual = getTokensAsString(tokens)
    expect(actual.filter(value => value === `${name} => identifier`)).toHaveLength(2)
    expect(actual).toContain('value => property')
  })

  it('keeps uppercase names, numbers, and null in the class category', () => {
    expect(getTokensAsString(tokenize('Widget Éclair 123 null'))).toEqual([
      'Widget => class', 'Éclair => class', '123 => class', 'null => class',
    ])
  })

  it('recognizes prefixed JSX attributes', () => {
    const actual = getTokensAsString(tokenize('<Widget $value={_value} _flag />'))
    expect(actual).toContain('$value => property')
    expect(actual).toContain('_value => identifier')
    expect(actual).toContain('_flag => property')
  })
})
