# Sugar High
### Introduction

Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped

> ⚠️ Still in experiment! Use it in production with caution!

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

Then make your own theme with customized colors and put in global CSS

```css
/*
 * 0 - comment
 * 1 - keyword
 * 2 - break
 * 3 - string
 * 4 - space
 * 5 - sign
 * 6 - identifier
 * 7 - Class, number and null
 */
.sh__7 {
  color: #3476cb;
}
.sh__6 {
  color: #2d333b;
}
.sh__5 {
  color: #818c9b;
  font-weight: bold;
}
.sh__3 {
  color: #00a99a;
}
.sh__1 {
  color: #f47067;
}
.sh__0 {
  color: #818c9b;
}
```

### LICENSE

MIT

