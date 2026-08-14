import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as css from '../../lib/presets/lang/css.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - css preset', () => {
  it('keeps @rules tokenized and /* */ as comment', () => {
    const input = '@media screen { color: red; } /* note */\n'
    const actual = getTokensAsString(tokenize(input, css))
    expect(actual).toContain('@ => sign')
    expect(actual).toContain('media => identifier')
    expect(actual).toContain('/* note */ => comment')
  })

  it('keeps CSS hex colors together regardless of their first digit', () => {
    const input = 'a { color: #fff; color: #abcd; color: #abcdef; color: #abcdef80; color: #12345678; }'
    const actual = getTokensAsString(tokenize(input, css))

    for (const color of ['#fff', '#abcd', '#abcdef', '#abcdef80', '#12345678']) {
      expect(actual).toContain(`${color} => string`)
    }
  })

  it('does not consume invalid hex lengths or identifier-like hashes', () => {
    const input = 'a { color: #ff; color: #fffff; color: #fffffff; color: #fffffffff; } #face-value {}'
    const actual = tokenize(input, css).map(([, value]) => value)

    for (const value of ['#ff', '#fffff', '#fffffff', '#fffffffff', '#face-value']) {
      expect(actual).not.toContain(value)
    }
  })

  it('classifies declaration names as properties', () => {
    const input = `body {
  background: #000;
  display: none;
  visibility: hidden;
  height: calc(var(--deathDate) - var(--birthDate));
  font-family: "Transylvania";
  opacity: 0;
  --accent-color: #ff79c6;
}`
    const actual = getTokensAsString(tokenize(input, css))

    for (const property of [
      'background',
      'display',
      'visibility',
      'height',
      'font-family',
      'opacity',
      '--accent-color',
    ]) {
      expect(actual).toContain(`${property} => property`)
    }
    expect(actual).toContain('#000 => string')
    expect(actual).toContain('#ff79c6 => string')
  })

  it('does not classify selectors and custom-property references as properties', () => {
    const input = `a:hover, #dracula {
  color: var(--accent-color);
  &::before { content: ""; }
}`
    const actual = getTokensAsString(tokenize(input, css))

    expect(actual).not.toContain('hover => property')
    expect(actual).not.toContain('dracula => property')
    expect(actual).not.toContain('accent => property')
    expect(actual).toContain('color => property')
    expect(actual).toContain('content => property')
  })
})
