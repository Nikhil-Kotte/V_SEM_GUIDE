import { Circle } from './ink/Ink.jsx'

// The examiner's red-pen circle around a repeat count. It carries the most useful fact on a PYQ:
// how many different papers asked it. The circle draws itself the first time it is seen.
export default function Tally({ count, size = 'md', label, delay }) {
  const text = label ?? `Asked in ${count} paper${count === 1 ? '' : 's'}`
  return (
    <span className={`tally tally--${size}${count >= 3 ? ' tally--hot' : ''}`} role="img" aria-label={text} title={text}>
      <Circle delay={delay} dur={520} />
      <span className="tally__n">{count}<span className="tally__x">×</span></span>
    </span>
  )
}
