import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { c } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - c preset', () => {
  it('classifies C keywords and keeps // comments as one token', () => {
    const input = 'int main(void) { return 0; } // ok\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain('int => keyword')
    expect(actual).toContain('return => keyword')
    expect(actual).toContain('// ok => comment')
  })

  it('supports block comments with C-like rules', () => {
    const input = '/* sum */\nstatic int total = 2;\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain('/* sum */ => comment')
    expect(actual).toContain('static => keyword')
  })
})
