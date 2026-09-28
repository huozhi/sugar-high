# GPU editor benchmark

Reference run: 2026-09-22, macOS arm64, Apple Metal 3 adapter, Headless Chrome 153,
React 19.2.0, gpu-lexer 0.0.3, Node 24.18.0. Raw observations and environment metadata
are in [gpu-editor-benchmark.json](./gpu-editor-benchmark.json).

The comparison isolates rendering/input: both modes use the same Sugar High GPU parser.
`textarea` is the existing textarea overlay and React token DOM, selected through
`textareaProps`. `editcontext` uses the persistent text node and viewport highlight ranges.

## Reference measurements

All times are milliseconds (ms). p50 is the median; p95 is the 95th percentile.
1 KiB = 1,024 bytes; 1 MiB = 1,024 KiB. Input timing is keydown to the second animation-frame callback,
including browser frame scheduling, not pure handler execution or Event Timing INP.

| Source (KiB) | Renderer | Edit p50 (ms) | Edit p95 (ms) | Mount to highlighted frame (ms) | DOM elements (count) |
| --- | --- | ---: | ---: | ---: | ---: |
| 64 | textarea | 33.7 | 36.7 | 129.9 | 28,694 |
| 64 | editcontext | 29.2 | 33.9 | 126.3 | 27 |
| 256 | textarea | 145.3 | 152.6 | 498.1 | 115,318 |
| 256 | editcontext | 29.6 | 31.0 | 165.2 | 27 |
| 1024 | textarea | 613.0 | 634.9 | 2035.6 | 459,411 |
| 1024 | editcontext | 49.1 | 63.1 | 305.5 | 27 |

At 1 MiB, this run reduced median editing latency from 613.0 ms to 49.1 ms, and the
highlighted mount from 2,035.6 ms to 305.5 ms. The renderer mounted 27 elements rather than
459,411. Both renderers use gpu-lexer 0.0.3. Keeping colors while inference is pending avoids
the plain-text flash on the EditContext path.

GPU parser timing is measured independently, so it is the same for both renderers:

| Source (KiB) | Parse p50 (ms) | Parse p95 (ms) |
| --- | ---: | ---: |
| 64 | 10.0 | 14.2 |
| 256 | 22.1 | 39.1 |
| 1024 | 93.2 | 102.9 |

The first small editor in a fresh browser context reached a highlighted frame in 128.3 ms.
This includes the editor debounce and GPU initialization; it does not flush driver caches.

## Method

- Bundle the built React package and fixture in production mode with Bun; run it on a temporary
  loopback HTTP server through the installed `agent-browser`, with WebGPU enabled.
- Use exact 64 KiB, 256 KiB, and 1 MiB ASCII TypeScript strings. Source is a repeated function
  with comments, numbers, type annotations, destructuring, and string method calls. This is
  synthetic source, not a representative repository corpus.
- Warm the GPU on a small document, then measure five awaited `sugar-high/gpu` parses at each size.
  With five samples the reported p95 is the maximum observation.
- Mount each renderer once at 900 × 480 CSS pixels, 14px text, 22px line height, line numbers on,
  and wrapping off. `firstFrameMs` in the JSON is mount to the second animation frame;
  `readyMs` waits for `data-sh-gpu="ready"` and another two-frame boundary.
- Send 12 actual `x` key presses near the start of each document. Record in-page event-to-frame
  durations, excluding CLI round trips. GPU work may overlap typing, as it does in an editor.
- The suite fails when WebGPU cannot initialize; it never counts plain-text fallback as a
  successful GPU benchmark. It also verifies that editing keeps the text node mounted.

These are small-sample observations from one machine and browser. They do not measure IME
candidate-window behavior, assistive technology, peak memory, very long single-line latency,
or sustained typing over minutes. The regression suite separately checks single-line range
bounds, scrolling, clipboard, deletion, controlled values, fallback modes, and cleanup.
Native IME interactions still warrant manual cross-platform testing.

## Bundle cost

Bun browser ESM, minified; React and react/jsx-runtime external. GPU model included.

| Entry | Before minified / gzip | After minified / gzip |
| --- | --- | --- |
| Default React Editor | 38.70 / 13.50 KiB | 38.70 / 13.50 KiB |
| GPU Editor | 98.20 / 46.32 KiB | 113.00 / 50.75 KiB |
| GPU Code | 94.84 / 45.14 KiB | 94.98 / 45.28 KiB |
| sugar-high/gpu | 60.79 / 33.51 KiB | 60.89 / 33.64 KiB |

The before sizes are from the original implementation with gpu-lexer 0.0.2; after sizes
include the local upgrade to 0.0.3. The runtime comparison above uses 0.0.3 on both paths.

The extra GPU editor code includes EditContext input, selection, clipboard and composition
handling, deletion/history, viewport geometry, and the compatible textarea renderer.

## Reproduce

From the repository root, with `agent-browser` and Bun installed:

```sh
pnpm --filter @sugar-high/react build
pnpm --filter @sugar-high/react test:gpu:browser
pnpm --filter @sugar-high/react benchmark:gpu --output=../../docs/gpu-editor-benchmark.json
pnpm --filter @sugar-high/react benchmark
```

Use the running development site at `http://localhost:3000/react#webgpu` for interactive checks.
The size selector loads the same sample sizes. The benchmark itself uses an isolated fixture
so Next.js development tooling is not included in the measurements.
