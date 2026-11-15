// @ts-check
import { doubleQuoted, singleQuoted } from './strings.js'

/** The `<header>` of an `#include <header>` directive, then ordinary quoted strings. */
export const cStrings = [
  /<(?<=(?:^|\n)[ \t]*#[ \t]*include[ \t]*<)[^>\r\n]*>/, doubleQuoted, singleQuoted,
]
