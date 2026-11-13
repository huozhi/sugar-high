import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as yaml from '../../lib/lang/yaml.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - yaml preset', () => {
  it('keeps apostrophes inside plain scalars from opening a string', () => {
    const actual = getTokensAsString(tokenize("message: don't stop\nnext: value\nowner: users' list\n", yaml))
    expect(actual).toContain("' => identifier")
    expect(actual).toContain('next => property')
    expect(actual).toContain('value => identifier')
    expect(actual.some(token => token.endsWith(' => string'))).toBe(false)
  })

  it('highlights plain keys as properties', () => {
    const actual = getTokensAsString(tokenize('name: web\nports:\n  - 80\nurl: http://host:80\n', yaml))
    expect(actual).toContain('name => property')
    expect(actual).toContain('ports => property')
    expect(actual).toContain('web => identifier')
    expect(actual).toContain('host => identifier')
  })

  it('highlights single-quoted scalars and escaped quotes', () => {
    const actual = getTokensAsString(tokenize("'key': 'value'\nlist: ['a', 'b']\nescaped: 'it''s'\nif: ${{ os == 'linux' }}\n", yaml))
    expect(actual).toContain("'key' => property")
    expect(actual).toContain("'value' => string")
    expect(actual).toContain("'a' => string")
    expect(actual).toContain("'it' => string")
    expect(actual).toContain("'s' => string")
    expect(actual).toContain("'linux' => string")
  })
})
