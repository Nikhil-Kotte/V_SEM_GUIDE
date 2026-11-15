import { useEffect, useRef } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One shared observer for every pen stroke on the page.
let io = null
function observer() {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-drawn')
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -6% 0px' })
  }
  return io
}

// Makes an SVG stroke draw itself the first time it scrolls into view.
// Strokes are visible by default: the hidden state only applies once JS has armed the element,
// and reduced-motion users never get it. Paths need pathLength={1}.
export function useDrawOn(enabled = true, deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || reduced() || !('IntersectionObserver' in window)) return
    el.classList.remove('is-drawn')
    el.classList.add('ink-armed')
    // Let the armed state paint before it can be released, otherwise nothing animates.
    const frame = requestAnimationFrame(() => observer().observe(el))
    return () => { cancelAnimationFrame(frame); io?.unobserve(el) }
  }, [enabled, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
  return ref
}
