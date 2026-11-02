import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/storage.js'
import TopicCard from './TopicCard.jsx'
import RevealHeading from './RevealHeading.jsx'
import BranchedMenu from './bits/BranchedMenu.jsx'
import StatusMark from './bits/StatusMark.jsx'

// Unit completion as a StatusMark: dashed ring → progress arc → check.
function UnitProgress({ topics, store }) {
  const done = topics.filter((t) => store.done(t.id)).length
  const status = done === 0 ? 'pending' : done === topics.length ? 'done' : 'running'
  return (
    <span className="unit-progress">
      <StatusMark status={status} progress={status === 'running' ? done / topics.length : undefined}
        size={22} doneColor="#3f7a5a" strike={false} label={`${done}/${topics.length} done`} fontSize={14} />
    </span>
  )
}

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
  // The active topic is the last one whose top edge has scrolled past a line ~35% down the screen.
  useEffect(() => {
    const els = data.units.flatMap((u) => u.topics.map((t) => document.getElementById(t.id))).filter(Boolean)
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current = els[0]
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el
        else break
      }
      if (current) setActive(current.id)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [data])

  const goTo = (id) => navigate(`/s/${subject.id}/learn/${encodeURIComponent(id)}`, { replace: true })

  const menuItems = useMemo(() => data.units.map((u) => ({
    label: `Unit ${u.unit} · ${u.title}`,
    children: u.topics.map((t) => ({ value: t.id, label: `${store.done(t.id) ? '✓ ' : ''}${t.title}` })),
  })), [data, store]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="layout">
      <aside className="outline" aria-label="Topics">
        <BranchedMenu
          items={menuItems}
          active={active}
          defaultOpen={data.units.map((_, i) => i)}
          onSelect={(id) => { goTo(id); document.getElementById(id)?.scrollIntoView({ block: 'start' }) }}
          color="var(--text)"
          accentColor="var(--coral-deep)"
          lineColor="var(--line-strong)"
          width={290}
          rowHeight={34}
          fontSize={14.5}
        />
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
              <div id={`unit-${u.unit}`}><RevealHeading text={u.title} /></div>
              <UnitProgress topics={u.topics} store={store} />
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
