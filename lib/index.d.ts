type HighlightOptions = {
  keywords?: Set<string>
}

export function highlight(code: string, options?: HighlightOptions): string
export function tokenize(code: string): Array<[number, string]>
export function generate(tokens: Array<[number, string]>): Array<any>
