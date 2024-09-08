import { describe, expect, it } from "vitest";
import { CodeSyntacticSugar } from "./index.js";
import { tokenize } from "./tokenize.js";
import type { Token } from "./types.js";

function getTypeName(token: Token) {
	return CodeSyntacticSugar.TokenTypes[token[0]];
}

function getTokenValues(tokens: Token[]) {
	return tokens.map((tk) => tk[1]);
}

function mergeSpaces(str: string) {
	return str.trim().replace(/^[\s]{2,}$/g, " ");
}

function filterSpaces(arr: string[]) {
	return arr.map((t) => mergeSpaces(t)).filter(Boolean);
}

function extractTokenValues(tokens: Token[]) {
	return filterSpaces(getTokenValues(tokens));
}

function getTokenArray(tokens: Token[]) {
	return tokens.map((tk) => [tk[1], getTypeName(tk)]);
}

function extractTokenArray(tokens: Token[]) {
	return tokens
		.map((tk) => [mergeSpaces(tk[1]), getTypeName(tk)])
		.filter(([_, type]) => type !== "space" && type !== "break");
}

describe("function calls", () => {
	it("dot catch should not be determined as keyword", () => {
		const tokens = tokenize(`promise.catch(log)`);
		expect(extractTokenArray(tokens)).toEqual([
			["promise", "identifier"],
			[".", "sign"],
			["catch", "identifier"],
			["(", "sign"],
			["log", "identifier"],
			[")", "sign"],
		]);
	});
});

describe("calculation expression", () => {
	it("basic inline calculation expression", () => {
		const tokens = tokenize(`123 - /555/ + 444;`);
		expect(getTokenValues(tokens)).toEqual([
			"123",
			" ",
			"-",
			" ",
			"/555/",
			" ",
			"+",
			" ",
			"444",
			";",
		]);
		expect(getTokenArray(tokens)).toEqual([
			["123", "class"],
			[" ", "space"],
			["-", "sign"],
			[" ", "space"],
			["/555/", "string"],
			[" ", "space"],
			["+", "sign"],
			[" ", "space"],
			["444", "class"],
			[";", "sign"],
		]);
	});

	it("calculation with comments", () => {
		const tokens = tokenize(`/* evaluate */ (19) / 234 + 56 / 7;`);
		expect(extractTokenValues(tokens)).toEqual([
			"/* evaluate */",
			"(",
			"19",
			")",
			"/",
			"234",
			"+",
			"56",
			"/",
			"7",
			";",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["/* evaluate */", "comment"],
			["(", "sign"],
			["19", "class"],
			[")", "sign"],
			["/", "sign"],
			["234", "class"],
			["+", "sign"],
			["56", "class"],
			["/", "sign"],
			["7", "class"],
			[";", "sign"],
		]);
	});

	it("calculation with defs", () => {
		const tokens = tokenize(`const _iu = (19) / 234 + 56 / 7;`);
		expect(extractTokenValues(tokens)).toEqual([
			"const",
			"_iu",
			"=",
			"(",
			"19",
			")",
			"/",
			"234",
			"+",
			"56",
			"/",
			"7",
			";",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["const", "keyword"],
			["_iu", "class"],
			["=", "sign"],
			["(", "sign"],
			["19", "class"],
			[")", "sign"],
			["/", "sign"],
			["234", "class"],
			["+", "sign"],
			["56", "class"],
			["/", "sign"],
			["7", "class"],
			[";", "sign"],
		]);
	});
});

