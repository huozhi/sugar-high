import { generate } from "./generate.js";
import { toHtml } from "./to-html.js";
import { tokenize } from "./tokenize.js";

export function highlight(code: string): string {
	const tokens = tokenize(code);
	const lines = generate(tokens);
	const output = toHtml(lines);
	return output;
}
