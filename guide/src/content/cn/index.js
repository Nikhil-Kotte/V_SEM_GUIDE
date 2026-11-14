import pyqs from './pyqs.js'
import pyqsU12 from './pyqs-u12.js'
import topics from './topics.js'
import topicsU1 from './topics-u1.js'
import topicsU2 from './topics-u2.js'
import simple from './simple.js'
import videos from './videos.js'
import u12 from './answers-u12.js'
import u3 from './answers-u3.js'
import u4 from './answers-u4.js'
import u5 from './answers-u5.js'
import { withSimple } from '../with-simple.js'

export default { pyqs: [...pyqsU12, ...pyqs], topics: withSimple({ ...topicsU1, ...topicsU2, ...topics }, simple, videos), videos, answers: { ...u12, ...u3, ...u4, ...u5 } }
