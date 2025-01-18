import { describe, expect, it } from 'vitest'
import { tokenize } from '../lib'
import {
  getTokensAsString,
} from './testing-utils'

describe('function calls', () => {
  it('dot catch should not be determined as keyword', () => {
    const code = `promise.catch(log)`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "promise => identifier",
        ". => sign",
        "catch => identifier",
        "( => sign",
        "log => identifier",
        ") => sign",
      ]
    `)
  })
})

describe('calculation expression', () => {
  it('basic inline calculation expression', () => {
    const code = `123 - /555/ + 444;`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "123 => class",
        "- => sign",
        "/555/ => string",
        "+ => sign",
        "444 => class",
        "; => sign",
      ]
    `)
  })

  it('calculation with comments', () => {
    const code = `/* evaluate */ (19) / 234 + 56 / 7;`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "/* evaluate */ => comment",
        "( => sign",
        "19 => class",
        ") => sign",
        "/ => sign",
        "234 => class",
        "+ => sign",
        "56 => class",
        "/ => sign",
        "7 => class",
        "; => sign",
      ]
    `)
  })

  it('calculation with defs', () => {
    const code = `const _iu = (19) / 234 + 56 / 7;`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "const => keyword",
        "_iu => class",
        "= => sign",
        "( => sign",
        "19 => class",
        ") => sign",
        "/ => sign",
        "234 => class",
        "+ => sign",
        "56 => class",
        "/ => sign",
        "7 => class",
        "; => sign",
      ]
    `)
  })
})

