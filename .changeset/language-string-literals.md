---
"sugar-high": minor
---

Highlight raw, multiline, and verbatim strings so code after them is no longer treated as a string. This covers Go raw strings, Kotlin, Python, Java, Swift, GraphQL, and TOML triple-quoted strings, C# verbatim and raw strings, Rust and C++ raw strings, and single quotes without backslash escapes in shell, SQL, PowerShell, and TOML. The core `onLiteral` option is replaced by `string`, a sticky (`y`) pattern for a language's string literals; configurations without it keep the default `"` and `'` strings. Browsers now need regular expression lookbehind support (Safari 16.4 or later).
