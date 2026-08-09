# @sugar-high/remark

Remark plugin for the [Sugar High](https://sugar-high.vercel.app) syntax highlighter.

## Install

```sh
npm install @sugar-high/remark sugar-high
```

## Usage

```js
import { remark } from 'remark'
import html from 'remark-html'
import remarkSugarHigh from '@sugar-high/remark'

const output = await remark()
  .use(remarkSugarHigh, {
    cx: { keyword: 'font-bold' },
  })
  .use(html, { sanitize: false })
  .process(markdown)
```

The named `highlight` export is available for integrations that prefer named imports:

```js
import { highlight } from '@sugar-high/remark'
```

Fence aliases are normalized through [`lang()`](https://github.com/huozhi/sugar-high/blob/main/docs/API.md#sugar-highlang), so `bash` uses `shell`, `jsonc` uses `json`, and `tf` uses `hcl`.

Use one-based ranges in fence metadata to highlight lines:

````md
```js {2,5-7}
const ready = true
```
````

The plugin accepts the same display options as `highlight`: `cx`, `mark`, and `markLine`. See the
[API reference](https://github.com/huozhi/sugar-high/blob/main/docs/API.md#highlight-options).

## License

MIT
