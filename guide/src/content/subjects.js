// Subject registry. `load` pulls in that subject's notes lazily so the home page stays light.
export const subjects = [
  {
    id: 'se', short: 'SE', code: '22CSC21N', name: 'Software Engineering',
    blurb: 'Estimate it, design it, test it, ship it.',
    accent: 'var(--blue)', tint: 'var(--blue-tint)', materialDir: 'Material/SE',
    load: () => import('./se/index.js'),
  },
  {
    id: 'os', short: 'OS', code: '22CSC15N', name: 'Operating Systems',
    blurb: 'Memory, disks, threads, deadlocks, files and security.',
    accent: 'var(--coral)', tint: 'var(--coral-tint)', materialDir: 'Material/OS',
    load: () => import('./os/index.js'),
  },
  {
    id: 'cn', short: 'CN', code: '22ITC10N', name: 'Computer Networks',
    blurb: 'How packets find their way, and how apps talk.',
    accent: 'var(--green)', tint: 'var(--mint)', materialDir: 'Material/CN',
    load: () => import('./cn/index.js'),
  },
  {
    id: 'fds', short: 'FDS', code: '22CSC59', name: 'Fundamentals of Data Science',
    blurb: 'pandas, cleaning, testing ideas, and machine learning.',
    accent: 'var(--gold)', tint: 'var(--yellow-tint)', materialDir: 'Material/FDS',
    load: () => import('./fds/index.js'),
  },
  {
    id: 'bda', short: 'BDA', code: '22CSE19', name: 'Big Data Analytics',
    blurb: 'YARN, Hive, Pig and Spark, without the jargon.',
    accent: 'var(--violet)', tint: 'var(--violet-tint)', materialDir: 'Material/BDA',
    load: () => import('./bda/index.js'),
  },
  {
    id: 'pdt', short: 'PDT', code: '22MEO01', name: 'Principles of Design Thinking',
    blurb: 'Define, ideate, prototype, test, repeat.',
    accent: 'var(--rose)', tint: 'var(--rose-tint)', materialDir: 'Material/PDT',
    load: () => import('./pdt/index.js'),
  },
]

export const comingSoon = [
  { id: 'drrm', short: 'DRRM', name: 'Disaster Risk Reduction & Management', blurb: 'Notes are on the way.' },
]

export const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]))
