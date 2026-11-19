import { Q } from '../pyq-helpers.js'

// Questions from the two PDT class tests (mid-terms) of this semester, PYQs/PDT MIDS.pdf:
// Class Test I (5 Sep 2026) and Class Test II (7 Nov 2026), in their original wording.
// Only the questions not already listed are here. The rest carry the class test in their papers:
//   Class Test I  → pyqs-u12.js: pdt-empathy-sympathy, pdt-persona-role, pdt-linear-lateral, pdt-iterative,
//                   pdt-street-vendors, pdt-bodystorming
//   Class Test II → pyqs.js: every Class Test II question was on the Mid-2 model list (pdt-m01, m02, m03, m11,
//                   m13, m15, m16, m17, m18, m19, m20), which are now marked as asked in the class test.
export default [
  Q('pdt-mid-out-of-box', 'pdt.u1.thinking-types', 'What is meant by out of box thinking?', ['pdt-ct1:2']),
  Q('pdt-mid-five-stage-apply', 'pdt.u1.five-stage', 'Apply the five stages of Design Thinking to solve a simple real-world problem. Illustrate how each stage contributes to developing a practical solution.', ['pdt-ct1:4']),
  Q('pdt-mid-science-engineering', 'pdt.u1.impact', 'How are Science and Engineering connected in the development process of a country?', ['pdt-ct1:4']),
  Q('pdt-mid-immersion', 'pdt.u2.immersion', 'Elaborate the steps involved in an Immersion Activity related to Design Thinking.', ['pdt-ct1:4']),
  Q('pdt-mid-define', 'pdt.u3.define', "Explain the 'Define' phase in the Design Thinking process with an example.", ['pdt-ct1:3']),
]
