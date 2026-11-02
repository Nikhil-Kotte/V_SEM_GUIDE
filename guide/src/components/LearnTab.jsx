import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/storage.js'
import TopicCard from './TopicCard.jsx'

export default function LearnTab({ subject, data, focus }) {
  const store = useStore()
  const navigate = useNavigate()
  const [active, setActive] = useState(focus || data.units[0].topics[0].id)

  // Jump to a topic when the URL names one (from search, PYQs or the outline).
  useEffect(() => {
    if (!focus) return
    const el = document.getElementById(focus)
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
      setActive(focus)
    }
  }, [focus])

  // Scroll-spy: highlight the topic currently being read.
  useEffect(() => {
    const els = data.units.flatMap((u) => u.topics.map((t) => document.getElementById(t.id))).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [data])

  const goTo = (id) => navigate(`/s/${subject.id}/learn/${encodeURIComponent(id)}`, { replace: true })

  return (
    <div className="layout">
      <aside className="outline" aria-label="Topics">
        {data.units.map((u) => (
          <div key={u.unit}>
            <div className="unit-title">Unit {u.unit}</div>
            <ul>
              {u.topics.map((t) => (
                <li key={t.id}>
                  <a href={`#/s/${subject.id}/learn/${encodeURIComponent(t.id)}`} className={active === t.id ? 'active' : undefined}
                    aria-current={active === t.id ? 'location' : undefined}
                    onClick={(e) => { e.preventDefault(); goTo(t.id); document.getElementById(t.id)?.scrollIntoView({ block: 'start' }) }}>
                    <span>{t.title}</span>
                    {store.done(t.id) && <span className="tick" aria-label="done">✓</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <main>
        <div className="mobile-picker">
          <label className="sr-only" htmlFor="topic-pick">Jump to topic</label>
          <select id="topic-pick" value={active} onChange={(e) => { goTo(e.target.value); document.getElementById(e.target.value)?.scrollIntoView({ block: 'start' }) }}>
            {data.units.map((u) => (
              <optgroup key={u.unit} label={`Unit ${u.unit} — ${u.title}`}>
                {u.topics.map((t) => <option key={t.id} value={t.id}>{store.done(t.id) ? '✓ ' : ''}{t.title}</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        {data.units.map((u, ui) => (
          <section key={u.unit} aria-labelledby={`unit-${u.unit}`}>
            <div className="unit-head" style={ui === 0 ? { marginTop: 24 } : undefined}>
              <span className="label">Unit {u.unit}</span>
              <h2 id={`unit-${u.unit}`}>{u.title}</h2>
            </div>
            {u.topics.map((t) => (
              <TopicCard key={t.id} subject={subject} topic={t} content={data.topics[t.id]} pyqs={data.bySyllabus[t.id] || []} />
            ))}
          </section>
        ))}
      </main>
    </div>
  )
}
