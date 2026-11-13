// @ts-check

import * as c from '../lang/c.js'
import * as cpp from '../lang/cpp.js'
import * as csharp from '../lang/csharp.js'
import * as css from '../lang/css.js'
import * as diff from '../lang/diff.js'
import * as dockerfile from '../lang/dockerfile.js'
import * as go from '../lang/go.js'
import * as glsl from '../lang/glsl.js'
import * as graphql from '../lang/graphql.js'
import * as hcl from '../lang/hcl.js'
import * as html from '../lang/html.js'
import * as java from '../lang/java.js'
import * as javascript from '../lang/javascript.js'
import * as json from '../lang/json.js'
import * as kotlin from '../lang/kotlin.js'
import * as lua from '../lang/lua.js'
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
import * as svelte from '../lang/svelte.js'
import * as vue from '../lang/vue.js'
import * as yaml from '../lang/yaml.js'
import * as zig from '../lang/zig.js'

function createConfigs() {
  return {
    javascript,
    typescript,
    css: css,
    python: python,
    c: c,
    go: go,
    glsl: glsl,
    java: java,
    rust: rust,
    json: json,
    diff: diff,
    shell: shell,
    cpp: cpp,
    csharp: csharp,
    sql: sql,
    html,
    vue,
    svelte,
    yaml: yaml,
    markdown: markdown,
    plaintext: plaintext,
    ruby: ruby,
    kotlin: kotlin,
    swift: swift,
    php: php,
    toml: toml,
    powershell: powershell,
    dockerfile: dockerfile,
    graphql: graphql,
    hcl: hcl,
    zig: zig,
    lua: lua,
  }
}

const configs = /* @__PURE__ */ createConfigs()

/** @param {string | undefined} name */
function configFor(name) {
  return configs[name || 'javascript']
}

export {
  c, configFor, configs, cpp, csharp, css, diff, dockerfile, go, glsl, graphql, hcl, html, java,
  javascript, json, kotlin, lua, markdown, php, plaintext, powershell, python, ruby,
  rust, shell, sql, svelte, swift, toml, typescript, vue, yaml, zig,
}
