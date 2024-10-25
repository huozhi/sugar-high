export function highlight(code: string): string
export function tokenize(code: string): Array<[number, string]>
export function generate(tokens: Array<[number, string]>): Array<any>
