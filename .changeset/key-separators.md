---
"sugar-high": minor
---

Highlight keys before `=` or `:` as properties in TOML, YAML, and HCL, and Terraform block types such as `resource` and `variable` as keywords. The core `quotedKeys` option is replaced by `keys: ':' | '='`, which marks the bare word or quoted string before that separator as a property.
