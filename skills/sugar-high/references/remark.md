# `@sugar-high/remark` API

Install the plugin with Sugar High and add it to a Remark processor:

```sh
npm install @sugar-high/remark sugar-high
```

```js
import { remark } from 'remark'
import html from 'remark-html'
import remarkSugarHigh from '@sugar-high/remark'

const output = await remark()
  .use(remarkSugarHigh, { cx: { keyword: 'font-bold' } })
  .use(html, { sanitize: false })
  .process(markdown)
```

The default export and named `highlight` export are the same Remark plugin factory. Its public
options type is `RemarkSugarHighOptions`:

```ts
type RemarkSugarHighOptions = {
  cx?: HighlightOptions['cx']
  mark?: HighlightOptions['mark']
  markLine?: HighlightOptions['markLine']
}
```

Use `cx` for token-category classes, `mark(token)` for conditional token changes, and
`markLine(line)` for line changes. `markLine` sees a zero-based index.

The plugin handles code nodes and code-like HTML AST nodes. It normalizes fence aliases through
`sugar-high/lang` (for example, `bash` becomes `shell`, `jsonc` becomes `json`, and `tf` becomes
`hcl`). Known languages use their built-in configuration; an unknown or missing language is parsed
with JavaScript while the output preserves its original language label.

## Highlighted lines

Put one-based line numbers and inclusive ranges in a fenced-code block's metadata:

````md
```js {2,5-7}
const ready = true
```
````

Selected lines receive the `sh__line--highlighted` class after the caller's `markLine` callback
runs. The plugin's generated `<pre>` and `<code>` both use `sh-lang--<language>`; the `<code>`
also receives `data-sh-language="<language>"`. Each rendered line ends with a
`<span class="sh__token--line">` newline marker.

When converting the resulting tree to HTML, allow the generated class and data attributes through
your sanitizer. With `remark-html`, the standard integration uses `{ sanitize: false }` as shown
above; choose a sanitizer configuration appropriate for the surrounding application's trust model.
