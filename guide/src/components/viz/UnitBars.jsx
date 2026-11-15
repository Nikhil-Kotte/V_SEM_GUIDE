import { Link } from 'react-router-dom'
import { unitStats } from './stats.js'

// Five bars, one per unit: height = how often the unit was asked, filled part = topics you have done.
export default function UnitBars({ subject, data, isDone }) {
  const units = unitStats(data, isDone)
  const max = Math.max(1, ...units.map((u) => u.asks))
  return (
    <ol className="unitbars" aria-label="Times each unit was asked in past papers">
      {units.map((u, i) => (
        <li key={u.unit}>
          <Link to={`/s/${subject.id}/learn/${encodeURIComponent(u.first)}`} title={`Unit ${u.unit}: ${u.title}`}
            aria-label={`Unit ${u.unit}, ${u.title}: asked ${u.asks} times, ${u.done} of ${u.topics} topics done`}>
            <span className="unitbars__n num">{u.asks}</span>
            <span className="unitbars__bar" style={{ '--h': (u.asks / max).toFixed(3), '--done': (u.done / u.topics).toFixed(3), '--i': i }}><i /></span>
            <span>{u.unit}</span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
