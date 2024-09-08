import { T_BREAK, types } from "./constants.js";
import type { Children, Line, Token } from "./types.js";

export function generate(tokens: Array<Token>): Line[] {
	const lines: Line[] = [];

	const createLine = (children: Children) =>
		// generateType === 'html'
		// ? `<span class="sh__line">${content}</span>`
		({
			type: "element",
			tagName: "span",
			children,
			properties: {
				className: "css__line",
			},
		}) as const;

	function flushLine(tokens: Array<Token>): void {
		const lineTokens = tokens.map(
			([type, value]) =>
				({
					type: "element",
					tagName: "span",
					children: [
						{
							type: "text",
							value: value, // to encode
						},
					],
					properties: {
						className: `css__token--${types[type]}`,
						style: `color: var(--css-${types[type]})`,
					},
				}) as const,
		);
		lines.push(createLine(lineTokens));
	}

	const lineTokens: Array<Token> = [];
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const [type, value] = token;
		if (type !== T_BREAK) {
			// Divide multi-line token into multi-line code
			if (value.includes("\n")) {
				const lines = value.split("\n");
				for (let j = 0; j < lines.length; j++) {
					lineTokens.push([type, lines[j]]);
					if (j < lines.length - 1) {
						flushLine(lineTokens);
						lineTokens.length = 0;
					}
				}
			} else {
				lineTokens.push(token);
			}
		} else {
			lineTokens.push([type, ""]);
			flushLine(lineTokens);
			lineTokens.length = 0;
		}
	}

	if (lineTokens.length) flushLine(lineTokens);

	return lines;
}
