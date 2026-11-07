import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Row of links with a ballpoint underline that slides to the current one.
// The underline moves with transform only (translateX + scaleX), so it stays smooth on slow phones.
// items: [{ to, label, current, ariaLabel? }]
export default function TabBar({ items, ariaLabel, className = '' }) {
  const listRef = useRef(null)
  const [bar, setBar] = useState(null)
  const activeIndex = items.findIndex((i) => i.current)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const el = list.querySelector('[aria-current="page"]')
      if (!el) { setBar(null); return }
      setBar((prev) => ({ x: el.offsetLeft, w: el.offsetWidth, ready: prev !== null }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    // Webfonts change label widths after first paint.
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [activeIndex, items.length])

  // Keep the current tab visible when the row scrolls sideways (phones).
  useLayoutEffect(() => {
    const el = listRef.current?.querySelector('[aria-current="page"]')
    if (!el) return
    const list = listRef.current
    if (el.offsetLeft < list.scrollLeft || el.offsetLeft + el.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: el.offsetLeft - 16 })
    }
  }, [activeIndex])

  return (
    <nav className={`tabbar ${className}`} aria-label={ariaLabel}>
      <ul ref={listRef}>
        {items.map((it) => (
          <li key={it.to}>
            <Link to={it.to} className="tabbar__link" aria-current={it.current ? 'page' : undefined} aria-label={it.ariaLabel}>
              {it.label}
            </Link>
          </li>
        ))}
        {bar && (
          <li aria-hidden="true" className={`tabbar__ink${bar.ready ? ' is-ready' : ''}`}
            style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})` }} />
        )}
      </ul>
    </nav>
  )
}
