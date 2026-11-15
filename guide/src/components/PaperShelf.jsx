import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown01Icon, Pdf01Icon } from '@hugeicons/core-free-icons'
import materials from '../content/materials.json'
import { isPdf, viewerPath } from '../lib/files.js'
import Icon from './Icon.jsx'

const GROUPS = [['paper', 'Past papers'], ['mids', 'Mid-term papers'], ['bank', 'Question banks']]
const label = (f) => f.name.replace(/\.pdf$/i, '')

// Every question paper for the subject, opened in the site's own PDF viewer.
export default function PaperShelf({ subject }) {
  const files = materials.filter((m) => m.subject === subject.id && m.group !== 'material' && isPdf(m.path))
  const [open, setOpen] = useState(false)
  if (!files.length) return null
  const sorted = (g) => files.filter((f) => f.group === g).sort((a, b) => (b.year || '').localeCompare(a.year || ''))
  return (
    <section className="shelf sheet" aria-labelledby="shelf-title">
      <button type="button" className="shelf__head" aria-expanded={open} aria-controls="shelf-list" onClick={() => setOpen((o) => !o)}>
        <span>
          <span id="shelf-title" className="hand shelf__title">The question papers</span>
          <span className="viz-sub">{files.length} papers, open any of them right here.</span>
        </span>
        <Icon icon={ArrowDown01Icon} className="icon shelf__chev" />
      </button>
      {open && (
        <div id="shelf-list" className="shelf__body">
          {GROUPS.map(([g, title]) => sorted(g).length > 0 && (
            <div key={g} className="shelf__group">
              <h3 className="shelf__group-title">{title}</h3>
              <ul className="shelf__list">
                {sorted(g).map((f, i) => (
                  <li key={f.path} style={{ '--i': i }}>
                    <Link to={viewerPath(f.path, f.name)} className="shelf__paper">
                      <Icon icon={Pdf01Icon} className="icon shelf__icon" />
                      <span className="shelf__name">{label(f)}</span>
                      {f.year && <span className="shelf__year num">{f.year}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
