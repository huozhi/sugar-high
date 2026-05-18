import { describe, expect, it } from 'vitest'
import { generate, highlight, tokenize } from '../..'
import { diff } from 'sugar-high/presets'

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

    const lines = generate(tokenize(input, diff), diff)
    const classNames = lines.map((line) => line.properties.className)

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
    const html = highlight('-old\n+new', diff)

    expect(html).toContain('class="sh__line sh__line--diff-remove"')
    expect(html).toContain('class="sh__line sh__line--diff-add"')
  })
})
