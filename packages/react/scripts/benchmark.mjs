import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const directory = mkdtempSync(join(process.cwd(), '.react-benchmark-'))

function measure(name, source) {
  const entry = join(directory, `${name}.js`)
  const output = join(directory, `${name}.bundle.js`)
  writeFileSync(entry, source)
  execFileSync(process.env.BUN_BIN || 'bun', [
    'build', entry, '--bundle', '--minify', '--target=browser',
    '--external=react', '--external=react/jsx-runtime', `--outfile=${output}`,
  ], { stdio: 'pipe' })

  const bundled = readFileSync(output)
  return {
    entry: name.replaceAll('-', ' + '),
    minified: `${(bundled.byteLength / 1024).toFixed(2)} KiB`,
    gzip: `${(gzipSync(bundled, { level: 9 }).byteLength / 1024).toFixed(2)} KiB`,
  }
}

try {
  console.table([
    measure('react', `
      import { createElement } from 'react'
      import { Code } from '@sugar-high/react'
      export const render = code => createElement(Code, null, code)
    `),
    measure('core-python', `
      import { createElement } from 'react'
      import { Code } from '@sugar-high/react/core'
      import * as python from 'sugar-high/lang/python'
      export const render = code => createElement(Code, { lang: python }, code)
    `),
    measure('headless-python', `
      import { createElement } from 'react'
      import { Highlight } from '@sugar-high/react/core'
      import * as python from 'sugar-high/lang/python'
      export const render = code => createElement(
        Highlight,
        {
          code,
          lang: python,
          render: ({ lines }) => createElement('pre', null, lines.map((line, index) =>
            createElement('span', { key: index, ...line.properties }, line.tokens.map(token => token.value))
          )),
        }
      )
    `),
    measure('core-python-json-css', `
      import { createElement } from 'react'
      import { Code } from '@sugar-high/react/core'
      import * as python from 'sugar-high/lang/python'
      import * as json from 'sugar-high/lang/json'
      import * as css from 'sugar-high/lang/css'
      const languages = { python, json, css }
      export const render = (code, lang) => createElement(Code, { lang: languages[lang] }, code)
    `),
  ])
} finally {
  rmSync(directory, { recursive: true, force: true })
}
