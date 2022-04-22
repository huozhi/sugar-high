# Sugar High
### Introduction

Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped

![img](https://repository-images.githubusercontent.com/453236442/94994be5-72fa-479f-8b87-2dc14fe40329)

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

Then make your own theme with customized colors by token type and put in global CSS. The corresponding class names star with `sh__` prefix.

```css
/**
 * Types that sugar-high have:
 *
 * identifier
 * keyword
 * string
 * Class, number and null
 * sign
 * comment
 * jsxliterals
 */
.sh__class {
  color: #2d5e9d;
}
.sh__identifier {
  color: #2d333b;
}
.sh__sign {
  color: #8996a3;
}
.sh__string {
  color: #00a99a;
}
.sh__keyword {
  color: #f47067;
}
.sh__comment {
  color: #a19595;
}
.sh__jsxliterals {
  color: #6266d1;
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

### LICENSE

MIT

