// Attach ChatGPT's simpler explanation (from <subject>/simple.js) to each topic as `simple`.
export const withSimple = (topics, simple = {}) =>
  Object.fromEntries(Object.entries(topics).map(([id, t]) => [id, simple[id] ? { ...t, simple: simple[id] } : t]))
