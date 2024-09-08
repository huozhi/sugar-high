import { signs } from "./constants.js";

export function isSpaces(str: string) {
	return /^[^\S\r\n]+$/g.test(str);
}

export function isSign(ch: string) {
	return signs.has(ch);
}

export function encode(str: string) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export function isWord(chr: string) {
	return /^[\w_]+$/.test(chr) || hasUnicode(chr);
}

export function isCls(str: string) {
	const chr0 = str[0];
	return (isWord(chr0) && chr0 === chr0.toUpperCase()) || str === "null";
}

export function hasUnicode(s: string) {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
	return /[^\u0000-\u007f]/.test(s);
}

export function isAlpha(chr: string) {
	return /^[a-zA-Z]$/.test(chr);
}

export function isIdentifierChar(chr: string) {
	return isAlpha(chr) || hasUnicode(chr);
}

export function isIdentifier(str: string) {
	return isIdentifierChar(str[0]) && (str.length === 1 || isWord(str.slice(1)));
}

export function isStrTemplateChr(chr: string) {
	return chr === "`";
}

export function isSingleQuotes(chr: string) {
	return chr === '"' || chr === "'";
}

export function isStringQuotation(chr: string) {
	return isSingleQuotes(chr) || isStrTemplateChr(chr);
}

export function isCommentStart(str: string) {
	const strStart = str.slice(0, 2);
	return strStart === "//" || strStart === "/*";
}

export function isRegexStart(str: string) {
	return str[0] === "/" && !isCommentStart(str[0] + str[1]);
}
