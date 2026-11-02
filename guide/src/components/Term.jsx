import { useId, useState } from 'react'

// Glossary chip: hover, focus or tap to see the definition.
export default function Term({ term, def }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="term-wrap">
      <button
        type="button" className="term" aria-describedby={open ? id : undefined} aria-expanded={open}
        onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      >
        {term}
      </button>
      {open && <span role="tooltip" id={id} className="term-tip">{def}</span>}
    </span>
  )
}
