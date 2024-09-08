import { types } from "./constants.js";

export const CodeSyntacticSugar = {
	TokenTypes: types,
	TokenMap: new Map(types.map((type, i) => [type, i])),
} as const;

export * from "./tokenize.js";
export * from "./generate.js";
export * from "./to-html.js";
export * from "./highlight.js";
