type HighlightOptions = {
  keywords?: Set<string>
  onCommentStart?: (curr: string, next: string) => number | boolean
  onCommentEnd?: (curr: string, prev: string) => number | boolean
}

export function highlight(code: string, options?: HighlightOptions): string
export function tokenize(code: string, options?: HighlightOptions): Array<[number, string]>
export function generate(tokens: Array<[number, string]>): Array<any>
export const SugarHigh: {
  TokenTypes: {
    [key: number]: string
  }
  TokenMap: Map<string, number>
}
