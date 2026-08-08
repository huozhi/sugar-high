# Sugar High API

## Package exports

### `sugar-high`

The default export path includes the built-in language registry. JavaScript is used when `lang` is
omitted.

```js
import { highlight, tokenize, generate } from 'sugar-high'

highlight('const ready = true')
highlight('print("hi")', { lang: 'python' })
```

The `lang` option accepts canonical language names only. TypeScript autocompletes the supported
names.

### `sugar-high/core`

The core export contains the tokenizer and generator without the built-in language registry. Pass
tokenizer configuration rather than a language name.

```js
import { highlight } from 'sugar-high/core'

highlight('select * from users', {
  keywords: new Set(['select', 'from', 'where']),
  comment: /--.*$/gm,
})
```

### `sugar-high/lang`

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

Use it at integration boundaries, such as Markdown fence names or a file extension supplied by an
editor. If you already have a canonical name, pass it directly to `highlight`.

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
| `kotlin` | `.kt` | `kts` |
| `swift` | `.swift` | — |
| `php` | `.php` | — |
| `toml` | `.toml` | — |
| `powershell` | `.ps1` | `pwsh` |
| `dockerfile` | `.dockerfile` | `docker` |
| `graphql` | `.graphql` | `gql` |
| `hcl` | `.hcl` | `terraform`, `tf` |

Related dialects intentionally share one canonical language. JavaScript includes JSX, TypeScript
includes TSX, JSON includes JSONC comments, Shell includes sh/Bash/Zsh, and HCL includes Terraform.

## Highlight options

```ts
type HighlightOptions = {
  lang?: LanguageName
  lineClassName?: (line: string, index: number) => string | null | undefined
  cx?: Partial<Record<TokenType, string>>
  mark?: (token: MarkToken) => void
}
```

The default package also accepts the lower-level tokenizer configuration documented by the
`sugar-high/core` types.

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

The string highlighter exposes line styling through `lineClassName`. The callback receives the
source line and its zero-based index:

```js
highlight(source, {
  lineClassName(_line, index) {
    return index === 1 ? 'sh__line--highlighted' : undefined
  },
})
```

Every generated line has `.sh__line`; the returned class is appended to it. Sugar High does not
assign visual styles to custom line classes, so the application controls the appearance:

```css
.sh__line--highlighted {
  background: #fff8c5;
}
```

The higher-level integrations provide their own line-selection syntax:

```tsx
import { Code } from '@sugar-high/react/code'

<Code highlightLines={[1, [4, 7]]}>{source}</Code>
```

React line numbers are one-based. A number selects one line; a tuple selects an inclusive range.
The Remark plugin reads the same one-based ranges from fenced-code metadata such as
<code>```js {2,5-7}</code> and adds `.sh__line--highlighted`.

## Functions

### `highlight(code, options?)`

Tokenizes code and returns highlighted HTML.

### `tokenize(code, options?)`

Returns Sugar High's compact token tuples.

### `generate(tokens, options?)`

Converts token tuples into line and token nodes. Generation accepts `lineClassName`, `cx`, and
`mark` options.
