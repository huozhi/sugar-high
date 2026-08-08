import { describe, expect, it } from 'vitest'
import { highlight as highlightBuiltin } from 'sugar-high'
import { highlight as highlightCore, tokenize } from 'sugar-high/core'
import { javascript, python, typescript } from '../lib/presets/index.js'

describe('composable core export', () => {
  it('composes a selected preset without the built-in registry API', () => {
    const source = '# note\ndef greet(name):\n  return "Hi " + name'
    expect(highlightCore(source, python)).toBe(
      highlightBuiltin(source, { lang: 'python' })
    )
  })

  it('retains the JavaScript defaults when no preset is supplied', () => {
    const source = 'const answer = 42'
    expect(tokenize(source).map(([, value]) => value).join('')).toBe(source)
  })

  it('composes JavaScript with JSX as one preset', () => {
    const source = 'const view = <Button aria-label="Save">Save</Button>'
    expect(highlightCore(source, javascript)).toBe(
      highlightBuiltin(source, { lang: 'javascript' })
    )
  })

  it('composes TypeScript with TSX as one preset', () => {
    const source = 'interface Props { label: string }\nconst View = (p: Props) => <div>{p.label}</div>'
    expect(highlightCore(source, typescript)).toBe(
      highlightBuiltin(source, { lang: 'typescript' })
    )
  })
})
