import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as json from '../../lib/presets/lang/json.js'
import * as javascript from '../../lib/presets/lang/javascript.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - json preset', () => {
  it('supports JSONC comments in the canonical JSON preset', () => {
    const actual = getTokensAsString(tokenize('{\n  // note\n  "ok": true /* enabled */\n}', json))
    expect(actual).toContain('// note => comment')
    expect(actual).toContain('/* enabled */ => comment')
  })

  it('distinguishes quoted object keys from string values', () => {
    const input = '{"name": "Alice", "age": 30, "active": true, "other": null}'
    const actual = getTokensAsString(tokenize(input, json))

    expect(actual).toEqual([
      '{ => sign',
      '"name" => property',
      ': => sign',
      '"Alice" => string',
      ', => sign',
      '"age" => property',
      ': => sign',
      '30 => class',
      ', => sign',
      '"active" => property',
      ': => sign',
      'true => keyword',
      ', => sign',
      '"other" => property',
      ': => sign',
      'null => keyword',
      '} => sign',
    ])
  })

  it('supports nested and multiline JSON with whitespace before the colon', () => {
    const input = '{\n  "items": [{ "label"  : "one:two" }]\n}'
    const actual = getTokensAsString(tokenize(input, json))

    expect(actual.filter((token) => token.includes('=> property'))).toEqual([
      '"items" => property',
      '"label" => property',
    ])
    expect(actual).toContain('"one:two" => string')
  })

  it('handles an escaped quote inside a property key', () => {
    const actual = getTokensAsString(tokenize('{"a\\"b": 1}', json))

    expect(actual.filter((token) => token.includes('=> property'))).toEqual([
      '"a\\"b" => property',
    ])
  })

  it('does not change default JavaScript string classification', () => {
    const actual = getTokensAsString(tokenize('{"name": "Alice"}', javascript))

    expect(actual).not.toContain('name => property')
    expect(actual).toContain('" => string')
    expect(actual).toContain('name => string')
  })
})
