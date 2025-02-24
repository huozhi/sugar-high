import { describe, expect, it } from 'vitest'
import { tokenize } from '..'
import { getTokensAsString } from './testing-utils'

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