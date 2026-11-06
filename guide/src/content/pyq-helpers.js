// Q(id, syllabusId, question, asks, opts)
//   asks: ['paperId' or 'paperId:marks', ...] — one entry per paper that asked this
//         (or a near-identical) question. The repeat count is derived from these, never typed in.
//   opts.kind: 'pyq' (default) | 'related-course' | 'predicted'
//   opts.numerical: true for problems with data
export const Q = (id, syllabusId, q, asks = [], opts = {}) => ({
  id,
  syllabusId,
  q,
  asks: asks.map((a) => {
    const [paperId, marks] = a.split(':')
    return { paperId, marks: marks ? Number(marks) : undefined }
  }),
  kind: opts.kind || 'pyq',
  numerical: !!opts.numerical,
  note: opts.note,
})

// A predicted question has no past papers — it is syllabus-derived.
export const Predict = (id, syllabusId, q, opts = {}) => Q(id, syllabusId, q, [], { ...opts, kind: 'predicted' })

// A question from a model question list handed out for the exam (not a past paper): no repeat count.
export const Model = (id, syllabusId, q, opts = {}) => Q(id, syllabusId, q, [], { ...opts, kind: 'model' })
