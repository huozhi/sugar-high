# `@sugar-high/react` API

Install it with its peer dependencies:

```sh
npm install @sugar-high/react sugar-high react
```

The default entry point is client-oriented and includes Sugar High's complete language registry.
It exports `Code`, `Editor`, `FileTree`, and the `Theme`, `ThemePalette`, and `FileTreeProps`
types.

```tsx
import { Code, Editor, FileTree } from '@sugar-high/react'
```

## `Code`

`Code` renders highlighted source in a framed code block. Its children are the source string.
`lang` accepts a canonical `LanguageName`; when omitted, Sugar High resolves `extension`, or the
extension in `title`, and finally uses JavaScript. `extension` is retained for compatibility; use
`lang` whenever the canonical language is already known.

```tsx
<Code
  lang="typescript"
  title="app.tsx"
  controls
  lineNumbers
  highlightLines={[2, [5, 7]]}
  startingLineNumber={40}
  wrapLongLines={false}
>
  {source}
</Code>
```

Its props are:

- `children: string` — source to highlight.
- `lang?: LanguageName`, `extension?: string`, `title?: string`, and `controls?: boolean`.
- `lineNumbers?: boolean` (default `false`), `startingLineNumber?: number` (default `1`), and
  `lineNumbersWidth?: string`. `highlightLines?: Array<number | [number, number]>` uses one-based
  line numbers and inclusive ranges.
- `wrapLongLines?: boolean` (default `true`), `padding?: string`, and `fontSize?: string | number`.
- `preformatted?: boolean` (default `true`) to choose `<pre><code>` rather than a `<div>` content
  container; `asMarkup?: boolean` to render `children` as trusted HTML.
- `cx`, `mark`, and `markLine`, with the same semantics as the root highlighter. `markLine` uses a
  zero-based line index.
- Ordinary `div` attributes such as `className`, `style`, and an element `ref`.

## `Editor`

`Editor` is a textarea overlay on highlighted code. It accepts a controlled `value` with
`onChange(code: string)`, or an uncontrolled `defaultValue`. It forwards its ref to the root
`div`, not the textarea.

```tsx
<Editor
  lang="typescript"
  value={source}
  onChange={setSource}
  textareaProps={{ 'aria-label': 'Source code' }}
  indent="  "
/>
```

`Editor` supports `title?: string | null`, `onChangeTitle?(title: string)`, `controls?: boolean`
(default `true`), `lineNumbers?: boolean` (default `true`), `lineNumbersWidth?: string`,
`startingLineNumber?: number`, `wrapLongLines?: boolean`, `padding?: string`, `fontSize?: string |
number`, `fontFamily?: string`, `lang?: LanguageName`, `extension?: string`, `cx`, and `mark`.

Pass a `textareaRef` to receive the underlying textarea. `textareaProps` accepts ordinary textarea
attributes except `children`, `value`, `defaultValue`, and `onChange`; `Editor` controls those.
`indent` defaults to two spaces. Tab indents the caret or selected lines; Shift+Tab outdents them.
It also accepts ordinary root `div` attributes other than React's event-shaped `onChange`.

`Editor` deliberately has no `highlightLines`, `markLine`, `preformatted`, or `asMarkup` prop.

## `FileTree`

`FileTree` is client-side file navigation designed to compose with `Code` or `Editor`. The parent
owns the file list and selected file; `FileTree` owns expanded-folder state and keyboard focus.

```tsx
<FileTree
  paths={Object.keys(files)}
  activeFile={activeFile}
  onActiveFileChange={setActiveFile}
/>
```

`paths: readonly string[]`, `activeFile: string | null`, and
`onActiveFileChange(path: string): void` are required. Paths must be relative, slash-separated
file names. Invalid paths (empty paths or segments, leading/trailing slashes, `.` and `..`) are
ignored, duplicates are removed, and folders are inferred. Folders sort before files and begin
expanded. When a selected file is removed, update `activeFile` in the parent; the tree does not
choose a replacement.

