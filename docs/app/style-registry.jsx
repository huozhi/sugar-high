'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

function useStyledJsxRegistry() {
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  function styledJsxFlushEffect() {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  }

  function StyledJsxRegistry({ children }) {
    return (
      <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
    )
  }

  return [StyledJsxRegistry, styledJsxFlushEffect]
}

export default function StyledJsxRegistry({ children }) {
  const [StyledJsxRegistry, styledJsxFlushEffect] = useStyledJsxRegistry()

  useServerInsertedHTML(() => {
    return (
      <>
        {styledJsxFlushEffect()}
      </>
    )
  })

  return (
    <StyledJsxRegistry>{children}</StyledJsxRegistry>
  )
}