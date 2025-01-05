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
