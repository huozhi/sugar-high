import { describe, expect, it } from 'vitest'
import type { LanguageName } from '../..'
import * as core from '../../lib/core.js'
import { languages } from '../../lib/lang.js'
import { getTokensAsString } from '../testing-utils'

const tokenize = (code, { lang }) =>
  core.tokenize(code, languages.find(({ id }) => id === lang)?.config)

const cases: Array<[LanguageName, string, string, string]> = [
  ['kotlin', 'data class User(val name: String)', 'data => keyword', 'String => class'],
  ['swift', 'struct User { let name: String }', 'struct => keyword', 'String => class'],
  ['php', '<?php readonly class User {}', 'readonly => keyword', 'class => keyword'],
  ['toml', 'enabled = true # rollout', 'true => keyword', '# rollout => comment'],
  ['powershell', 'FUNCTION Start-App { # run\n}', 'FUNCTION => keyword', '# run => comment'],
  ['dockerfile', 'FROM node\nRUN npm install', 'FROM => keyword', 'RUN => keyword'],
  ['graphql', 'type User { id: ID! }', 'type => keyword', 'ID => class'],
  ['hcl', 'enabled = true # rollout', 'true => keyword', '# rollout => comment'],
  ['zig', 'const answer: u32 = 42; // result', 'const => keyword', 'u32 => class'],
  ['lua', 'local ready = true -- status', 'local => keyword', '-- status => comment'],
]

describe('second-wave language presets', () => {
  it.each(cases)('highlights %s', (lang, source, first, second) => {
    const actual = getTokensAsString(tokenize(source, { lang }))
    expect(actual).toContain(first)
    expect(actual).toContain(second)
  })

  it('supports PowerShell block comments', () => {
    const actual = getTokensAsString(tokenize('<# note #>\nfunction Test {}', {
      lang: 'powershell',
    }))
    expect(actual).toContain('<# note #> => comment')
  })

  it('supports Lua long comments and strings', () => {
    const actual = getTokensAsString(tokenize('--[=[ ignore ]] until ]=]\nlocal value = [==[text]==]', {
      lang: 'lua',
    }))
    expect(actual).toContain('--[=[ ignore ]] until ]=] => comment')
    expect(actual).toContain('[==[text]==] => string')
  })

  it('supports Zig multiline string lines', () => {
    const actual = getTokensAsString(tokenize('const text =\n    \\\\first line\n    \\\\second line;', {
      lang: 'zig',
    }))
    expect(actual).toContain('\\\\first line => string')
    expect(actual).toContain('\\\\second line; => string')
  })
})
