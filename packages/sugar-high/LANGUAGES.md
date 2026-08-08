# Language support plan

Sugar High uses one canonical language name and one preferred file extension for each
highlighter. Similar dialects are compatibility aliases, not separate highlighters.

For example, `bash`, `sh`, and `zsh` all resolve to the `shell` language, whose preferred
extension is `.sh`. Likewise, `jsonc` resolves to `json`; JSON comment support lives in the JSON
highlighter instead of a second preset.

## Canonical catalog

| Language | Extension | Accepted aliases | Status |
| --- | --- | --- | --- |
| `javascript` | `.js` | `js`, `jsx`, `node` | Core |
| `typescript` | `.ts` | `ts`, `tsx` | Core |
| `css` | `.css` | `scss` | Supported |
| `python` | `.py` | `py`, `python3` | Supported |
| `c` | `.c` | - | Supported |
| `go` | `.go` | `golang` | Supported |
| `java` | `.java` | - | Supported |
| `rust` | `.rs` | `rs` | Supported |
| `json` | `.json` | `jsonc` | Supported; comments planned |
| `diff` | `.diff` | `patch` | Supported |
| `html` | `.html` | `htm`, `xml` | Supported |
| `shell` | `.sh` | `sh`, `bash`, `zsh` | Supported |
| `cpp` | `.cpp` | `c++`, `cc`, `cxx` | Supported |
| `csharp` | `.cs` | `c#`, `cs`, `dotnet` | Supported |
| `sql` | `.sql` | - | Supported |
| `yaml` | `.yaml` | `yml` | Supported |
| `markdown` | `.md` | `md`, `mdx` | Supported |
| `kotlin` | `.kt` | `kts` | Supported |
| `swift` | `.swift` | - | Supported |
| `php` | `.php` | - | Supported |
| `toml` | `.toml` | - | Supported |
| `powershell` | `.ps1` | `pwsh` | Supported |
| `dockerfile` | `.dockerfile` | `docker` | Supported |
| `graphql` | `.graphql` | `gql` | Supported |
| `hcl` | `.hcl` | `terraform`, `tf` | Supported |

An alias only affects language lookup. It does not create another export, implementation, or test
matrix. The canonical name is used in generated classes and `data-sh-language` attributes.

## Public API

Canonical language names are the configurable API. The option is named `lang`, not `language`,
and integrations can normalize aliases before highlighting.

```js
import { highlight } from 'sugar-high'

highlight(source, { lang: 'python' })
highlight(source, { lang: 'json' })
highlight(source, { lang: 'diff' })
highlight(source, { lang: 'rust' })
```

The registry exposes canonical metadata and predictable resolution:

```js
import { lang } from 'sugar-high/lang'

lang('bash')  // shell; integration normalization
lang('.yml') // yaml; integration normalization
lang('jsonc') // json
```

The root highlighting option accepts canonical names only. The resolver accepts canonical names,
aliases, and extensions; unknown values return `undefined`, allowing integrations to choose a
fallback or an error.

## Architecture work

1. Add a typed registry containing canonical name, preferred extension, aliases, and preset.
2. Route direct highlighting and the Remark plugin through the same resolver.
3. Make JavaScript-only tokenizer behavior configurable: JSX, regular expressions, and template
   strings must be possible to disable for other languages.
4. Add reusable scanner rules for strings, line comments, block comments, and multiline constructs.
   Keep the existing callbacks as escape hatches.
5. Build shared language families (`clike`, `hash-comment`, `markup`, and `document`) without
   merging distinct public languages such as C++ and C#.
6. Add first-wave definitions and fixtures, then add the second wave after the scanner surface is
   stable.

## Delivery

The registry, scanner primitives, first-wave languages, and integration changes should remain
separate reviewable units. If they do not fit cleanly in one pull request, deliver them as stacked
PRs with `gh stack`, preserving this dependency order:

1. Canonical registry and public API.
2. Scanner primitives and language families.
3. First-wave languages and JSON comment support.
4. Second-wave languages.
5. Remark integration, documentation, and final bundle-size checks.

Every language needs fixtures for representative syntax, incomplete input, escaping, and source
round-tripping. Alias collision tests enforce the one-name/one-extension contract.
