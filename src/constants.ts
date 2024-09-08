export const jsxBrackets = new Set(["<", ">", "{", "}", "[", "]"]);
export const keywords = new Set([
	"for",
	"do",
	"while",
	"if",
	"else",
	"return",
	"function",
	"var",
	"let",
	"const",
	"true",
	"false",
	"undefined",
	"this",
	"new",
	"delete",
	"typeof",
	"in",
	"instanceof",
	"void",
	"break",
	"continue",
	"switch",
	"case",
	"default",
	"throw",
	"try",
	"catch",
	"finally",
	"debugger",
	"with",
	"yield",
	"async",
	"await",
	"class",
	"extends",
	"super",
	"import",
	"export",
	"from",
	"static",
]);

export const signs = new Set([
	"+",
	"-",
	"*",
	"/",
	"%",
	"=",
	"!",
	"&",
	"|",
	"^",
	"~",
	"!",
	"?",
	":",
	".",
	",",
	";",
	`'`,
	'"',
	".",
	"(",
	")",
	"[",
	"]",
	"#",
	"@",
	"\\",
	...jsxBrackets,
]);

/**
 * 0  - identifier
 * 1  - keyword
 * 2  - string
 * 3  - Class, number and null
 * 4  - property
 * 5  - entity
 * 6  - jsx literals
 * 7  - sign
 * 8  - comment
 * 9  - break
 * 10 - space
 *
 */
export const types = [
	"identifier",
	"keyword",
	"string",
	"class",
	"property",
	"entity",
	"jsxliterals",
	"sign",
	"comment",
	"break",
	"space",
] as const;

export const [
	T_IDENTIFIER,
	T_KEYWORD,
	T_STRING,
	T_CLS_NUMBER,
	T_PROPERTY,
	T_ENTITY,
	T_JSX_LITERALS,
	T_SIGN,
	T_COMMENT,
	T_BREAK,
	T_SPACE,
] = types.map((_, i) => i);
