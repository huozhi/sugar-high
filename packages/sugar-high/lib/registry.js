// @ts-check

import * as c from './presets/lang/c.js'
import * as cpp from './presets/lang/cpp.js'
import * as csharp from './presets/lang/csharp.js'
import * as css from './presets/lang/css.js'
import * as diff from './presets/lang/diff.js'
import * as dockerfile from './presets/lang/dockerfile.js'
import * as go from './presets/lang/go.js'
import * as html from './presets/lang/html.js'
import * as graphql from './presets/lang/graphql.js'
import * as hcl from './presets/lang/hcl.js'
import * as java from './presets/lang/java.js'
import * as json from './presets/lang/json.js'
import * as javascript from './presets/lang/javascript.js'
import * as kotlin from './presets/lang/kotlin.js'
import * as markdown from './presets/lang/markdown.js'
import * as php from './presets/lang/php.js'
import * as powershell from './presets/lang/powershell.js'
import * as python from './presets/lang/python.js'
import * as rust from './presets/lang/rust.js'
import * as shell from './presets/lang/shell.js'
import * as sql from './presets/lang/sql.js'
import * as swift from './presets/lang/swift.js'
import * as toml from './presets/lang/toml.js'
import * as typescript from './presets/lang/typescript.js'
import * as yaml from './presets/lang/yaml.js'
import { languages } from './lang.js'

const configs = {
  c, cpp, csharp, css, diff, dockerfile, go, graphql, hcl, html, java, javascript,
  json, kotlin, markdown, php, powershell, python, rust, shell, sql, swift, toml,
  typescript, yaml,
}

const javascriptModes = new Set(['javascript', 'typescript', 'html'])

/** @type {import('./registry.js').Registry} */
const registry = Object.freeze(languages.map(language => Object.freeze({
  ...language,
  config: javascriptModes.has(language.id)
    ? configs[language.id]
    : {
        ...configs[language.id],
        jsx: false,
        regex: false,
        templateStrings: false,
      },
})))

export { registry }
