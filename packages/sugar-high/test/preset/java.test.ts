import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { java } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - java preset', () => {
  it('classifies Java keywords and block comments', () => {
    const input = '/* app */\npublic class App { static void main(String[] args) { return; } }\n'
    const actual = getTokensAsString(tokenize(input, java))
    expect(actual).toContain('/* app */ => comment')
    expect(actual).toContain('public => keyword')
    expect(actual).toContain('class => keyword')
    expect(actual).toContain('static => keyword')
    expect(actual).toContain('void => class')
    expect(actual).toContain('String => class')
    expect(actual).toContain('return => keyword')
  })
})
