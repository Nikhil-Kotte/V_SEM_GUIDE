// Subject registry. `load` pulls in that subject's notes lazily so the home page stays light.
// `exam` is the date of the paper (CSE column of the November 2026 time-table); the list is kept in exam order.
const list = [
  {
    id: 'se', short: 'SE', code: '22CSC21N', name: 'Software Engineering',
    exam: '2026-11-25',
    blurb: 'Estimate it, design it, test it, ship it.',
    accent: 'var(--blue)', tint: 'var(--blue-tint)', materialDir: 'Material/SE',
    load: () => import('./se/index.js'),
  },
  {
    id: 'os', short: 'OS', code: '22CSC15N', name: 'Operating Systems',
    exam: '2026-11-20',
    blurb: 'Memory, disks, threads, deadlocks, files and security.',
    accent: 'var(--coral)', tint: 'var(--coral-tint)', materialDir: 'Material/OS',
    load: () => import('./os/index.js'),
  },
  {
    id: 'cn', short: 'CN', code: '22ITC10N', name: 'Computer Networks',
    exam: '2026-11-17',
    blurb: 'How packets find their way, and how apps talk.',
    accent: 'var(--green)', tint: 'var(--mint)', materialDir: 'Material/CN',
    load: () => import('./cn/index.js'),
  },
  {
    id: 'fds', short: 'FDS', code: '22CSC59', name: 'Fundamentals of Data Science',
    exam: '2026-11-28',
    blurb: 'pandas, cleaning, testing ideas, and machine learning.',
    accent: 'var(--gold)', tint: 'var(--yellow-tint)', materialDir: 'Material/FDS',
    load: () => import('./fds/index.js'),
  },
  {
    id: 'bda', short: 'BDA', code: '22CSE19', name: 'Big Data Analytics',
    exam: '2026-12-02',
    blurb: 'YARN, Hive, Pig and Spark, without the jargon.',
    accent: 'var(--violet)', tint: 'var(--violet-tint)', materialDir: 'Material/BDA',
    load: () => import('./bda/index.js'),
  },
  {
    id: 'pdt', short: 'PDT', code: '22MEO01', name: 'Principles of Design Thinking',
    exam: '2026-12-05',
    blurb: 'Define, ideate, prototype, test, repeat.',
    accent: 'var(--rose)', tint: 'var(--rose-tint)', materialDir: 'Material/PDT',
    load: () => import('./pdt/index.js'),
  },
]

export const subjects = [...list].sort((a, b) => a.exam.localeCompare(b.exam))

export const comingSoon = [
  { id: 'drrm', short: 'DRRM', name: 'Disaster Risk Reduction & Management', exam: '2026-12-05', blurb: 'Notes are on the way.' },
]

export const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]))
