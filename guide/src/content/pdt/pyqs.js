import { Q, Predict } from '../pyq-helpers.js'

export default [
  // ---------------- Unit III (rest) ----------------
  Q('pdt-problem-statement', 'pdt.u3.problem-statement', 'What is a problem statement? What makes an ideal problem definition, and how does a good problem statement guide ideation?', ['pdt-dec25:5', 'pdt-may26:5']),
  Q('pdt-pov', 'pdt.u3.problem-statement', 'Write a Point-of-View (POV) problem statement for "an elderly person living alone".', ['pdt-dec25:5']),
  Q('pdt-personas', 'pdt.u3.persona-steps', 'What is the role of a user persona? Explain the types of personas and the steps to create one.', ['pdt-dec25:5', 'pdt-may26:2']),
  Q('pdt-empathy-map', 'pdt.u3.empathy-map', 'Explain empathy mapping with an example.', ['pdt-may26:5']),
  Predict('pdt-pred-affinity', 'pdt.u3.affinity', 'What is an affinity diagram? Explain how to build one with an example.'),

  // ---------------- Unit IV ----------------
  Q('pdt-six-hats', 'pdt.u4.six-hats', 'Explain the Six Thinking Hats with examples. Apply them to "improving campus security".', ['pdt-may26:10', 'pdt-dec25:5']),
  Q('pdt-brainstorming', 'pdt.u4.brainstorming', 'Explain brainstorming and the rules for an effective brainstorming session.', ['pdt-dec25:5', 'pdt-may26:5']),
  Q('pdt-mind-maps', 'pdt.u4.mind-maps', 'Explain the importance of mind maps. Compare mind maps and doodling.', ['pdt-may26:5', 'pdt-dec25:5']),
  Q('pdt-methods', 'pdt.u4.methods', 'Name ideation methods/tools other than brainstorming.', ['pdt-dec25:2', 'pdt-may26:2']),
  Q('pdt-games', 'pdt.u4.games', 'Explain any two ideation games.', ['pdt-dec25:5']),
  Predict('pdt-pred-ideation', 'pdt.u4.ideation', 'What is ideation? Explain its need and uses in design thinking.'),
  Predict('pdt-pred-doodling', 'pdt.u4.doodling', 'How does doodling help express creative ideas?'),

  // ---------------- Unit V ----------------
  Q('pdt-testing-need', 'pdt.u5.test-need', 'Why is the testing phase necessary in design thinking?', ['pdt-dec25:5', 'pdt-may26:5']),
  Q('pdt-value-prop', 'pdt.u5.value-prop', 'Give the guidelines for writing a value proposition. How do advertisements communicate a value proposition?', ['pdt-dec25:5', 'pdt-may26:10']),
  Q('pdt-iterate', 'pdt.u5.iterate', 'Why is iteration important? Explain the significance of the last phase with a real-world example.', ['pdt-may26:5']),
  Q('pdt-dfv', 'pdt.u5.dfv', 'Explain desirable, feasible and viable solutions.', ['pdt-dec25:5']),
  Q('pdt-wallet', 'pdt.u5.user-test', 'Users found your wallet prototype too bulky. How would you use their feedback to make it more desirable?', ['pdt-dec25:5']),
  Q('pdt-proto-importance', 'pdt.u5.prototype-importance', 'Give two reasons why prototyping is important in design thinking.', ['pdt-dec25:2']),
  Predict('pdt-pred-proto-types', 'pdt.u5.prototype-types', 'Explain the types of prototyping (low fidelity vs high fidelity, etc.).'),
  Predict('pdt-pred-storytelling', 'pdt.u5.storytelling', 'What makes a good story? How does storytelling help reach users?'),
  Predict('pdt-pred-user-test', 'pdt.u5.user-test', 'How do you conduct a user test? Explain the steps.'),
  Predict('pdt-pred-proto-guidelines', 'pdt.u5.prototype-guidelines', 'State the guidelines for prototyping.'),
]
