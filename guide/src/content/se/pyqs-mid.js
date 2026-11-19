import { Q } from '../pyq-helpers.js'

// Questions from the two SE class tests (mid-terms) of this semester, PYQs/SE MIDS.pdf:
// Class Test I (2 Sep 2026) and Class Test II (5 Nov 2026), in their original wording.
// Class-test questions that were near-identical to an older paper's question are not repeated here:
// the class test is added to that question's papers instead (see pyqs.js: se-mccall, se-basis-path).
export default [
  // ---- Class Test I ----
  Q('se-mid-sdlc', 'se.u1.process', 'Define the Software Development Life Cycle and list out all the phases of SDLC.', ['se-ct1:2']),
  Q('se-mid-backlog-sprint', 'se.u2.scrum', 'Mention the importance of backlogs and sprints in the agile process model.', ['se-ct1:2']),
  Q('se-mid-effort-define', 'se.u3.effort', 'Define effort estimation.', ['se-ct1:2']),
  Q('se-mid-campedu', 'se.u1.spiral', "Assume that a software project named 'CampEdu' has unclear requirements and involves a few technical risks. How would the Prototyping Model and the Spiral Model address the requirements and risks?", ['se-ct1:3']),
  Q('se-mid-waterfall-exam', 'se.u1.waterfall', 'Our college plans to develop an Online Examination Management System where requirements are clearly defined. How would you apply the Waterfall Model to this project? Explain all the phases.', ['se-ct1:4']),
  Q('se-mid-generic-three', 'se.u1.generic-model', 'Explain any three major framework activities of the Generic Process Model that are involved in the process.', ['se-ct1:3']),
  Q('se-mid-specialized-choice', 'se.u1.specialized', 'A company needs to develop a business application within a short time, with active user involvement and frequently changing requirements. Identify the most suitable specialized process model for this project and justify your choice.', ['se-ct1:4']),
  Q('se-mid-agile-choice', 'se.u2.scrum', 'A development team needs to deliver software in short iterations with continuous customer feedback. Identify a suitable Agile process model and justify your choice.', ['se-ct1:3']),
  Q('se-mid-feedback-re', 'se.u2.req-engineering', 'A university wants to develop an Online Student Feedback System. Apply the requirements engineering process to identify how requirements would be elicited, negotiated and validated.', ['se-ct1:4']),
  Q('se-mid-size-effort', 'se.u3.effort', 'Explain how size estimation of a software project helps in estimating the effort required for its development.', ['se-ct1:3']),
  Q('se-num-600ph', 'se.u3.effort', 'A software project is estimated to require 600 person-hours of effort. If three developers work on the project, 8 hours/day, calculate the approximate development time and state one limitation of this estimation.', ['se-ct1:4'], { numerical: true }),
  // ---- Class Test II ----
  Q('se-mid-decomposition-list', 'se.u3.decomposition', 'List the decomposition techniques used in software estimation.', ['se-ct2:2']),
  Q('se-mid-incremental-code', 'se.u4.incremental-code', 'Explain how incremental code development helps in software development.', ['se-ct2:2']),
  Q('se-mid-rollback', 'se.u5.deployment', 'What is Deployment Rollback?', ['se-ct2:2']),
  Q('se-num-fp-ct2', 'se.u3.fp', 'Student Management System: EI 10 (average), EO 6 (high), EQ 5 (average), ILF 4 (high), EIF 3 (low); total degree of influence DI = 35. Using Function Point Analysis, calculate (1) the Unadjusted Function Points (UFP), (2) the Value Adjustment Factor (VAF), (3) the adjusted Function Points (FP).', ['se-ct2:4'], { numerical: true }),
  Q('se-mid-design-concepts', 'se.u4.coupling-cohesion', '"Software design provides the blueprint of the system." Explain the design concepts used to build scalable software systems.', ['se-ct2:3']),
  Q('se-mid-risk-importance', 'se.u3.risk', 'Explain the importance of risk management and its activities for successful software project development.', ['se-ct2:4']),
  Q('se-mid-coupling-cohesion', 'se.u4.coupling-cohesion', 'Outline the role of coupling and cohesion in designing maintainable software systems.', ['se-ct2:3']),
  Q('se-mid-dfd-library', 'se.u4.dfd', 'Construct a complete DFD (context level and level-1) for a Library Management System and explain how it represents function-oriented modelling.', ['se-ct2:4']),
  Q('se-mid-architecture', 'se.u4.architecture', 'Model the concept of software architecture using a suitable real-life example.', ['se-ct2:4']),
]
