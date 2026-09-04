import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { cpus, tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'

const script = fileURLToPath(import.meta.url)
const sugarHighVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version
const engines = [
  { id: 'sugar-high', label: 'Sugar High', version: sugarHighVersion },
  { id: 'prismjs', label: 'PrismJS', version: '1.30.0' },
  { id: 'highlight.js', label: 'highlight.js', version: '11.12.0' },
]
const phases = [
  { id: 'sugar-high-parse', label: 'parse' },
  { id: 'sugar-high-render', label: 'render parsed result' },
]

function positiveNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function sourceBlock(index) {
  return `
interface User${index} {
  id: number
  name: string
  roles: readonly string[]
  active: boolean
}

export class UserService${index} {
  #cache = new Map<number, User${index}>()

  async find(id: number): Promise<User${index} | null> {
    // Return a cached user before requesting the API.
    const cached = this.#cache.get(id)
    if (cached?.active) return cached

    const response = await fetch(\`/api/users/\${id}?source=benchmark\`)
    if (!response.ok) return null

    const user = (await response.json()) as User${index}
    this.#cache.set(id, user)
    return { ...user, roles: user.roles.filter(Boolean) }
  }
}
`
}

function makeSource(targetBytes) {
  const blocks = [
    "import type { ReadonlyDeep } from './types'\n",
    "export type Status = 'idle' | 'loading' | 'ready' | 'error'\n",
  ]
  let bytes = blocks[0].length + blocks[1].length

  for (let index = 0; bytes < targetBytes; index++) {
    const block = sourceBlock(index)
    blocks.push(block)
    bytes += block.length
  }

  return blocks.join('')
}

function comparisonModule(...path) {
  const directory = process.env.SUGAR_HIGH_BENCH_MODULES
  if (!directory) throw new Error('Comparison packages are not installed. Run the benchmark through pnpm.')
  return pathToFileURL(join(directory, 'node_modules', ...path)).href
}

async function loadHighlighter(engine) {
  if (engine === 'sugar-high') {
    const { highlight } = await import('../lib/index.js')
    return source => highlight(source, { lang: 'typescript' })
  }

  if (engine === 'prismjs') {
    const { default: Prism } = await import(comparisonModule('prismjs', 'prism.js'))
    await import(comparisonModule('prismjs', 'components', 'prism-typescript.js'))
    return source => Prism.highlight(source, Prism.languages.typescript, 'typescript')
  }

  if (engine === 'highlight.js') {
    const [{ default: hljs }, { default: typescript }] = await Promise.all([
      import(comparisonModule('highlight.js', 'es', 'core.js')),
      import(comparisonModule('highlight.js', 'es', 'languages', 'typescript.js')),
    ])
    hljs.registerLanguage('typescript', typescript)
    return source => hljs.highlight(source, { language: 'typescript', ignoreIllegals: true }).value
  }

  throw new Error(`Unknown highlighter: ${engine}`)
}

async function loadOperation(engine, source) {
  if (engine === 'sugar-high-parse' || engine === 'sugar-high-render') {
    const [{ parse, render }, typescript] = await Promise.all([
      import('../lib/core.js'),
      import('../lib/lang/typescript.js'),
    ])
    if (engine === 'sugar-high-parse') return () => parse(source, typescript)

    const parsed = parse(source, typescript)
    return () => render(parsed)
  }

  const highlight = await loadHighlighter(engine)
  return () => highlight(source)
}

function resultWeight(result) {
  return typeof result === 'string' ? result.length : result.lines.length
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

async function runWorker() {
  const engine = process.argv[3]
  const targetKiB = positiveNumber(process.argv[4], 100)
  const iterations = Math.ceil(positiveNumber(process.argv[5], 3))
  const runs = Math.ceil(positiveNumber(process.argv[6], 3))
  const source = makeSource(targetKiB * 1024)
  const sourceBytes = Buffer.byteLength(source)
  const operation = await loadOperation(engine, source)
  let output = operation()

  if (typeof output === 'string' && !output.includes('<span')) {
    throw new Error(`${engine} did not produce highlighted HTML`)
  }
  if (typeof output !== 'string' && !Array.isArray(output.lines)) {
    throw new Error(`${engine} did not produce parsed lines`)
  }

  const outputBytes = typeof output === 'string' ? Buffer.byteLength(output) : undefined
  output = undefined

  const warmupIterations = Math.max(1, Math.min(10, Math.ceil(512 * 1024 / sourceBytes)))
  for (let index = 0; index < warmupIterations; index++) operation()

  global.gc?.()
  const heapBefore = process.memoryUsage().heapUsed
  let retainedResult = operation()
  global.gc?.()
  const retainedHeapMiB = Math.max(0, process.memoryUsage().heapUsed - heapBefore) / 1024 / 1024
  let checksum = resultWeight(retainedResult)
  retainedResult = undefined
  global.gc?.()

  const samples = []
  for (let run = 0; run < runs; run++) {
    global.gc?.()
    const start = process.hrtime.bigint()
    for (let iteration = 0; iteration < iterations; iteration++) {
      checksum += resultWeight(operation())
    }
    const elapsedSeconds = Number(process.hrtime.bigint() - start) / 1e9
    samples.push({
      milliseconds: elapsedSeconds * 1000 / iterations,
      mibPerSecond: sourceBytes * iterations / elapsedSeconds / 1024 / 1024,
    })
  }

  const throughput = samples.map(sample => sample.mibPerSecond)
  const result = {
    engine,
    targetKiB,
    sourceBytes,
    outputBytes,
    iterations,
    runs,
    milliseconds: median(samples.map(sample => sample.milliseconds)),
    mibPerSecond: median(throughput),
    spreadPercent: (Math.max(...throughput) - Math.min(...throughput)) / median(throughput) * 100,
    retainedHeapMiB,
    checksum,
  }
  process.stdout.write(JSON.stringify(result))
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MiB`
    : `${(bytes / 1024).toFixed(0)} KiB`
}

function installComparisons() {
  const directory = mkdtempSync(join(tmpdir(), 'sugar-high-benchmark-'))
  const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
  process.stderr.write('Installing temporary benchmark comparisons...\n')

  try {
    execFileSync(pnpm, [
      'add',
      '--dir', directory,
      '--ignore-workspace',
      '--ignore-scripts',
      '--save-exact',
      '--lockfile=false',
      ...engines.slice(1).map(engine => `${engine.id}@${engine.version}`),
    ], { stdio: ['ignore', 'pipe', 'pipe'] })
    return directory
  } catch (error) {
    rmSync(directory, { recursive: true, force: true })
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

async function measureBundles(directory) {
  const sugar = fileURLToPath(new URL('../lib/', import.meta.url))
  const entries = {
    'sugar-high': `
      import { parse, render } from ${JSON.stringify(join(sugar, 'core.js'))}
      import * as typescript from ${JSON.stringify(join(sugar, 'lang/typescript.js'))}
      export const highlight = source => render(parse(source, typescript))
    `,
    'prismjs': `
      import Prism from 'prismjs/components/prism-core.js'
      import 'prismjs/components/prism-clike.js'
      import 'prismjs/components/prism-javascript.js'
      import 'prismjs/components/prism-typescript.js'
      export const highlight = source => Prism.highlight(source, Prism.languages.typescript, 'typescript')
    `,
    'highlight.js': `
      import hljs from 'highlight.js/lib/core'
      import typescript from 'highlight.js/lib/languages/typescript'
      hljs.registerLanguage('typescript', typescript)
      export const highlight = source => hljs.highlight(source, { language: 'typescript', ignoreIllegals: true }).value
    `,
  }
  const bun = process.env.BUN_BIN || 'bun'
  const bundles = []
  for (const engine of engines) {
    const entry = join(directory, `${engine.id}-entry.js`)
    const output = join(directory, `${engine.id}-bundle.mjs`)
    writeFileSync(entry, entries[engine.id])
    execFileSync(bun, ['build', entry, '--bundle', '--minify', '--target=browser', `--outfile=${output}`], { stdio: 'pipe' })
    const bundled = readFileSync(output)
    const { highlight } = await import(pathToFileURL(output).href)
    if (!highlight(sourceBlock(0)).includes('<span')) throw new Error(`${engine.id} bundle did not highlight TypeScript`)
    bundles.push({ engine: engine.id, minified: bundled.byteLength, gzip: gzipSync(bundled, { level: 9 }).byteLength })
  }
  return { bundler: `Bun ${execFileSync(bun, ['--version'], { encoding: 'utf8' }).trim()}`, language: 'typescript', results: bundles }
}

async function runBenchmarks(comparisonDirectory) {
  const bundles = await measureBundles(comparisonDirectory)
  const sizes = (process.env.BENCH_SIZES_KIB || '10,100,500')
    .split(',')
    .map(value => positiveNumber(value.trim(), 0))
    .filter(Boolean)
  const targetMiB = positiveNumber(process.env.BENCH_TARGET_MIB, 4)
  const runs = Math.ceil(positiveNumber(process.env.BENCH_RUNS, 3))
  const iterationOverride = positiveNumber(process.env.BENCH_ITERATIONS, 0)
  const results = []
  const phaseResults = []

  for (const size of sizes) {
    const iterations = iterationOverride || Math.max(3, Math.ceil(targetMiB * 1024 / size))
    for (const engine of engines) {
      const output = execFileSync(process.execPath, [
        '--expose-gc',
        script,
        '--worker',
        engine.id,
        String(size),
        String(iterations),
        String(runs),
      ], {
        encoding: 'utf8',
        env: { ...process.env, SUGAR_HIGH_BENCH_MODULES: comparisonDirectory },
        maxBuffer: 1024 * 1024,
      })
      results.push(JSON.parse(output))
    }
    for (const phase of phases) {
      const output = execFileSync(process.execPath, [
        '--expose-gc',
        script,
        '--worker',
        phase.id,
        String(size),
        String(iterations),
        String(runs),
      ], {
        encoding: 'utf8',
        env: { ...process.env, SUGAR_HIGH_BENCH_MODULES: comparisonDirectory },
        maxBuffer: 1024 * 1024,
      })
      phaseResults.push(JSON.parse(output))
    }
  }

  const report = results.map(result => {
    const sugarHigh = results.find(candidate => (
      candidate.sourceBytes === result.sourceBytes && candidate.engine === 'sugar-high'
    ))
    const engine = engines.find(candidate => candidate.id === result.engine)
    return {
      size: formatSize(result.sourceBytes),
      library: `${engine.label} ${engine.version}`,
      'ms / file': result.milliseconds.toFixed(2),
      throughput: `${result.mibPerSecond.toFixed(2)} MiB/s`,
      'vs Sugar High': `${(result.mibPerSecond / sugarHigh.mibPerSecond).toFixed(2)}×`,
      'sample range': `${result.spreadPercent.toFixed(1)}%`,
      '~heap / file': `${result.retainedHeapMiB.toFixed(1)} MiB`,
      'HTML / source': `${(result.outputBytes / result.sourceBytes).toFixed(2)}×`,
    }
  })

  const phaseReport = sizes.flatMap(size => {
    const sugarHigh = results.find(result => (
      result.engine === 'sugar-high' && result.targetKiB === size
    ))
    const matchingPhases = phaseResults.filter(result => result.targetKiB === size)
    return [
      { ...sugarHigh, label: 'parse + render' },
      ...phases.map(phase => ({
        ...matchingPhases.find(result => result.engine === phase.id),
        label: phase.label,
      })),
    ].map(result => ({
      size: formatSize(result.sourceBytes),
      phase: result.label,
      'ms / file': result.milliseconds.toFixed(2),
      'share of full': `${(result.milliseconds / sugarHigh.milliseconds * 100).toFixed(0)}%`,
      throughput: `${result.mibPerSecond.toFixed(2)} MiB/s`,
    }))
  })

  const snapshot = {
    measuredAt: new Date().toISOString(),
    engines,
    runtime: process.version,
    platform: `${process.platform} ${process.arch}`,
    cpu: cpus()[0]?.model,
    targetMiB,
    runs,
    results,
    phases: phaseResults,
    bundles,
  }

  if (process.argv.includes('--write')) {
    const readmeUrl = new URL('../README.md', import.meta.url)
    const readme = readFileSync(readmeUrl, 'utf8')
    const marker = /<!-- benchmark:start -->[\s\S]*?<!-- benchmark:end -->/
    if (!marker.test(readme)) throw new Error('README benchmark markers are missing')
    const rows = sizes.map(size => {
      const matching = results.filter(result => result.targetKiB === size)
      return `| ${formatSize(matching[0].sourceBytes)} | ${engines.map(engine => matching.find(result => result.engine === engine.id).milliseconds.toFixed(2)).join(' | ')} |`
    })
    const bundleRows = ['minified', 'gzip'].map(metric =>
      `| ${metric === 'gzip' ? 'Gzip' : 'Minified'} (KiB) | ${engines.map(engine => (bundles.results.find(result => result.engine === engine.id)[metric] / 1024).toFixed(2)).join(' | ')} |`
    )
    const markdown = [
      '<!-- benchmark:start -->',
      `Measured ${snapshot.measuredAt.slice(0, 10)} with Node ${snapshot.runtime}, ${snapshot.platform}, ${snapshot.cpu}.`,
      '',
      `| TypeScript | ${engines.map(engine => `${engine.label} ${engine.version}`).join(' | ')} |`,
      '| --- | ---: | ---: | ---: |',
      ...bundleRows,
      ...rows,
      '',
      `Median milliseconds per file; lower is better. ${runs} timed samples after warmup.`,
      'Sizes are TypeScript-only browser bundles, minified with Bun; gzip uses level 9. Theme CSS is excluded.',
      'Loading and initialization are excluded. Each library highlights the same generated TypeScript',
      'into HTML using an explicit language. Grammars and HTML output differ; this is not a measure',
      'of highlighting quality or browser rendering speed. Results vary by machine and workload.',
      '<!-- benchmark:end -->',
    ].join('\n')
    writeFileSync(new URL('../../../docs/benchmark-results.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n')
    writeFileSync(readmeUrl, readme.replace(marker, () => markdown))
    process.stderr.write('Updated docs/benchmark-results.json and packages/sugar-high/README.md\n')
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(snapshot, null, 2))
    return
  }

  console.log('Large TypeScript highlight-to-HTML benchmark')
  console.log(`${process.version} · ${process.platform} ${process.arch} · ${cpus()[0]?.model || 'unknown CPU'}`)
  console.log(`${runs} timed runs per row; median reported; about ${targetMiB} MiB processed per run\n`)
  console.table(report)
  console.log(`\nTypeScript-only browser bundles (${bundles.bundler})\n`)
  console.table(bundles.results.map(result => ({
    library: result.engine,
    minified: `${(result.minified / 1024).toFixed(2)} KiB`,
    gzip: `${(result.gzip / 1024).toFixed(2)} KiB`,
  })))
  console.log('\nSugar High phases\n')
  console.table(phaseReport)
  console.log('\nPhase timings are measured independently, so their percentages need not sum to exactly 100%.')
  console.log('Retained heap is approximate and includes the returned highlighted HTML.')
  console.log('\nThe libraries use different grammars and emit different HTML, so this measures public API cost rather than feature equivalence.')
}

async function runSuite() {
  const comparisonDirectory = installComparisons()
  try {
    await runBenchmarks(comparisonDirectory)
  } finally {
    rmSync(comparisonDirectory, { recursive: true, force: true })
  }
}

if (process.argv[2] === '--worker') await runWorker()
else await runSuite()
