# Sugar High
### Introduction

Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped

![img](https://repository-images.githubusercontent.com/453236442/9416c941-9c40-4dbe-a73e-0e0d21993802)

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
  color: #03066e;
}
```

### LICENSE

MIT

