import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { css } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - css preset', () => {
  it('keeps @rules tokenized and /* */ as comment', () => {
    const input = '@media screen { color: red; } /* note */\n'
    const actual = getTokensAsString(tokenize(input, css))
    expect(actual).toContain('@ => sign')
    expect(actual).toContain('media => identifier')
    expect(actual).toContain('/* note */ => comment')
  })
})