describe("jsx", () => {
	it("parse jsx compositions", () => {
		const tokens = tokenize(`// jsx
    const element = (
      <>
        <Food
          season={{
            sault: <p a={[{}]} />
          }}>
        </Food>
        {/* jsx comment */}
        <h1 className="title" data-title="true">
          Read more{' '}
          <Link href="/posts/first-post">
            <a>this page! - {Date.now()}</a>
          </Link>
        </h1>
      </>
    )`);
		expect(extractTokenValues(tokens)).toEqual([
			"// jsx",
			"const",
			"element",
			"=",
			"(",
			"<",
			">",
			"<",
			"Food",
			"season",
			"=",
			"{",
			"{",
			"sault",
			":",
			"<",
			"p",
			"a",
			"=",
			"{",
			"[",
			"{",
			"}",
			"]",
			"}",
			"/>",
			"}",
			"}",
			">",
			"</",
			"Food",
			">",
			"{",
			"/* jsx comment */",
			"}",
			"<",
			"h1",
			"className",
			"=",
			'"',
			"title",
			'"',
			"data-",
			"title",
			"=",
			'"',
			"true",
			'"',
			">",
			"Read more",
			"{",
			"'",
			"'",
			"}",
			"<",
			"Link",
			"href",
			"=",
			'"',
			"/posts/first-post",
			'"',
			">",
			"<",
			"a",
			">",
			"this page! -",
			"{",
			"Date",
			".",
			"now",
			"(",
			")",
			"}",
			"</",
			"a",
			">",
			"</",
			"Link",
			">",
			"</",
			"h1",
			">",
			"</",
			">",
			")",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["// jsx", "comment"],
			["const", "keyword"],
			["element", "identifier"],
			["=", "sign"],
			["(", "sign"],
			["<", "sign"],
			[">", "sign"],
			["<", "sign"],
			["Food", "entity"],
			["season", "property"],
			["=", "sign"],
			["{", "sign"],
			["{", "sign"],
			["sault", "identifier"],
			[":", "sign"],
			["<", "sign"],
			["p", "entity"],
			["a", "property"],
			["=", "sign"],
			["{", "sign"],
			["[", "sign"],
			["{", "sign"],
			["}", "sign"],
			["]", "sign"],
			["}", "sign"],
			["/>", "sign"],
			["}", "sign"],
			["}", "sign"],
			[">", "sign"],
			["</", "sign"],
			["Food", "entity"],
			[">", "sign"],
			["{", "sign"],
			["/* jsx comment */", "comment"],
			["}", "sign"],
			["<", "sign"],
			["h1", "entity"],
			["className", "property"],
			["=", "sign"],
			['"', "string"],
			["title", "string"],
			['"', "string"],
			["data-", "property"],
			["title", "property"],
			["=", "sign"],
			['"', "string"],
			["true", "string"],
			['"', "string"],
			[">", "sign"],
			["", "jsxliterals"],
			["Read more", "jsxliterals"],
			["{", "sign"],
			["'", "string"],
			["", "string"],
			["'", "string"],
			["}", "sign"],
			["", "jsxliterals"],
			["", "jsxliterals"],
			["<", "sign"],
			["Link", "entity"],
			["href", "property"],
			["=", "sign"],
			['"', "string"],
			["/posts/first-post", "string"],
			['"', "string"],
			[">", "sign"],
			["", "jsxliterals"],
			["", "jsxliterals"],
			["<", "sign"],
			["a", "entity"],
			[">", "sign"],
			["this page! -", "jsxliterals"],
			["{", "sign"],
			["Date", "class"],
			[".", "sign"],
			["now", "property"],
			["(", "sign"],
			[")", "sign"],
			["}", "sign"],
			["</", "sign"],
			["a", "entity"],
			[">", "sign"],
			["</", "sign"],
			["Link", "entity"],
			[">", "sign"],
			["</", "sign"],
			["h1", "entity"],
			[">", "sign"],
			["</", "sign"],
			[">", "sign"],
			[")", "sign"],
		]);
	});

	it("parse basic jsx with text without expression children", () => {
		const tokens = tokenize(`<Foo>This is content</Foo>`);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			"Foo",
			">",
			"This is content",
			"</",
			"Foo",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["Foo", "entity"],
			[">", "sign"],
			["This is content", "jsxliterals"],
			["</", "sign"],
			["Foo", "entity"],
			[">", "sign"],
		]);
	});

	it("parse basic jsx with expression children", () => {
		const tokens = tokenize(`<Foo>{Class + variable}</Foo>`);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			"Foo",
			">",
			"{",
			"Class",
			"+",
			"variable",
			"}",
			"</",
			"Foo",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["Foo", "entity"],
			[">", "sign"],
			["{", "sign"],
			["Class", "class"],
			["+", "sign"],
			["variable", "identifier"],
			["}", "sign"],
			["</", "sign"],
			["Foo", "entity"],
			[">", "sign"],
		]);
	});

	it("parse multi jsx definitions", () => {
		const tokens = tokenize(
			`x = <div>this </div>
        y = <div>thi</div>
        z = <div>this</div>
      `,
		);
		expect(extractTokenValues(tokens)).toEqual([
			"x",
			"=",
			"<",
			"div",
			">",
			"this",
			"</",
			"div",
			">",
			"y",
			"=",
			"<",
			"div",
			">",
			"thi",
			"</",
			"div",
			">",
			"z",
			"=",
			"<",
			"div",
			">",
			"this",
			"</",
			"div",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["x", "identifier"],
			["=", "sign"],
			["<", "sign"],
			["div", "entity"],
			[">", "sign"],
			["this", "jsxliterals"],
			["</", "sign"],
			["div", "entity"],
			[">", "sign"],
			["y", "identifier"],
			["=", "sign"],
			["<", "sign"],
			["div", "entity"],
			[">", "sign"],
			["thi", "jsxliterals"],
			["</", "sign"],
			["div", "entity"],
			[">", "sign"],
			["z", "identifier"],
			["=", "sign"],
			["<", "sign"],
			["div", "entity"],
			[">", "sign"],
			["this", "jsxliterals"],
			["</", "sign"],
			["div", "entity"],
			[">", "sign"],
		]);
	});

	it("parse fold jsx", () => {
		const tokens = tokenize(`// jsx
    const element = (
      <div>Hello World <Food /></div>
    )`);
		expect(extractTokenValues(tokens)).toEqual([
			"// jsx",
			"const",
			"element",
			"=",
			"(",
			"<",
			"div",
			">",
			"Hello World",
			"<",
			"Food",
			"/>",
			"</",
			"div",
			">",
			")",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["// jsx", "comment"],
			["const", "keyword"],
			["element", "identifier"],
			["=", "sign"],
			["(", "sign"],
			["<", "sign"],
			["div", "entity"],
			[">", "sign"],
			["Hello World", "jsxliterals"],
			["<", "sign"],
			["Food", "entity"],
			["/>", "sign"],
			["</", "sign"],
			["div", "entity"],
			[">", "sign"],
			[")", "sign"],
		]);
	});

	it("parse keyword in jsx children literals as jsx literals", () => {
		const tokens = tokenize(`<div>Hello <Name /> with {data}</div>`);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			"div",
			">",
			"Hello",
			"<",
			"Name",
			"/>",
			"with",
			"{",
			"data",
			"}",
			"</",
			"div",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["div", "entity"],
			[">", "sign"],
			["Hello", "jsxliterals"],
			["<", "sign"],
			["Name", "entity"],
			["/>", "sign"],
			["with", "jsxliterals"],
			["{", "sign"],
			["data", "identifier"],
			["}", "sign"],
			["</", "sign"],
			["div", "entity"],
			[">", "sign"],
		]);
	});

	it("parse arrow function in jsx correctly", () => {
		const code = "<button onClick={() => {}}>click</button>";
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			"button",
			"onClick",
			"=",
			"{",
			"(",
			")",
			"=",
			">",
			"{",
			"}",
			"}",
			">",
			"click",
			"</",
			"button",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["button", "entity"],
			["onClick", "property"],
			["=", "sign"],
			["{", "sign"],
			["(", "sign"],
			[")", "sign"],
			["=", "sign"],
			[">", "sign"],
			["{", "sign"],
			["}", "sign"],
			["}", "sign"],
			[">", "sign"],
			["click", "jsxliterals"],
			["</", "sign"],
			["button", "entity"],
			[">", "sign"],
		]);
	});

	it("should render string for any jsx attribute values", () => {
		const code = '<h1 data-title="true" />';
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			"h1",
			"data-",
			"title",
			"=",
			'"',
			"true",
			'"',
			"/>",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["h1", "entity"],
			["data-", "property"],
			["title", "property"],
			["=", "sign"],
			['"', "string"],
			["true", "string"],
			['"', "string"],
			["/>", "sign"],
		]);

		const code2 = '<svg color="null" height="24"/>';
		const tokens2 = tokenize(code2);
		expect(extractTokenValues(tokens2)).toEqual([
			"<",
			"svg",
			"color",
			"=",
			'"',
			"null",
			'"',
			"height",
			"=",
			'"',
			"24",
			'"',
			"/>",
		]);
		expect(extractTokenArray(tokens2)).toEqual([
			["<", "sign"],
			["svg", "entity"],
			["color", "property"],
			["=", "sign"],
			['"', "string"],
			["null", "string"],
			['"', "string"],
			["height", "property"],
			["=", "sign"],
			['"', "string"],
			["24", "string"],
			['"', "string"],
			["/>", "sign"],
		]);
	});

	it("should render single quote inside jsx literals as jsx literals", () => {
		const code = `<p>Let's get started!</p>`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			"p",
			">",
			"Let's get started!",
			"</",
			"p",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["p", "entity"],
			[">", "sign"],
			["Let's get started!", "jsxliterals"],
			["</", "sign"],
			["p", "entity"],
			[">", "sign"],
		]);
	});

	it("should handle nested jsx literals correctly", async () => {
		const code = `<>
      <div>
        <p>Text 1</p>
      </div>
      <p>Text 2</p>
    </>`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"<",
			">",
			"<",
			"div",
			">",
			"<",
			"p",
			">",
			"Text 1",
			"</",
			"p",
			">",
			"</",
			"div",
			">",
			"<",
			"p",
			">",
			"Text 2",
			"</",
			"p",
			">",
			"</",
			">",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			[">", "sign"],
			["<", "sign"],
			["div", "entity"],
			[">", "sign"],
			["", "jsxliterals"],
			["", "jsxliterals"],
			["<", "sign"],
			["p", "entity"],
			[">", "sign"],
			["Text 1", "jsxliterals"],
			["</", "sign"],
			["p", "entity"],
			[">", "sign"],
			["</", "sign"],
			["div", "entity"],
			[">", "sign"],
			["<", "sign"],
			["p", "entity"],
			[">", "sign"],
			["Text 2", "jsxliterals"],
			["</", "sign"],
			["p", "entity"],
			[">", "sign"],
			["</", "sign"],
			[">", "sign"],
		]);
	});

	it("should not affect the function param after closed jsx tag", () => {
		// issue: (str was treated as string
		const code = `<a k={v} />
      function p(str) {}
      `;
		const tokens = tokenize(code);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["a", "entity"],
			["k", "property"],
			["=", "sign"],
			["{", "sign"],
			["v", "identifier"],
			["}", "sign"],
			["/>", "sign"],
			["function", "keyword"],
			["p", "identifier"],
			["(", "sign"],
			["str", "identifier"],
			[")", "sign"],
			["{", "sign"],
			["}", "sign"],
		]);
	});

	it("should handle object spread correctly", () => {
		const code = `<Component {...props} />`;
		const tokens = tokenize(code);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["Component", "entity"],
			["{", "sign"],
			[".", "sign"],
			[".", "sign"],
			[".", "sign"],
			["props", "identifier"],
			["}", "sign"],
			["/>", "sign"],
		]);
	});

	it("should handle tailwind properties well", () => {
		const code = `<div className="data-[layout=grid]:grid" />`;
		const tokens = tokenize(code);
		expect(extractTokenArray(tokens)).toEqual([
			["<", "sign"],
			["div", "entity"],
			["className", "property"],
			["=", "sign"],
			['"', "string"],
			["data-[layout=grid]:grid", "string"],
			['"', "string"],
			["/>", "sign"],
		]);
	});
});

