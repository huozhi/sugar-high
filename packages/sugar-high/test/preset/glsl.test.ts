import { describe, expect, it } from 'vitest'
import { highlight } from '../../lib/index.js'
import { lang } from '../../lib/lang.js'
import { tokenize } from '../../lib/core.js'
import * as glsl from '../../lib/lang/glsl.js'
import { getTokensAsString } from '../testing-utils'

describe('GLSL preset', () => {
  it('highlights GLSL qualifiers, built-in types, and C-style comments', () => {
    const source = 'layout(location = 0) in vec3 position; // vertex\nuniform mat4 projection;\nsampler2D tex;'
    const actual = getTokensAsString(tokenize(source, glsl))

    expect(actual).toContain('layout => keyword')
    expect(actual).toContain('in => keyword')
    expect(actual).toContain('uniform => keyword')
    expect(actual).toContain('vec3 => class')
    expect(actual).toContain('mat4 => class')
    expect(actual).toContain('sampler2D => class')
    expect(actual).toContain('// vertex => comment')
    expect(highlight(source, { lang: 'glsl' })).toContain('sh__token--class')
  })

  it('keeps project-specific types in a copied configuration', () => {
    const shader = {
      ...glsl,
      typeKeywords: new Set([...glsl.typeKeywords, 'customvec']),
    }
    expect(getTokensAsString(tokenize('customvec color;', shader))).toContain('customvec => class')
    expect(getTokensAsString(tokenize('customvec color;', glsl))).toContain('customvec => identifier')
  })

  it.each(['glsl', '.vert', 'frag', 'geom', 'tesc', 'tese', 'comp'])(
    'resolves %s to the GLSL preset', (extension) => {
      expect(lang(extension)).toBe('glsl')
    },
  )
})
