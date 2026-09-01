// @ts-check
import { T_IDENTIFIER } from '../shared.js'

/** @param {string} code */
export const tokenize = (code) => [[T_IDENTIFIER, code]]
