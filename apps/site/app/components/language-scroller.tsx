'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { languages } from 'sugar-high/lang'
import type { LanguageName } from 'sugar-high'
import { scrollItemScale } from './scroll-effects'
import './language-scroller.css'

const languageOptions = languages.map(({ id }) => ({ id, label: id }))

export function LanguageScroller({ initialLanguage, onChange }: {
  initialLanguage: LanguageName
  onChange: (language: LanguageName) => void
}) {
  return <ScrollSelector options={languageOptions} initialValue={initialLanguage} label="Code language" onChange={value => onChange(value as LanguageName)} />
}

export function ScrollSelector({ options, initialValue, value, label, onChange }: {
  options: readonly { id: string; label: string }[]
  initialValue: string
  value?: string
  label: string
  onChange: (value: string) => void
}) {
  const repeatedOptions = Array.from({ length: 5 }, () => options).flat()
  const initialIndex = options.length * 2 + Math.max(0, options.findIndex(item => item.id === initialValue))
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const selectedLanguage = useRef(initialValue)
  const [scrollPosition, setScrollPosition] = useState(initialIndex)
  const activeIndex = Math.round(scrollPosition)
  const active = useRef(initialIndex)
  const list = useRef<HTMLDivElement>(null)
  const optionId = useId()
  const centerIndex = useCallback((index: number) => {
    const element = list.current
    const item = element?.firstElementChild as HTMLElement | null | undefined
    if (!element || !item || !item.offsetWidth) return
    const step = item.offsetWidth
    element.scrollTo({ left: index * step, top: 0, behavior: 'instant' })
  }, [])
  useEffect(() => {
    if (value === undefined || selectedLanguage.current === value) return
    const index = options.findIndex(item => item.id === value)
    if (index < 0) return
    selectedLanguage.current = value
    active.current = options.length * 2 + index
    setScrollPosition(active.current)
    centerIndex(active.current)
  }, [value, options, centerIndex])

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
      const cycle = options.length * step
      if (position < cycle || position >= cycle * 4) {
        position = cycle * 2 + ((position % cycle) + cycle) % cycle
        element.scrollTo({ left: position, top: 0, behavior: 'instant' })
      }
      const index = Math.round(position / step)
      active.current = index
      setScrollPosition(position / step)
      const language = options[index % options.length].id
      if (selectedLanguage.current !== language) {
        selectedLanguage.current = language
        onChangeRef.current(language)
      }
    }
    const onScroll = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    const resize = () => {
      if (disposed) return
      centerIndex(options.length * 2 + active.current % options.length)
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
  }, [centerIndex, options])

  return (
      <div className="language-scroller">
        <div
          className="language-scroller__list scroll-edge-fade"
          role="listbox"
          aria-label={label}
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
          {repeatedOptions.map((item, index) => (
            <button
              id={`${optionId}-${index}`}
              key={index}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={activeIndex === index}
              aria-setsize={options.length}
              aria-posinset={index % options.length + 1}
              onClick={() => {
                centerIndex(index)
                list.current?.focus({ preventScroll: true })
              }}
            >
              <span style={{ transform: `scale(${scrollItemScale(index, scrollPosition)})` }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
  )
}
