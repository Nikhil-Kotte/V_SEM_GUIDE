import { Link } from 'react-router-dom'
import { subjects } from '../../content/subjects.js'
import { unitStats } from './stats.js'

const UNITS = ['I', 'II', 'III', 'IV', 'V']

// Subjects down, units across. The redder the cell, the more often that unit was asked;
// the green bar under the number is how much of the unit you have ticked off.
export default function UnitHeatmap({ data, isDone }) {
  const rows = subjects.map((s) => ({ subject: s, units: data[s.id] ? unitStats(data[s.id], isDone) : null }))
  const max = Math.max(1, ...rows.flatMap((r) => (r.units || []).map((u) => u.asks)))

  return (
    <figure className="heatmap">
      <figcaption className="viz-title">
        <span className="hand">Where the marks come from</span>
        <span className="viz-sub">Times each unit was asked in the past papers</span>
      </figcaption>
      <div className="heatmap__scroll">
        <table className="heatmap__table">
          <thead>
            <tr>
              <td />
              {UNITS.map((u) => <th key={u} scope="col">Unit {u}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ subject: s, units }) => (
              <tr key={s.id}>
                <th scope="row"><span className="heatmap__subj" style={{ color: s.accent }}>{s.short}</span></th>
                {UNITS.map((u, i) => {
                  const cell = units?.find((x) => x.unit === u)
                  if (!cell) return <td key={u}><span className="heatmap__cell is-empty" aria-hidden="true" /></td>
                  const heat = cell.asks / max
                  const share = cell.done / cell.topics
                  return (
                    <td key={u}>
                      <Link to={`/s/${s.id}/learn/${encodeURIComponent(cell.first)}`} className="heatmap__cell"
                        style={{ '--heat': heat.toFixed(3), '--i': i }}
                        title={`${s.short} Unit ${u}: ${cell.title}`}
                        aria-label={`${s.name}, Unit ${u}: asked ${cell.asks} times, ${cell.done} of ${cell.topics} topics done`}>
                        <span className="heatmap__n num">{cell.asks}</span>
                        <span className="heatmap__done" aria-hidden="true"><i style={{ transform: `scaleX(${share})` }} /></span>
                      </Link>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="viz-legend">
        <span className="heatmap__key" aria-hidden="true"><i style={{ '--heat': 0.05 }} /><i style={{ '--heat': 0.35 }} /><i style={{ '--heat': 0.7 }} /><i style={{ '--heat': 1 }} /></span>
        <span>asked rarely to asked most</span>
        <span className="heatmap__key-done" aria-hidden="true"><i /></span>
        <span>share of the unit you have done</span>
      </p>
    </figure>
  )
}
