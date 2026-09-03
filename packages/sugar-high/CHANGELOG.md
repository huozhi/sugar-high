# sugar-high

## 2.2.2

### Patch Changes

- 56b1813: Reduce the default bundle size by keeping language aliases and extension metadata out of the
  canonical highlighting path.

## 2.2.1

### Patch Changes

- 30ff8e5: Speed up HTML rendering by serializing parsed lines directly without allocating an intermediate
  generated syntax tree.

## 2.2.0

### Minor Changes

- cccf12a: Add built-in Ruby and plaintext language configurations.

## 2.1.0

### Minor Changes

- 8236314: Expose individual language configurations from `sugar-high/lang/<language>` for smaller custom highlighter bundles.

## 2.0.3

### Patch Changes

- da621df: Prevent the CSS tokenizer from crashing on input that ends with hyphens.

## 2.0.2

### Patch Changes

- 3985855: Keep hyphenated CSS names in a single syntax token

## 2.0.1

### Patch Changes

- 01dee18: Classify CSS declaration names as property tokens.

## 2.0.0

### Major Changes

- 70ddc26: Release Sugar High v2 with canonical multi-language highlighting, a composable core, typed generated nodes, granular token and line styling, first-party React components, Remark integration, themes, and updated documentation.

  The default `highlight()` API stays focused on common highlighting, while `sugar-high/core` provides `parse()`, `generate()`, and `render()` for advanced composition. Language aliases are normalized through `sugar-high/lang`, and related dialects share canonical implementations.
