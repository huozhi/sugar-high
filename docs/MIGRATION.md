# Migrating to Sugar High v2

Sugar High v2 keeps one-step highlighting small while making languages and rendering explicitly
composable.

## Highlight with options

Pass the canonical language in the options object:

```js
import { highlight } from 'sugar-high'

highlight(source, { lang: 'python' })
```

JavaScript, including JSX, remains the default. TypeScript includes TSX.

## Normalize external language names

The root package accepts canonical names. Normalize filename extensions and fence aliases at the
integration boundary:

```js
import { lang } from 'sugar-high/lang'

highlight(source, { lang: lang(extension) })
```

`lang('py')` returns `python`, `lang('bash')` returns `shell`, and unsupported inputs return
`undefined`.

## Move low-level work to core

Parsing, tokenization, node generation, and rendering live under `sugar-high/core`:

```js
import { parse, render } from 'sugar-high/core'

const parsed = parse(source, config)
const html = render(parsed, options)
```

## Customize output

Use `cx` for token classes, `mark` for individual generated tokens, and `markLine` for generated
lines:

```js
highlight(source, {
  cx: { keyword: 'font-bold' },
  mark(token) {
    if (token.value === 'TODO') token.properties['data-todo'] = true
  },
  markLine(line) {
    if (line.index === 1) line.className += ' selected'
  },
})
```

These callbacks mutate their argument and return nothing.

## React and Remark

The editor and code block are available from `@sugar-high/react`:

```tsx
import { Code, Editor } from '@sugar-high/react'
```

The Remark plugin is ESM and supports both default and named imports:

```js
import remarkSugarHigh, { highlight } from '@sugar-high/remark'
```

See the [API reference](API.md) for the full language mapping and v2 types.
