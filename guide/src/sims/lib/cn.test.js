import { describe, expect, it } from 'vitest'
import { cidr, parseCidr, cwndTrace } from './cn.js'

describe('CIDR', () => {
  it("Nov '25: 205.16.37.39/28 → .32 to .47, 16 addresses", () => {
    const { ip, n } = parseCidr('205.16.37.39/28')
    const r = cidr(ip, n)
    expect(r.first).toBe('205.16.37.32')
    expect(r.last).toBe('205.16.37.47')
    expect(r.count).toBe(16)
    expect(r.mask).toBe('255.255.255.240')
  })
  it('handles /31 and /32 without network/broadcast loss', () => {
    expect(cidr(parseCidr('10.0.0.1/32').ip, 32)).toMatchObject({ first: '10.0.0.1', last: '10.0.0.1', count: 1, usable: 1 })
    expect(cidr(parseCidr('10.0.0.1/31').ip, 31)).toMatchObject({ first: '10.0.0.0', last: '10.0.0.1', usable: 2 })
  })
  it('handles /0 and classes', () => {
    expect(cidr(parseCidr('129.14.6.8/0').ip, 0)).toMatchObject({ first: '0.0.0.0', last: '255.255.255.255', cls: 'B' })
    expect(cidr(parseCidr('238.34.2.1/24').ip, 24).cls).toMatch(/^D/)
  })
  it('rejects bad input', () => {
    expect(parseCidr('300.1.1.1/24').error).toBeTruthy()
    expect(parseCidr('1.1.1.1/33').error).toBeTruthy()
    expect(parseCidr('hello').error).toBeTruthy()
  })
})

describe('cwnd trace', () => {
  it("Dec '22 preset: window at end of 10th transmission is 7 (restart from initial window)", () => {
    const t = cwndTrace({ initial: 2, ssthresh: 8, rounds: 10, timeouts: [5] })
    expect(t.map((x) => x.cwnd)).toEqual([2, 4, 8, 9, 10, 2, 4, 5, 6, 7])
  })
  it('restart from 1 MSS gives 6', () => {
    const t = cwndTrace({ initial: 2, ssthresh: 8, rounds: 10, timeouts: [5], reset: 'one' })
    expect(t.at(-1).cwnd).toBe(6)
  })
  it('Reno halves instead of restarting', () => {
    const t = cwndTrace({ initial: 1, ssthresh: 8, rounds: 7, timeouts: [5], mode: 'reno' })
    expect(t.map((x) => x.cwnd)).toEqual([1, 2, 4, 8, 9, 4, 5])
  })
})
