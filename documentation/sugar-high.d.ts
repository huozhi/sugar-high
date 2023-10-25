declare module "sugar-high" {
  export function highlight(code: string): string;
  export function tokenize(code: string): Array<[number, string]>;
}
