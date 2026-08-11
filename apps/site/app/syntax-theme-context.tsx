'use client'

import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
export type SyntaxThemeContextValue = {
  themeIndex: number
  setThemeIndex: Dispatch<SetStateAction<number>>
  previewMode: 'light' | 'dark'
  setPreviewMode: Dispatch<SetStateAction<'light' | 'dark'>>
}

export const SyntaxThemeContext = createContext<SyntaxThemeContextValue | null>(
  null
)

export function SyntaxThemeProvider({ children }: { children: ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(0)
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')

  const value = useMemo(
    () => ({
      themeIndex,
      setThemeIndex,
      previewMode,
      setPreviewMode,
    }),
    [themeIndex, previewMode]
  )

  return (
    <SyntaxThemeContext.Provider value={value}>
      {children}
    </SyntaxThemeContext.Provider>
  )
}
