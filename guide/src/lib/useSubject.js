import { useEffect, useState } from 'react'
import { subjectById, subjects } from '../content/subjects.js'
import { syllabus } from '../content/syllabus.js'
import { rankPyqs } from './rank.js'

const cache = {}

// Loads a subject's notes/PYQs once and derives ranked questions.
export function loadSubject(id) {
  if (!cache[id]) {
    cache[id] = subjectById[id].load().then((m) => {
      const mod = m.default
      const ranked = rankPyqs(mod.pyqs).map((q) => ({ ...q, answer: mod.answers?.[q.id] }))
      const bySyllabus = {}
      for (const q of ranked) (bySyllabus[q.syllabusId] ||= []).push(q)
      return { ...mod, ranked, bySyllabus, units: syllabus[id] }
    })
  }
  return cache[id]
}

export function useSubject(id) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    setData(null)
    if (subjectById[id]) loadSubject(id).then((d) => alive && setData(d))
    return () => { alive = false }
  }, [id])
  return data
}

export const loadAll = () => Promise.all(subjects.map((s) => loadSubject(s.id).then((d) => ({ subject: s, ...d }))))
