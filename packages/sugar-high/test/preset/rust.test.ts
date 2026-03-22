import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import { rust } from 'sugar-high/presets'
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
