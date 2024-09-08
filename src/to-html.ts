import type { Line } from "./types.js";
import { encode } from "./utils.js";

export function toHtml(lines: Line[]) {
	return lines
		.map((line) => {
			const { tagName: lineTag } = line;
			const tokens = line.children
				.map((child) => {
					const { tagName, children, properties } = child;
					return `<${tagName} class="${properties.className}" style="${
						properties.style
					}">${encode(children[0].value)}</${tagName}>`;
				})
				.join("");
			return `<${lineTag} class="${line.properties.className}">${tokens}</${lineTag}>`;
		})
		.join("\n");
}
