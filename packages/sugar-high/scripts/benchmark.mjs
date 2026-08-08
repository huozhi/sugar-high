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

try {
  const javascriptEntry = join(benchmarkDir, 'javascript-entry.js')
  writeFileSync(javascriptEntry, [
    `import { parse, render } from ${JSON.stringify(join(process.cwd(), 'lib/core.js'))}`,
    `import * as javascript from ${JSON.stringify(join(process.cwd(), 'lib/presets/lang/javascript.js'))}`,
    'export const run = code => render(parse(code, javascript))',
  ].join('\n'))

  const sizes = [
    ['sugar-high', measureBundle('lib/index.js', join(benchmarkDir, 'builtin.js'))],
    ['sugar-high/core', measureBundle('lib/core.js', join(benchmarkDir, 'core.js'))],
    ['core + javascript', measureBundle(javascriptEntry, join(benchmarkDir, 'javascript.js'))],
  ]

  console.log(`Size (Bun browser ESM, minified)\n`)
  console.table(sizes.map(([name, size]) => ({
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
} finally {
  rmSync(benchmarkDir, { recursive: true, force: true })
}
