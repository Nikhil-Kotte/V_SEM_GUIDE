import { describe, expect, it } from 'vitest'
import { cocomoBasic, functionPoints, cyclomatic } from './se.js'

describe('COCOMO basic', () => {
  it('organic E = 2.4 * KLOC^1.05', () => {
    const r = cocomoBasic(32, 'organic')
    expect(r.effort).toBeCloseTo(2.4 * 32 ** 1.05, 6)
    expect(r.time).toBeCloseTo(2.5 * r.effort ** 0.38, 6)
  })
  it('200 KLOC semi-detached ≈ 1133 pm, 29.3 months', () => {
    const r = cocomoBasic(200, 'semidetached')
    expect(Math.round(r.effort)).toBe(1133)
    expect(r.time).toBeCloseTo(29.3, 1)
  })
})

describe('function points', () => {
  it("May '25 example: UFP 628, FP 671.96 with all Fi = 3", () => {
    const r = functionPoints({ ei: 50, eo: 40, eq: 35, ilf: 6, eif: 4 }, { ei: 1, eo: 1, eq: 1, ilf: 1, eif: 1 }, Array(14).fill(3))
    expect(r.ufp).toBe(628)
    expect(r.caf).toBeCloseTo(1.07, 10)
    expect(r.fp).toBeCloseTo(671.96, 2)
  })
  it('CAF spans 0.65 to 1.35', () => {
    expect(functionPoints({}, {}, Array(14).fill(0)).caf).toBeCloseTo(0.65)
    expect(functionPoints({}, {}, Array(14).fill(5)).caf).toBeCloseTo(1.35)
  })
})

describe('cyclomatic complexity', () => {
  it("Jun '23 flow graph has V(G) = 4 both ways", () => {
    const r = cyclomatic('a->bc, bc->f, bc->de, f->g, f->h, g->i, h->i, i->j, de->j, j->a, a->k')
    expect(r.E).toBe(11)
    expect(r.N).toBe(9)
    expect(r.byEdges).toBe(4)
    expect(r.byPredicates).toBe(4)
  })
  it('rejects malformed edges', () => {
    expect(() => cyclomatic('a->b->c')).toThrow()
  })
})
