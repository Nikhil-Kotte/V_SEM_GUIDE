// Pure logic behind the CN tools — tested in cn.test.js.

const toInt = (ip) => ip.reduce((n, o) => ((n << 8) | o) >>> 0, 0)
const toIp = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.')
const bin = (n) => [24, 16, 8, 0].map((s) => ((n >>> s) & 255).toString(2).padStart(8, '0')).join('.')

export function parseCidr(text) {
  const m = String(text).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*\/\s*(\d{1,2})$/)
  if (!m) return { error: 'Write it like 205.16.37.39/28' }
  const octets = m.slice(1, 5).map(Number)
  const n = Number(m[5])
  if (octets.some((o) => o > 255)) return { error: 'Each part of the address must be 0–255.' }
  if (n > 32) return { error: 'The prefix length must be 0–32.' }
  return { ip: toInt(octets), n }
}

export function cidr(ip, n) {
  const mask = n === 0 ? 0 : (0xffffffff << (32 - n)) >>> 0
  const first = (ip & mask) >>> 0
  const last = (first | (~mask >>> 0)) >>> 0
  const count = 2 ** (32 - n)
  const firstByte = ip >>> 24
  const cls = firstByte < 128 ? 'A' : firstByte < 192 ? 'B' : firstByte < 224 ? 'C' : firstByte < 240 ? 'D (multicast)' : 'E (reserved)'
  // /31 (point-to-point, RFC 3021) and /32 (single host) have no separate network/broadcast addresses.
  const usable = n >= 31 ? count : Math.max(0, count - 2)
  return {
    address: toIp(ip), mask: toIp(mask), first: toIp(first), last: toIp(last), count, usable,
    hostRange: n >= 31 ? `${toIp(first)} – ${toIp(last)}` : `${toIp(first + 1)} – ${toIp(last - 1)}`,
    cls, binary: bin(ip), maskBinary: bin(mask), firstBinary: bin(first), lastBinary: bin(last),
    special: n === 32 ? 'A /32 is a single host address.' : n === 31 ? 'A /31 is a point-to-point link: both addresses are usable hosts.' : null,
  }
}

// TCP congestion window per transmission round.
// timeouts: round numbers (1-based) at which a timeout is detected.
// reset: window after a timeout ('initial' = back to the starting window, 'one' = 1 MSS).
// mode 'reno' treats the loss as 3 duplicate ACKs: cwnd = new ssthresh (fast recovery).
export function cwndTrace({ initial = 1, ssthresh = 8, rounds = 15, timeouts = [], reset = 'initial', mode = 'tahoe' }) {
  let cwnd = initial
  let thresh = ssthresh
  const out = []
  for (let r = 1; r <= rounds; r++) {
    const phase = cwnd < thresh ? 'slow start' : 'congestion avoidance'
    out.push({ round: r, cwnd, ssthresh: thresh, phase, loss: timeouts.includes(r) })
    if (timeouts.includes(r)) {
      thresh = Math.max(2, Math.floor(cwnd / 2))
      cwnd = mode === 'reno' ? thresh : reset === 'one' ? 1 : initial
    } else if (cwnd < thresh) {
      cwnd = Math.min(cwnd * 2, thresh)
    } else {
      cwnd += 1
    }
  }
  return out
}
