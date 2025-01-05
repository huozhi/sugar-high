import { describe, expect, it } from 'vitest'
import { tokenize } from '../lib/'
import { getTokensPairs } from './testing-utils'

describe('tokenize - customized keywords', () => {
  it('should tokenize the input string with the given keywords', () => {
    const input = 'def f(): return 1'
    const keywords = ['def', 'return']
    const actual = getTokensPairs(tokenize(input, keywords))
    expect(actual).toMatchInlineSnapshot(`
      [
        "def => identifier",
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
