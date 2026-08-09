import { describe, expect, it } from 'vitest'
import { highlight } from '../..'
import { generate, parse } from '../../lib/core.js'
import * as diff from '../../lib/presets/lang/diff.js'

describe('diff preset', () => {
  it('adds line classes for simple line diffs', () => {
    const input = [
      'diff --git a/a.js b/a.js',
      'index 1111111..2222222 100644',
      '--- a/a.js',
      '+++ b/a.js',
      '@@ -1,3 +1,3 @@',
      ' const a = 1',
      '-const oldValue = true',
      '+const newValue = true',
    ].join('\n')

    const parsed = parse(input, diff)
    const lines = generate(parsed)
    const classNames = lines.map((line) => line.properties.className)

    expect(parsed.lines[6].annotations).toEqual(['diff-remove'])
    expect(parsed.lines[7].annotations).toEqual(['diff-add'])

    expect(classNames).toEqual([
      'sh__line sh__line--diff-meta',
      'sh__line sh__line--diff-meta',
      'sh__line sh__line--diff-meta',
      'sh__line sh__line--diff-meta',
      'sh__line sh__line--diff-hunk',
      'sh__line',
      'sh__line sh__line--diff-remove',
      'sh__line sh__line--diff-add',
    ])
  })

  it('includes diff line classes in highlighted HTML', () => {
    const html = highlight('-old\n+new', { lang: 'diff' })

    expect(html).toContain('class="sh__line sh__line--diff-remove"')
    expect(html).toContain('class="sh__line sh__line--diff-add"')
  })

  it('does not highlight filename extensions in metadata', () => {
    const parsed = parse([
      'diff --git a/src/index.tsx b/src/index.tsx',
      '--- a/theme.css',
      '+++ b/theme.css',
      '+const value = data.name',
    ].join('\n'), diff)

    for (const line of parsed.lines.slice(0, 3)) {
      expect(line.tokens.filter(token => ['tsx', 'css'].includes(token.value)))
        .toEqual(expect.arrayContaining([
          expect.objectContaining({ type: 'identifier' }),
        ]))
      expect(line.tokens.some(token => token.type === 'property')).toBe(false)
    }

    expect(parsed.lines[3].tokens).toContainEqual({ type: 'property', value: 'name' })
  })
})