describe("comments", () => {
	it("basic inline comments", () => {
		const code = `+ // This is a inline comment / <- a slash`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"+",
			"// This is a inline comment / <- a slash",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["+", "sign"],
			["// This is a inline comment / <- a slash", "comment"],
		]);
	});

	it("multiple slashes started inline comments", () => {
		const code = `/// <reference path="..." /> // reference comment`;
		const tokens = tokenize(code);
		expect(extractTokenArray(tokens)).toEqual([
			['/// <reference path="..." /> // reference comment', "comment"],
		]);
	});

	it("multi-line comments", () => {
		const code = `/* This is another comment */ alert('good') // <- alerts`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"/* This is another comment */",
			"alert",
			"(",
			"'",
			"good",
			"'",
			")",
			"// <- alerts",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["/* This is another comment */", "comment"],
			["alert", "identifier"],
			["(", "sign"],
			["'", "string"],
			["good", "string"],
			["'", "string"],
			[")", "sign"],
			["// <- alerts", "comment"],
		]);
	});
});

describe("regex", () => {
	it("basic regex", () => {
		const reg1 = "/^\\/[0-5]\\/$/";
		const reg2 = `/^\\w+[a-z0-9]/ig`;
		expect(extractTokenArray(tokenize(reg1))).toEqual([
			["/^\\/[0-5]\\/$/", "string"],
		]);
		expect(extractTokenArray(tokenize(reg2))).toEqual([
			["/^\\w+[a-z0-9]/ig", "string"],
		]);
	});

	it("regex plus operators", () => {
		const code = `/^\\/[0-5]\\/$/ + /^\\/\w+\\/$/gi`;
		expect(extractTokenValues(tokenize(code))).toEqual([
			"/^\\/[0-5]\\/$/",
			"+",
			"/^\\/w+\\/$/gi",
		]);
		expect(extractTokenArray(tokenize(code))).toEqual([
			["/^\\/[0-5]\\/$/", "string"],
			["+", "sign"],
			["/^\\/w+\\/$/gi", "string"],
		]);
	});

	it("regex with quotes inside", () => {
		const code = `replace(/'/, \`"\`)`;
		expect(extractTokenValues(tokenize(code))).toEqual([
			"replace",
			"(",
			"/'/",
			",",
			"`",
			'"',
			"`",
			")",
		]);
		expect(extractTokenArray(tokenize(code))).toEqual([
			["replace", "identifier"],
			["(", "sign"],
			["/'/", "string"],
			[",", "sign"],
			["`", "string"],
			['"', "string"],
			["`", "string"],
			[")", "string"],
		]);
	});

	it("multi line regex tests", () => {
		const code1 = `/reg/.test('str')\n` + `[]\n` + `/reg/.test('str')`;

		// '[]' consider as a end of the expression
		expect(extractTokenValues(tokenize(code1))).toEqual([
			"/reg/",
			".",
			"test",
			"(",
			"'",
			"str",
			"'",
			")",
			"[",
			"]",
			"/reg/",
			".",
			"test",
			"(",
			"'",
			"str",
			"'",
			")",
		]);
		expect(extractTokenArray(tokenize(code1))).toEqual([
			["/reg/", "string"],
			[".", "sign"],
			["test", "identifier"],
			["(", "sign"],
			["'", "string"],
			["str", "string"],
			["'", "string"],
			[")", "sign"],
			["[", "sign"],
			["]", "sign"],
			["/reg/", "string"],
			[".", "sign"],
			["test", "identifier"],
			["(", "sign"],
			["'", "string"],
			["str", "string"],
			["'", "string"],
			[")", "sign"],
		]);

		const code2 = `/reg/.test('str')()\n` + `/reg/.test('str')`;

		// what before '()' still considers as an expression
		expect(extractTokenValues(tokenize(code2))).toEqual([
			"/reg/",
			".",
			"test",
			"(",
			"'",
			"str",
			"'",
			")",
			"(",
			")",
			"/",
			"reg",
			"/",
			".",
			"test",
			"(",
			"'",
			"str",
			"'",
			")",
		]);
		expect(extractTokenArray(tokenize(code2))).toEqual([
			["/reg/", "string"],
			[".", "sign"],
			["test", "identifier"],
			["(", "sign"],
			["'", "string"],
			["str", "string"],
			["'", "string"],
			[")", "sign"],
			["(", "sign"],
			[")", "sign"],
			["/", "sign"],
			["reg", "identifier"],
			["/", "sign"],
			[".", "sign"],
			["test", "identifier"],
			["(", "sign"],
			["'", "string"],
			["str", "string"],
			["'", "string"],
			[")", "sign"],
		]);
	});
});

