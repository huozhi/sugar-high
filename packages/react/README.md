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

## Code

```tsx
import { Code } from '@sugar-high/react'

<Code lang="python" title="main.py" lineNumbers cx={{ keyword: 'font-bold' }}>
  {'def hello():\n    return "world"'}
</Code>
```

`lang` takes a canonical Sugar High language name. When omitted, `title` or the legacy
`extension` prop is resolved through Sugar High's language aliases.

The package preserves Codice's existing `data-codice-*` attributes and CSS variables so existing
themes can migrate without a DOM/CSS rewrite.

## Styling

Set Codice variables on the component itself for a self-contained theme:

```tsx
const style = {
  backgroundColor: '#f6f8fa',
  '--codice-background-color': 'transparent',
  '--codice-caret-color': '#24292f',
  '--codice-title-color': '#57606a',
  '--codice-control-color': '#afb8c1',
  '--codice-code-line-number-color': '#8c959f',
  '--codice-code-highlight-color': '#fff8c5',
  '--sh-keyword': '#cf222e',
  '--sh-string': '#0a3069',
} as React.CSSProperties

<Editor style={style} value={source} onChange={setSource} />
```

The `--codice-*` variables control the component frame and editor. Sugar High's `--sh-*`
variables control syntax tokens; see the [theme guide](https://sugar-high.vercel.app/theme).

| Variable | Applies to | Default | Purpose |
| --- | --- | --- | --- |
| `--codice-text-color` | Editor | `transparent` | Textarea text color; normally transparent over highlighted code. |
| `--codice-background-color` | Editor | `transparent` | Textarea background color. |
| `--codice-caret-color` | Both | `inherit` | Editor caret and editable title caret. |
| `--codice-font-family` | Both | Editor: `Consolas, Monaco, monospace`; Code: inherited | Code, textarea, and title font family. |
| `--codice-font-size` | Both | `inherit` | Code and textarea font size. |
| `--codice-code-padding` | Both | `1rem` | Shared content and header spacing. |
| `--codice-code-line-number-width` | Both | `2.5rem`, expanding for 4+ digits | Line-number gutter width. Prefer `lineNumbersWidth` for an explicit override. |
| `--codice-control-color` | Both | unset | Header control-dot color. |
| `--codice-title-color` | Both | unset | Header filename color. |
| `--codice-code-line-number-color` | Both | unset | Line-number color. |
| `--codice-code-highlight-color` | Both | unset | Background for lines selected by `highlightLines`. |

The editor is a textarea layered over highlighted code. Keep `--codice-text-color` and
`--codice-background-color` transparent unless deliberately changing that overlay; set the root's
ordinary `color` and `backgroundColor` for the visible surface.

All component roots retain `data-codice`, `data-codice-code`, or `data-codice-editor` attributes
for stylesheet selectors. Both components also accept standard `div` attributes.
