import { startTransition, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/storage.js'
import TopicCard from './TopicCard.jsx'
import RevealHeading from './RevealHeading.jsx'
import { useReveal } from './Reveal.jsx'
import BranchedMenu from './bits/BranchedMenu.jsx'
import StatusMark from './bits/StatusMark.jsx'
import Blocks from './Blocks.jsx'
import Icon from './Icon.jsx'
import Tally from './Tally.jsx'

// Unit completion as a StatusMark: dashed ring → progress arc → check.
function UnitProgress({ topics, store }) {
  const done = topics.filter((t) => store.done(t.id)).length
  const status = done === 0 ? 'pending' : done === topics.length ? 'done' : 'running'
  return (
    <span className="unit-progress">
      <StatusMark status={status} progress={status === 'running' ? done / topics.length : undefined}
        size={22} doneColor="var(--ok)" strike={false} label={`${done}/${topics.length} done`} fontSize={14} />
    </span>
  )
}

// Wide screens only: a sticky panel about the topic being read, so the extra width carries
// something useful (its past questions, the exam tip, what comes next) instead of empty paper.
function TopicRail({ subject, data, active, onJump }) {
  const topics = data.units.flatMap((u) => u.topics.map((t) => ({ ...t, unit: u.unit })))
  const i = topics.findIndex((t) => t.id === active)
  const topic = topics[i]
  if (!topic) return null
  const content = data.topics[topic.id]
  const pyqs = (data.bySyllabus[topic.id] || []).filter((q) => q.kind !== 'predicted').slice(0, 5)
  const next = topics[i + 1]
  return (
    <aside className="topic-rail" aria-label="About this topic">
      <p className="topic-rail__meta faint">Unit {topic.unit}, topic {i + 1} of {topics.length}</p>
      <h2 className="topic-rail__title">{topic.title}</h2>
      {pyqs.length > 0 ? (
        <section className="topic-rail__block" aria-label="Past questions on this topic">
          <h3>Asked in past papers</h3>
          <ul className="topic-rail__qs">
            {pyqs.map((q) => (
              <li key={q.id}>
                <Link to={`/s/${subject.id}/pyqs/${encodeURIComponent(q.id)}`}>
                  {q.count > 0 ? <Tally count={q.count} size="sm" /> : <span className="pyq-kind">Model</span>}
                  <span>{q.q}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : <p className="faint topic-rail__block">Not asked in the past papers we have.</p>}
      {content?.exam && (
        <section className="topic-rail__block topic-rail__exam" aria-label="How to write it in the exam">
          <h3>In the exam</h3>
          <div className="prose"><Blocks blocks={Array.isArray(content.exam) ? content.exam : [content.exam]} /></div>
        </section>
      )}
      {next && (
        <button type="button" className="topic-rail__next" onClick={() => onJump(next.id)}>
          <span><span className="faint">Next</span> {next.title}</span>
          <Icon icon={ArrowRight01Icon} />
        </button>
      )}
    </aside>
  )
}

export default function LearnTab({ subject, data, focus }) {
  const store = useStore()
  const navigate = useNavigate()
  const [active, setActive] = useState(focus || data.units[0].topics[0].id)
  // Render the first topics immediately and the rest in the next idle moment, unless a link
  // points deeper into the page, in which case everything renders at once so the jump lands.
  const [limit, setLimit] = useState(focus ? Infinity : 4)
  useEffect(() => {
    if (limit === Infinity) return
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200))
    const cancel = window.cancelIdleCallback || clearTimeout
    const id = idle(() => startTransition(() => setLimit(Infinity)))
    return () => cancel(id)
  }, [limit])
  const listRef = useReveal([data, limit])

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
  }, [data, limit])

  const rank = useMemo(() => Object.fromEntries(data.units.flatMap((u) => u.topics).map((t, i) => [t.id, i])), [data])

  const goTo = (id) => navigate(`/s/${subject.id}/learn/${encodeURIComponent(id)}`, { replace: true })

  const menuItems = useMemo(() => data.units.map((u) => ({
    label: `Unit ${u.unit}: ${u.title}`,
    children: u.topics.map((t) => {
      const label = `${store.done(t.id) ? '✓ ' : ''}${t.title}`
      // ~28 characters fit on one line of the 280px sidebar; extra lines make the row taller
      return { value: t.id, label, lines: Math.ceil(label.length / 28) }
    }),
  })), [data, store])

  return (
    <div className="layout has-rail">
      <aside className="outline" aria-label="Topics">
        <BranchedMenu
          items={menuItems}
          active={active}
          defaultOpen={data.units.map((_, i) => i)}
          onSelect={(id) => { goTo(id); document.getElementById(id)?.scrollIntoView({ block: 'start' }) }}
          color="var(--text)"
          accentColor="var(--accent)"
          lineColor="var(--line-strong)"
          width={280}
          rowHeight={34}
          fontSize={14.5}
        />
      </aside>

      <main ref={listRef}>
        <div className="mobile-picker">
          <label className="sr-only" htmlFor="topic-pick">Jump to topic</label>
          <select id="topic-pick" value={active} onChange={(e) => { goTo(e.target.value); document.getElementById(e.target.value)?.scrollIntoView({ block: 'start' }) }}>
            {data.units.map((u) => (
              <optgroup key={u.unit} label={`Unit ${u.unit}: ${u.title}`}>
                {u.topics.map((t) => <option key={t.id} value={t.id}>{store.done(t.id) ? '✓ ' : ''}{t.title}</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        {data.units.map((u, ui) => (
          <section key={u.unit} aria-labelledby={`unit-${u.unit}`}>
            <div className={`unit-head${ui === 0 ? ' is-first' : ''}`}>
              <span className="unit-num">Unit {u.unit}</span>
              <RevealHeading id={`unit-${u.unit}`} text={u.title} />
              <UnitProgress topics={u.topics} store={store} />
            </div>
            {u.topics.map((t) => rank[t.id] < limit && (
              <TopicCard key={t.id} subject={subject} topic={t} content={data.topics[t.id]} pyqs={data.bySyllabus[t.id] || []} />
            ))}
          </section>
        ))}
      </main>

      <TopicRail subject={subject} data={data} active={active}
        onJump={(id) => { goTo(id); document.getElementById(id)?.scrollIntoView({ block: 'start' }) }} />
    </div>
  )
}