describe("strings", () => {
	it("import paths", () => {
		const code = `import mod from "../../mod"`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"import",
			"mod",
			"from",
			'"',
			"../../mod",
			'"',
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["import", "keyword"],
			["mod", "identifier"],
			["from", "keyword"],
			['"', "string"],
			["../../mod", "string"],
			['"', "string"],
		]);
	});

	it("multi quotes string", () => {
		const str1 = `"aa'bb'cc"`;
		expect(extractTokenValues(tokenize(str1))).toEqual([
			`"`,
			`aa`,
			`'`,
			`bb`,
			`'`,
			`cc`,
			`"`,
		]);
		expect(extractTokenArray(tokenize(str1))).toEqual([
			['"', "string"],
			["aa", "string"],
			["'", "string"],
			["bb", "string"],
			["'", "string"],
			["cc", "string"],
			['"', "string"],
		]);

		const str2 = `'aa"bb"cc'`;
		expect(extractTokenValues(tokenize(str2))).toEqual([
			`'`,
			`aa`,
			`"`,
			`bb`,
			`"`,
			`cc`,
			`'`,
		]);
		expect(extractTokenArray(tokenize(str2))).toEqual([
			["'", "string"],
			["aa", "string"],
			['"', "string"],
			["bb", "string"],
			['"', "string"],
			["cc", "string"],
			["'", "string"],
		]);

		const str3 = `\`\nabc\``;
		expect(extractTokenValues(tokenize(str3))).toEqual(["`", `abc`, "`"]);
		expect(extractTokenArray(tokenize(str3))).toEqual([
			["`", "string"],
			["abc", "string"],
			["`", "string"],
		]);
	});

	it("string template", () => {
		const code1 = `
      \`hi \$\{ a \} world\`
      \`hello \$\{world\}\`
    `;
		expect(extractTokenValues(tokenize(code1))).toEqual([
			"`",
			"hi",
			"${",
			"a",
			"}",
			"world",
			"`",
			"`",
			"hello",
			"${",
			"world",
			"}",
			"`",
		]);
		expect(extractTokenArray(tokenize(code1))).toEqual([
			["`", "string"],
			["hi", "string"],
			["${", "sign"],
			["a", "identifier"],
			["}", "sign"],
			["world", "string"],
			["`", "string"],
			["`", "string"],
			["hello", "string"],
			["${", "sign"],
			["world", "identifier"],
			["}", "sign"],
			["`", "string"],
		]);

		const code2 = `
    \`hi \$\{ b \} plus \$\{ c + \`text\` \}\`
      \`nested \$\{ c + \`\$\{ no \}\` }\`
    `;
		const tokens2 = tokenize(code2);
		expect(extractTokenValues(tokens2)).toEqual([
			"`",
			"hi",
			"${",
			"b",
			"}",
			"plus",
			"${",
			"c",
			"+",
			"`",
			"text",
			"`",
			"}",
			"`",
			"`",
			"nested",
			"${",
			"c",
			"+",
			"`",
			"${",
			"no",
			"}",
			"`",
			"}",
			"`",
		]);
		expect(extractTokenArray(tokens2)).toEqual([
			["`", "string"],
			["hi", "string"],
			["${", "sign"],
			["b", "identifier"],
			["}", "sign"],
			["plus", "string"],
			["${", "sign"],
			["c", "identifier"],
			["+", "sign"],
			["`", "string"],
			["text", "string"],
			["`", "string"],
			["}", "sign"],
			["`", "string"],
			["`", "string"],
			["nested", "string"],
			["${", "sign"],
			["c", "identifier"],
			["+", "sign"],
			["`", "string"],
			["${", "sign"],
			["no", "identifier"],
			["}", "sign"],
			["`", "string"],
			["}", "sign"],
			["`", "string"],
		]);

		const code3 = `
    \`
      hehehehe
      \`
      'we'
      "no"
      \`hello\`
    `;
		expect(extractTokenValues(tokenize(code3))).toEqual([
			"`",
			"hehehehe",
			"`",
			"'",
			"we",
			"'",
			'"',
			"no",
			'"',
			"`",
			"hello",
			"`",
		]);
		expect(extractTokenArray(tokenize(code3))).toEqual([
			["`", "string"],
			["hehehehe", "string"],
			["`", "string"],
			["'", "string"],
			["we", "string"],
			["'", "string"],
			['"', "string"],
			["no", "string"],
			['"', "string"],
			["`", "string"],
			["hello", "string"],
			["`", "string"],
		]);
	});

	it("unicode token", () => {
		const code = `let hello你好 = 'hello你好'`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"let",
			"hello你好",
			"=",
			"'",
			"hello你好",
			"'",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["let", "keyword"],
			["hello你好", "identifier"],
			["=", "sign"],
			["'", "string"],
			["hello你好", "string"],
			["'", "string"],
		]);
	});

	it("number in string", () => {
		const code = `'123'\n'true'`;
		const tokens = tokenize(code);
		expect(extractTokenValues(tokens)).toEqual([
			"'",
			"123",
			"'",
			"'",
			"true",
			"'",
		]);
		expect(extractTokenArray(tokens)).toEqual([
			["'", "string"],
			["123", "string"],
			["'", "string"],
			["'", "string"],
			["true", "string"],
			["'", "string"],
		]);
	});
});

describe("class", () => {
	it("determine class name", () => {
		const code = `class Bar extends Array {}`;
		const tokens = tokenize(code);
		expect(extractTokenArray(tokens)).toEqual([
			["class", "keyword"],
			["Bar", "class"],
			["extends", "keyword"],
			["Array", "class"],
			["{", "sign"],
			["}", "sign"],
		]);
	});
});
