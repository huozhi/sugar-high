import { describe, expect, it } from 'vitest'
import { tokenize } from '../lib/core.js'
import * as typescript from '../lib/lang/typescript.js'
import { getTokensAsString } from './testing-utils'

describe('TypeScript generics surrounded by JSX', () => {
  it.each([
    ['const identity = <T,>(value: T) => value;', ['T => class', 'value => identifier']],
    ['const identity = <T extends { id: string }>(value: T) => value;', ['extends => keyword', 'string => keyword', 'value => identifier']],
    ['const values: Map<string, Array<number>> = new Map();', ['Map => class', 'string => keyword', 'Array => class', 'number => keyword']],
    ['<div>{identity<string>(value)}</div>', ['identity => identifier', 'string => keyword', 'value => identifier']],
    ['<Select<Item> value={selected} />', ['Select => entity', 'Item => class', 'value => property', 'selected => identifier']],
    ['<Widget render={<T,>(value: T) => value} />', ['render => property', 'T => class', 'value => identifier']],
    ['<div>{identity<"a>b">(value)}</div>', ['" => string', 'a>b => string', 'value => identifier']],
    ['const identity = <T extends (value: string) => number>(value: T) => value;', ['extends => keyword', 'string => keyword', 'number => keyword']],
    ['const identity = <T extends { id: string; active: boolean }>(value: T) => value;', ['string => keyword', 'boolean => keyword', 'value => identifier']],
    ['a < b; c > d;', ['a => identifier', 'b => identifier', 'c => identifier', 'd => identifier']],
  ])('keeps type syntax in JavaScript mode: %s', (snippet, expected) => {
    const input = snippet + '\nconst after = 1;'
    const tokens = tokenize(input, typescript)
    const actual = getTokensAsString(tokens)
    expect(tokens.map(([, value]) => value).join('')).toBe(input)
    for (const token of expected) expect(actual).toContain(token)
    expect(actual.slice(-5)).toEqual([
      'const => keyword', 'after => identifier', '= => sign', '1 => class', '; => sign',
    ])
  })
})
