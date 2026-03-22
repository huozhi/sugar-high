import { describe, expect, it } from 'vitest'
import { tokenize } from '..'
import { rust } from 'sugar-high/presets'
import { getTokensAsString } from './testing-utils'

describe('tokenize - rust preset', () => {
  it('does not treat lifetime in generic as a string (TryGetError fmt)', () => {
    const input = `impl core::fmt::Display for TryGetError {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> Result<(), core::fmt::Error> {
        write!(
            f,
            "Not enough bytes remaining in buffer to read value (requested {} but only {} available)",
            self.requested,
            self.available
        )
    }
}`
    const actual = getTokensAsString(tokenize(input, rust))
    expect(actual).toContain("'_ => identifier")
    expect(actual.some((t) => t.includes("'_>)") && t.includes('string'))).toBe(
      false
    )
  })

  it('tokenizes lifetime underscore and char literal', () => {
    const input = "fn x(_: Formatter<'_>) { let c = 'z'; }\n"
    const actual = getTokensAsString(tokenize(input, rust))
    expect(actual).toContain("'_ => identifier")
    expect(actual).toContain("'z' => identifier")
  })
})
