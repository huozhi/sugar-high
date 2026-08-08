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
import { Code } from '@sugar-high/react/code'

<Code lang="python" title="main.py" lineNumbers cx={{ keyword: 'font-bold' }}>
  {'def hello():\n    return "world"'}
</Code>
```

`lang` takes a canonical Sugar High language name. When omitted, `title` or the legacy
`extension` prop is resolved through Sugar High's language aliases.

The package preserves Codice's existing `data-codice-*` attributes and CSS variables so existing
themes can migrate without a DOM/CSS rewrite.
