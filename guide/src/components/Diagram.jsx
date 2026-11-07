import { useEffect, useState } from 'react'
import { diagrams } from '../content/diagrams.js'
import { svgDiagrams } from './svg/index.js'
import { asset } from '../config.js'
import Inline from './Inline.jsx'
import Icon from './Icon.jsx'
import { ZoomInAreaIcon } from '@hugeicons/core-free-icons'

// Shows an extracted diagram from the course notes (click to enlarge) or a hand-drawn SVG.
export default function Diagram({ id }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const Svg = svgDiagrams[id]
  if (Svg) {
    return (
      <figure className="diagram svg-diagram">
        <div className="svg-wrap"><Svg.Component /></div>
        {Svg.caption && <figcaption><Inline text={Svg.caption} /></figcaption>}
      </figure>
    )
  }
  const d = diagrams[id]
  if (!d) {
    if (import.meta.env.DEV) console.warn('Missing diagram', id)
    return null
  }
  const src = asset(d.file)
  return (
    <figure className="diagram">
      <button type="button" onClick={() => setOpen(true)} aria-label={`Enlarge: ${d.caption}`}>
        <img src={src} alt={d.alt || d.caption} loading="lazy" decoding="async" width={d.w} height={d.h} />
        <span className="zoom-hint" aria-hidden="true"><Icon icon={ZoomInAreaIcon} size={14} /> Enlarge</span>
      </button>
      <figcaption>
        <Inline text={d.caption} />
        <span className="src">From your notes: {d.credit}</span>
      </figcaption>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={d.caption} onClick={() => setOpen(false)}>
          <img src={src} alt={d.alt || d.caption} />
        </div>
      )}
    </figure>
  )
}
