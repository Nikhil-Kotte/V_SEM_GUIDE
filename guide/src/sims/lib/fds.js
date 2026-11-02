// Pure logic behind the FDS tools — tested in fds.test.js.

export function regressionMetrics(y, yhat) {
  if (y.length !== yhat.length) return { error: 'Actual and predicted lists must be the same length.' }
  if (!y.length) return { error: 'Enter at least one value.' }
  const n = y.length
  const err = y.map((v, i) => v - yhat[i])
  const mae = err.reduce((s, e) => s + Math.abs(e), 0) / n
  const mse = err.reduce((s, e) => s + e * e, 0) / n
  const mean = y.reduce((s, v) => s + v, 0) / n
  const ssTot = y.reduce((s, v) => s + (v - mean) ** 2, 0)
  const ssRes = err.reduce((s, e) => s + e * e, 0)
  // R² is undefined when every actual value is identical (no variance to explain).
  const r2 = ssTot === 0 ? null : 1 - ssRes / ssTot
  return { n, err, mae, mse, rmse: Math.sqrt(mse), mean, ssTot, ssRes, r2 }
}

// Small seeded PRNG so k-means runs are reproducible.
export function rng(seed = 1) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)
}

const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

// One k-means iteration history. Empty clusters are re-seeded at the point farthest from its centroid.
export function kmeans(points, k, { seed = 1, maxIter = 50, init } = {}) {
  const rand = rng(seed)
  let centroids = init ? init.map((c) => [...c]) : []
  if (!init) {
    const used = new Set()
    while (centroids.length < Math.min(k, points.length)) {
      const i = Math.floor(rand() * points.length)
      if (!used.has(i)) { used.add(i); centroids.push([...points[i]]) }
    }
  }
  const history = []
  let labels = []
  for (let it = 0; it < maxIter; it++) {
    labels = points.map((p) => centroids.reduce((best, c, j) => (dist2(p, c) < dist2(p, centroids[best]) ? j : best), 0))
    const next = centroids.map((c, j) => {
      const members = points.filter((_, i) => labels[i] === j)
      if (!members.length) {
        const far = points.reduce((b, p, i) => (dist2(p, centroids[labels[i]]) > dist2(points[b], centroids[labels[b]]) ? i : b), 0)
        return [...points[far]]
      }
      return [members.reduce((s, p) => s + p[0], 0) / members.length, members.reduce((s, p) => s + p[1], 0) / members.length]
    })
    history.push({ centroids, labels })
    const moved = next.some((c, j) => dist2(c, centroids[j]) > 1e-12)
    centroids = next
    if (!moved) break
  }
  const wcss = points.reduce((s, p, i) => s + dist2(p, centroids[labels[i]]), 0)
  return { centroids, labels, history, wcss, iterations: history.length }
}
