'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { languages } from 'sugar-high/lang'
import { LANGUAGE_EXAMPLES } from '../language-examples'
import { ThemedCode } from '../components/react-themes'

const repeatedLanguages = Array.from({ length: 5 }, () => languages).flat()
const initialIndex = languages.length * 2 + languages.findIndex(item => item.id === 'typescript')

export function CodeDemo({ examples }: { examples: Record<'javascript' | 'typescript', string> }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const active = useRef(initialIndex)
  const list = useRef<HTMLDivElement>(null)
  const optionId = useId()
  const language = repeatedLanguages[activeIndex].id
  const centerIndex = useCallback((index: number) => {
    const element = list.current
    const item = element?.firstElementChild as HTMLElement | null | undefined
    if (!element || !item || !item.offsetWidth) return
    const step = item.offsetWidth
    element.scrollTo({ left: index * step, top: 0, behavior: 'instant' })
  }, [])
  const selected = languages.find(item => item.id === language)!
  const isJavaScript = language === 'javascript' || language === 'typescript'
  const source = isJavaScript ? examples[language] : LANGUAGE_EXAMPLES[language]
  const filename = language === 'dockerfile' ? 'Dockerfile' : `example.${selected.extension}`

  useEffect(() => {
    const element = list.current
    if (!element) return
    let disposed = false
    let frame = 0
    const update = () => {
      if (disposed) return
      const item = element.firstElementChild as HTMLElement | null
      if (!item || !item.offsetWidth) return
      const step = item.offsetWidth
      let position = element.scrollLeft
      const cycle = languages.length * step
      if (position < cycle || position >= cycle * 4) {
        position = cycle * 2 + ((position % cycle) + cycle) % cycle
        element.scrollTo({ left: position, top: 0, behavior: 'instant' })
      }
      const index = Math.round(position / step)
      active.current = index
      setActiveIndex(index)
    }
    const onScroll = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    const resize = () => {
      if (disposed) return
      centerIndex(languages.length * 2 + active.current % languages.length)
      update()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    element.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      element.removeEventListener('scroll', onScroll)
    }
  }, [centerIndex])

  return (
    <div className="react-code-demo">
      <div className="react-code-language-list">
        <div
          className="react-code-languages"
          role="listbox"
          aria-label="Code language"
          aria-orientation="horizontal"
          aria-activedescendant={`${optionId}-${activeIndex}`}
          tabIndex={0}
          ref={list}
          onKeyDown={event => {
            const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1
              : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0
            if (direction) {
              event.preventDefault()
              centerIndex(active.current + direction)
            }
          }}
        >
          {repeatedLanguages.map((item, index) => (
            <button
              id={`${optionId}-${index}`}
              key={index}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={activeIndex === index}
              aria-setsize={languages.length}
              aria-posinset={index % languages.length + 1}
              onClick={() => {
                centerIndex(index)
                list.current?.focus({ preventScroll: true })
              }}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>
      <div className="product-card">
        <div className="product-card__bar">
          <span className="product-card__title">{filename}</span>
        </div>
        <div className="react-code-scroll" key={language} tabIndex={0} role="region" aria-label={`${language} code example`}>
          <ThemedCode
            className="react-code-preview"
            lang={language}
            lineNumbers
            padding="0"
            highlightLines={isJavaScript ? [[7, 16]] : language === 'diff' ? [] : [1]}
          >
            {source}
          </ThemedCode>
        </div>
      </div>
    </div>
  )
}
