import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import { highlight } from '../lib/index.js'
import { parse, render } from '../lib/core.js'
import * as python from '../lib/lang/python.js'

const iterations = Number.parseInt(process.env.BENCH_ITERATIONS || '50000', 10)
const warmupIterations = Math.min(2000, iterations)
const source = `\
from dataclasses import dataclass

@dataclass
class User:
    name: str
    active: bool = True

def greeting(user: User) -> str:
    # Render a friendly message
    return f"Hello, {user.name}!"
`

function benchmark(name, run) {
  let bytes = 0
  for (let i = 0; i < warmupIterations; i++) bytes += run().length

  const start = process.hrtime.bigint()
  for (let i = 0; i < iterations; i++) bytes += run().length
  const elapsedNs = Number(process.hrtime.bigint() - start)
  const seconds = elapsedNs / 1e9

  return {
    name,
    milliseconds: seconds * 1000,
    operationsPerSecond: iterations / seconds,
    bytes,
  }
}

function measureBundle(entry, output) {
  execFileSync(process.env.BUN_BIN || 'bun', [
    'build', entry, '--bundle', '--minify', '--target=browser', `--outfile=${output}`,
  ], { stdio: 'pipe' })

  const bundled = readFileSync(output)
  return {
    minified: bundled.byteLength,
    gzip: gzipSync(bundled, { level: 9 }).byteLength,
    brotli: brotliCompressSync(bundled, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).byteLength,
  }
}

