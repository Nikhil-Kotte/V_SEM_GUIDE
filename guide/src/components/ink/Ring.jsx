import { useEffect, useState } from 'react'

const R = 22
const C = 2 * Math.PI * R

// Progress ring: a dotted pencil track with the done part inked over it.
// `value` is 0..1. `children` replaces the default percentage label.
export default function Ring({ value = 0, size = 56, label, color, children, className = '' }) {
  const v = Math.max(0, Math.min(1, value || 0))
  // Start empty and fill on mount, so the arc sweeps in.
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(v))
    return () => cancelAnimationFrame(id)
  }, [v])
  const pct = Math.round(v * 100)
  return (
    <span className={`ring${v >= 1 ? ' is-full' : ''} ${className}`} style={{ '--ring': `${size}px`, ...(color ? { color } : null) }}
      role="img" aria-label={label || `${pct}% done`}>
      <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
        <circle className="ring__track" cx="28" cy="28" r={R} />
        <circle className="ring__arc" cx="28" cy="28" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - shown)}
          style={{ opacity: v > 0 ? 1 : 0 }} />
      </svg>
      <span className="ring__label" aria-hidden="true">{children ?? <>{pct}<small>%</small></>}</span>
    </span>
  )
}
