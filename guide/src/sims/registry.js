import { lazy } from 'react'

// Interactive tools. `subject` decides which Numericals tab lists them; `syllabusId` ties them to a topic.
// Keys are matched by scripts/check-content.mjs — keep one per line in the form  'id': {
export const sims = {
  'os-page-replacement': { subject: 'os', syllabusId: 'os.u3.page-replacement', Component: lazy(() => import('./PageReplacementSim.jsx')) },
  'os-disk-scheduling': { subject: 'os', syllabusId: 'os.u3.disk-scheduling', Component: lazy(() => import('./DiskSchedulingSim.jsx')) },
  'os-bankers': { subject: 'os', syllabusId: 'os.u4.deadlock-avoidance', Component: lazy(() => import('./BankersSim.jsx')) },
  'se-cocomo': { subject: 'se', syllabusId: 'se.u3.cocomo', Component: lazy(() => import('./CocomoSim.jsx')) },
  'se-fp': { subject: 'se', syllabusId: 'se.u3.fp', Component: lazy(() => import('./FunctionPointSim.jsx')) },
  'se-cyclomatic': { subject: 'se', syllabusId: 'se.u5.whitebox', Component: lazy(() => import('./CyclomaticSim.jsx')) },
  'cn-cidr': { subject: 'cn', syllabusId: 'cn.u3.ip-addresses', Component: lazy(() => import('./CidrSim.jsx')) },
  'cn-cwnd': { subject: 'cn', syllabusId: 'cn.u4.congestion', Component: lazy(() => import('./CwndSim.jsx')) },
}

export const simsFor = (subject) =>
  Object.entries(sims).filter(([, s]) => s.subject === subject).map(([id, s]) => ({ id, ...s }))
