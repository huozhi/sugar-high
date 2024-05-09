# Sugar High

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]

### Introduction

Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped

![img](https://repository-images.githubusercontent.com/453236442/aa0db684-bad3-4cd3-a420-f4e53b8c6757)

### Usage

```sh
npm install --save sugar-high
```

```js
import { highlight } from 'sugar-high'

const codeHTML = highlight(code)

document.querySelector('pre > code').innerHTML = codeHTML
```

### Highlight with CSS

Then make your own theme with customized colors by token type and put in global CSS. The corresponding class names start with `--sh-` prefix.

```css
/**
 * Types that sugar-high have:
 *
 * identifier
 * keyword
 * string
 * Class, number and null
 * property
 * entity
 * jsx literals
 * sign
 * comment
 * break
 * space
 */
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

### Features

#### Line number

Sugar high provide `.sh_line` class name for each line. To display line number, define the `.sh_line::before` element with CSS will enable line numbers automatically.

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

### Line Highlight

Use `.sh__line:nth-child(<line number>)` to highlight specific line.

```css
.sh__line:nth-child(5) {
  background: #f5f5f5;
}
```

#### CSS Class Names

You can use `.sh__token--<token type>` to customize the output node of each token.

```css
.sh__token--keyword {
  background: #f47067;
}
```

### LICENSE

MIT

<!-- Definitions -->

[build-badge]: https://github.com/huozhi/sugar-high/workflows/Test/badge.svg

[build]: https://github.com/huozhi/sugar-high/actions

[coverage-badge]: https://badge.fury.io/js/sugar-high.svg

[coverage]: https://codecov.io/github/huozhi/sugar-high

[downloads-badge]: https://img.shields.io/npm/dm/sugar-high.svg

[downloads]: https://www.npmjs.com/package/sugar-high
