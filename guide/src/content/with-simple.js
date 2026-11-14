// Attach each topic's simple-words explanation (<subject>/simple.js) as `simple` and its
// YouTube videos (<subject>/videos.js) as `videos`.
export const withSimple = (topics, simple = {}, videos = {}) =>
  Object.fromEntries(Object.entries(topics).map(([id, t]) => {
    const extra = {}
    if (simple[id]) extra.simple = simple[id]
    if (videos[id]?.length) extra.videos = videos[id]
    return [id, Object.keys(extra).length ? { ...t, ...extra } : t]
  }))
