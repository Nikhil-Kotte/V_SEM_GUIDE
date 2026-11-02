import { Link } from 'react-router-dom'
import Inline from './Inline.jsx'

// Everything on one page for the night before: each topic's one-liner plus its must-remember points.
export default function RevisionTab({ subject, data }) {
  return (
    <div style={{ padding: '36px 0 96px' }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <span className="label">Night before</span>
        <div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}>Quick revision</h2>
          <p>Every topic in one line, plus the points you must not forget. Tap a card to open the full notes.</p>
        </div>
      </div>
      {data.units.map((u) => (
        <section key={u.unit} className="rev-unit">
          <div className="unit-head"><span className="label">Unit {u.unit}</span><h2>{u.title}</h2></div>
          <div className="rev-list">
            {u.topics.map((t) => {
              const c = data.topics[t.id]
              return (
                <Link key={t.id} to={`/s/${subject.id}/learn/${encodeURIComponent(t.id)}`} className="rev-card" style={{ textDecoration: 'none' }}>
                  <b>{t.title}</b>
                  {c ? <Inline text={c.oneLine} /> : <span className="faint">Notes coming.</span>}
                  {c?.revise && (
                    <ul style={{ margin: '8px 0 0', paddingLeft: '1.1em', fontSize: 14.5 }}>
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
