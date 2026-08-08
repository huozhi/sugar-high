import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { json } from 'sugar-high/presets'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - json preset', () => {
  it('distinguishes quoted object keys from string values', () => {
    const input = '{"name": "Alice", "age": 30, "active": true, "other": null}'
    const actual = getTokensAsString(tokenize(input, json))

    expect(actual).toEqual([
      '{ => sign',
      '" => property',
      'name => property',
      '" => property',
      ': => sign',
      '" => string',
      'Alice => string',
      '" => string',
      ', => sign',
      '" => property',
      'age => property',
      '" => property',
      ': => sign',
      '30 => class',
      ', => sign',
      '" => property',
      'active => property',
      '" => property',
      ': => sign',
      'true => keyword',
      ', => sign',
      '" => property',
      'other => property',
      '" => property',
      ': => sign',
      'null => keyword',
      '} => sign',
    ])
  })

  it('supports nested and multiline JSON with whitespace before the colon', () => {
    const input = '{\n  "items": [{ "label"  : "one:two" }]\n}'
    const actual = getTokensAsString(tokenize(input, json))

    expect(actual.filter((token) => token.includes('=> property'))).toEqual([
      '" => property',
      'items => property',
      '" => property',
      '" => property',
      'label => property',
      '" => property',
    ])
    expect(actual).toContain('one:two => string')
  })

  it('handles an escaped quote inside a property key', () => {
    const actual = getTokensAsString(tokenize('{"a\\"b": 1}', json))

    expect(actual.filter((token) => token.includes('=> property'))).toEqual([
      '" => property',
      'a\\ => property',
      '" => property',
      'b => property',
      '" => property',
    ])
  })

  it('does not change default JavaScript string classification', () => {
    const actual = getTokensAsString(tokenize('{"name": "Alice"}'))

    expect(actual).not.toContain('name => property')
    expect(actual).toContain('name => string')
  })
})
