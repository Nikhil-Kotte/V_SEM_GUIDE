import { useEffect, useRef } from 'react'

// Section heading that rises in once when scrolled into view (transform + opacity only).
// Visible by default; reduced-motion users and headings already on screen never animate.
export default function RevealHeading({ text, tag = 'h2', id }) {
  const Tag = tag
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    el.classList.add('rv-armed')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect() }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <Tag ref={ref} id={id} className="rv rv-heading">{text}</Tag>
}
