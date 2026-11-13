import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as rust from '../../lib/lang/rust.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - rust preset', () => {
  it('onQuote: lifetime in generics and char literal (no JS single-quote swallow)', () => {
    const actual = getTokensAsString(
      tokenize("F<'_>\nlet c='z';\n", rust)
    )
    expect(actual).toContain("'_ => identifier")
    expect(actual).toContain("'z' => identifier")
  })

  it('highlights line, doc, and block comments', () => {
    const actual = getTokensAsString(
      tokenize('/// Docs\nfn main() { // note\n  let a = 1; /* block\n  comment */\n}\n', rust)
    )
    expect(actual).toContain('/// Docs => comment')
    expect(actual).toContain('// note => comment')
    expect(actual).toContain('/* block\n  comment */ => comment')
    expect(actual).toContain('fn => keyword')
  })

  it('does not classify range bounds as properties', () => {
    const actual = getTokensAsString(tokenize('for i in 0..len { v.push(i) }\nlet r = start..=end;', rust))
    expect(actual).toContain('len => identifier')
    expect(actual).toContain('end => identifier')
    expect(actual).toContain('push => property')
  })
})
