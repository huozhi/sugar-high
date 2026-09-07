---
name: sugar-high
description: Use Sugar High to add lightweight syntax highlighting to JavaScript, React, or Remark projects. Use when highlighting source code or configuring Sugar High languages, classes, or token hooks.
---

# Sugar High

Use `sugar-high` for a small, DOM-free HTML highlighter. It highlights JavaScript (including JSX) by default and returns an HTML string.

```ts
import { highlight } from 'sugar-high'

const html = highlight('const ready = true')
```

Pass a canonical built-in language name when it is known:

```ts
highlight('print("hi")', { lang: 'python' })
highlight('{"ready": true}', { lang: 'json' })
```

For language labels from filenames or Markdown fences, normalize them first with `lang()`:

```ts
import { lang } from 'sugar-high/lang'

const language = lang('tsx') // 'typescript'
```

Do not call `lang()` when the caller already has a canonical name. The highlighter accepts:
`javascript`, `typescript`, `css`, `python`, `c`, `go`, `java`, `rust`, `json`, `diff`, `shell`,
`cpp`, `csharp`, `sql`, `html`, `yaml`, `markdown`, `plaintext`, `ruby`, `kotlin`, `swift`,
`php`, `toml`, `powershell`, `dockerfile`, `graphql`, and `hcl`.

## Choose the entry point

- Use `sugar-high` for the standard, one-step highlighter with all built-in languages.
- Use `@sugar-high/react` for React `<Code>` blocks, the textarea-overlay `<Editor>`, or a
  navigable `<FileTree>`.
- Use `@sugar-high/remark` to highlight fenced Markdown code blocks.
- Use `sugar-high/core` only when the caller needs to compose parsing and rendering or selectively
  imports language configurations for bundle size.

`sugar-high/core` does not include the built-in registry. Import individual configurations from
`sugar-high/lang/<language>` and pass them to `parse()` when using it.

For React components, props, server compatibility, and styling hooks, read
[the React API reference](references/react.md). For Remark plugin configuration, fence metadata,
and generated markup, read [the Remark API reference](references/remark.md).

## Customize display

Use `cx` to add classes by token category. Use `mark(token)` for conditional classes, inline
styles, or attributes; it runs after `cx` and may mutate the token. Use `markLine(line)` for
line-level customization; its index is zero-based.

Preserve Sugar High's semantic classes (`sh__line` and the token classes) unless the caller
explicitly wants to replace their styling. Avoid adding an abstraction or custom grammar when the
existing language configuration and display hooks express the need.

Read the [API reference](https://github.com/huozhi/sugar-high/blob/main/docs/API.md) for export
details, token shapes, and the complete language-alias mapping.