const formatSize = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`
const formatRate = (rate) => `${Math.round(rate).toLocaleString('en-US')} ops/s`
const benchmarkDir = mkdtempSync(join(tmpdir(), 'sugar-high-benchmark-'))
const markdown = process.argv.includes('--markdown')
const comparePerformance = process.argv.includes('--perf')
const baseIndex = process.argv.indexOf('--base')
const base = baseIndex === -1 ? undefined : process.argv[baseIndex + 1]

// Languages supported by every 2.x release, with enough code per sample to exercise each lexer.
const samples = {
  javascript: 'import { readFile } from "node:fs/promises"\nexport async function load(path, { retries = 3 } = {}) {\n  // Retry transient failures\n  for (let i = 0; i < retries; i++) {\n    try { return JSON.parse(await readFile(path, "utf8")) } catch (error) { if (i === retries - 1) throw error }\n  }\n}\nconst view = <List items={users.filter(u => u.active)} render={(u) => `${u.name} (${u.id})`} />\n',
  typescript: 'interface User { id: number; name: string; roles: readonly string[] }\nexport class Store<T extends User> {\n  #items = new Map<number, T>()\n  get(id: number): T | undefined { return this.#items.get(id) }\n  set(item: T): this { this.#items.set(item.id, item); return this }\n}\ntype Status = "idle" | "loading" | `error:${string}`\n',
  css: '@media (min-width: 640px) {\n  .card-header, .button--primary:hover {\n    background-color: #0d6efd;\n    margin: -1rem calc(100% - 2px);\n    --accent-color: rgba(13, 110, 253, 0.5);\n    -webkit-font-smoothing: antialiased;\n  }\n}\n',
  html: '<!doctype html>\n<section class="hero" data-id="1">\n  <h1>Hello <em>world</em></h1>\n  <style>.hero { color: #fff; }</style>\n  <script>document.querySelector(".hero").hidden = false</script>\n</section>\n',
  python: '@dataclass\nclass User:\n    name: str\n    active: bool = True\n\ndef greeting(user: User) -> str:\n    # Render a friendly message\n    return f"Hello, {user.name}!" if user.active else "Bye"\n',
  rust: "use std::collections::HashMap;\npub struct Parser<'a> { input: &'a str, cache: HashMap<&'a str, usize> }\nimpl<'a> Parser<'a> {\n    pub fn next(&mut self) -> Option<char> {\n        let c = '\\n'; // newline\n        for i in 0..self.input.len() { if i > 2 { return Some(c) } }\n        None\n    }\n}\n",
  go: 'package main\n\nimport "fmt"\n\ntype User struct {\n\tName string `json:"name"`\n}\n\nfunc (u *User) Greet(args ...string) error {\n\t// Print a greeting\n\tfmt.Printf("hi %s %v\\n", u.Name, args)\n\treturn nil\n}\n',
  json: '{\n  "name": "sugar-high",\n  "version": "1.0.0",\n  "keywords": ["syntax", "highlight"],\n  "private": false,\n  "config": { "port": 8080, "debug": null }\n}\n',
  yaml: 'name: Test\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo "don\'t stop" # comment\n',
}

/**
 * Prepare the comparison base: a git ref, or a published package such as `npm:sugar-high@latest`.
 * @returns {{ directory: string, label: string, cleanup: () => void }}
 */
function prepareBase(ref) {
  const directory = join(benchmarkDir, 'base')
  if (ref.startsWith('npm:')) {
    const tarball = execFileSync('npm', ['pack', ref.slice(4), '--silent', '--pack-destination', benchmarkDir], { encoding: 'utf8' }).trim().split('\n').pop()
    mkdirSync(directory)
    execFileSync('tar', ['-xzf', join(benchmarkDir, tarball), '-C', directory])
    const { version } = JSON.parse(readFileSync(join(directory, 'package/package.json'), 'utf8'))
    return { directory: join(directory, 'package'), label: version, cleanup() {} }
  }
  execFileSync('git', ['worktree', 'add', '--detach', directory, ref], { stdio: 'pipe' })
  return {
    directory: join(directory, 'packages/sugar-high'),
    label: ref,
    cleanup: () => execFileSync('git', ['worktree', 'remove', '--force', directory], { stdio: 'pipe' }),
  }
}

/** Time both versions in alternating rounds so runner noise affects them alike. */
async function compareHighlight(baseDirectory, currentDirectory) {
  const load = async (directory) => (await import(pathToFileURL(join(directory, 'lib/index.js')).href)).highlight
  const [baseHighlight, currentHighlight] = await Promise.all([load(baseDirectory), load(currentDirectory)])
  const rounds = 21
  const results = []
  for (const [lang, sample] of Object.entries(samples)) {
    const code = sample.repeat(20)
    let iterations = 1
    const time = (highlight) => {
      const start = process.hrtime.bigint()
      for (let i = 0; i < iterations; i++) highlight(code, { lang })
      return Number(process.hrtime.bigint() - start) / iterations
    }
    // Warm up both versions, then size each sample to roughly 15 ms.
    for (let i = 0; i < 20; i++) time(baseHighlight), time(currentHighlight)
    iterations = Math.max(1, Math.round(15e6 / time(currentHighlight)))
    const baseTimes = []
    const currentTimes = []
    for (let round = 0; round < rounds; round++) {
      baseTimes.push(time(baseHighlight))
      currentTimes.push(time(currentHighlight))
    }
    // Noise only adds time, so the fastest round is the most repeatable estimate.
    results.push({ lang, bytes: code.length, base: Math.min(...baseTimes), current: Math.min(...currentTimes) })
  }
  return results
}

const formatThroughput = (bytes, nanoseconds) => `${(bytes / nanoseconds * 1e3).toFixed(1)} MB/s`
function formatSpeed(current, previous) {
  const change = (previous / current - 1) * 100
  if (Math.abs(change) < 5) return `≈ (${change < 0 ? '−' : '+'}${Math.abs(change).toFixed(1)}%)`
  return `${change > 0 ? '+' : '−'}${Math.abs(change).toFixed(1)}% ${change > 0 ? 'faster' : 'slower'}`
}

function measureSizes(directory, prefix) {
  const javascriptEntry = join(benchmarkDir, `${prefix}-javascript-entry.js`)
  const languageDirectory = existsSync(join(directory, 'lib/lang/javascript.js'))
    ? 'lang'
    : 'presets/lang'
  writeFileSync(javascriptEntry, [
    `import { parse, render } from ${JSON.stringify(join(directory, 'lib/core.js'))}`,
    `import * as javascript from ${JSON.stringify(join(directory, `lib/${languageDirectory}/javascript.js`))}`,
    'export const run = code => render(parse(code, javascript))',
  ].join('\n'))

  const sizes = {
    'sugar-high': measureBundle(join(directory, 'lib/index.js'), join(benchmarkDir, `${prefix}-builtin.js`)),
    'sugar-high/core': measureBundle(join(directory, 'lib/core.js'), join(benchmarkDir, `${prefix}-core.js`)),
    'core + javascript': measureBundle(javascriptEntry, join(benchmarkDir, `${prefix}-javascript.js`)),
  }
  if (existsSync(join(directory, 'lib/lang.js'))) {
    sizes['sugar-high/lang'] = measureBundle(join(directory, 'lib/lang.js'), join(benchmarkDir, `${prefix}-lang.js`))
  }
  return sizes
}

function formatDelta(current, previous) {
  const difference = current - previous
  if (!difference) return '—'
  const sign = difference > 0 ? '+' : '−'
  const percentage = Math.abs(difference / previous * 100).toFixed(1)
  return `${sign}${Math.abs(difference)} B (${sign}${percentage}%)`
}

try {
  const sizes = measureSizes(process.cwd(), 'current')

  if (markdown) {
    if (!base) throw new Error('--markdown requires --base <git-ref>')
    const prepared = prepareBase(base)
    try {
      const previous = measureSizes(prepared.directory, 'base')
      const release = base.startsWith('npm:')
      const baseLabel = release ? `${prepared.label} gzip` : 'Base gzip'
      const currentLabel = release ? 'Next gzip' : 'PR gzip'
      console.log(release ? '<!-- sugar-high-release-report -->' : '<!-- sugar-high-size-report -->')
      if (release) {
        console.log(`### Release compared with sugar-high@${prepared.label}`)
        console.log('')
        console.log('Every change since the latest published version, measured together.')
        console.log('')
        console.log('#### Bundle size')
      } else {
        console.log('### Bundle size')
      }
      console.log('')
      console.log(`| Entry | ${baseLabel} | ${currentLabel} | Change |`)
      console.log('| --- | ---: | ---: | ---: |')
      for (const name of Object.keys(sizes)) {
        if (!previous[name] || (!release && name !== 'sugar-high' && name !== 'sugar-high/core')) continue
        console.log(`| \`${name}\` | ${formatSize(previous[name].gzip)} | ${formatSize(sizes[name].gzip)} | ${formatDelta(sizes[name].gzip, previous[name].gzip)} |`)
      }
      console.log('')
      console.log('_Bun browser ESM bundle, minified and gzip-compressed._')

      if (comparePerformance) {
        const results = await compareHighlight(prepared.directory, process.cwd())
        console.log('')
        console.log(release ? '#### Highlight performance' : '### Highlight performance')
        console.log('')
        console.log(`| Language | ${release ? prepared.label : 'Base'} | ${release ? 'Next' : 'PR'} | Change |`)
        console.log('| --- | ---: | ---: | ---: |')
        for (const result of results) {
          console.log(`| ${result.lang} | ${formatThroughput(result.bytes, result.base)} | ${formatThroughput(result.bytes, result.current)} | ${formatSpeed(result.current, result.base)} |`)
        }
        console.log('')
        console.log('_`highlight()` to HTML on ~4–8 KB inputs; fastest of 21 alternating ~15 ms rounds on the same machine. Changes under 5% are within runner noise._')
      }
    } finally {
      prepared.cleanup()
    }
  }

  if (!markdown) {
    console.log(`Size (Bun browser ESM, minified)\n`)
    console.table(Object.entries(sizes).map(([name, size]) => ({
      entry: name,
      minified: formatSize(size.minified),
      gzip: formatSize(size.gzip),
      brotli: formatSize(size.brotli),
    })))

    const performance = [
      benchmark('builtin: { lang: "python" }', () => highlight(source, { lang: 'python' })),
      benchmark('core: parse and render python', () => render(parse(source, python))),
    ]

    console.log(`\nHighlight performance (${iterations.toLocaleString('en-US')} iterations)\n`)
    console.table(performance.map(result => ({
      benchmark: result.name,
      time: `${result.milliseconds.toFixed(1)} ms`,
      throughput: formatRate(result.operationsPerSecond),
    })))
  }
} finally {
  rmSync(benchmarkDir, { recursive: true, force: true })
}
