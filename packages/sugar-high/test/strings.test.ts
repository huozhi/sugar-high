import { describe, expect, it } from 'vitest'
import { SugarHigh, tokenize } from '../lib/core.js'
import { configs } from '../lib/presets/configs.js'

const named = (code: string, lang: string) =>
  tokenize(code, configs[lang]).map(([type, value]) => [SugarHigh.TokenTypes[type], value])

// Each literal must stay one string token, and the code after it must not be a string.
const cases: Array<[lang: string, literal: string, after: string]> = [
  ['go', '`a"b // c`', 'x := 1'],
  ['go', '`a\\`', 'x := 1'],
  ['kotlin', '"""a\n"b\n"""', 'val y = 1'],
  ['kotlin', '"""a\\"""', 'val y = 1'],
  ['csharp', '@"a\\"', 'var y = 1;'],
  ['csharp', '@"say ""hi"""', 'var y = 1;'],
  ['csharp', '$@"a\\{x}"', 'var y = 1;'],
  ['csharp', '"""a "" b"""', 'var y = 1;'],
  ['csharp', '""""a """ b""""', 'var y = 1;'],
  ['python', '"""a"b"""', 'y = 1'],
  ["python", "'''a'b'''", 'y = 1'],
  ['java', '"""\na"b\n"""', 'int y = 1;'],
  ['swift', '"""\na"b\n"""', 'let y = 1'],
  ['swift', '#"a\\"b"#', 'let y = 1'],
  ['rust', 'r#"a"b"#', 'let y = 1;'],
  ['rust', 'r"a\\"', 'let y = 1;'],
  ['rust', 'br##"a"#b"##', 'let y = 1;'],
  ['rust', 'b"a\\"b"', 'let y = 1;'],
  ['cpp', 'R"(a"b)"', 'int y = 1;'],
  ['cpp', 'R"x(a)"b)x"', 'int y = 1;'],
  ['shell', "'a\\'", 'y=1'],
  ['sql', "'it''s'", 'select 1'],
  ['sql', "'C:\\'", 'select 1'],
  ['powershell', "'a\\'", '$y = 1'],
  ['powershell', '"a`"b"', '$y = 1'],
  ['powershell', '@"\na"b\n"@', '$y = 1'],
  ['toml', "'''x'y'''", 'b = 1'],
  ['toml', "'C:\\'", 'b = 1'],
  ['graphql', '"""a"b"""', 'type Q { x: Int }'],
  ['lua', '[==[a]]b]==]', 'local y = 1'],
]

describe('language string literals', () => {
  it.each(cases)('%s closes %j', (lang, literal, after) => {
    const code = `${literal}\n${after}`
    const tokens = named(code, lang)
    expect(tokens.map(([, value]) => value).join('')).toBe(code)
    expect(tokens).toContainEqual(['string', literal])
    const rest = tokens.slice(tokens.findIndex(([, value]) => value === '\n') + 1)
    expect(rest.filter(([type]) => type === 'string')).toEqual([])
  })

  it.each([
    ['go', '`open'],
    ['kotlin', '"""open'],
    ['rust', 'r#"open'],
    ['cpp', 'R"x(open'],
    ['lua', '[[open'],
  ])('%s keeps an unclosed literal to the end', (lang, code) => {
    expect(named(code, lang)).toEqual([['string', code]])
  })

  it('keeps Rust lifetimes and chars separate from strings', () => {
    const tokens = named("fn f<'a>(c: char) { 'z' }", 'rust')
    expect(tokens).not.toContainEqual(['string', "'a>(c: char) { '"])
  })

  it('does not read identifiers ending in a prefix as raw strings', () => {
    expect(named('bar"x"', 'rust')).toEqual([['identifier', 'bar'], ['string', '"x"']])
    expect(named('ToR"(x)"', 'cpp')[0]).toEqual(['class', 'ToR'])
  })
})
