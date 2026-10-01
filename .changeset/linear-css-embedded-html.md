---
'sugar-high': patch
---

Keep CSS and embedded HTML tokenization linear on large inputs: large stylesheets no longer slow down quadratically, and large HTML, Vue, and Svelte sources no longer overflow the call stack.
