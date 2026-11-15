import { Link } from 'react-router-dom'
import Tally from '../Tally.jsx'
import { Tape } from '../ink/Desk.jsx'
import { Tick } from '../ink/Ink.jsx'
import { topicStats } from './stats.js'

// A to-do list torn from a pad: the most-asked topics you have not ticked off yet.
export default function StudyNext({ data, isDone, limit = 6 }) {
  const all = Object.values(data).flatMap((d) => topicStats(d).map((t) => ({ ...t, subject: d.subject })))
  const todo = all.filter((t) => t.papers > 0 && !isDone(t.id)).sort((a, b) => b.papers - a.papers || b.questions - a.questions).slice(0, limit)
  const loaded = Object.keys(data).length > 0

  return (
    <section className="todo sheet sheet--ruled torn-b" aria-labelledby="todo-title">
      <Tape />
      <h3 id="todo-title" className="hand todo__title">Do these next</h3>
      <p className="viz-sub">Asked in the most papers, and not ticked off yet.</p>
      {!loaded ? <p className="faint">Reading the question papers...</p>
        : todo.length === 0 ? (
          <p className="todo__clear"><Tick /> Every topic that was ever asked is ticked off. Go and revise.</p>
        ) : (
          <ol className="todo__list">
            {todo.map((t, i) => (
              <li key={t.id}>
                <Link to={`/s/${t.subject.id}/learn/${encodeURIComponent(t.id)}`}>
                  <span className="todo__box" aria-hidden="true" />
                  <span className="todo__main">
                    <span className="todo__name">{t.title}</span>
                    <span className="todo__meta">{t.subject.short}, Unit {t.unit}</span>
                  </span>
                  <Tally count={t.papers} size="sm" delay={i * 90} />
                </Link>
              </li>
            ))}
          </ol>
        )}
    </section>
  )
}
