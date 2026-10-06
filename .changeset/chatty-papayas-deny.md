---
"@sugar-high/react": major
"sugar-high": major
---

Remove the experimental `sugar-high/gpu` and `@sugar-high/react/gpu` entry points and the optional `gpu-lexer` dependency to keep highlighting on the existing language-aware lexer.

Replace GPU imports with `highlight` from `sugar-high`, `parse` from `sugar-high/core`, or `Code` and `Editor` from `@sugar-high/react`. These APIs use synchronous parsing. Select a language explicitly when needed: `highlight` and the default React components accept a language name, while core `parse` accepts a configuration imported from `sugar-high/lang/<language>`. Language-agnostic GPU inference is no longer available.
