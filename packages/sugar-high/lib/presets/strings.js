// @ts-check
// String literal patterns. A language joins them with `strings()` into one sticky pattern;
// a pattern with back-references must come first so its groups keep their numbers.
// An unclosed string runs to the end of the code. Loops are unrolled (`a*(?:\\.a*)*`) so each
// character is matched one way, which keeps them fast and free of backtracking.

/** `"` with backslash escapes. */
export const doubleQuoted = /"[^\\"]*(?:\\[\s\S][^\\"]*)*\\?"?/
/** `'` with backslash escapes. */
export const singleQuoted = /'[^\\']*(?:\\[\s\S][^\\']*)*\\?'?/
/** `"""` with backslash escapes, such as Python, Java, Swift, and GraphQL. */
export const tripleQuoted = /"""[^\\"]*(?:(?:\\[\s\S]|"(?!""))[^\\"]*)*(?:"""|\\?$)/

/** @param {...RegExp} patterns */
export const strings = (...patterns) => new RegExp(patterns.map((p) => p.source).join('|'), 'y')
