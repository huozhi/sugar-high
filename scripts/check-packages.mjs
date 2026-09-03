import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const temporary = mkdtempSync(join(tmpdir(), 'sugar-high-packages-'))

const run = (command, args, cwd = root) => execFileSync(command, args, {
  cwd,
  stdio: 'inherit',
})

// Package managers set npm_execpath for scripts. Reuse it so nested commands run
// the same pnpm version.
const runPnpm = (args, cwd = root) => process.env.npm_execpath
  ? run(process.env.npm_execpath, args, cwd)
  : run('pnpm', args, cwd)

const pack = (directory, name) => {
  runPnpm(['pack', '--pack-destination', temporary], join(root, directory))
  return join(temporary, readdirSync(temporary).find(file => file.startsWith(name) && file.endsWith('.tgz')))
}

try {
  const sugarHigh = pack('packages/sugar-high', 'sugar-high-')
  const react = pack('packages/react', 'sugar-high-react-')
  const remark = pack('packages/remark', 'sugar-high-remark-')

  writeFileSync(join(temporary, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
    dependencies: {
      '@sugar-high/react': `file:${react}`,
      '@sugar-high/remark': `file:${remark}`,
      '@types/react': '^19.2.0',
      react: '^19.2.0',
      'sugar-high': `file:${sugarHigh}`,
    },
  }, null, 2))

  writeFileSync(join(temporary, 'pnpm-workspace.yaml'), `
packages:
  - '.'
overrides:
  '@sugar-high/remark>sugar-high': ${JSON.stringify(`file:${sugarHigh}`)}
`)

  writeFileSync(join(temporary, 'check.mjs'), `
import { highlight } from 'sugar-high'
import { generate, parse, render, tokenize, SugarHigh } from 'sugar-high/core'
import { lang, languages } from 'sugar-high/lang'
import { Code, Editor } from '@sugar-high/react'
import { taffy, vercel } from '@sugar-high/react/themes'
import remarkSugarHigh, { highlight as remarkHighlight } from '@sugar-high/remark'

if (!highlight('const ready = true').includes('sh__token--keyword')) throw new Error('root export')
if (!render(parse('const ready = true')).includes('sh__line')) throw new Error('core export')
if (generate(parse('value'))[0].children[0].tokenType !== 'identifier') throw new Error('generated nodes')
if (!tokenize('value').length || !SugarHigh.TokenMap.size) throw new Error('low-level core')
if (lang('py') !== 'python' || !languages.length) throw new Error('language exports')
if (!Editor || !Code || remarkSugarHigh !== remarkHighlight) throw new Error('integration exports')
if (taffy.dark.background !== '#25272d') throw new Error('React theme exports')
if (vercel.light.keyword !== '#c41562') throw new Error('Vercel theme export')
`)

  writeFileSync(join(temporary, 'check.ts'), `
import { highlight, type HighlightOptions, type LanguageName } from 'sugar-high'
import { generate, parse, render, tokenize, SugarHigh } from 'sugar-high/core'
import { lang, languages } from 'sugar-high/lang'
import { Code, Editor, type Theme } from '@sugar-high/react'
import { taffy, vercel } from '@sugar-high/react/themes'
import remarkSugarHigh, { highlight as remarkHighlight } from '@sugar-high/remark'

const language: LanguageName = 'typescript'
const options: HighlightOptions = { lang: language, cx: { keyword: 'bold' } }
highlight('const ready = true', options)
render(parse('value'))
generate(parse('value'))[0].children[0].tokenType
tokenize('value')
SugarHigh.TokenMap.size
lang('tsx')
languages.length
Editor
Code
const customTheme: Theme = { background: '#fff', foreground: '#111', keyword: '#f00' }
customTheme
taffy
vercel
remarkSugarHigh
remarkHighlight
`)

  runPnpm(['install', '--prefer-offline', '--ignore-scripts'], temporary)
  run('node', ['check.mjs'], temporary)
  runPnpm([
    '--filter', 'sugar-high', 'exec', 'tsc', '--noEmit', '--strict', '--skipLibCheck',
    '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--target', 'ES2022',
    join(temporary, 'check.ts'),
  ])
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
