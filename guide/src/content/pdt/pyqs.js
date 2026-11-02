import { Q, Predict } from '../pyq-helpers.js'

// Every in-scope question from the Dec '25 (22MEO01) and May '26 (22MEC36) papers, one entry per distinct question.
// Empathise-phase and Unit I/II questions are Mid-1 and left out.
const MODEL = { note: 'From the department model paper (22MEC36)' }

export default [
  // ---------------- Unit III (rest): define phase ----------------
  Q('pdt-ps-what', 'pdt.u3.problem-statement', "What is meant by 'Problem Statement' in the define phase of design thinking?", ['pdt-dec25:2']),
  Q('pdt-problem-statement', 'pdt.u3.problem-statement', 'What is an ideal problem definition? How do you know that you have defined a problem properly?', ['pdt-may26:5']),
  Q('pdt-ps-guides', 'pdt.u3.problem-statement', 'Analyse how a well-defined problem statement guides the subsequent ideation phase.', ['pdt-dec25:5']),
  Q('pdt-why-how', 'pdt.u3.problem-statement', "What is the purpose of 'Why-How Laddering'?", ['pdt-dec25:5']),
  Q('pdt-pov', 'pdt.u3.problem-statement', 'For a persona of an "elderly person living alone", create a Point of View (POV) statement.', ['pdt-dec25:5']),
  Q('pdt-define-walk', 'pdt.u3.problem-statement', 'Consider a product or a service. Walk through the Define phase of design thinking for it, explain the steps to consider, and elaborate on suitable tools that help the process.', ['pdt-may26:10']),
  Q('pdt-persona-role', 'pdt.u3.persona-steps', 'What is the role of a user persona in the design thinking process?', ['pdt-may26:2']),
  Q('pdt-personas', 'pdt.u3.persona-steps', 'What are the different types of personas? Briefly explain them (and the steps to create one).', ['pdt-dec25:5']),
  Q('pdt-empathy-map', 'pdt.u3.empathy-map', 'Write a brief note on empathy mapping with a suitable example, explaining its various aspects.', ['pdt-may26:5']),
  Predict('pdt-pred-affinity', 'pdt.u3.affinity', 'What is an affinity diagram? Explain how to build one with an example.'),
  Predict('pdt-model-persona', 'pdt.u3.persona-steps', 'Give a simple example of a persona (e.g. a student using an online learning app) and explain how it can be applied in designing better solutions.', MODEL),
  Predict('pdt-model-lab', 'pdt.u3.problem-statement', 'Engineering students find it difficult to maintain laboratory equipment properly. Apply the Define phase to frame a problem statement.', MODEL),

  // ---------------- Unit IV: ideation ----------------
  Q('pdt-methods', 'pdt.u4.methods', 'Name ideation methods/tools other than brainstorming (mention at least four tools used in the ideation phase).', ['pdt-dec25:2', 'pdt-may26:2']),
  Q('pdt-brainstorming', 'pdt.u4.brainstorming', 'Explain the rules for conducting an effective brainstorming session. How can brainstorming be used for effective ideation?', ['pdt-dec25:5', 'pdt-may26:5']),
  Q('pdt-six-hats', 'pdt.u4.six-hats', 'Explain with suitable examples how the Six Thinking Hats method helps ideation. Apply it to structure a team\'s discussion on "how to improve campus security".', ['pdt-may26:10', 'pdt-dec25:5']),
  Q('pdt-games', 'pdt.u4.games', 'What are ideation games? Name any two.', ['pdt-dec25:5']),
  Q('pdt-mind-maps', 'pdt.u4.mind-maps', 'Explain the importance of mind maps used in design thinking.', ['pdt-may26:5']),
  Q('pdt-mind-doodle', 'pdt.u4.doodling', 'Compare the use of mind maps and doodling for generating ideas.', ['pdt-dec25:5']),
  Predict('pdt-pred-ideation', 'pdt.u4.ideation', 'What is ideation? Explain its need and uses in design thinking.'),
  Predict('pdt-pred-doodling', 'pdt.u4.doodling', 'How does doodling help express creative ideas?'),

  // ---------------- Unit V: prototyping & testing ----------------
  Q('pdt-proto-importance', 'pdt.u5.prototype-importance', 'List two reasons why prototyping is important.', ['pdt-dec25:2']),
  Q('pdt-value-prop', 'pdt.u5.value-prop', 'Develop guidelines for crafting a good value proposition.', ['pdt-dec25:5']),
  Q('pdt-value-ads', 'pdt.u5.value-prop', 'Consider an existing product or service. Explain how its value proposition is communicated through advertisements, and outline specific aspects of user feedback that may have helped improve it.', ['pdt-may26:10']),
  Q('pdt-wallet', 'pdt.u5.user-test', 'A prototype of a new wallet is found to be too bulky by users. Analyse the factors you would consider to make it more desirable.', ['pdt-dec25:5']),
  Q('pdt-testing-need', 'pdt.u5.test-need', 'What is the necessity / importance of the testing phase in design thinking?', ['pdt-dec25:5', 'pdt-may26:5']),
  Q('pdt-dfv', 'pdt.u5.dfv', "Explain the terms 'Desirable', 'Feasible' and 'Viable' in the context of testing a solution.", ['pdt-dec25:5']),
  Q('pdt-iterate', 'pdt.u5.iterate', 'What is the importance of iteration in the last phase of design thinking? Give a real-world example of a product/service and explain how iteration helped, or how the lack of iteration was a problem.', ['pdt-may26:5']),
  Predict('pdt-pred-proto-types', 'pdt.u5.prototype-types', 'Explain the types of prototypes and prototype fidelity (low, mid, high).'),
  Predict('pdt-pred-storytelling', 'pdt.u5.storytelling', 'What makes a good story? How does storytelling help reach users?'),
  Predict('pdt-pred-user-test', 'pdt.u5.user-test', 'How do you conduct a user test? Explain the user-testing methods.'),
  Predict('pdt-pred-proto-guidelines', 'pdt.u5.prototype-guidelines', 'State the guidelines for prototyping.'),
]
