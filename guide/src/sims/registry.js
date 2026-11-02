import { lazy } from 'react'

// Interactive tools. `subject` decides which Numericals tab lists them; `syllabusId` ties them to a topic.
// Keys are matched by scripts/check-content.mjs — keep one per line in the form  'id': {
export const sims = {
  'os-page-replacement': { subject: 'os', syllabusId: 'os.u3.page-replacement', Component: lazy(() => import('./PageReplacementSim.jsx')) },
  'os-disk-scheduling': { subject: 'os', syllabusId: 'os.u3.disk-scheduling', Component: lazy(() => import('./DiskSchedulingSim.jsx')) },
  'os-bankers': { subject: 'os', syllabusId: 'os.u4.deadlock-avoidance', Component: lazy(() => import('./BankersSim.jsx')) },
}

export const simsFor = (subject) =>
  Object.entries(sims).filter(([, s]) => s.subject === subject).map(([id, s]) => ({ id, ...s }))
