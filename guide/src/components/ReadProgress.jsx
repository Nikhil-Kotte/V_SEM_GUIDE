import { useEffect, useRef } from 'react'

// An ink line under the tabs that grows as you read down the page.
export default function ReadProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.setProperty('--read', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0')
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [])
  return <span ref={ref} className="read-progress" aria-hidden="true" />
}
