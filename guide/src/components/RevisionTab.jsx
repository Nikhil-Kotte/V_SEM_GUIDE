import { Link } from 'react-router-dom'
import Inline from './Inline.jsx'

// Everything on one page for the night before: each topic's one-liner plus its must-remember points.
export default function RevisionTab({ subject, data }) {
  return (
    <div className="tab-body revision">
      <div className="section-head">
        <h2>Quick revision</h2>
        <p>Every topic in one line, plus the points you must not forget. Tap a topic to open its full notes. This page also prints cleanly.</p>
      </div>
      {data.units.map((u) => (
        <section key={u.unit} className="rev-unit" aria-labelledby={`rev-${u.unit}`}>
          <div className="unit-head"><span className="unit-num">Unit {u.unit}</span><h2 id={`rev-${u.unit}`}>{u.title}</h2></div>
          <div className="rev-list">
            {u.topics.map((t) => {
              const c = data.topics[t.id]
              return (
                <Link key={t.id} to={`/s/${subject.id}/learn/${encodeURIComponent(t.id)}`} className="rev-card">
                  <b className="rev-card__title">{t.title}</b>
                  {c ? <span className="rev-card__line"><Inline text={c.oneLine} /></span> : <span className="faint">Notes coming.</span>}
                  {c?.revise && (
                    <ul>
                      {c.revise.map((r, i) => <li key={i}><Inline text={r} /></li>)}
                    </ul>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
