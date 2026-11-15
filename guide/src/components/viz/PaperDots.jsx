import { papers } from '../../content/papers.js'

const bySubject = {}
function papersOf(subjectId) {
  if (!bySubject[subjectId]) bySubject[subjectId] = papers.filter((p) => p.subject === subjectId).sort((a, b) => a.date.localeCompare(b.date))
  return bySubject[subjectId]
}

// One dot per past paper, oldest on the left; filled dots are the papers that asked this question.
export default function PaperDots({ subjectId, asks }) {
  const all = papersOf(subjectId)
  if (all.length < 2 || !asks.length) return null
  const asked = new Map(asks.map((a) => [a.paperId, a]))
  return (
    <span className="dots" role="img" aria-label={`Asked in ${asks.map((a) => a.paper.label).join(', ')}`}>
      <span className="dots__line" aria-hidden="true">
        {all.map((p, i) => (
          <i key={p.id} title={p.label} style={{ '--i': i }}
            className={asked.has(p.id) ? `is-on${p.relation === 'related' ? ' is-related' : p.relation === 'mid' ? ' is-mid' : ''}` : undefined} />
        ))}
      </span>
      <span className="dots__label" aria-hidden="true">{all[0].label} to {all[all.length - 1].label}</span>
    </span>
  )
}
