import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { python } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - python preset', () => {
  it('treats # to EOL as one comment, including apostrophes (minimal regression)', () => {
    // Without python rules, `#` is a sign and `'` in "isn't" starts a string through newline.
    const input = 'pass  # isn\'t\n'
    const actual = getTokensAsString(tokenize(input, python))
    expect(actual).toEqual(['pass => keyword', "# isn't => comment"])
  })

  it('inline comment after != and quoted list (urllib3 compatibility line, shortened)', () => {
    const input =
      'assert x != ["dev"]  # Verify urllib3 isn\'t installed from git.\n'
    const actual = getTokensAsString(tokenize(input, python))
    expect(actual).toEqual([
      'assert => keyword',
      'x => identifier',
      '! => sign',
      '= => sign',
      '[ => sign',
      '" => string',
      'dev => string',
      '" => string',
      '] => sign',
      "# Verify urllib3 isn't installed from git. => comment",
    ])
  })

  it('classifies python keywords from the preset set', () => {
    const input = 'def f(): return None'
    const actual = getTokensAsString(tokenize(input, python))
    expect(actual).toEqual([
      'def => keyword',
      'f => identifier',
      '( => sign',
      ') => sign',
      ': => sign',
      'return => keyword',
      'None => class',
    ])
  })
})
