---
"sugar-high": patch
---

Tokenize CSS hyphenated names such as `font-size`, `--color`, and `-webkit-box` while lexing instead of rejoining them afterwards, making CSS highlighting faster and smaller. Class names that start with a hyphen, such as `.-mx-1`, are now highlighted like other class names.
