# Sugar High

[![npm][npm-badge]][npm]

Super lightweight syntax highlighter for JavaScript and JSX—about **1 kB** minified and gzipped. Works in the browser or any JS runtime that can set HTML strings.

![Sugar High preview](https://repository-images.githubusercontent.com/453236442/e9c853e9-4af6-45c4-aa4a-c27afbf16a0d)

## Install

```sh
npm install sugar-high
```

## Usage

```js
import { highlight } from 'sugar-high'

const codeHTML = highlight(code)

document.querySelector('pre > code').innerHTML = codeHTML
```

### Language presets

The core highlighter targets JavaScript and JSX. For CSS, Rust, Python, and similar, import a preset from [`sugar-high/presets`](https://github.com/huozhi/sugar-high/tree/main/packages/sugar-high/lib/presets) and pass it into `highlight`:

```js
import { highlight } from 'sugar-high'
import { rust } from 'sugar-high/presets'

const html = highlight(source, { ...rust })
```

For more language presets and syntax color themes, see **[sugar-high.vercel.app](https://sugar-high.vercel.app/)**.

## Styling

Each line is wrapped in `sh__line`. Set **CSS custom properties** `--sh-*` on an ancestor (for example `:root`) to pick colors—inspect the output or the example below for the variable names you need.

Example theme:

```css
:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-property: #0550ae;
  --sh-entity: #249a97;
  --sh-jsxliterals: #6266d1;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
}
```

### Line numbers

Use a `::before` counter on `.sh__line` for gutter numbers:

```css
pre code {
  counter-reset: sh-line-number;
}

.sh__line::before {
  counter-increment: sh-line-number 1;
  content: counter(sh-line-number);
  margin-right: 24px;
  text-align: right;
  color: #a4a4a4;
}
```

### Highlighting a line

Target a line with `.sh__line:nth-child(<n>)` (1-based):

```css
.sh__line:nth-child(5) {
  background: #f5f5f5;
}
```

## Remark

Use the [remark plugin](https://sugar-high.vercel.app/remark) to highlight fenced code blocks when processing Markdown with [remark](https://remark.js.org/). Details: [`packages/remark-sugar-high`](https://github.com/huozhi/sugar-high/tree/main/packages/remark-sugar-high).

## License

MIT

<!-- Definitions -->

[npm-badge]: https://img.shields.io/npm/v/sugar-high.svg

[npm]: https://www.npmjs.com/package/sugar-high
