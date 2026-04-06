import { describe, expect, it } from 'vitest'
import { tokenize } from '..'
import { getTokensAsString } from './testing-utils'

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
        "_ => class",
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