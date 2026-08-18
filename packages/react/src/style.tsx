export function ScopedStyle({ css, href }: { css: string; href: string }) {
  return (
    <style data-codice-style data-sh-style href={href} precedence="default">
      {css}
    </style>
  )
}

export const fontSizeCss = (fontSize: string | number | undefined): string => {
  const fz = `${fontSize ?? 'inherit'}${typeof fontSize === 'number' ? 'px' : ''}`
  return fz
}
