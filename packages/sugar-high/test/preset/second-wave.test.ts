import { describe, expect, it } from 'vitest'
import { tokenize } from '../..'
import type { LanguageName } from '../..'
import { getTokensAsString } from '../testing-utils'

const cases: Array<[LanguageName, string, string, string]> = [
  ['kotlin', 'data class User(val name: String)', 'data => keyword', 'String => class'],
  ['swift', 'struct User { let name: String }', 'struct => keyword', 'String => class'],
  ['php', '<?php readonly class User {}', 'readonly => keyword', 'class => keyword'],
  ['toml', 'enabled = true # rollout', 'true => keyword', '# rollout => comment'],
  ['powershell', 'FUNCTION Start-App { # run\n}', 'FUNCTION => keyword', '# run => comment'],
  ['dockerfile', 'FROM node\nRUN npm install', 'FROM => keyword', 'RUN => keyword'],
  ['graphql', 'type User { id: ID! }', 'type => keyword', 'ID => class'],
  ['hcl', 'enabled = true # rollout', 'true => keyword', '# rollout => comment'],
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
})
