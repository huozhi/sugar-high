'use client'

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  LIVE_EDITOR_THEME_PRESETS,
  type LiveEditorColorPlate,
} from './live-editor-presets'

export type SyntaxThemeContextValue = {
  themeIndex: number
  setThemeIndex: Dispatch<SetStateAction<number>>
  colorPlateColors: LiveEditorColorPlate
  setColorPlateColors: Dispatch<SetStateAction<LiveEditorColorPlate>>
}

export const SyntaxThemeContext = createContext<SyntaxThemeContextValue | null>(
  null
)

export function SyntaxThemeProvider({ children }: { children: ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(0)
  const [colorPlateColors, setColorPlateColors] = useState<LiveEditorColorPlate>(
    () => LIVE_EDITOR_THEME_PRESETS[0].colors
  )

  useEffect(() => {
    setColorPlateColors(LIVE_EDITOR_THEME_PRESETS[themeIndex].colors)
  }, [themeIndex])

  const value = useMemo(
    () => ({
      themeIndex,
      setThemeIndex,
      colorPlateColors,
      setColorPlateColors,
    }),
    [themeIndex, colorPlateColors]
  )

  return (
    <SyntaxThemeContext.Provider value={value}>
      {children}
    </SyntaxThemeContext.Provider>
  )
}
