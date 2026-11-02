import { paperById } from '../content/papers.js'

// Repeat count = number of *distinct* papers that asked the question.
// Ranking: most repeated first, then most recently asked, then highest marks.
export function enrich(q) {
  const seen = new Map()
  for (const a of q.asks) {
    const p = paperById[a.paperId]
    if (!p) throw new Error(`Unknown paper "${a.paperId}" in ${q.id}`)
    const prev = seen.get(p.id)
    if (!prev || (a.marks || 0) > (prev.marks || 0)) seen.set(p.id, { ...a, paper: p })
  }
  const asks = [...seen.values()].sort((a, b) => b.paper.date.localeCompare(a.paper.date))
  return {
    ...q,
    asks,
    count: q.kind === 'predicted' ? 0 : asks.length,
    latest: asks[0]?.paper.date || '',
    latestLabel: asks[0]?.paper.label || '',
    maxMarks: Math.max(0, ...asks.map((a) => a.marks || 0)),
  }
}

export function rankPyqs(list) {
  return list.map(enrich).sort((a, b) =>
    (b.count - a.count) || b.latest.localeCompare(a.latest) || (b.maxMarks - a.maxMarks))
}

export const sortByRecent = (list) =>
  [...list].sort((a, b) => b.latest.localeCompare(a.latest) || (b.count - a.count))
