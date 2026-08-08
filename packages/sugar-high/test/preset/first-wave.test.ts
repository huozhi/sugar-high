import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { getTokensAsString } from '../testing-utils'

describe('first-wave language presets', () => {
  it('highlights the canonical shell language and hash comments', () => {
    const actual = getTokensAsString(tokenize('if test -f file; then # found\n  echo yes\nfi', {
      lang: 'shell',
    }))
    expect(actual).toContain('if => keyword')
    expect(actual).toContain('then => keyword')
    expect(actual).toContain('# found => comment')
    expect(actual).toContain('fi => keyword')
  })

  it('highlights C++ keywords and built-in types', () => {
    const actual = getTokensAsString(tokenize('template <typename T> class Box { public: T value; };', {
      lang: 'cpp',
    }))
    expect(actual).toContain('template => keyword')
    expect(actual).toContain('typename => keyword')
    expect(actual).toContain('class => keyword')
    expect(actual).toContain('public => keyword')
  })

  it('highlights C# keywords and built-in types', () => {
    const actual = getTokensAsString(tokenize('public record User(string Name);', {
      lang: 'csharp',
    }))
    expect(actual).toContain('public => keyword')
    expect(actual).toContain('record => keyword')
    expect(actual).toContain('string => class')
  })

  it('highlights SQL keywords and comments', () => {
    const actual = getTokensAsString(tokenize('SELECT id FROM users WHERE active = true; -- enabled', {
      lang: 'sql',
    }))
    expect(actual).toContain('SELECT => keyword')
    expect(actual).toContain('FROM => keyword')
    expect(actual).toContain('WHERE => keyword')
    expect(actual).toContain('-- enabled => comment')
  })

  it('highlights HTML tags, attributes, and comments', () => {
    const actual = getTokensAsString(tokenize('<!-- note -->\n<section aria-label="Hi">Hello</section>', {
      lang: 'html',
    }))
    expect(actual).toContain('<!-- note --> => comment')
    expect(actual).toContain('section => entity')
    expect(actual).toContain('aria-label => property')
  })

  it('highlights YAML values and hash comments', () => {
    const actual = getTokensAsString(tokenize('enabled: true # rollout\nmissing: null', {
      lang: 'yaml',
    }))
    expect(actual).toContain('true => keyword')
    expect(actual).toContain('# rollout => comment')
    expect(actual).toContain('null => keyword')
  })

  it('adds semantic line classes to Markdown', () => {
    const html = tokenize('# Title\n- one\n> quote', { lang: 'markdown' })
    // Tokenization remains source-preserving; line semantics are applied during generation.
    expect(html.map(([, value]) => value).join('')).toBe('# Title\n- one\n> quote')
  })
})
