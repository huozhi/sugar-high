import type { types } from "./constants.js";

export type Token = [number, string];

export type Children = Readonly<
	{
		type: "element";
		tagName: "span";
		children: Readonly<
			[
				{
					type: "text";
					value: string;
				},
			]
		>;
		properties: Readonly<{
			className: `css__token--${(typeof types)[number]}`;
			style: `color: var(--css-${(typeof types)[number]})`;
		}>;
	}[]
>;

export type Line = {
	type: "element";
	tagName: "span";
	children: Children;
	properties: {
		className: "css__line";
	};
};
