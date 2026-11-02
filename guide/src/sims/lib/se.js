// Pure logic behind the SE calculators — tested in se.test.js.

export const COCOMO_MODES = {
  organic: { label: 'Organic', a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
  semidetached: { label: 'Semi-detached', a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  embedded: { label: 'Embedded', a: 3.6, b: 1.2, c: 2.5, d: 0.32 },
}

export function cocomoBasic(kloc, mode) {
  const { a, b, c, d } = COCOMO_MODES[mode]
  const effort = a * kloc ** b
  const time = c * effort ** d
  return { effort, time, staff: effort / time, productivity: (kloc * 1000) / effort }
}

export const FP_WEIGHTS = {
  ei: { label: 'External inputs (EI)', w: [3, 4, 6] },
  eo: { label: 'External outputs (EO)', w: [4, 5, 7] },
  eq: { label: 'External inquiries (EQ)', w: [3, 4, 6] },
  ilf: { label: 'Internal logical files (ILF)', w: [7, 10, 15] },
  eif: { label: 'External interface files (EIF)', w: [5, 7, 10] },
}

export const GSC = [
  'Backup and recovery', 'Data communications', 'Distributed processing', 'Performance critical',
  'Heavily used configuration', 'Online data entry', 'Multi-screen input', 'Master files updated online',
  'Complex inputs/outputs/queries', 'Complex internal processing', 'Code designed for reuse',
  'Conversion/installation included', 'Multiple installations', 'Ease of change and use',
]

// counts: { ei: n, ... }, levels: { ei: 0|1|2 } (simple/average/complex), fi: array of 14 ratings 0..5
export function functionPoints(counts, levels, fi) {
  const rows = Object.entries(FP_WEIGHTS).map(([k, { w }]) => ({ key: k, count: counts[k] || 0, weight: w[levels[k] ?? 1], total: (counts[k] || 0) * w[levels[k] ?? 1] }))
  const ufp = rows.reduce((s, r) => s + r.total, 0)
  const sumFi = fi.reduce((s, x) => s + x, 0)
  const caf = 0.65 + 0.01 * sumFi
  return { rows, ufp, sumFi, caf, fp: ufp * caf }
}

// Edges as "a-b" or "a->b", one per line or comma separated. Returns V(G) by E − N + 2 and by decisions + 1.
export function cyclomatic(text) {
  const edges = String(text).split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean).map((s) => {
    const parts = s.split(/\s*(?:->|→|-)\s*/).filter(Boolean)
    if (parts.length !== 2) throw new Error(`Can't read edge "${s}". Write it like a->b.`)
    return parts
  })
  const nodes = [...new Set(edges.flat())]
  const out = {}
  for (const [a] of edges) out[a] = (out[a] || 0) + 1
  const decisions = Object.entries(out).filter(([, n]) => n > 1)
  const predicates = decisions.reduce((s, [, n]) => s + (n - 1), 0) // a node with k exits counts as k−1 predicates
  return { E: edges.length, N: nodes.length, byEdges: edges.length - nodes.length + 2, byPredicates: predicates + 1, decisions: decisions.map(([n]) => n), nodes, edges }
}
