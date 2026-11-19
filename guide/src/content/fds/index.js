// Fundamentals of Data Science: one set of detailed notes per topic (notes-u1 … notes-u5), the
// questions (class-test questions first), model answers, videos and a per-unit 2-mark question bank.
import pyqs from './pyqs.js'
import pyqsU12 from './pyqs-u12.js'
import pyqsMid from './pyqs-mid.js'
import notesU1 from './notes-u1.js'
import notesU2 from './notes-u2.js'
import notesU3 from './notes-u3.js'
import notesU4 from './notes-u4.js'
import notesU5 from './notes-u5.js'
import videos from './videos.js'
import u3 from './answers-u3.js'
import u4 from './answers-u4.js'
import u5 from './answers-u5.js'
import mid from './answers-mid.js'
import bank2m from './bank-2m.js'
import { withSimple } from '../with-simple.js'

const notes = { ...notesU1, ...notesU2, ...notesU3, ...notesU4, ...notesU5 }

// A 2-mark bank answer doubles as the model answer of the question it came from, unless that one has a longer answer.
const bankAnswers = Object.fromEntries(bank2m.flatMap((u) => u.items.filter((i) => i.from)
  .map((i) => [i.from, { blocks: i.a, sources: ['FDS unit notes'] }])))

export default {
  pyqs: [...pyqsMid, ...pyqsU12, ...pyqs],
  topics: withSimple(notes, {}, videos),
  videos,
  answers: { ...bankAnswers, ...u3, ...u4, ...u5, ...mid },
  bank2m,
}
