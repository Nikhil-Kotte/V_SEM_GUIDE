import { lazy } from 'react'

// Interactive tools. `subject` decides which Numericals tab lists it; `syllabusId` ties it to a topic.
export const sims = {}

export const simsFor = (subject) =>
  Object.entries(sims).filter(([, s]) => s.subject === subject).map(([id, s]) => ({ id, ...s }))

export { lazy }
