import { describe, expect, it } from 'vitest'
import { pageReplacement, diskSchedule, bankersSafety, bankersRequest, isSafeSequence, validateBankers, parseNums } from './os.js'

const textbook = parseNums('7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1')

describe('page replacement', () => {
  it('matches the textbook fault counts with 3 frames', () => {
    expect(pageReplacement(textbook, 3, 'FIFO').faults).toBe(15)
    expect(pageReplacement(textbook, 3, 'LRU').faults).toBe(12)
    expect(pageReplacement(textbook, 3, 'OPT').faults).toBe(9)
  })
  it('shows Belady\'s anomaly for FIFO on 1,2,3,4,1,2,5,1,2,3,4,5', () => {
    const s = parseNums('1 2 3 4 1 2 5 1 2 3 4 5')
    expect(pageReplacement(s, 3, 'FIFO').faults).toBe(9)
    expect(pageReplacement(s, 4, 'FIFO').faults).toBe(10)
  })
  it('never beats OPT', () => {
    const s = parseNums('7,2,3,1,2,5,3,4,6,7,7,1,0,5,4,6,2,3,0,1')
    const opt = pageReplacement(s, 3, 'OPT').faults
    expect(pageReplacement(s, 3, 'LRU').faults).toBeGreaterThanOrEqual(opt)
    expect(pageReplacement(s, 3, 'FIFO').faults).toBeGreaterThanOrEqual(opt)
  })
})

describe('disk scheduling (queue 98 183 37 122 14 124 65 67, head 53)', () => {
  const q = parseNums('98 183 37 122 14 124 65 67')
  it('FCFS = 640', () => expect(diskSchedule('FCFS', 53, q).total).toBe(640))
  it('SSTF = 236', () => expect(diskSchedule('SSTF', 53, q).total).toBe(236))
  it('SCAN towards 0 = 236', () => expect(diskSchedule('SCAN', 53, q, { direction: 'down' }).total).toBe(236))
  it('C-SCAN upwards = 382 counting the jump, 183 without', () => {
    expect(diskSchedule('C-SCAN', 53, q, { direction: 'up' }).total).toBe(382)
    expect(diskSchedule('C-SCAN', 53, q, { direction: 'up', countJump: false }).total).toBe(183)
  })
  it('LOOK upwards = 299, C-LOOK upwards = 322', () => {
    expect(diskSchedule('LOOK', 53, q, { direction: 'up' }).total).toBe(130 + 169)
    expect(diskSchedule('C-LOOK', 53, q, { direction: 'up' }).total).toBe(130 + 169 + 23)
  })
})

describe("Banker's", () => {
  // Silberschatz example: Available 3 3 2
  const avail = [3, 3, 2]
  const max = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]]
  const alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]]
  it('finds a valid safe sequence for the textbook example', () => {
    const r = bankersSafety(avail, max, alloc)
    expect(r.safe).toBe(true)
    expect(isSafeSequence(avail, max, alloc, r.sequence)).toBe(true)
    expect(isSafeSequence(avail, max, alloc, [1, 3, 4, 0, 2])).toBe(true)
  })
  it('grants P1 (1,0,2) and refuses P0 (0,2,0) after it', () => {
    const r1 = bankersRequest(avail, max, alloc, 1, [1, 0, 2])
    expect(r1.granted).toBe(true)
    const alloc2 = alloc.map((r, i) => (i === 1 ? [3, 0, 2] : r))
    expect(bankersRequest(r1.newAvail, max, alloc2, 0, [0, 2, 0]).granted).toBe(false)
  })
  it('Dec 21 paper data is safe', () => {
    const r = bankersSafety([3, 3, 2, 1],
      [[4, 2, 1, 2], [5, 2, 5, 2], [2, 3, 1, 6], [1, 4, 2, 4], [3, 6, 6, 5]],
      [[2, 0, 0, 1], [3, 1, 2, 1], [2, 1, 0, 3], [1, 3, 1, 2], [1, 4, 3, 2]])
    expect(r.safe).toBe(true)
    expect(r.sequence).toEqual([0, 3, 1, 2, 4]) // P1 can't go second: needs 3 of type C, only 2 free
  })
  it('rejects malformed matrices', () => {
    expect(validateBankers([1, 1], [[1, 1]], [[2, 0]])).toMatch(/more than its Max/)
    expect(validateBankers([1, 1], [[1, 1, 1]], [[0, 0]])).toMatch(/must have 2/)
  })
})
