import { describe, expect, it } from 'vitest'
import { tokenize } from '../../lib/core.js'
import * as rust from '../../lib/presets/lang/rust.js'
import { getTokensAsString } from '../testing-utils'

describe('tokenize - rust preset', () => {
  it('onQuote: lifetime in generics and char literal (no JS single-quote swallow)', () => {
    const actual = getTokensAsString(
      tokenize("F<'_>\nlet c='z';\n", rust)
    )
    expect(actual).toContain("'_ => identifier")
    expect(actual).toContain("'z' => identifier")
  })
})
