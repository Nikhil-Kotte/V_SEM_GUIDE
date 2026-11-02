import { Link } from 'react-router-dom'
import { simsFor } from '../sims/registry.js'
import SimEmbed from '../sims/SimEmbed.jsx'
import { topicIndex } from '../content/syllabus.js'

export default function NumericalsTab({ subject, data }) {
  const tools = simsFor(subject.id)
  const numericals = data.ranked.filter((q) => q.numerical)

  return (
    <div style={{ padding: '36px 0 96px' }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <span className="label">Practise</span>
        <div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}>{tools.length ? 'Try it yourself' : 'Problems & scripts'}</h2>
          <p>
            {tools.length
              ? 'Each tool comes loaded with a real past-paper problem. Change the numbers to check your own answers step by step.'
              : 'This subject has no number-crunching problems. Practise the code and script questions below instead.'}
          </p>
        </div>
      </div>

      {tools.map((t) => <SimEmbed key={t.id} id={t.id} />)}

      {numericals.length > 0 && (
        <>
          <div className="unit-head" style={{ marginTop: tools.length ? 48 : 0 }}>
            <span className="label">From past papers</span>
            <h2>{subject.id === 'bda' ? 'Code & script questions' : 'Numerical questions asked before'}</h2>
          </div>
          <div className="dl-list">
            {numericals.map((q) => (
              <Link key={q.id} to={`/s/${subject.id}/pyqs/${encodeURIComponent(q.id)}`} className="dl-row" style={{ textDecoration: 'none', gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                <div>
                  <div className="dl-name" style={{ fontWeight: 500 }}>{q.q}</div>
                  <div className="dl-sub">{topicIndex[q.syllabusId]?.title} · {q.asks.map((a) => a.paper.label).join(', ')}{q.answer ? ' · worked answer available' : ''}</div>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
