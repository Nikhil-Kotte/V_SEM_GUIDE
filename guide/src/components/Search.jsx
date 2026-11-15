import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { loadAll } from '../lib/useSubject.js'
import Icon from './Icon.jsx'
import { Tape } from './ink/Desk.jsx'

const TRY = ['banker', 'tcp header', 'cocomo', 'k-means', 'scrum']

// Highlighter over the words that matched.
function Marked({ text, words }) {
  if (!words.length) return text
  // `words` are already reduced to letters and digits, so they are safe inside a RegExp.
  const re = new RegExp(`(${words.join('|')})`, 'ig')
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

// Ctrl/⌘-K search across every topic and past question.
export default function Search({ onClose }) {
  const [index, setIndex] = useState([])
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
    loadAll().then((all) => {
      const items = []
      for (const s of all) {
        for (const u of s.units) {
          for (const t of u.topics) {
            items.push({
              kind: `${s.subject.short}, Unit ${u.unit} topic`, title: t.title,
              text: `${t.title} ${t.covers || ''} ${s.topics[t.id]?.oneLine || ''}`,
              to: `/s/${s.subject.id}/learn/${encodeURIComponent(t.id)}`,
            })
          }
        }
        for (const u of s.bank2m || []) {
          for (const b of u.items) {
            items.push({ kind: `${s.subject.short}, Unit ${u.unit} 2-mark bank`, title: b.q, text: b.q, to: `/s/${s.subject.id}/bank/${encodeURIComponent(b.id)}` })
          }
        }
        for (const q of s.ranked) {
          items.push({
            kind: `${s.subject.short}, ${q.kind === 'predicted' ? 'likely question' : q.count ? `asked in ${q.count} paper${q.count > 1 ? 's' : ''}` : 'question'}`,
            title: q.q, text: q.q, to: `/s/${s.subject.id}/pyqs/${encodeURIComponent(q.id)}`,
          })
        }
      }
      setIndex(items)
    })
  }, [])

  const results = useMemo(() => {
    // Ignore punctuation so "bankers" finds "Banker's" and "tcp/ip" finds "TCP IP".
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9²\s]/g, '')
    const words = norm(query).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return index
      .map((it) => {
        const hay = norm(it.text)
        if (!words.every((w) => hay.includes(w))) return null
        const titleHit = words.filter((w) => norm(it.title).includes(w)).length
        return { ...it, score: titleHit * 2 + (it.kind.endsWith('topic') ? 1 : 0) }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
  }, [query, index])

  useEffect(() => setSel(0), [query])
  const words = query.toLowerCase().replace(/[^a-z0-9²\s]/g, '').split(/\s+/).filter(Boolean)

  const go = (r) => { onClose(); navigate(r.to) }

  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search the guide">
        <Tape side="l" />
        <div className="search-panel__field">
        <Icon icon={Search01Icon} size={22} />
        <input
          ref={inputRef} value={query} placeholder="Search topics and questions, e.g. banker, tcp header, mccall"
          aria-label="Search" role="combobox" aria-expanded={results.length > 0} aria-controls="search-results"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
            if (e.key === 'Enter' && results[sel]) go(results[sel])
          }}
        />
        </div>
        <div className="search-results" id="search-results" role="listbox">
          {query && !results.length && <p className="muted" style={{ padding: '12px 14px' }}>No matches. Try fewer words.</p>}
          {!query && (
            <div className="search-hint">
              <span className="hand">Try:</span>
              <span className="search-try">
                {TRY.map((t) => <button key={t} type="button" className="chip" onClick={() => { setQuery(t); inputRef.current?.focus() }}>{t}</button>)}
              </span>
              <span className="muted" style={{ fontSize: 14 }}><kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open.</span>
            </div>
          )}
          {results.map((r, i) => (
            <a key={r.to} href={'#' + r.to} role="option" aria-selected={i === sel} style={{ '--i': i }}
              onMouseEnter={() => setSel(i)} onClick={(e) => { e.preventDefault(); go(r) }}>
              <div className="kind">{r.kind}</div>
              <div className="title"><Marked text={r.title} words={words} /></div>
              <Icon icon={ArrowRight01Icon} className="icon go" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
