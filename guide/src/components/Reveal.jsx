import { useEffect, useRef } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Staggered scroll reveal for lists (topic cards, PYQ rows, subject rows).
// Children with the `rv` class fade and rise 12px the first time they enter the viewport.
// Content is visible by default: the hidden state only applies once JS has armed the list,
// and reduced-motion users skip it entirely. One IntersectionObserver per list, no scroll handlers.
export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root || reduced() || !('IntersectionObserver' in window)) return
    const items = [...root.querySelectorAll('.rv:not(.is-in)')]
    if (!items.length) return
    const vh = window.innerHeight
    // Anything already on screen stays put; only rows below the fold animate in.
    const below = items.filter((el) => el.getBoundingClientRect().top > vh * 0.92)
    if (!below.length) return
    below.forEach((el) => el.classList.add('rv-armed'))
    let batch = 0
    let frame = 0
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.style.setProperty('--rv-i', String(batch++ % 6))
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => { batch = 0 })
    }, { rootMargin: '0px 0px -8% 0px' })
    below.forEach((el) => io.observe(el))
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return ref
}

