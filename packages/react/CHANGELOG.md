# @sugar-high/react

## 2.2.1

### Patch Changes

- c3fe994: Keep the default editor and editable-title caret visible when their text layer is transparent.

## 2.2.0

### Minor Changes

- fdc0a35: Add JavaScript theme objects, a `theme` prop for Code and Editor, ten built-in presets including
  Taffy and Vercel, and automatic light and dark palettes through the inherited CSS color scheme.

## 2.1.0

### Minor Changes

- 2c64725: Add starting line numbers and configurable long-line wrapping to `Code` and `Editor`.
- 2af2b1d: Add a registry-free, server-compatible `@sugar-high/react/core` entry whose `Code` component accepts language configurations through `lang`.
- 359f2e3: Add Tab and Shift+Tab indentation to `Editor`, plus `textareaProps` for customizing the underlying textarea.
- 3ecadac: Add a server-compatible headless `Highlight` API with a `render` prop to `@sugar-high/react/core`.

## 2.0.0

### Major Changes

- e0bd2d1: Improve editor value synchronization and highlighting performance, add `defaultValue` for
  uncontrolled editors, and introduce canonical `data-sh-*` component markers while retaining the
  Codice compatibility attributes. Replace the legacy `--codice-*` styling variables with canonical
  `--sh-*` variables.

## 1.0.0

### Major Changes

- 70ddc26: Release Sugar High v2 with canonical multi-language highlighting, a composable core, typed generated nodes, granular token and line styling, first-party React components, Remark integration, themes, and updated documentation.

  The default `highlight()` API stays focused on common highlighting, while `sugar-high/core` provides `parse()`, `generate()`, and `render()` for advanced composition. Language aliases are normalized through `sugar-high/lang`, and related dialects share canonical implementations.

### Patch Changes

- Updated dependencies [70ddc26]
  - sugar-high@2.0.0
