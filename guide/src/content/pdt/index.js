import pyqs from './pyqs.js'
import topics from './topics.js'
import u3 from './answers-u3.js'
import u4 from './answers-u4.js'
import u5 from './answers-u5.js'

export default { pyqs, topics, answers: { ...u3, ...u4, ...u5 } }
