import { Q } from '../pyq-helpers.js'

// Units I and II: every question from the Dec '25 (22MEO01) and May '26 (22MEC36) papers that falls
// in the introduction or empathize units, one entry per distinct question, with marks.
export default [
  // ======================= UNIT I =======================
  Q('pdt-lateral', 'pdt.u1.thinking-types', "What is 'lateral thinking'?", ['pdt-dec25:2']),
  Q('pdt-dt-applications', 'pdt.u1.applications', 'Give two examples of applications of design thinking in engineered products or services.', ['pdt-may26:2']),
  Q('pdt-eng-social', 'pdt.u1.impact', 'Explain the impact of engineering on social development.', ['pdt-dec25:5']),
  Q('pdt-five-vs-linear', 'pdt.u1.five-stage', 'Differentiate between the five-stage design thinking model and a linear problem-solving approach.', ['pdt-dec25:5']),
  Q('pdt-thinking-types', 'pdt.u1.thinking-types', 'List the different types of thinking and give a brief description of each.', ['pdt-dec25:5']),
  Q('pdt-iterative', 'pdt.u1.five-stage', 'Explain, with an example, why design thinking is considered an iterative process.', ['pdt-ct1:3', 'pdt-dec25:5']),
  Q('pdt-dt-engineering', 'pdt.u1.impact', 'Are design thinking and engineering activity interconnected or independent? Is it better to start with one and proceed to the other? If yes, which comes first and why? Justify with examples.', ['pdt-may26:10']),
  Q('pdt-linear-lateral', 'pdt.u1.thinking-types', 'Write brief notes about linear and lateral thinking with one example each.', ['pdt-ct1:3', 'pdt-may26:5']),
  Q('pdt-five-stages', 'pdt.u1.phases', 'Represent the five stages of the design thinking method and briefly mention the role of each stage.', ['pdt-may26:5']),

  // ======================= UNIT II =======================
  Q('pdt-define-empathy', 'pdt.u2.empathize', "Define 'empathy' in the context of design thinking.", ['pdt-dec25:2']),
  Q('pdt-empathy-sympathy', 'pdt.u2.empathize', 'Differentiate between empathy and sympathy.', ['pdt-ct1:2', 'pdt-may26:2']),
  Q('pdt-empathize-outputs', 'pdt.u2.empathize', 'What are the key outputs of the Empathize phase?', ['pdt-dec25:5']),
  Q('pdt-street-vendors', 'pdt.u2.steps', 'You are to understand the challenges faced by street vendors. Discuss how you would address the problem faced by street vendors using design thinking.', ['pdt-ct1:4', 'pdt-dec25:5']),
  Q('pdt-empathy-steps', 'pdt.u2.developing-empathy', 'Describe the steps one should follow to develop empathy towards people.', ['pdt-dec25:5']),
  Q('pdt-bodystorming', 'pdt.u2.bodystorming', "Explain the concept of 'Body Storming' with an example.", ['pdt-ct1:3', 'pdt-dec25:5']),
  Q('pdt-empathy-importance', 'pdt.u2.developing-empathy', 'Explain the importance of empathy for design thinking with suitable examples, focusing on how immersive or experiential learning can help empathisation.', ['pdt-may26:10']),
  Q('pdt-empathy-sufficient', 'pdt.u2.empathize', 'Do you agree that empathisation is both necessary and sufficient to understand user needs? Justify your answer.', ['pdt-may26:5']),
  Q('pdt-beginners-mind', 'pdt.u2.beginners-mind', "What is a beginner's mindset? Why is it important for user empathisation?", ['pdt-may26:5']),
]
