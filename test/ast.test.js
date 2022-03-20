import { describe, expect, it } from 'vitest'
import { tokenize, types } from '../lib'

function getTypeName(token) {
  return types[token[0]]
}

function getTokenValues(tokens) {
  return tokens.map((tk) => tk[1])
}

function getTokenTypes(tokens) {
  return tokens.map((tk) => getTypeName(tk))
}

function getNonSpacesTokensTypes(tokens) {
  return getTokenTypes(tokens).filter(type => type !== 'space')
}

function mergeSpaces(str) {  
  return str.trim().replace(/^[\s]{2,}$/g, ' ')
}

function filterSpaces(arr) {
  return arr
    .map(t => mergeSpaces(t))
    .filter(Boolean)
}

function getNonSpacesTokens(tokens) {
  return filterSpaces(getTokenValues(tokens))
}

describe('calculation expression', () => {
  it('basic inline calculation expression', () => {
    const tokens = tokenize(`123 - /555/ + 444;`)
    expect(getTokenTypes(tokens)).toEqual([
      'class', 'space', 'sign', 'space', 'string', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getTokenValues(tokens)).toEqual([
      '123', ' ', '-', ' ', '/555/', ' ', '+', ' ', '444', ';'
    ])
    
  })

  it('calculation with comments', () => {
    const tokens = tokenize(`/* evaluate */ (19) / 234 + 56 / 7;`)
    expect(getNonSpacesTokensTypes(tokens)).toEqual([
      'comment', 'sign', 'class', 'sign', 'sign', 'class', 'sign', 'class', 'sign', 'class', 'sign',
    ])
    expect(getNonSpacesTokens(tokens)).toEqual([
      '/* evaluate */', '(', '19', ')', '/', '234', '+', '56', '/', '7', ';',
    ])
  })
  
  it('calculation with defs', () => {
    const tokens = tokenize(`const _iu = (19) / 234 + 56 / 7;`)
    expect(getNonSpacesTokens(tokens)).toEqual([
      'const', '_iu', '=', '(', '19', ')', '/', '234', '+', '56', '/', '7', ';',
    ])
    expect(getNonSpacesTokensTypes(tokens)).toEqual([
      "keyword", "class", "sign", "sign", "class", "sign", "sign", 
      "class", "sign", "class", "sign", "class", "sign",
    ])
  })
})

describe('jsx', () => {
  it('parse jsx compositions', () => {
    const tokens = tokenize(`// jsx
    const element = (
      <>
        <Food
          season={{
            sault: <p a={[{}]} />
          }}>
        </Food>
        {/* jsx comment */}
        <h1 className="title" data-title="true">
          Read more{' '}
          <Link href="/posts/first-post">
            <a>this page! - {Date.now()}</a>
          </Link>
        </h1>
      </>
    )`)
    expect(getNonSpacesTokens(tokens)).toEqual([
      "// jsx", "const", "element", "=", "(", "<", ">", "<", "Food", "season", "=", "{", "{", "sault", 
      ":", "<", "p", "a", "=", "{", "[", "{", "}", "]", "}", "/>", "}", "}", ">", "</", "Food", ">", "{", 
      "/* jsx comment */", "}", "<", "h1", "className", "=", '"title"', "data", "-", "title", "=", '"true"', 
      ">", "Read more", "{", "' '", "}", "<", "Link", "href", "=", '"/posts/first-post"', ">", "<", "a", ">", 
      "this page! -", "{", "Date", ".", "now", "(", ")", "}", "</", "a", ">", "</", "Link", ">", "</", "h1", ">", 
      "</", ">", ")",
    ])

    const jsxPropertyNameToken = tokens.find(tk => mergeSpaces(tk[1]) === 'className')
    expect(getTypeName(jsxPropertyNameToken)).toBe('identifier')

    const jsxPropertyValueToken = tokens.find(tk => mergeSpaces(tk[1]) === '"title"')
    expect(getTypeName(jsxPropertyValueToken)).toBe('string')

    const jsChildrenTextToken = tokens.find(tk => mergeSpaces(tk[1]) === 'Read more')
    expect(getTypeName(jsChildrenTextToken)).toBe('jsxliterals')
  })
})

describe('comments', () => {
  it('basic inline comments', () => {
    const code = `// This is a inline comment / <- a slash`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      '// This is a inline comment / <- a slash',
    ])
  })

  it('multiple slashes started inline comments', () => {
    const code = `/// <reference path="..." /> // reference comment`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      '/// <reference path="..." /> // reference comment',
    ])
  })

  it('multi-line comments', () => {
    const code = `/* This is another comment */ alert('good') // <- alerts`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      "/* This is another comment */",
      "alert",
      "(",
      "'good'",
      ")",
      "// <- alerts",
    ])
  })
})

describe('string & regex', () => {
  it('basic regex', () => {
    const reg1 = '/^\\/[0-5]\\/$/'
    const reg2 = `/^\\w+[a-z0-9]/ig`
    
    expect(getNonSpacesTokens(tokenize(reg1))).toEqual([
      '/^\\/[0-5]\\/$/',
    ])
    expect(getNonSpacesTokens(tokenize(reg2))).toEqual([
      '/^\\w+[a-z0-9]/ig',
    ])
  })

  it('regex plus operators', () => {
    const code = `/^\\/[0-5]\\/$/ + /^\\/\w+\\/$/gi`
    expect(getNonSpacesTokens(tokenize(code))).toEqual([
      '/^\\/[0-5]\\/$/', '+', '/^\\/\w+\\/$/gi',
    ])
  })

  it('multi line regex tests', () => {
    const code1 = 
      `/reg/.test('str')[]\n` +
      `/reg/.test('str')`

    // '[]' consider as a end of the expression
    expect(getNonSpacesTokensTypes(tokenize(code1))).toEqual([
      'string',
      'sign',
      'identifier',
      'sign',
      'string',
      'sign',
      'sign',
      'sign',
      'break',
      'string',
      'sign',
      'identifier',
      'sign',
      'string',
      'sign',
    ])

    const code2 = 
      `/reg/.test('str')()\n` +
      `/reg/.test('str')`

    // what before '()' still considers as an expression
    expect(getNonSpacesTokensTypes(tokenize(code2))).toEqual([
      'string',
      'sign',
      'identifier',
      'sign',
      'string',
      'sign',
      'sign',
      'sign',
      'break',
      'sign',
      'identifier',
      'sign',
      'identifier',
      'sign',
      'string',
      'sign',
    ])
  })

  it('import string', () => {
    const code = `import mod from "../../mod"`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      'import', 'mod', 'from', '"../../mod"',
    ])
  })
})
