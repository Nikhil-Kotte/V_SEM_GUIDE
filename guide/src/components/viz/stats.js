// Numbers behind the charts. Everything is derived from what loadAll()/loadSubject() already return.

// Distinct papers that asked anything on a topic.
export function papersForTopic(pyqs = []) {
  return new Set(pyqs.filter((q) => q.count > 0).flatMap((q) => q.asks.map((a) => a.paperId))).size
}

// Per unit: how many times its topics were asked (one per question per paper), and how many topics it has.
export function unitStats(data, isDone) {
  return data.units.map((u) => {
    const asks = u.topics.reduce((n, t) => n + (data.bySyllabus[t.id] || []).reduce((k, q) => k + (q.count > 0 ? q.asks.length : 0), 0), 0)
    const done = u.topics.filter((t) => isDone(t.id)).length
    return { unit: u.unit, title: u.title, first: u.topics[0]?.id, topics: u.topics.length, done, asks }
  })
}

// Per topic: distinct papers and number of questions, for the "asked most" chart.
export function topicStats(data) {
  return data.units.flatMap((u) => u.topics.map((t) => {
    const pyqs = (data.bySyllabus[t.id] || []).filter((q) => q.count > 0)
    return { id: t.id, title: t.title, unit: u.unit, papers: papersForTopic(pyqs), questions: pyqs.length }
  }))
}
