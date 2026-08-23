# @sugar-high/react

Lightweight React code blocks and editors powered by Sugar High.

## Install

```sh
npm install @sugar-high/react sugar-high react
```

## Editor

```tsx
import { Editor } from '@sugar-high/react'

<Editor
  lang="typescript"
  title="app.tsx"
  value="const App = () => <main>Hello</main>"
  onChange={console.log}
/>
```

Press Tab or Shift+Tab to indent or outdent the caret or selected lines. Customize the indentation
string and underlying textarea attributes with `indent` and `textareaProps`:

```tsx
<Editor
  indent="\t"
  textareaProps={{ 'aria-label': 'Source code', autoCapitalize: 'off' }}
  value={source}
  onChange={setSource}
/>
```

## Code

```tsx
import { Code } from '@sugar-high/react'

<Code lang="python" title="main.py" lineNumbers cx={{ keyword: 'font-bold' }}>
  {'def hello():\n    return "world"'}
</Code>
```

For excerpts from larger files, set the first displayed line number. Long lines wrap by default;
disable wrapping to use horizontal scrolling instead. Both options also work with `Editor`.

```tsx
<Code lineNumbers startingLineNumber={40} wrapLongLines={false}>
  {source}
</Code>
```

`lang` takes a canonical Sugar High language name. When omitted, `title` or the legacy
`extension` prop is resolved through Sugar High's language aliases.

### Select languages and render on the server

Use `@sugar-high/react/core` when you only need a few languages or want a server-compatible static
code block. Import each language configuration explicitly and pass it through `lang`:

```tsx
import { Code } from '@sugar-high/react/core'
import * as python from 'sugar-high/lang/python'

<Code lang={python} title="main.py" lineNumbers>
  {'def hello():\n    return "world"'}
</Code>
```

The core React entry does not include the complete language registry or a client directive. The
default entry remains the convenient choice when string language names and title-based detection
are more important than selecting the smallest bundle.

Use the `data-sh-*` attributes and `--sh-*` variables for new styles. The package temporarily
preserves Codice's existing `data-codice-*` attributes so existing structural selectors can
migrate incrementally.

## Styling

Set Sugar High variables on the component itself for a self-contained theme:

```tsx
const style = {
  backgroundColor: '#f6f8fa',
  '--sh-editor-background-color': 'transparent',
  '--sh-caret-color': '#24292f',
  '--sh-title-color': '#57606a',
  '--sh-control-color': '#afb8c1',
  '--sh-line-number-color': '#8c959f',
  '--sh-line-highlight-color': '#fff8c5',
  '--sh-keyword': '#cf222e',
  '--sh-string': '#0a3069',
} as React.CSSProperties

<Editor style={style} value={source} onChange={setSource} />
```

The `--sh-*` variables control both the component frame and syntax tokens; see the
[theme guide](https://sugar-high.vercel.app/theme).

| Variable | Applies to | Default | Purpose |
| --- | --- | --- | --- |
| `--sh-editor-text-color` | Editor | `transparent` | Textarea text color; normally transparent over highlighted code. |
| `--sh-editor-background-color` | Editor | `transparent` | Textarea background color. |
| `--sh-caret-color` | Both | `inherit` | Editor caret and editable title caret. |
| `--sh-font-family` | Both | Editor: `Consolas, Monaco, monospace`; Code: inherited | Code, textarea, and title font family. |
| `--sh-font-size` | Both | `inherit` | Code and textarea font size. |
| `--sh-padding` | Both | `1rem` | Shared content and header spacing. |
| `--sh-line-number-width` | Both | `2.5rem`, expanding for 4+ digits | Line-number gutter width. Prefer `lineNumbersWidth` for an explicit override. |
| `--sh-control-color` | Both | unset | Header control-dot color. |
| `--sh-title-color` | Both | unset | Header filename color. |
| `--sh-line-number-color` | Both | unset | Line-number color. |
| `--sh-line-highlight-color` | Both | unset | Background for lines selected by `highlightLines`. |

The editor is a textarea layered over highlighted code. Keep `--sh-editor-text-color` and
`--sh-editor-background-color` transparent unless deliberately changing that overlay; set the root's
ordinary `color` and `backgroundColor` for the visible surface.

New styles should select component structure through the `data-sh-*` attributes. Component roots
retain `data-codice`, `data-codice-code`, or `data-codice-editor` compatibility attributes during
the Codice migration. Both components also accept standard `div` attributes.