It also accepts `theme?: Theme` and ordinary root `div` attributes, except `children` and
React's `onChange`. The default accessible label is `Files`; override it with `aria-label`.
Arrow keys move through the tree and expand or collapse folders; Home/End jump to the first or
last visible item; Enter/Space activate an item; typing searches file and folder names. Style the
root with `data-sh-file-tree` and `--sh-*` variables.

## `@sugar-high/react/core`

Use the core entry for server-compatible output or selective language imports. It has no client
directive and no built-in language registry. It exports `Code`, `Highlight`, `CodeProps`,
`HighlightProps`, `Theme`, and `ThemePalette`.

```tsx
import { Code, Highlight } from '@sugar-high/react/core'
import * as typescript from 'sugar-high/lang/typescript'

<Code lang={typescript}>{source}</Code>
```

Core `Code` accepts every `Code` prop above except that `lang` is a language configuration imported
from `sugar-high/lang/<language>`, rather than a string. It does not resolve `title` or `extension`
to a language.

`Highlight` is headless and server-compatible. It takes `code: string`, optional configuration
`lang`, `cx`, `mark`, `markLine`, and a required `render` callback. The callback receives
`{ lines }`; every line contains its generated line properties plus `tokens`, and every token
contains its generated token properties plus a string `value`. Render the result with the markup
the caller needs.

```tsx
<Highlight
  code={source}
  lang={typescript}
  render={({ lines }) => <pre>{lines.map((line, i) => <div key={i}>{line.tokens.map((t) => t.value)}</div>)}</pre>}
/>
```

## Themes

Pass `theme?: Theme` to `Code`, `Editor`, or `FileTree`. A `ThemePalette` requires `background`
and `foreground`; it may also specify token colors and `caret`, `title`, `control`, `lineNumber`,
and `lineHighlight`. Tokens not specified inherit `foreground`.

```tsx
import { Editor } from '@sugar-high/react'
import { taffy } from '@sugar-high/react/themes'

<Editor theme={taffy} value={source} onChange={setSource} />
```

For a light/dark-adaptive theme, pass `{ light: ThemePalette, dark: ThemePalette }`. It follows
the inherited CSS `color-scheme`, so changes of scheme do not require a React rerender. A single
palette is used unchanged in either scheme.

`@sugar-high/react/themes` exports `taffy`, `vercel`, `vscode`, `oneDarkPro`, `monokai`,
`minimal`, `gruvbox`, `tokyoNight`, `nordLight`, and `softMinimal`, plus `Theme` and
`ThemePalette` types. `nordLight` and `softMinimal` are light-only; the others provide paired
light and dark palettes.

## Styling and structure

Set `--sh-*` variables on a component root. Frequently useful variables are `--sh-font-family`,
`--sh-font-size`, `--sh-padding`, `--sh-line-number-width`, `--sh-caret-color`,
`--sh-editor-text-color`, `--sh-editor-background-color`, `--sh-title-color`,
`--sh-control-color`, `--sh-line-number-color`, `--sh-line-highlight-color`, and the root Sugar
High token variables such as `--sh-keyword` and `--sh-string`.

Target component structure with `data-sh-*` attributes: `data-sh="code"` or `data-sh="editor"`,
`data-sh-code`, `data-sh-editor`, `data-sh-header`, `data-sh-content`, `data-sh-code-content`,
`data-sh-code-line`, `data-sh-code-line-number`, `data-sh-title`, and `data-sh-token-type`.
Highlighted `Code` lines receive `data-highlight`. Existing `data-codice-*` attributes are retained
for migration compatibility, but new styles should use `data-sh-*`.

Because the editor overlays a textarea on displayed highlighted code, keep
`--sh-editor-text-color` and `--sh-editor-background-color` transparent unless intentionally
changing that design; set the root `color` and `backgroundColor` for visible text and surface.
