import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as ruby from '../../lib/lang/ruby.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - Ruby preset', () => {
  it('highlights keywords, strings, and line comments', () => {
    const input = [
      'class Greeter',
      '  # Says hello',
      '  def greet(name)',
      '    puts "Hello, #{name}" if defined?(name)',
      '  end',
      'end',
    ].join('\n')
    const actual = getTokensAsString(tokenize(input, ruby))

    expect(actual).toContain('class => keyword')
    expect(actual).toContain('def => keyword')
    expect(actual).toContain('if => keyword')
    expect(actual).toContain('defined => keyword')
    expect(actual).toContain('"Hello, #{name}" => string')
    expect(actual).toContain('# Says hello => comment')
  })

  it('highlights block comments', () => {
    const input = '=begin\nDocumentation\n=end\nclass Greeter\nend'
    const actual = getTokensAsString(tokenize(input, ruby))

    expect(actual).toContain('=begin\nDocumentation\n=end => comment')
    expect(actual).toContain('class => keyword')
    expect(actual).toContain('end => keyword')
  })
})
