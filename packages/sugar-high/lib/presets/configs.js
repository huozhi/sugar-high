// @ts-check

import * as c from '../lang/c.js'
import * as cpp from '../lang/cpp.js'
import * as csharp from '../lang/csharp.js'
import * as css from '../lang/css.js'
import * as diff from '../lang/diff.js'
import * as dockerfile from '../lang/dockerfile.js'
import * as go from '../lang/go.js'
import * as graphql from '../lang/graphql.js'
import * as hcl from '../lang/hcl.js'
import * as html from '../lang/html.js'
import * as java from '../lang/java.js'
import * as javascript from '../lang/javascript.js'
import * as json from '../lang/json.js'
import * as kotlin from '../lang/kotlin.js'
import * as markdown from '../lang/markdown.js'
import * as php from '../lang/php.js'
import * as plaintext from '../lang/plaintext.js'
import * as powershell from '../lang/powershell.js'
import * as python from '../lang/python.js'
import * as ruby from '../lang/ruby.js'
import * as rust from '../lang/rust.js'
import * as shell from '../lang/shell.js'
import * as sql from '../lang/sql.js'
import * as swift from '../lang/swift.js'
import * as toml from '../lang/toml.js'
import * as typescript from '../lang/typescript.js'
import * as yaml from '../lang/yaml.js'

/**
 * Disable JavaScript-only scanner modes for a non-JavaScript language.
 * @param {import('../core.js').ParseOptions} config
 * @returns {import('../core.js').ParseOptions}
 */
function nonJavaScript(config) {
  return {
    ...config,
    jsx: false,
    regex: false,
    templateStrings: false,
  }
}

/** @type {Record<string, import('../core.js').ParseOptions>} */
const configs = {
  javascript,
  typescript,
  css: nonJavaScript(css),
  python: nonJavaScript(python),
  c: nonJavaScript(c),
  go: nonJavaScript(go),
  java: nonJavaScript(java),
  rust: nonJavaScript(rust),
  json: nonJavaScript(json),
  diff: nonJavaScript(diff),
  shell: nonJavaScript(shell),
  cpp: nonJavaScript(cpp),
  csharp: nonJavaScript(csharp),
  sql: nonJavaScript(sql),
  html,
  yaml: nonJavaScript(yaml),
  markdown: nonJavaScript(markdown),
  plaintext: nonJavaScript(plaintext),
  ruby: nonJavaScript(ruby),
  kotlin: nonJavaScript(kotlin),
  swift: nonJavaScript(swift),
  php: nonJavaScript(php),
  toml: nonJavaScript(toml),
  powershell: nonJavaScript(powershell),
  dockerfile: nonJavaScript(dockerfile),
  graphql: nonJavaScript(graphql),
  hcl: nonJavaScript(hcl),
}

export { configs }
