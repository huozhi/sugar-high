---
"sugar-high": minor
---

Remove the `onQuote` and `templateStrings` core options. Presets that need custom words, such as Rust lifetimes and char literals or YAML apostrophes in plain scalars, now provide a sticky `word` pattern instead. Rust escaped char literals such as `'\''` are now kept together, and YAML words such as `don't` are one token.
