import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadAll } from '../lib/useSubject.js'

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
              kind: `${s.subject.short} · Unit ${u.unit} · Topic`, title: t.title,
              text: `${t.title} ${t.covers || ''} ${s.topics[t.id]?.oneLine || ''}`,
              to: `/s/${s.subject.id}/learn/${encodeURIComponent(t.id)}`,
            })
          }
        }
        for (const q of s.ranked) {
          items.push({
            kind: `${s.subject.short} · ${q.kind === 'predicted' ? 'Likely question' : q.count ? `Asked ${q.count}×` : 'Question'}`,
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
        return { ...it, score: titleHit * 2 + (it.kind.endsWith('Topic') ? 1 : 0) }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
  }, [query, index])

  useEffect(() => setSel(0), [query])

  const go = (r) => { onClose(); navigate(r.to) }

  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search the guide">
        <input
          ref={inputRef} value={query} placeholder="Search topics and past questions… e.g. banker, tcp header, mccall"
          aria-label="Search" role="combobox" aria-expanded={results.length > 0} aria-controls="search-results"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
            if (e.key === 'Enter' && results[sel]) go(results[sel])
          }}
        />
        <div className="search-results" id="search-results" role="listbox">
          {query && !results.length && <p className="muted" style={{ padding: '12px 14px' }}>No matches. Try fewer words.</p>}
          {!query && <p className="muted" style={{ padding: '12px 14px', margin: 0 }}>Type to search every subject. <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open.</p>}
          {results.map((r, i) => (
            <a key={r.to} href={'#' + r.to} role="option" aria-selected={i === sel}
              onMouseEnter={() => setSel(i)} onClick={(e) => { e.preventDefault(); go(r) }}>
              <div className="kind">{r.kind}</div>
              <div className="title">{r.title}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
