# @sugar-high/react

## 2.4.0

### Minor Changes

- a63d7ed: Add opt-in WebGPU syntax highlighting through `sugar-high/gpu` and client-side `Code` and `Editor` components from `@sugar-high/react/gpu`. The experimental `gpu-lexer` integration is an optional peer dependency accepting version 0.0.2 and newer, and is installed separately.

### Patch Changes

- Updated dependencies [a63d7ed]
  - sugar-high@2.4.0

## 2.3.1

### Patch Changes

- a72f0c2: Install Sugar High as a runtime dependency of the React package instead of requiring applications to declare it as a peer dependency. Document the simplified React and Remark installation commands.

## 2.3.0

### Minor Changes

- bed24dc: Add a themed FileTree with controlled file selection, folder expansion, and keyboard navigation that composes with Editor or Code.
- 6c43b5c: Render highlighted lines in Code and Editor as blocks to prevent extra baseline spacing after blank lines and keep editor selection aligned. Custom styles relying on inline-block line alignment should be reviewed.

### Patch Changes

- bda310f: Keep file tree row backgrounds, focus outlines, and click targets aligned with long filenames and deeply nested paths when scrolling horizontally.
  
  Preserve the selected file's background while hovering.
  
  Keep the tree contained in narrow or short panels and give larger filename text a consistent line height.
  
  Isolate filename text direction and mirror indentation and disclosure arrows in right-to-left trees.
  
  Use the theme foreground for selection and focus contrast, and system selection colors in forced-color mode.

## 2.2.3

### Patch Changes

- 22812aa: Keep editor text and highlighting aligned by inheriting font size, line height, and letter spacing from the root, and prevent later global code styles from changing the highlighted layer's typography independently.

## 2.2.2

### Patch Changes

- 0fd8503: Keep empty code lines full-height, match Code and Editor wrapping at the same width, and apply fontSize consistently to source text and filename headers.

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
