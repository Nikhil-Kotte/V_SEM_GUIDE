import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/storage.js'
import Blocks from './Blocks.jsx'
import Inline from './Inline.jsx'
import SpringCheck from './bits/SpringCheck.jsx'

// The detailed exam answers for this topic's past questions, right under the notes.
function TopicAnswers({ subject, pyqs }) {
  const [open, setOpen] = useState(null)
  return (
    <section className="topic-answers" aria-label="Exam answers for this topic">
      <div className="label" style={{ marginBottom: 10 }}>Exam answers for this topic · {pyqs.length}</div>
      {pyqs.map((q) => (
        <div key={q.id} className="ta-item">
          <button type="button" className="ta-q" aria-expanded={open === q.id} onClick={() => setOpen(open === q.id ? null : q.id)}>
            <span className="ta-chev" aria-hidden="true">{open === q.id ? '−' : '+'}</span>
            <span className="ta-text">{q.q}</span>
            <span className="ta-meta">{q.count > 0 ? `${q.count}×` : q.kind === 'predicted' ? 'likely' : ''}{q.maxMarks ? ` · ${q.maxMarks}M` : ''}</span>
          </button>
          {open === q.id && (
            <div className="ta-a prose">
              <Blocks blocks={q.answer.blocks} />
              {q.answer.sources && <p className="faint" style={{ fontSize: 13, marginTop: 12 }}>Sources: {q.answer.sources.join(' · ')}</p>}
              <Link to={`/s/${subject.id}/pyqs/${encodeURIComponent(q.id)}`} className="chip" style={{ textDecoration: 'none' }}>Open in PYQs →</Link>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}

// ChatGPT's plain-language explanation of the topic (content/<subject>/simple.js).
function SimpleWords({ s }) {
  return (
    <section className="simple-words" aria-label="In simple words">
      <div className="simple-words__head">
        <span className="label">In simple words</span>
        <span className="simple-words__by">Explained by ChatGPT</span>
      </div>
      <div className="prose">
        <Blocks blocks={[s.summary, { ul: s.points }, { analogy: s.analogy }, `**Example:** ${s.example}`]} />
      </div>
    </section>
  )
}

export default function TopicCard({ subject, topic, content, pyqs }) {
  const store = useStore()
  const done = store.done(topic.id)
  const asked = pyqs.filter((q) => q.count > 0)
  const totalAsks = new Set(asked.flatMap((q) => q.asks.map((a) => a.paperId))).size

  return (
    <article className="topic" id={topic.id} aria-labelledby={`${topic.id}-title`}>
      <div className="topic-head">
        <div>
          <h3 id={`${topic.id}-title`}>{topic.title}</h3>
          <div className="asked">
            {totalAsks > 0
              ? <Link to={`/s/${subject.id}/pyqs?topic=${encodeURIComponent(topic.id)}`} className={`chip ${totalAsks >= 3 ? 'chip-hot' : 'chip-warm'}`} style={{ textDecoration: 'none' }}>
                {totalAsks >= 3 ? '🔥 ' : ''}In {totalAsks} past paper{totalAsks > 1 ? 's' : ''} · {asked.length} question{asked.length > 1 ? 's' : ''} →
              </Link>
              : <span className="chip chip-pred">Not asked in past papers yet</span>}
            {topic.covers && <span className="chip">{topic.covers}</span>}
          </div>
        </div>
        <div className="done-check">
          <SpringCheck
            label={done ? 'Done' : 'Mark done'}
            checked={done}
            onChange={() => store.toggleDone(topic.id)}
            color="var(--text)"
            fillColor="#3f7a5a"
            checkColor="#ffffff"
            boxSize={24}
            boxRadius={12}
            fontSize={15}
            strike="none"
            doneOpacity={1}
            ariaLabel={`Mark ${topic.title} as done`}
          />
        </div>
      </div>

      {content ? (
        <>
          <p className="one-line"><b>In one line:</b><Inline text={content.oneLine} /></p>
          {content.simple && <SimpleWords s={content.simple} />}
          {content.simple && <div className="label" style={{ margin: '22px 0 10px' }}>Detailed notes</div>}
          <div className="prose"><Blocks blocks={content.blocks} /></div>
          {content.terms?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="label" style={{ marginBottom: 8 }}>Key terms — tap to see</div>
              <Blocks blocks={[{ terms: content.terms }]} />
            </div>
          )}
          {content.exam && <div style={{ marginTop: 20 }}><Blocks blocks={[{ exam: content.exam }]} /></div>}
        </>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>Notes for this topic are being written. Meanwhile, check the past questions and the original material in Downloads.</p>
      )}

      {pyqs.some((q) => q.answer) && <TopicAnswers subject={subject} pyqs={pyqs.filter((q) => q.answer)} />}
    </article>
  )
}
