import type { DisplayOptions, ParsedCode } from './core.js'

/** Parse source code asynchronously with gpu-lexer and return Sugar High's structured format. */
export function parse(code: string): Promise<ParsedCode>

/** Highlight source code asynchronously with WebGPU. */
export function highlight(code: string, options?: DisplayOptions): Promise<string>
