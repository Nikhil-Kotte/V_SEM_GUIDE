import pyqs from './pyqs.js'
import topics from './topics.js'
import simple from './simple.js'
import u3 from './answers-u3.js'
import u4 from './answers-u4.js'
import u5 from './answers-u5.js'
import { withSimple } from '../with-simple.js'

export default { pyqs, topics: withSimple(topics, simple), answers: { ...u3, ...u4, ...u5 } }
