# Benchmarks

Run benchmarks from the repository root.

## Bundle size and common highlighting

```sh
pnpm --filter sugar-high benchmark
```

This reports the minified, gzip, and Brotli sizes of the main entry points and measures the common
small-input highlighting path.

## Large-file comparison

```sh
pnpm --filter sugar-high benchmark:large
```

The benchmark installs pinned PrismJS and highlight.js versions into a temporary directory and
removes the directory when it finishes. These comparison libraries are not workspace dependencies.

It generates deterministic TypeScript inputs and reports:

- complete highlight-to-HTML time and throughput
- sample range across timed runs
- approximate retained heap, including returned HTML
- HTML-to-source size expansion
- separate Sugar High parse and render timings

The default input sizes are 10, 100, and 500 KiB. Customize the run with environment variables:

```sh
BENCH_SIZES_KIB=100,1000 BENCH_TARGET_MIB=8 BENCH_RUNS=5 pnpm --filter sugar-high benchmark:large
```

- `BENCH_SIZES_KIB`: comma-separated target input sizes
- `BENCH_TARGET_MIB`: approximate amount processed by each timed run
- `BENCH_RUNS`: number of timed samples; the median is reported
- `BENCH_ITERATIONS`: fixed iterations per sample, overriding `BENCH_TARGET_MIB`

Pass `--json` directly to the script for machine-readable results:

```sh
node packages/sugar-high/scripts/benchmark-large.mjs --json
```

The libraries use different grammars and emit different HTML. Treat the results as a comparison of
public API cost, not exact feature equivalence.

## Publish a local result

```sh
pnpm --filter sugar-high benchmark:large --write
```

This runs the same suite, saves the raw results and environment metadata to
`docs/benchmark-results.json`, and refreshes the generated table in `packages/sugar-high/README.md`.
The homepage imports that JSON snapshot on the server, so both surfaces show the same run without
shipping benchmark libraries to visitors. Commit the snapshot and README together. Running without
`--write` leaves the published results unchanged.

The comparison measures warmed highlight-to-HTML calls with an explicit TypeScript language.
Package loading and initialization happen before timing. Each library and input size runs in a
separate Node process, with garbage collection before each timed sample. The generated source is
repeated TypeScript interfaces and classes, so these results describe that workload rather than
all languages, real-world files, browser rendering, or highlighting quality. The snapshot includes
actual source bytes, iterations, sample spread, and library versions for inspection.

## Comparison bundle sizes

The large-file suite also measures TypeScript-only browser ESM bundles with Bun (available on
`PATH`, or set `BUN_BIN`). All three bundles export a working highlight-to-HTML function. They are
minified with the same bundler settings and gzip-compressed with Node at level 9. Sizes exclude
theme CSS, source maps, and application code. Required grammar dependencies are included:

- Sugar High: `sugar-high/core` plus `sugar-high/lang/typescript`.
- PrismJS: core plus C-like, JavaScript, and TypeScript grammars.
- highlight.js: core plus the TypeScript grammar.

These sizes describe selective imports, not each package's default entry or its full language
catalog. Timing uses the existing public highlighting calls (Sugar High's root API, Prism's
`highlight`, and highlight.js with an explicit language). The bundle exports are smoke-checked
against the TypeScript fixture before timing starts. The snapshot records the Bun version and
exact byte counts, and the generated README and website share those measurements.
