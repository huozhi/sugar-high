import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import { highlight } from '../lib/index.js'
import { parse, render } from '../lib/core.js'
import * as python from '../lib/presets/lang/python.js'

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
const baseIndex = process.argv.indexOf('--base')
const base = baseIndex === -1 ? undefined : process.argv[baseIndex + 1]

function measureSizes(directory, prefix) {
  const javascriptEntry = join(benchmarkDir, `${prefix}-javascript-entry.js`)
  writeFileSync(javascriptEntry, [
    `import { parse, render } from ${JSON.stringify(join(directory, 'lib/core.js'))}`,
    `import * as javascript from ${JSON.stringify(join(directory, 'lib/presets/lang/javascript.js'))}`,
    'export const run = code => render(parse(code, javascript))',
  ].join('\n'))

  return {
    'sugar-high': measureBundle(join(directory, 'lib/index.js'), join(benchmarkDir, `${prefix}-builtin.js`)),
    'sugar-high/core': measureBundle(join(directory, 'lib/core.js'), join(benchmarkDir, `${prefix}-core.js`)),
    'core + javascript': measureBundle(javascriptEntry, join(benchmarkDir, `${prefix}-javascript.js`)),
  }
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
    const baseDirectory = join(benchmarkDir, 'base')
    execFileSync('git', ['worktree', 'add', '--detach', baseDirectory, base], { stdio: 'pipe' })
    try {
      const previous = measureSizes(join(baseDirectory, 'packages/sugar-high'), 'base')
      console.log('<!-- sugar-high-size-report -->')
      console.log('### Bundle size')
      console.log('')
      console.log('| Entry | Base gzip | PR gzip | Change |')
      console.log('| --- | ---: | ---: | ---: |')
      for (const name of ['sugar-high', 'sugar-high/core']) {
        console.log(`| \`${name}\` | ${formatSize(previous[name].gzip)} | ${formatSize(sizes[name].gzip)} | ${formatDelta(sizes[name].gzip, previous[name].gzip)} |`)
      }
      console.log('')
      console.log('_Bun browser ESM bundle, minified and gzip-compressed._')
    } finally {
      execFileSync('git', ['worktree', 'remove', '--force', baseDirectory], { stdio: 'pipe' })
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
