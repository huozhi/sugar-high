import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as c from '../../lib/lang/c.js'
import * as cpp from '../../lib/lang/cpp.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - c preset', () => {
  it('classifies built-in types as class tokens and // comments as one token', () => {
    const input = 'int main() { return 0; } // ok\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain('int => class')
    expect(actual).toContain('return => keyword')
    expect(actual).toContain('// ok => comment')
  })

  it('highlights int in parameter list as a type', () => {
    const input = 'int sum(int a, int b) { return a + b; }\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual.filter((t) => t.startsWith('int =>'))).toEqual([
      'int => class',
      'int => class',
      'int => class',
    ])
  })

  it('keeps multi-line block comments open until */', () => {
    const input = `/*
 * Copyright (c) 2009-Present, Redis Ltd.
 * All rights reserved.
 */
static int total = 2;
`
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain(`/*
 * Copyright (c) 2009-Present, Redis Ltd.
 * All rights reserved.
 */ => comment`)
    expect(actual).toContain('static => keyword')
    expect(actual).toContain('int => class')
  })

  it.each([c, cpp])('highlights angle-bracket headers', (preset) => {
    const input = '#include <stdio.h> // io\n#include<sys/types.h>\n  #  include <vector>\n#include "local.h"\n'
    const actual = getTokensAsString(tokenize(input, preset))
    expect(actual).toContain('include => identifier')
    expect(actual).toContain('<stdio.h> => string')
    expect(actual).toContain('<sys/types.h> => string')
    expect(actual).toContain('<vector> => string')
    expect(actual).toContain('"local.h" => string')
  })

  it.each([c, cpp])('keeps include as an ordinary identifier', (preset) => {
    const actual = getTokensAsString(tokenize('int include = 0; return include;', preset))
    expect(actual.filter(token => token.startsWith('include =>'))).toEqual([
      'include => identifier',
      'include => identifier',
    ])
  })

  it('keeps comparisons outside include directives as signs', () => {
    const input = 'int x = a < b && c > d; // <not.h>\nif (n<max) return include;\n'
    const actual = getTokensAsString(tokenize(input, c))
    expect(actual).toContain('< => sign')
    expect(actual).toContain('> => sign')
    expect(actual.some(token => token.endsWith(' => string'))).toBe(false)
  })
})
