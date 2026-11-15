// Exam dates come from the CBIT V Semester (Main) R22A time-table, November 2026, CSE column.
// Every paper runs 10:00 AM to 1:00 PM IST; a subject counts as over once its paper has ended.
const END = 'T13:00:00+05:30'
const DAY = 24 * 60 * 60 * 1000
const IST = 5.5 * 60 * 60 * 1000

export const examEnd = (date) => new Date(`${date}${END}`)
export const examOver = (date, now = new Date()) => !!date && now.getTime() > examEnd(date).getTime()

// Whole calendar days (in IST) from today to the exam: 0 = today, 1 = tomorrow.
export function daysToExam(date, now = new Date()) {
  const today = Math.floor((now.getTime() + IST) / DAY)
  const exam = Math.floor((new Date(`${date}T00:00:00+05:30`).getTime() + IST) / DAY)
  return exam - today
}

// "Tue, 17 Nov"
export function examDay(date) {
  return new Date(`${date}T10:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })
}

// "in 2 days", "tomorrow", "today, 10 AM", "exam over"
export function examCountdown(date, now = new Date()) {
  if (examOver(date, now)) return 'exam over'
  const d = daysToExam(date, now)
  if (d <= 0) return 'today, 10 AM'
  if (d === 1) return 'tomorrow'
  return `in ${d} days`
}
