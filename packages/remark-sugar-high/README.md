# remark-sugar-high

Remark plugin for [Sugar High](https://sugar-high.vercel.app) syntax highlighter.

[Website](https://remark-sugar-high.vercel.app/)


## Installation

```bash
$ npm i -S remark-sugar-high
```

## Usage

Input markdown file:

```
\`\`\`javascript {2,5}
// Here is a simple function
async function hello() {
    console.log('Hello, world from JavaScript!')
    return 123 // return a number
}

await hello()
\`\`\`
```

Using [remark](https://github.com/remarkjs/remark):

```js
const { highlight } = require('remark-sugar-high');

await remark()
  .use(highlight)
  .use(require('remark-html'))
  .process(file, (err, file) => console.log(String(file)));
```

<details>
<summary>Output HTML</summary>
<p>

```html
<pre
  class="sh-lang--javascript"
><code class="sh-lang--javascript" data-sh-language="javascript"><span class="sh__line"><span class="sh__token--comment" style="color: var(--sh-comment)">// Here is a simple function</span><span class="sh__token--line">
</span></span><span class="sh__line sh__line--highlighted"><span class="sh__token--comment" style="color: var(--sh-comment)"></span><span class="sh__token--keyword" style="color: var(--sh-keyword)">async</span><span class="sh__token--space" style="color: var(--sh-space)"> </span><span class="sh__token--keyword" style="color: var(--sh-keyword)">function</span><span class="sh__token--space" style="color: var(--sh-space)"> </span><span class="sh__token--identifier" style="color: var(--sh-identifier)">hello</span><span class="sh__token--sign" style="color: var(--sh-sign)">(</span><span class="sh__token--sign" style="color: var(--sh-sign)">)</span><span class="sh__token--space" style="color: var(--sh-space)"> </span><span class="sh__token--sign" style="color: var(--sh-sign)">{</span><span class="sh__token--break" style="color: var(--sh-break)"></span><span class="sh__token--line">
</span></span><span class="sh__line"><span class="sh__token--space" style="color: var(--sh-space)">    </span><span class="sh__token--identifier" style="color: var(--sh-identifier)">console</span><span class="sh__token--sign" style="color: var(--sh-sign)">.</span><span class="sh__token--property" style="color: var(--sh-property)">log</span><span class="sh__token--sign" style="color: var(--sh-sign)">(</span><span class="sh__token--string" style="color: var(--sh-string)">'</span><span class="sh__token--string" style="color: var(--sh-string)">Hello, world from JavaScript!</span><span class="sh__token--string" style="color: var(--sh-string)">'</span><span class="sh__token--sign" style="color: var(--sh-sign)">)</span><span class="sh__token--break" style="color: var(--sh-break)"></span><span class="sh__token--line">
</span></span><span class="sh__line"><span class="sh__token--space" style="color: var(--sh-space)">    </span><span class="sh__token--keyword" style="color: var(--sh-keyword)">return</span><span class="sh__token--space" style="color: var(--sh-space)"> </span><span class="sh__token--class" style="color: var(--sh-class)">123</span><span class="sh__token--space" style="color: var(--sh-space)"> </span><span class="sh__token--comment" style="color: var(--sh-comment)">// return a number</span><span class="sh__token--line">
</span></span><span class="sh__line sh__line--highlighted"><span class="sh__token--comment" style="color: var(--sh-comment)"></span><span class="sh__token--sign" style="color: var(--sh-sign)">}</span><span class="sh__token--break" style="color: var(--sh-break)"></span><span class="sh__token--line">
</span></span><span class="sh__line"><span class="sh__token--break" style="color: var(--sh-break)"></span><span class="sh__token--line">
</span></span><span class="sh__line"><span class="sh__token--keyword" style="color: var(--sh-keyword)">await</span><span class="sh__token--space" style="color: var(--sh-space)"> </span><span class="sh__token--identifier" style="color: var(--sh-identifier)">hello</span><span class="sh__token--sign" style="color: var(--sh-sign)">(</span><span class="sh__token--sign" style="color: var(--sh-sign)">)</span><span class="sh__token--line">
</span></span></code></pre>
```
</p>

</details>

Customize the color theme with sugar-high CSS variables. Check [sugar-high highlight-with-css section](https://github.com/huozhi/sugar-high#highlight-with-css) for more details.


## License

MIT
