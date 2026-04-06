import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { go } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - go preset', () => {
  it('classifies Go keywords and line comments', () => {
    const input = 'package main\nfunc add(a int, b int) int { return a + b } // done\n'
    const actual = getTokensAsString(tokenize(input, go))
    expect(actual).toContain('package => keyword')
    expect(actual).toContain('func => keyword')
    expect(actual).toContain('return => keyword')
    expect(actual).toContain('// done => comment')
  })
})
