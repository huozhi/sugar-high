import { describe, expect, it } from 'vitest'
import { highlight, tokenize } from 'sugar-high'
import {
  getCanonicalLanguage,
  getLanguage,
  languages,
  resolveLanguage,
} from 'sugar-high/languages'
import { getTokensAsString } from './testing-utils'

describe('language registry', () => {
  it.each([
    ['javascript', 'javascript'],
    ['js', 'javascript'],
    ['.js', 'javascript'],
    ['jsx', 'javascript'],
    ['ts', 'typescript'],
    ['tsx', 'typescript'],
    ['py', 'python'],
    ['python3', 'python'],
    ['rs', 'rust'],
    ['jsonc', 'json'],
    ['patch', 'diff'],
    ['bash', 'shell'],
    ['.sh', 'shell'],
    ['c++', 'cpp'],
    ['cs', 'csharp'],
  ])('resolves %s to %s', (input, expected) => {
    expect(resolveLanguage(input)).toBe(expected)
  })

  it('uses exactly one preferred extension per canonical language', () => {
    const ids = new Set<string>()
    const extensions = new Set<string>()

    for (const language of languages) {
      expect(ids.has(language.id)).toBe(false)
      expect(extensions.has(language.extension)).toBe(false)
      expect(language.extension).not.toMatch(/^\./)
      ids.add(language.id)
      extensions.add(language.extension)
    }
  })

  it('returns the canonical definition for an alias', () => {
    const language = getLanguage('jsonc')
    expect(language?.id).toBe('json')
    expect(language?.extension).toBe('json')
    expect(language?.config?.quotedKeys).toBe(true)
  })

  it('returns undefined for unknown languages', () => {
    expect(resolveLanguage('not-a-language')).toBeUndefined()
  })

  it('configures tokenization using a canonical lang', () => {
    const actual = getTokensAsString(tokenize('# note\ndef run():', { lang: 'python' }))

    expect(actual).toContain('# note => comment')
    expect(actual).toContain('def => keyword')
  })

  it('applies preset generation options selected by language', () => {
    expect(highlight('-old\n+new', { lang: 'diff' }))
      .toContain('sh__line sh__line--diff-remove')
  })

  it('keeps aliases out of the canonical direct API', () => {
    expect(getCanonicalLanguage('python')?.id).toBe('python')
    expect(getCanonicalLanguage('py')).toBeUndefined()
    expect(resolveLanguage('py')).toBe('python')
  })

  it('disables JavaScript-only scanner modes for other languages', () => {
    const language = getLanguage('jsonc')
    expect(language?.config).toMatchObject({
      jsx: false,
      regex: false,
      templateStrings: false,
    })
  })
})
