import type { CSSProperties } from 'react'
import type { TokenType } from 'sugar-high/core'

type ThemeToken = Exclude<TokenType, 'break' | 'space'>

export type ThemePalette = Readonly<
  {
    background: string
    foreground: string
    caret?: string
    title?: string
    control?: string
    lineNumber?: string
    lineHighlight?: string
  } & Partial<Record<ThemeToken, string>>
>

export type Theme =
  | ThemePalette
  | Readonly<{
      light: ThemePalette
      dark: ThemePalette
    }>

const tokenKeys: readonly ThemeToken[] = [
  'identifier',
  'keyword',
  'string',
  'class',
  'property',
  'entity',
  'jsxliterals',
  'sign',
  'comment',
]

type ThemeStyle = CSSProperties & Record<`--sh-${string}`, string | undefined>

function lightDark(light: string, dark: string) {
  return `light-dark(${light}, ${dark})`
}

function paletteStyle(palette: ThemePalette): ThemeStyle {
  const style: ThemeStyle = {
    backgroundColor: palette.background,
    color: palette.foreground,
    '--sh-caret-color': palette.caret ?? palette.foreground,
    '--sh-title-color': palette.title ?? palette.foreground,
    '--sh-control-color': palette.control ?? palette.comment ?? palette.foreground,
    '--sh-line-number-color': palette.lineNumber ?? palette.comment ?? palette.foreground,
    '--sh-line-highlight-color': palette.lineHighlight,
  }

  for (const token of tokenKeys) {
    style[`--sh-${token}`] = palette[token] ?? palette.foreground
  }

  return style
}

export function themeStyle(theme: Theme | undefined): ThemeStyle {
  if (!theme) return {}
  if (!('light' in theme)) return paletteStyle(theme)

  const light = paletteStyle(theme.light)
  const dark = paletteStyle(theme.dark)
  const style: ThemeStyle = {
    backgroundColor: lightDark(theme.light.background, theme.dark.background),
    color: lightDark(theme.light.foreground, theme.dark.foreground),
  }

  for (const key of Object.keys(light)) {
    if (!key.startsWith('--sh-')) continue
    const lightColor = light[key as keyof ThemeStyle]
    const darkColor = dark[key as keyof ThemeStyle]
    if (typeof lightColor === 'string' && typeof darkColor === 'string') {
      style[key as `--sh-${string}`] = lightDark(lightColor, darkColor)
    }
  }

  return style
}
