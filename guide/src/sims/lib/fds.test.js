import { describe, expect, it } from 'vitest'
import { regressionMetrics, kmeans } from './fds.js'

describe('regression metrics', () => {
  it('worked example y=[3,5,7], ŷ=[2,5,9]', () => {
    const r = regressionMetrics([3, 5, 7], [2, 5, 9])
    expect(r.mae).toBeCloseTo(1, 10)
    expect(r.mse).toBeCloseTo(5 / 3, 10)
    expect(r.rmse).toBeCloseTo(Math.sqrt(5 / 3), 10)
    expect(r.r2).toBeCloseTo(0.375, 10)
  })
  it('R² is undefined for a constant target', () => {
    expect(regressionMetrics([4, 4, 4], [4, 5, 3]).r2).toBeNull()
  })
  it('rejects mismatched lengths', () => {
    expect(regressionMetrics([1, 2], [1]).error).toBeTruthy()
  })
})

describe('k-means', () => {
  it('1-D example converges to centres 7 and 25', () => {
    const pts = [2, 4, 10, 12, 3, 20, 30, 11, 25].map((x) => [x, 0])
    const r = kmeans(pts, 2, { init: [[2, 0], [4, 0]] })
    const xs = r.centroids.map((c) => c[0]).sort((a, b) => a - b)
    expect(xs[0]).toBeCloseTo(7)
    expect(xs[1]).toBeCloseTo(25)
  })
  it('re-seeds an empty cluster instead of producing NaN', () => {
    const pts = [[0, 0], [0, 1], [10, 10]]
    const r = kmeans(pts, 2, { init: [[0, 0.5], [100, 100]] })
    expect(r.centroids.flat().every(Number.isFinite)).toBe(true)
  })
  it('is reproducible for a given seed', () => {
    const pts = Array.from({ length: 30 }, (_, i) => [i % 7, (i * 3) % 11])
    expect(kmeans(pts, 3, { seed: 5 }).wcss).toBe(kmeans(pts, 3, { seed: 5 }).wcss)
  })
})
