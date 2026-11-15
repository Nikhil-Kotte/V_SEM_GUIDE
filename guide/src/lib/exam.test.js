import { describe, expect, it } from 'vitest'
import { daysToExam, examCountdown, examOver } from './exam.js'
import { subjects } from '../content/subjects.js'

const at = (iso) => new Date(iso)

describe('exam dates', () => {
  it('is not over until the paper ends at 1 PM IST', () => {
    expect(examOver('2026-11-17', at('2026-11-17T12:59:00+05:30'))).toBe(false)
    expect(examOver('2026-11-17', at('2026-11-17T13:01:00+05:30'))).toBe(true)
    expect(examOver('2026-11-17', at('2026-11-16T23:00:00+05:30'))).toBe(false)
  })
  it('counts calendar days in IST', () => {
    expect(daysToExam('2026-11-17', at('2026-11-15T23:30:00+05:30'))).toBe(2)
    expect(daysToExam('2026-11-17', at('2026-11-16T00:30:00+05:30'))).toBe(1)
    expect(examCountdown('2026-11-17', at('2026-11-17T08:00:00+05:30'))).toBe('today, 10 AM')
    expect(examCountdown('2026-11-17', at('2026-11-17T14:00:00+05:30'))).toBe('exam over')
  })
  it('lists the subjects in exam order', () => {
    expect(subjects.map((s) => s.id)).toEqual(['cn', 'os', 'se', 'fds', 'bda', 'pdt'])
    expect(subjects.every((s) => /^2026-1[12]-\d\d$/.test(s.exam))).toBe(true)
  })
})
