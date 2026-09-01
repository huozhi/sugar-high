import { describe, expect, it } from 'vitest'
import { parse } from '../../lib/core.js'
import * as plaintext from '../../lib/lang/plaintext.js'

describe('tokenize - plaintext preset', () => {
  it('preserves lines without assigning syntax token types', () => {
    const input = 'A "quoted" value: true # still text\nAnother line'
    const parsed = parse(input, plaintext)

    expect(parsed.lines.map(({ value }) => value)).toEqual([
      'A "quoted" value: true # still text',
      'Another line',
    ])
    expect(
      new Set(
        parsed.lines.flatMap(({ tokens }) => tokens.map(({ type }) => type)),
      ),
    ).toEqual(new Set(['identifier']))
  })
})
