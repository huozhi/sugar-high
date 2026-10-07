// @ts-check
import { onCommentStart, onCommentEnd } from '../presets/clike-base.js'

// GLSL and GLSL ES share these control words and qualifiers. Version-specific
// words can be highlighted without treating this preset as a validator.
export const keywords = new Set([
  'attribute', 'varying', 'const', 'uniform', 'buffer', 'shared', 'coherent',
  'volatile', 'restrict', 'readonly', 'writeonly', 'layout', 'centroid', 'flat',
  'smooth', 'noperspective', 'patch', 'sample', 'invariant', 'precise', 'lowp',
  'mediump', 'highp', 'precision', 'in', 'out', 'inout', 'subroutine',
  'break', 'continue', 'do', 'for', 'while', 'switch', 'case', 'default',
  'if', 'else', 'discard', 'return', 'struct', 'true', 'false',
])

export const typeKeywords = new Set([
  'void', 'bool', 'int', 'uint', 'float', 'double', 'atomic_uint',
  'vec2', 'vec3', 'vec4', 'bvec2', 'bvec3', 'bvec4',
  'ivec2', 'ivec3', 'ivec4', 'uvec2', 'uvec3', 'uvec4',
  'dvec2', 'dvec3', 'dvec4',
  'mat2', 'mat3', 'mat4', 'mat2x2', 'mat2x3', 'mat2x4',
  'mat3x2', 'mat3x3', 'mat3x4', 'mat4x2', 'mat4x3', 'mat4x4',
  'dmat2', 'dmat3', 'dmat4', 'dmat2x2', 'dmat2x3', 'dmat2x4',
  'dmat3x2', 'dmat3x3', 'dmat3x4', 'dmat4x2', 'dmat4x3', 'dmat4x4',
  'sampler1D', 'sampler2D', 'sampler3D', 'samplerCube',
  'sampler2DShadow', 'sampler2DArray', 'sampler2DArrayShadow',
  'samplerCubeShadow', 'samplerCubeArray', 'samplerCubeArrayShadow',
  'sampler2DMS', 'sampler2DMSArray', 'samplerBuffer',
  'isampler2D', 'isampler3D', 'isamplerCube', 'isampler2DArray',
  'usampler2D', 'usampler3D', 'usamplerCube', 'usampler2DArray',
  'image2D', 'image3D', 'imageCube', 'image2DArray',
  'iimage2D', 'iimage3D', 'iimageCube', 'iimage2DArray',
  'uimage2D', 'uimage3D', 'uimageCube', 'uimage2DArray',
])

export { onCommentStart, onCommentEnd }