describe('jsx', () => {
  it('parse jsx compositions', () => {
    const code = `// jsx
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
    )`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "// jsx => comment",
        "const => keyword",
        "element => identifier",
        "= => sign",
        "( => sign",
        "< => sign",
        "> => sign",
        "< => sign",
        "Food => entity",
        "season => property",
        "= => sign",
        "{ => sign",
        "{ => sign",
        "sault => identifier",
        ": => sign",
        "< => sign",
        "p => entity",
        "a => property",
        "= => sign",
        "{ => sign",
        "[ => sign",
        "{ => sign",
        "} => sign",
        "] => sign",
        "} => sign",
        "/> => sign",
        "} => sign",
        "} => sign",
        "> => sign",
        "</ => sign",
        "Food => entity",
        "> => sign",
        "{ => sign",
        "/* jsx comment */ => comment",
        "} => sign",
        "< => sign",
        "h1 => entity",
        "className => property",
        "= => sign",
        "" => string",
        "title => string",
        "" => string",
        "data- => property",
        "title => property",
        "= => sign",
        "" => string",
        "true => string",
        "" => string",
        "> => sign",
        " => jsxliterals",
        "Read more => jsxliterals",
        "{ => sign",
        "' => string",
        " => string",
        "' => string",
        "} => sign",
        " => jsxliterals",
        " => jsxliterals",
        "< => sign",
        "Link => entity",
        "href => property",
        "= => sign",
        "" => string",
        "/posts/first-post => string",
        "" => string",
        "> => sign",
        " => jsxliterals",
        " => jsxliterals",
        "< => sign",
        "a => entity",
        "> => sign",
        "this page! - => jsxliterals",
        "{ => sign",
        "Date => class",
        ". => sign",
        "now => property",
        "( => sign",
        ") => sign",
        "} => sign",
        "</ => sign",
        "a => entity",
        "> => sign",
        "</ => sign",
        "Link => entity",
        "> => sign",
        "</ => sign",
        "h1 => entity",
        "> => sign",
        "</ => sign",
        "> => sign",
        ") => sign",
      ]
    `)
  })

  it('parse basic jsx with text without expression children', () => {
    const tokens = tokenize(`<Foo>This is content</Foo>`)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "Foo => entity",
        "> => sign",
        "This is content => jsxliterals",
        "</ => sign",
        "Foo => entity",
        "> => sign",
      ]
    `)
  })

  it('parse basic jsx with expression children', () => {
    const tokens = tokenize(`<Foo>{Class + variable}</Foo>`)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "Foo => entity",
        "> => sign",
        "{ => sign",
        "Class => class",
        "+ => sign",
        "variable => identifier",
        "} => sign",
        "</ => sign",
        "Foo => entity",
        "> => sign",
      ]
    `)
  })

  it('parse multi jsx definitions', () => {
    const tokens = tokenize(
      `x = <div>this </div>
        y = <div>thi</div>
        z = <div>this</div>
      `)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "x => identifier",
        "= => sign",
        "< => sign",
        "div => entity",
        "> => sign",
        "this => jsxliterals",
        "</ => sign",
        "div => entity",
        "> => sign",
        "y => identifier",
        "= => sign",
        "< => sign",
        "div => entity",
        "> => sign",
        "thi => jsxliterals",
        "</ => sign",
        "div => entity",
        "> => sign",
        "z => identifier",
        "= => sign",
        "< => sign",
        "div => entity",
        "> => sign",
        "this => jsxliterals",
        "</ => sign",
        "div => entity",
        "> => sign",
      ]
    `)
  })

  it('parse fold jsx', () => {
    const tokens = tokenize(`// jsx
    const element = (
      <div>Hello World <Food /></div>
    )`);
    
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "// jsx => comment",
        "const => keyword",
        "element => identifier",
        "= => sign",
        "( => sign",
        "< => sign",
        "div => entity",
        "> => sign",
        "Hello World => jsxliterals",
        "< => sign",
        "Food => entity",
        "/> => sign",
        "</ => sign",
        "div => entity",
        "> => sign",
        ") => sign",
      ]
    `)
  })

  it('parse keyword in jsx children literals as jsx literals', () => {
    const tokens = tokenize(`<div>Hello <Name /> with {data}</div>`)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "div => entity",
        "> => sign",
        "Hello => jsxliterals",
        "< => sign",
        "Name => entity",
        "/> => sign",
        "with => jsxliterals",
        "{ => sign",
        "data => identifier",
        "} => sign",
        "</ => sign",
        "div => entity",
        "> => sign",
      ]
    `)
  })

  it('parse svg with break lines', () => {
    const code = `\
      <svg>
        <path
          d='M12'/></svg>
      `
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "svg => entity",
        "> => sign",
        " => jsxliterals",
        " => jsxliterals",
        "< => sign",
        "path => entity",
        "d => property",
        "= => sign",
        "' => string",
        "M12 => string",
        "' => string",
        "/> => sign",
        "</ => sign",
        "svg => entity",
        "> => sign",
      ]
    `)
  })

  it('parse arrow function in jsx correctly', () => {
    const code = '<button onClick={() => {}}>click</button>'
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "button => entity",
        "onClick => property",
        "= => sign",
        "{ => sign",
        "( => sign",
        ") => sign",
        "= => sign",
        "> => sign",
        "{ => sign",
        "} => sign",
        "} => sign",
        "> => sign",
        "click => jsxliterals",
        "</ => sign",
        "button => entity",
        "> => sign",
      ]
    `)
  })

  it('parse arrow function prop of jsx correctly', () => {
    const code = `<Editor onChange={(text) => 1)} />`

    const tokens = tokenize(code)
    expect(getTokensAsString(tokens, { filterSpaces: false })).toMatchInlineSnapshot(`
      [
        "< => sign",
        "Editor => entity",
        " => space",
        "onChange => property",
        "= => sign",
        "{ => sign",
        "( => sign",
        "text => identifier",
        ") => sign",
        " => space",
        "= => sign",
        "> => sign",
        " => space",
        "1 => identifier",
        ") => sign",
        "} => sign",
        " => space",
        "/> => sign",
      ]
    `)
  })

  it('should render string for any jsx attribute values', () => {
    const code = '<h1 data-title="true" />'
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "h1 => entity",
        "data- => property",
        "title => property",
        "= => sign",
        "" => string",
        "true => string",
        "" => string",
        "/> => sign",
      ]
    `)

    const code2 = '<svg color="null" height="24"/>'
    const tokens2 = tokenize(code2)
    expect(getTokensAsString(tokens2)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "svg => entity",
        "color => property",
        "= => sign",
        "" => string",
        "null => string",
        "" => string",
        "height => property",
        "= => sign",
        "" => string",
        "24 => string",
        "" => string",
        "/> => sign",
      ]
    `)
  })

  it('should render single quote inside jsx literals as jsx literals', () => {
    const code = `<p>Let's get started!</p>`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "p => entity",
        "> => sign",
        "Let's get started! => jsxliterals",
        "</ => sign",
        "p => entity",
        "> => sign",
      ]
    `)
  })

  it('should handle nested jsx literals correctly', async () => {
    const code =
    `<>
      <div>
        <p>Text 1</p>
      </div>
      <p>Text 2</p>
    </>`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "> => sign",
        "< => sign",
        "div => entity",
        "> => sign",
        " => jsxliterals",
        " => jsxliterals",
        "< => sign",
        "p => entity",
        "> => sign",
        "Text 1 => jsxliterals",
        "</ => sign",
        "p => entity",
        "> => sign",
        "</ => sign",
        "div => entity",
        "> => sign",
        "< => sign",
        "p => entity",
        "> => sign",
        "Text 2 => jsxliterals",
        "</ => sign",
        "p => entity",
        "> => sign",
        "</ => sign",
        "> => sign",
      ]
    `)
  })

  it('should not affect the function param after closed jsx tag', () => {
    // issue: (str was treated as string
    const code =
      `<a k={v} />
      function p(str) {}
      `
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "a => entity",
        "k => property",
        "= => sign",
        "{ => sign",
        "v => identifier",
        "} => sign",
        "/> => sign",
        "function => keyword",
        "p => identifier",
        "( => sign",
        "str => identifier",
        ") => sign",
        "{ => sign",
        "} => sign",
      ]
    `)
  })

  it('should handle object spread correctly', () => {
    const code = `<Component {...props} />`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "Component => entity",
        "{ => sign",
        ". => sign",
        ". => sign",
        ". => sign",
        "props => identifier",
        "} => sign",
        "/> => sign",
      ]
    `)
  })

  it('should handle tailwind properties well', () => {
    const code = `<div className="data-[layout=grid]:grid" />`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "< => sign",
        "div => entity",
        "className => property",
        "= => sign",
        "" => string",
        "data-[layout=grid]:grid => string",
        "" => string",
        "/> => sign",
      ]
    `)
  })
})

describe('comments', () => {
  it('basic inline comments', () => {
    const code = `+ // This is a inline comment / <- a slash`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "+ => sign",
        "// This is a inline comment / <- a slash => comment",
      ]
    `)
  })

  it('multiple slashes started inline comments', () => {
    const code = `/// <reference path="..." /> // reference comment`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "/// <reference path="..." /> // reference comment => comment",
      ]
    `)
  })

  it('multi-line comments', () => {
    const code = `/* This is another comment */ alert('good') // <- alerts`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "/* This is another comment */ => comment",
        "alert => identifier",
        "( => sign",
        "' => string",
        "good => string",
        "' => string",
        ") => sign",
        "// <- alerts => comment",
      ]
    `)
  })

  it('multi-line comments with annotations', () => {
    const code = `/**
 * @param {string} names
 * @return {Promise<string[]>}
 */`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "/**
       * @param {string} names
       * @return {Promise<string[]>}
       */ => comment",
      ]
    `)
  })
})

