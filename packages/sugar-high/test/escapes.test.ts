import { describe, expect, it } from 'vitest'
import { tokenize, SugarHigh } from '../lib/core.js'
import * as javascript from '../lib/lang/javascript.js'

const named = (code, options) => tokenize(code, options).map(([type, value]) => [SugarHigh.TokenTypes[type], value])

describe.each([['core', {}], ['javascript', javascript]])('%s string escapes', (_, options) => {
  it.each(['"', "'"])('closes %s strings after even backslash runs', (quote) => {
    for (const count of [2, 4, 6]) {
      const code = `${quote}text${'\\'.repeat(count)}${quote}; after`
      const tokens = named(code, options)
      expect(tokens.map(([, value]) => value).join('')).toBe(code)
      expect(tokens).toContainEqual(['sign', ';'])
      expect(tokens).toContainEqual(['identifier', 'after'])
    }
  })

  it.each(['"', "'"])('keeps escaped %s quotes inside strings', (quote) => {
    for (const count of [1, 3, 5]) {
      const code = `${quote}text${'\\'.repeat(count)}${quote}; inside${quote}; after`
      const tokens = named(code, options)
      expect(tokens.map(([, value]) => value).join('')).toBe(code)
      expect(tokens.filter(([type]) => type === 'sign')).toEqual([['sign', ';']])
      expect(tokens).toContainEqual(['identifier', 'after'])
    }
  })

  it('preserves a trailing backslash in an unfinished string', () => {
    const code = '"unfinished\\'
    const tokens = named(code, options)
    expect(tokens.map(([, value]) => value).join('')).toBe(code)
    expect(tokens.every(([type]) => type === 'string')).toBe(true)
  })
})

describe('javascript template and regex escapes', () => {
  it('keeps escaped backticks and interpolation openers literal', () => {
    const code = '`a\\`b \\${literal} ${value}`; after'
    const tokens = named(code, javascript)
    expect(tokens.map(([, value]) => value).join('')).toBe(code)
    expect(tokens).toContainEqual(['string', 'a\\`b \\${literal} '])
    expect(tokens).toContainEqual(['identifier', 'value'])
    expect(tokens).toContainEqual(['identifier', 'after'])
  })

  it('does not scan a regex across an escaped newline', () => {
    const code = '/unfinished' + '\\' + '\n; after / tail'
    const tokens = named(code, javascript)
    expect(tokens).toContainEqual(['identifier', 'after'])
    expect(tokens.some(([type, value]) => type === 'string' && value.includes('after'))).toBe(false)
  })

  it('closes templates after paired backslashes', () => {
    const tokens = named('`a\\\\`; after', javascript)
    expect(tokens).toContainEqual(['sign', ';'])
    expect(tokens).toContainEqual(['identifier', 'after'])
  })

  it.each([String.raw`/foo\\/g`, String.raw`/[\\]/g`, String.raw`/[\/]foo/g`, String.raw`/foo\//g`])('scans %s without consuming following code', (literal) => {
    const code = `const pattern = ${literal}; after`
    const tokens = named(code, javascript)
    expect(tokens.map(([, value]) => value).join('')).toBe(code)
    expect(tokens).toContainEqual(['string', literal])
    expect(tokens).toContainEqual(['sign', ';'])
    expect(tokens).toContainEqual(['identifier', 'after'])
  })
})
