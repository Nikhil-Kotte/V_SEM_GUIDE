// Computer Networks: one set of detailed notes per topic (notes-u1 … notes-u5), the past questions,
// model answers and videos.
import pyqs from './pyqs.js'
import pyqsU12 from './pyqs-u12.js'
import notesU1 from './notes-u1.js'
import notesU2 from './notes-u2.js'
import notesU3 from './notes-u3.js'
import notesU4 from './notes-u4.js'
import notesU5 from './notes-u5.js'
import videos from './videos.js'
import u12 from './answers-u12.js'
import u3 from './answers-u3.js'
import u4 from './answers-u4.js'
import u5 from './answers-u5.js'
import { withSimple } from '../with-simple.js'

const notes = { ...notesU1, ...notesU2, ...notesU3, ...notesU4, ...notesU5 }

export default { pyqs: [...pyqsU12, ...pyqs], topics: withSimple(notes, {}, videos), videos, answers: { ...u12, ...u3, ...u4, ...u5 } }
