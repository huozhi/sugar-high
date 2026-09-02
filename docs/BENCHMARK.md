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
