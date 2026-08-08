export function ScopedStyle({ css }: { css: string }) {
  return (
    <style data-codice-style>
      {`@scope {\n${css}\n}`}
    </style>
  )
}

export const fontSizeCss = (fontSize: string | number | undefined): string => {
  const fz = `${fontSize ?? 'inherit'}${typeof fontSize === 'number' ? 'px' : ''}`
  return fz
}
