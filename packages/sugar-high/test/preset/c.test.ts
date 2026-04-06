import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { c } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - c preset', () => {
  it('classifies built-in types as class tokens and // comments as one token', () => {
    const input = 'int main() { return 0; } // ok\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain('int => class')
    expect(actual).toContain('return => keyword')
    expect(actual).toContain('// ok => comment')
  })

  it('highlights int in parameter list as a type', () => {
    const input = 'int sum(int a, int b) { return a + b; }\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual.filter((t) => t.startsWith('int =>'))).toEqual([
      'int => class',
      'int => class',
      'int => class',
    ])
  })

  it('supports block comments with C-like rules', () => {
    const input = '/* sum */\nstatic int total = 2;\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain('/* sum */ => comment')
    expect(actual).toContain('static => keyword')
    expect(actual).toContain('int => class')
  })
})
