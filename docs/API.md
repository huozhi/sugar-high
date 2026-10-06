# Sugar High API

## Package exports

### `sugar-high`

The default export path includes the built-in language registry. JavaScript is used when `lang` is
omitted.

```js
import { highlight } from 'sugar-high'

highlight('const ready = true')
highlight('print("hi")', { lang: 'python' })
```

The `lang` option accepts canonical language names only. TypeScript autocompletes the supported
names. In plain JavaScript, an unrecognized name uses the general-purpose lexer. Normalize external
input with `lang()` when you want to detect unsupported names before highlighting.

### `sugar-high/core`

The core export separates syntax parsing from HTML rendering and does not include the built-in
language registry. Pass tokenizer configuration to `parse()` and display options to `render()`.

```js
import { parse, render } from 'sugar-high/core'

const parsed = parse('select * from users', {
  keywords: new Set(['select', 'from', 'where']),
})

const html = render(parsed, {
  cx: { keyword: 'font-bold' },
})
```

### Advanced: `sugar-high/lang`

`lang(input)` normalizes a canonical name, filename extension, or common fence alias to the
canonical name accepted by the default highlighter. It trims whitespace, ignores case, accepts a
leading dot, and returns `undefined` for unknown input.

```js
import { lang } from 'sugar-high/lang'

lang('python') // 'python'
lang('py')     // 'python'
lang('.PY')    // 'python'
lang('unknown') // undefined
```

You do not need `lang()` when the language is already known. Use it at integration boundaries,
such as Markdown fence names or a file extension supplied by an editor. If you already have a
canonical name, pass it directly to `highlight`.

```js
highlight(source, { lang: 'python' })
highlight(source, { lang: lang(extension) })
```

## `lang()` mapping

Canonical names appear in the first column. The preferred extension and every additional accepted
input map to that canonical name. Canonical names themselves are always accepted.

| Canonical name | Preferred extension | Additional accepted inputs |
| --- | --- | --- |
| `javascript` | `.js` | `js`, `jsx`, `node` |
| `typescript` | `.ts` | `ts`, `tsx` |
| `css` | `.css` | `scss` |
| `python` | `.py` | `py`, `python3` |
| `c` | `.c` | — |
| `go` | `.go` | `golang` |
| `java` | `.java` | — |
| `rust` | `.rs` | `rs` |
| `json` | `.json` | `jsonc` |
| `diff` | `.diff` | `patch` |
| `shell` | `.sh` | `sh`, `bash`, `zsh` |
| `cpp` | `.cpp` | `c++`, `cc`, `cxx` |
| `csharp` | `.cs` | `c#`, `cs`, `dotnet` |
| `sql` | `.sql` | — |
| `html` | `.html` | `htm`, `xml` |
| `yaml` | `.yaml` | `yml` |
| `markdown` | `.md` | `md`, `mdx` |
| `plaintext` | `.txt` | `text`, `plain` |
| `ruby` | `.rb` | — |
| `kotlin` | `.kt` | `kts` |
| `swift` | `.swift` | — |
| `php` | `.php` | — |
| `toml` | `.toml` | — |
| `powershell` | `.ps1` | `pwsh` |
| `dockerfile` | `.dockerfile` | `docker` |
| `graphql` | `.graphql` | `gql` |
| `hcl` | `.hcl` | `terraform`, `tf` |
| `zig` | `.zig` | — |
| `lua` | `.lua` | — |

Related dialects intentionally share one canonical language. JavaScript includes JSX, TypeScript
includes TSX, JSON includes JSONC comments, Shell includes sh/Bash/Zsh, and HCL includes Terraform.
An alias only affects lookup: it does not create another language implementation or public name.
Integrations use the canonical name for generated `sh-lang--*` classes and `data-sh-language`
attributes.

## Highlight options

```ts
type HighlightOptions = {
  lang?: LanguageName
  cx?: Partial<Record<TokenType, string>>
  mark?: (token: MarkToken) => void
  markLine?: (line: MarkLine) => void
}
```

### `cx`

Append classes by semantic token type. Sugar High's generated classes are preserved.

```js
highlight(source, {
  cx: {
    keyword: 'font-bold',
    comment: 'italic opacity-60',
  },
})
```

### `mark`

