import { Link } from 'react-router-dom'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { simsFor } from '../sims/registry.js'
import SimEmbed from '../sims/SimEmbed.jsx'
import { topicIndex } from '../content/syllabus.js'
import Icon from './Icon.jsx'
import Tally from './Tally.jsx'

export default function NumericalsTab({ subject, data }) {
  const tools = simsFor(subject.id)
  const numericals = data.ranked.filter((q) => q.numerical)

  return (
    <div className="tab-body">
      <div className="section-head">
        <h2>{tools.length ? 'Try it yourself' : 'Problems and scripts'}</h2>
        <p>
          {tools.length
            ? 'Each tool comes loaded with a real past-paper problem. Change the numbers to check your own answers step by step.'
            : 'This subject has no number-crunching problems. Practise the code and script questions below instead.'}
        </p>
      </div>

      {tools.length > 1 && (
        <nav className="sim-index" aria-label="Tools on this page">
          {tools.map((t) => (
            <a key={t.id} href={`#sim-${t.id}`} className="chip"
              onClick={(e) => { e.preventDefault(); document.getElementById(`sim-${t.id}`)?.scrollIntoView({ block: 'start' }) }}>
              {topicIndex[t.syllabusId]?.title || t.id}
            </a>
          ))}
        </nav>
      )}

      {tools.map((t) => <div key={t.id} id={`sim-${t.id}`} className="sim-anchor"><SimEmbed id={t.id} /></div>)}

      {numericals.length > 0 && (
        <>
          <div className="unit-head">
            <h2>{subject.id === 'bda' ? 'Code and script questions' : 'Numerical questions asked before'}</h2>
          </div>
          <ul className="row-list">
            {numericals.map((q) => (
              <li key={q.id}>
                <Link to={`/s/${subject.id}/pyqs/${encodeURIComponent(q.id)}`} className="row-link">
                  {q.count > 0 ? <Tally count={q.count} size="sm" /> : <span className="pyq-kind">Likely</span>}
                  <span className="row-link__main">
                    <span className="row-link__title">{q.q}</span>
                    <span className="row-link__sub">
                      {topicIndex[q.syllabusId]?.title}
                      {q.asks.length > 0 && `. Asked in ${q.asks.map((a) => a.paper.label).join(', ')}`}
                      {q.answer ? '. Worked answer available' : ''}
                    </span>
                  </span>
                  <Icon icon={ArrowRight01Icon} className="icon row-link__go" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
