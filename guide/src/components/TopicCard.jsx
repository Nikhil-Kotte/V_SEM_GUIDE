import { Link } from 'react-router-dom'
import { useStore } from '../lib/storage.js'
import Blocks from './Blocks.jsx'
import Inline from './Inline.jsx'

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
        <button type="button" className="done-btn" aria-pressed={done} onClick={() => store.toggleDone(topic.id)}>
          <span className="box" aria-hidden="true">{done ? '✓' : ''}</span>
          {done ? 'Done' : 'Mark done'}
        </button>
      </div>

      {content ? (
        <>
          <p className="one-line"><b>In one line:</b><Inline text={content.oneLine} /></p>
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
    </article>
  )
}
