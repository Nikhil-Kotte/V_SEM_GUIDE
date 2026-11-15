import { useEffect, useRef, useState } from 'react'

// A number that counts up to its value the first time it is seen.
// Screen readers and reduced-motion users get the final value straight away.
export default function CountUp({ value, duration = 900, className = 'num' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(value)
  const played = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof value !== 'number' || !Number.isFinite(value)) { setShown(value); return }
    if (played.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setShown(value)
      return
    }
    let frame = 0
    setShown(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      played.current = true
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration)
        setShown(Math.round(value * (1 - Math.pow(1 - p, 4))))
        if (p < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  }, [value, duration])

  return <span ref={ref} className={className} aria-label={String(value)}><span aria-hidden="true">{shown}</span></span>
}
