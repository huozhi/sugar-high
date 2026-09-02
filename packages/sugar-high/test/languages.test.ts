import { describe, expect, it } from 'vitest'
import { highlight } from 'sugar-high'
import * as core from 'sugar-high/core'
import { lang, languages } from 'sugar-high/lang'
import * as css from 'sugar-high/lang/css'
import * as json from 'sugar-high/lang/json'
import * as plaintext from 'sugar-high/lang/plaintext'
import * as python from 'sugar-high/lang/python'
import * as ruby from 'sugar-high/lang/ruby'
import { configs } from '../lib/presets/configs.js'
import { getTokensAsString } from './testing-utils'

const tokenize = (code, { lang }) =>
  core.tokenize(code, languages.find(({ id }) => id === lang)?.config)

describe('language registry', () => {
  it('keeps canonical configs aligned with public language metadata', () => {
    expect(Object.keys(configs)).toEqual(languages.map(({ id }) => id))
  })

  it.each(languages.map(({ id }) => id))('exports %s as an individual configuration', async (id) => {
    expect(Object.keys(await import(`sugar-high/lang/${id}`))).not.toHaveLength(0)
  })

  it('supports importing individual language configurations', () => {
    expect(core.render(core.parse('def run():', python))).toContain('sh__token--keyword')
    expect(core.render(core.parse('{"ready": true}', json))).toContain('sh__token--property')
    expect(core.render(core.parse('body { color: red; }', css))).toContain('sh__token--property')
    expect(core.render(core.parse('class Greeter', ruby))).toContain('sh__token--keyword')
    expect(core.parse('"plain" # text', plaintext).lines[0].tokens).toEqual([
      { type: 'identifier', value: '"plain" # text' },
    ])
  })

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
    ['xml', 'html'],
    ['yml', 'yaml'],
    ['mdx', 'markdown'],
    ['kts', 'kotlin'],
    ['pwsh', 'powershell'],
    ['docker', 'dockerfile'],
    ['gql', 'graphql'],
    ['terraform', 'hcl'],
    ['tf', 'hcl'],
    ['rb', 'ruby'],
    ['txt', 'plaintext'],
    ['text', 'plaintext'],
  ])('resolves %s to %s', (input, expected) => {
    expect(lang(input)).toBe(expected)
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
    expect(lang('jsonc')).toBe('json')
  })

  it('returns undefined for unknown languages', () => {
    expect(lang('not-a-language')).toBeUndefined()
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
    expect(lang('python')).toBe('python')
    expect(lang('py')).toBe('python')
  })

  it('disables JavaScript-only scanner modes for other languages', () => {
    const language = languages.find(({ id }) => id === lang('jsonc'))
    expect(language?.config).toMatchObject({
      jsx: false,
      regex: false,
      templateStrings: false,
    })
  })
})
