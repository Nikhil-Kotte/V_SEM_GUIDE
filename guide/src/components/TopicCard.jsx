import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/storage.js'
import Blocks from './Blocks.jsx'
import Inline from './Inline.jsx'
import Icon from './Icon.jsx'
import Tally from './Tally.jsx'
import SpringCheck from './bits/SpringCheck.jsx'

// The detailed exam answers for this topic's past questions, right under the notes.
function TopicAnswers({ subject, pyqs }) {
  const [open, setOpen] = useState(null)
  return (
    <section className="topic-answers" aria-label="Exam answers for this topic">
      <h4 className="topic-answers__title">Exam answers for this topic <span className="faint num">({pyqs.length})</span></h4>
      {pyqs.map((q) => {
        const isOpen = open === q.id
        return (
          <div key={q.id} className={`ta-item${isOpen ? ' is-open' : ''}`}>
            <button type="button" className="ta-q" aria-expanded={isOpen} aria-controls={`ta-${q.id}`} onClick={() => setOpen(isOpen ? null : q.id)}>
              <Icon icon={ArrowDown01Icon} className="icon ta-chev" />
              <span className="ta-text">{q.q}</span>
              <span className="ta-meta">
                {q.count > 0 ? <span className="ta-count">{q.count}×</span> : q.kind === 'predicted' ? 'likely' : ''}
                {q.maxMarks ? <span>{q.maxMarks} marks</span> : null}
              </span>
            </button>
            {isOpen && (
              <div className="ta-a prose" id={`ta-${q.id}`}>
                <Blocks blocks={q.answer.blocks} />
                {q.answer.sources && <p className="faint src-line">Sources: {q.answer.sources.join(', ')}</p>}
                <Link to={`/s/${subject.id}/pyqs/${encodeURIComponent(q.id)}`} className="text-link">Open in PYQs <Icon icon={ArrowRight01Icon} /></Link>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

// The plain-language explanation of the topic (content/<subject>/simple.js).
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
    <article className={`topic rv${done ? ' is-done' : ''}`} id={topic.id} aria-labelledby={`${topic.id}-title`}>
      <div className="topic-head">
        <div>
          <h3 id={`${topic.id}-title`}>{topic.title}</h3>
          <div className="asked">
            {totalAsks > 0
              ? (
                <Link to={`/s/${subject.id}/pyqs?topic=${encodeURIComponent(topic.id)}`} className="asked-link">
                  <Tally count={totalAsks} size="sm" />
                  <span>In {totalAsks} past paper{totalAsks > 1 ? 's' : ''}, {asked.length} question{asked.length > 1 ? 's' : ''}</span>
                </Link>
              )
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
            fillColor="var(--ok)"
            checkColor="var(--surface)"
            boxSize={24}
            boxRadius={7}
            fontSize={15}
            strike="none"
            doneOpacity={1}
            ariaLabel={`Mark ${topic.title} as done`}
          />
        </div>
      </div>

      {content ? (
        <>
          <p className="one-line"><b>In one line:</b> <span className="hl"><Inline text={content.oneLine} /></span></p>
          {content.simple && <SimpleWords s={content.simple} />}
          {content.simple && <h4 className="notes-label">Detailed notes</h4>}
          <div className="prose"><Blocks blocks={content.blocks} /></div>
          {content.terms?.length > 0 && (
            <div className="topic-terms">
              <h4 className="notes-label">Key terms <span className="faint">(tap one to see what it means)</span></h4>
              <Blocks blocks={[{ terms: content.terms }]} />
            </div>
          )}
          {content.exam && <div className="topic-exam"><Blocks blocks={[{ exam: content.exam }]} /></div>}
        </>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>Notes for this topic are being written. Meanwhile, check the past questions and the original material in Downloads.</p>
      )}

      {pyqs.some((q) => q.answer) && <TopicAnswers subject={subject} pyqs={pyqs.filter((q) => q.answer)} />}
    </article>
  )
}