Mutate a generated token before it is rendered. The callback returns nothing. `cx` runs first, so
`mark` receives the composed class name.

```js
highlight(source, {
  mark(token) {
    if (token.type === 'comment' && token.value.includes('TODO')) {
      token.className += ' text-orange-500'
      token.properties['data-todo'] = true
    }
  },
})
```

## Highlighted lines

Use `markLine` to mutate a generated line before rendering. It follows the same void-returning
model as `mark`; `line.index` is zero-based.

```js
highlight(source, {
  markLine(line) {
    if (line.index === 1) {
      line.className += ' sh__line--highlighted'
      line.properties['data-highlight'] = true
    }
  },
})
```

Every generated line starts with `.sh__line`. Sugar High does not assign visual styles to custom
line classes, so the application controls the appearance:

```css
.sh__line--highlighted {
  background: #fff8c5;
}
```

Language presets can attach semantic annotations to a line. Sugar High turns each annotation into
a default BEM-style class using `.sh__line--<annotation>`. For example, a Markdown heading has the
`markdown-heading` annotation and receives `.sh__line--markdown-heading`; an added Diff line
receives `.sh__line--diff-add`.

`markLine` receives the annotations and the generated class name. Append classes to preserve the
defaults, or replace `className` to use your own naming convention:

```js
highlight(source, {
  lang: 'markdown',
  markLine(line) {
    line.className = [
      'line',
      ...line.annotations.map(annotation => `line-${annotation}`),
    ].join(' ')
  },
})
```

This renders a Markdown heading with `class="line line-markdown-heading"`. `markLine` can also
customize inline styles and HTML properties:

```js
highlight(source, {
  markLine(line) {
    if (line.annotations.includes('diff-add')) {
      line.style.background = '#e6ffec'
      line.properties['data-change'] = 'addition'
    }
  },
})
```

The higher-level integrations provide their own line-selection syntax:

```tsx
import { Code } from '@sugar-high/react'

<Code highlightLines={[1, [4, 7]]}>{source}</Code>
```

React line numbers are one-based. A number selects one line; a tuple selects an inclusive range.
The Remark plugin reads the same one-based ranges from fenced-code metadata such as
<code>```js {2,5-7}</code> and adds `.sh__line--highlighted`.

## Functions

### `highlight(code, options?)`

Selects a built-in language, parses the source with core, and returns highlighted HTML. This is the
only function most applications need.

### `parse(code, config?)`

Core API. Returns structured source data containing lines and semantic tokens. Parsing accepts
tokenizer configuration and does not produce HTML.

```ts
type ParsedCode = {
  readonly value: string
  readonly lines: ReadonlyArray<{
    readonly index: number
    readonly value: string
    readonly tokens: ReadonlyArray<{ type: TokenType; value: string }>
    readonly annotations: readonly string[]
  }>
}
```

### `render(parsed, options?)`

Core API. Converts parsed code to HTML and accepts only display customization: `cx`, `mark`, and
`markLine`.

### `generate(parsed, options?)`

Core API. Builds typed line and token nodes for integrations that render through React or another
syntax tree instead of HTML. Generated token nodes expose their semantic `tokenType` separately
from the syntax-tree `type: 'element'` field.

## Processing order

Parsing tokenizes the source, assembles lines, and then runs the language configuration's
`annotateLine` hook. Generation creates default annotation classes and runs `markLine`; each token
then receives its default class and style, followed by `cx` and `mark`. `render()` serializes those
generated nodes to HTML.

`annotateLine` belongs to language configurations and records syntax meaning. `markLine`, `cx`, and
`mark` belong to display options and control presentation.

## Size and performance

[![sugar-high bundle size](https://deno.bundlejs.com/?q=sugar-high&badge=detailed)](https://bundlejs.com/?q=sugar-high)
[![sugar-high/core bundle size](https://deno.bundlejs.com/?q=sugar-high%2Fcore&badge=detailed)](https://bundlejs.com/?q=sugar-high%2Fcore)

The badges show the minified and gzip-compressed cost of the latest published package. To measure
the current checkout together with highlighting throughput:

```sh
pnpm --filter sugar-high benchmark
```

The benchmark runs 50,000 iterations by default. Set `BENCH_ITERATIONS` to change the count.
