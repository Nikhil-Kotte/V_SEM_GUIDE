import { useState } from 'react'
import { topicStats } from './stats.js'

// Which topics the papers keep coming back to. Each bar is a filter: press it to list that topic's questions.
export default function TopicFrequency({ data, topic, onPick, unit = 'all' }) {
  const [all, setAll] = useState(false)
  const rows = topicStats(data).filter((t) => t.papers > 0 && (unit === 'all' || t.unit === unit)).sort((a, b) => b.papers - a.papers || b.questions - a.questions)
  if (rows.length < 3) return null
  const max = rows[0].papers
  const shown = all ? rows : rows.slice(0, 8)

  return (
    <figure className="freq sheet sheet--grid">
      <figcaption className="viz-title">
        <span className="hand">What the papers keep asking</span>
        <span className="viz-sub">Number of papers that asked each topic. Press a bar to see only its questions.</span>
      </figcaption>
      <ol className="freq__list">
        {shown.map((t, i) => (
          <li key={t.id}>
            <button type="button" className={`freq__row${i < 3 ? ' is-hot' : ''}`} aria-pressed={topic === t.id}
              onClick={() => onPick(topic === t.id ? 'all' : t.id)} title={t.title}>
              <span className="freq__name">{t.title}</span>
              <span className="freq__track" aria-hidden="true"><span className="freq__bar" style={{ '--w': (t.papers / max).toFixed(3), '--i': i }} /></span>
              <span className="freq__n num">{t.papers}<span className="sr-only"> papers</span></span>
            </button>
          </li>
        ))}
      </ol>
      {rows.length > 8 && (
        <button type="button" className="link-btn freq__more" aria-expanded={all} onClick={() => setAll((a) => !a)}>
          {all ? 'Show the top 8' : `Show all ${rows.length} topics`}
        </button>
      )}
    </figure>
  )
}
