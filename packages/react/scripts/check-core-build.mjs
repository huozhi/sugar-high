import { readFileSync } from 'node:fs'

const core = readFileSync(new URL('../dist/core.mjs', import.meta.url), 'utf8')

if (core.includes("'use client'") || core.includes('sugar-high/lang')) {
  throw new Error('The core entry must remain server-safe and registry-free')
}