describe('regex', () => {
  it('basic regex', () => {
    const reg1 = '/^\\/[0-5]\\/$/'
    const reg2 = `/^\\w+[a-z0-9]/ig`

    expect(getTokensAsString(tokenize(reg1))).toMatchInlineSnapshot(`
      [
        "/^\\/[0-5]\\/$/ => string",
      ]
    `)
    expect(getTokensAsString(tokenize(reg2))).toMatchInlineSnapshot(`
      [
        "/^\\w+[a-z0-9]/ig => string",
      ]
    `)
  })

  it('contain angle brackets', () => {
    const code = `/^\\w+<a>\\/$/`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "/^\\w+<a>\\/$/ => string",
      ]
    `)
  })

  it('regex plus operators', () => {
    const code = `/^\\/[0-5]\\/$/ + /^\\/\w+\\/$/gi`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "/^\\/[0-5]\\/$/ => string",
        "+ => sign",
        "/^\\/w+\\/$/gi => string",
      ]
    `)
  })

  it('regex with quotes inside', () => {
    const code = `replace(/'/, \`"\`)`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "replace => identifier",
        "( => sign",
        "/'/ => string",
        ", => sign",
        "\` => string",
        "" => string",
        "\` => string",
        ") => string",
      ]
    `)
  })

  it('multi line regex tests', () => {
    const code1 =
      `/reg/.test('str')\n` +
      `[]\n` +
      `/reg/.test('str')`

    // '[]' consider as a end of the expression
    const tokens1 = tokenize(code1)
    expect(getTokensAsString(tokens1)).toMatchInlineSnapshot(`
      [
        "/reg/ => string",
        ". => sign",
        "test => identifier",
        "( => sign",
        "' => string",
        "str => string",
        "' => string",
        ") => sign",
        "[ => sign",
        "] => sign",
        "/reg/ => string",
        ". => sign",
        "test => identifier",
        "( => sign",
        "' => string",
        "str => string",
        "' => string",
        ") => sign",
      ]
    `)

    const code2 =
      `/reg/.test('str')()\n` +
      `/reg/.test('str')`

    // what before '()' still considers as an expression
    const tokens2 = tokenize(code2)
    expect(getTokensAsString(tokens2)).toMatchInlineSnapshot(`
      [
        "/reg/ => string",
        ". => sign",
        "test => identifier",
        "( => sign",
        "' => string",
        "str => string",
        "' => string",
        ") => sign",
        "( => sign",
        ") => sign",
        "/ => sign",
        "reg => identifier",
        "/ => sign",
        ". => sign",
        "test => identifier",
        "( => sign",
        "' => string",
        "str => string",
        "' => string",
        ") => sign",
      ]
    `)
  })
})

describe('strings', () => {
  it('import paths', () => {
    const code = `import mod from "../../mod"`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "import => keyword",
        "mod => identifier",
        "from => keyword",
        "" => string",
        "../../mod => string",
        "" => string",
      ]
    `)
  })

  it('contains curly brackets', () => {
    const code = `const str = 'hello {world}'`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "const => keyword",
        "str => identifier",
        "= => sign",
        "' => string",
        "hello {world} => string",
        "' => string",
      ]
    `)
  })

  it('contains angle brackets', () => {
    const code = `const str = 'hello <world>'`
    const tokens = tokenize(code)
    expect(getTokensAsString(tokens)).toMatchInlineSnapshot(`
      [
        "const => keyword",
        "str => identifier",
        "= => sign",
        "' => string",
        "hello <world> => string",
        "' => string",
      ]
    `)
  })

  it('multi quotes string', () => {
    const str1 = `"aa'bb'cc"`
    expect(getTokensAsString(tokenize(str1))).toMatchInlineSnapshot(`
      [
        "" => string",
        "aa => string",
        "' => string",
        "bb => string",
        "' => string",
        "cc => string",
        "" => string",
      ]
    `)

    const str2 = `'aa"bb"cc'`
    expect(getTokensAsString(tokenize(str2))).toMatchInlineSnapshot(`
      [
        "' => string",
        "aa => string",
        "" => string",
        "bb => string",
        "" => string",
        "cc => string",
        "' => string",
      ]
    `)

    const str3 = `\`\nabc\``
    expect(getTokensAsString(tokenize(str3))).toMatchInlineSnapshot(`
      [
        "\` => string",
        "abc => string",
        "\` => string",
      ]
    `)
  })

  it('string template', () => {
    const code1 = `
      \`hi \$\{ a \} world\`
      \`hello \$\{world\}\`
    `
    expect(getTokensAsString(tokenize(code1))).toMatchInlineSnapshot(`
      [
        "\` => string",
        "hi => string",
        "\${ => sign",
        "a => identifier",
        "} => sign",
        "world => string",
        "\` => string",
        "\` => string",
        "hello => string",
        "\${ => sign",
        "world => identifier",
        "} => sign",
        "\` => string",
      ]
    `)

    const code2 = `
    \`hi \$\{ b \} plus \$\{ c + \`text\` \}\`
      \`nested \$\{ c + \`\$\{ no \}\` }\`
    `
    expect(getTokensAsString(tokenize(code2))).toMatchInlineSnapshot(`
      [
        "\` => string",
        "hi => string",
        "\${ => sign",
        "b => identifier",
        "} => sign",
        "plus => string",
        "\${ => sign",
        "c => identifier",
        "+ => sign",
        "\` => string",
        "text => string",
        "\` => string",
        "} => sign",
        "\` => string",
        "\` => string",
        "nested => string",
        "\${ => sign",
        "c => identifier",
        "+ => sign",
        "\` => string",
        "\${ => sign",
        "no => identifier",
        "} => sign",
        "\` => string",
        "} => sign",
        "\` => string",
      ]
    `)

    const code3 = `
    \`
      hehehehe
      \`
      'we'
      "no"
      \`hello\`
    `
    expect(getTokensAsString(tokenize(code3))).toMatchInlineSnapshot(`
      [
        "\` => string",
        "hehehehe => string",
        "\` => string",
        "' => string",
        "we => string",
        "' => string",
        "" => string",
        "no => string",
        "" => string",
        "\` => string",
        "hello => string",
        "\` => string",
      ]
    `)
  })

  it('unicode token', () => {
    const code = `let hello你好 = 'hello你好'`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "let => keyword",
        "hello你好 => identifier",
        "= => sign",
        "' => string",
        "hello你好 => string",
        "' => string",
      ]
    `)
  })

  it('number in string', () => {
    const code = `'123'\n'true'`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "' => string",
        "123 => string",
        "' => string",
        "' => string",
        "true => string",
        "' => string",
      ]
    `)
  })
})

describe('class', () => {
  it('determine class name', () => {
    const code = `class Bar extends Array {}`
    expect(getTokensAsString(tokenize(code))).toMatchInlineSnapshot(`
      [
        "class => keyword",
        "Bar => class",
        "extends => keyword",
        "Array => class",
        "{ => sign",
        "} => sign",
      ]
    `)
  })
})
