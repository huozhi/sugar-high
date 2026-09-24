import './scroll-effects.css'

export function scrollItemScale(index: number, position: number) {
  return Math.max(0.76, 1 - Math.abs(index - position) * 0.08)
}
