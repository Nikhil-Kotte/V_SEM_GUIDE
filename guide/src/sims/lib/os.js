// Pure logic behind the OS simulators — tested in os.test.js.

export const parseNums = (s) => String(s).split(/[\s,]+/).filter(Boolean).map(Number)

// ---------- Page replacement ----------
// Returns one step per reference: frame contents after the reference, hit/fault and which slot changed.
export function pageReplacement(refs, frameCount, algo) {
  const frames = Array(frameCount).fill(null)
  const loadedAt = Array(frameCount).fill(-1) // FIFO order
  const lastUsed = Array(frameCount).fill(-1) // LRU
  const steps = []
  let faults = 0
  refs.forEach((page, t) => {
    let slot = frames.indexOf(page)
    const hit = slot !== -1
    if (hit) {
      lastUsed[slot] = t
    } else {
      faults++
      slot = frames.indexOf(null)
      if (slot === -1) slot = pickVictim(algo, frames, loadedAt, lastUsed, refs, t)
      frames[slot] = page
      loadedAt[slot] = t
      lastUsed[slot] = t
    }
    steps.push({ page, frames: [...frames], hit, slot })
  })
  return { steps, faults, hits: refs.length - faults }
}

function pickVictim(algo, frames, loadedAt, lastUsed, refs, t) {
  const idx = frames.map((_, i) => i)
  if (algo === 'FIFO') return idx.reduce((a, b) => (loadedAt[b] < loadedAt[a] ? b : a))
  if (algo === 'LRU') return idx.reduce((a, b) => (lastUsed[b] < lastUsed[a] ? b : a))
  // OPT: the page whose next use is farthest away (never used again = Infinity).
  // Ties (several never used again) go to the one loaded earliest, i.e. FIFO among them.
  const next = frames.map((p) => {
    const n = refs.indexOf(p, t + 1)
    return n === -1 ? Infinity : n
  })
  return idx.reduce((a, b) => (next[b] > next[a] || (next[b] === next[a] && loadedAt[b] < loadedAt[a]) ? b : a))
}

// ---------- Disk scheduling ----------
// opts: { min, max, direction: 'up' | 'down', countJump: true }
// Returns the head path (including end-of-disk stops and jumps) and the total movement.
export function diskSchedule(algo, head, queue, opts = {}) {
  const { min = 0, max = 199, direction = 'up', countJump = true } = opts
  const up = queue.filter((c) => c >= head).sort((a, b) => a - b)
  const down = queue.filter((c) => c < head).sort((a, b) => b - a)
  let path = [head]
  const jumps = [] // indexes in path where the move is a wrap-around jump

  if (algo === 'FCFS') path = [head, ...queue]
  else if (algo === 'SSTF') {
    const left = [...queue]
    let pos = head
    while (left.length) {
      let best = 0
      left.forEach((c, i) => {
        const d = Math.abs(c - pos), bd = Math.abs(left[best] - pos)
        if (d < bd || (d === bd && c < left[best])) best = i
      })
      pos = left.splice(best, 1)[0]
      path.push(pos)
    }
  } else {
    const [first, second] = direction === 'up' ? [up, down] : [down, up]
    const end = direction === 'up' ? max : min
    const otherEnd = direction === 'up' ? min : max
    const secondAsc = [...second].reverse() // same direction as first, for circular algorithms
    path.push(...first)
    if (algo === 'SCAN') {
      if (second.length) path.push(end)
      path.push(...second)
    } else if (algo === 'LOOK') {
      path.push(...second)
    } else if (algo === 'C-SCAN') {
      if (second.length) {
        path.push(end, otherEnd)
        jumps.push(path.length - 1)
        path.push(...secondAsc)
      }
    } else if (algo === 'C-LOOK') {
      if (second.length) {
        path.push(secondAsc[0])
        jumps.push(path.length - 1)
        path.push(...secondAsc.slice(1))
      }
    } else throw new Error('Unknown algorithm ' + algo)
  }
  // drop consecutive duplicates (e.g. a request exactly at the end of the disk)
  path = path.filter((c, i) => i === 0 || c !== path[i - 1])
  const moves = path.slice(1).map((c, i) => ({ from: path[i], to: c, dist: Math.abs(c - path[i]), jump: jumps.includes(i + 1) && path[i] !== c }))
  const total = moves.reduce((s, m) => s + (m.jump && !countJump ? 0 : m.dist), 0)
  return { path, moves, total }
}

// ---------- Banker's algorithm ----------
const leq = (a, b) => a.every((x, i) => x <= b[i])
const add = (a, b) => a.map((x, i) => x + b[i])
const sub = (a, b) => a.map((x, i) => x - b[i])

export function validateBankers(available, max, alloc) {
  const m = available.length
  if (!m) return 'Enter the Available vector.'
  if (max.length !== alloc.length) return 'Max and Allocation must have the same number of processes (rows).'
  for (let i = 0; i < max.length; i++) {
    if (max[i].length !== m || alloc[i].length !== m) return `Row P${i} must have ${m} numbers, one per resource type.`
    if (max[i].some((x, j) => alloc[i][j] > x)) return `P${i} holds more than its Max (Need would be negative).`
  }
  if ([available, ...max, ...alloc].flat().some((x) => !Number.isFinite(x) || x < 0)) return 'Use non-negative whole numbers only.'
  return null
}

// Scans P0..Pn-1 from the top each round and picks the first process that can finish.
export function bankersSafety(available, max, alloc) {
  const need = max.map((row, i) => sub(row, alloc[i]))
  const finish = Array(max.length).fill(false)
  let work = [...available]
  const steps = []
  for (;;) {
    const i = finish.findIndex((f, k) => !f && leq(need[k], work))
    if (i === -1) break
    const before = work
    work = add(work, alloc[i])
    finish[i] = true
    steps.push({ pid: i, need: need[i], before, after: work })
  }
  return { need, safe: finish.every(Boolean), sequence: steps.map((s) => s.pid), steps, stuck: finish.map((f, i) => (f ? null : i)).filter((x) => x !== null) }
}

// Replays a sequence to confirm it is genuinely safe (used by tests and to double-check output).
export function isSafeSequence(available, max, alloc, seq) {
  let work = [...available]
  for (const i of seq) {
    if (!leq(sub(max[i], alloc[i]), work)) return false
    work = add(work, alloc[i])
  }
  return seq.length === max.length && new Set(seq).size === seq.length
}

export function bankersRequest(available, max, alloc, pid, request) {
  const need = sub(max[pid], alloc[pid])
  if (!leq(request, need)) return { granted: false, reason: `Request exceeds P${pid}'s remaining Need (${need.join(' ')}). Error.` }
  if (!leq(request, available)) return { granted: false, reason: `Not enough resources available (${available.join(' ')}). P${pid} must wait.` }
  const newAvail = sub(available, request)
  const newAlloc = alloc.map((r, i) => (i === pid ? add(r, request) : r))
  const result = bankersSafety(newAvail, max, newAlloc)
  return result.safe
    ? { granted: true, reason: 'The new state is safe, so the request is granted.', result, newAvail }
    : { granted: false, reason: `Granting it would leave the system unsafe, so P${pid} must wait.`, result, newAvail }
}
