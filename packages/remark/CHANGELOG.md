# @sugar-high/remark

## 1.0.2

### Patch Changes

- a72f0c2: Install Sugar High as a runtime dependency of the React package instead of requiring applications to declare it as a peer dependency. Document the simplified React and Remark installation commands.

## 1.0.1

### Patch Changes

- 43771a4: fix inline style of remark plugin rendered lines

## 1.0.0

### Major Changes

- 70ddc26: Release Sugar High v2 with canonical multi-language highlighting, a composable core, typed generated nodes, granular token and line styling, first-party React components, Remark integration, themes, and updated documentation.

  The default `highlight()` API stays focused on common highlighting, while `sugar-high/core` provides `parse()`, `generate()`, and `render()` for advanced composition. Language aliases are normalized through `sugar-high/lang`, and related dialects share canonical implementations.

### Patch Changes

- Updated dependencies [70ddc26]
  - sugar-high@2.0.0
