---
"sugar-high": major
---

Remove the experimental `sugar-high/gpu` entry point and the optional `gpu-lexer` dependency to keep highlighting on the existing language-aware lexer.

Replace GPU imports with `highlight` from `sugar-high` or `parse` from `sugar-high/core`. These APIs use synchronous parsing. Select a language explicitly when needed: `highlight` accepts a language name, while core `parse` accepts a configuration imported from `sugar-high/lang/<language>`. Language-agnostic GPU inference is no longer available.
