// The examiner's red-pen circle around a repeat count: the one decorative mark on the site.
// It carries the most useful fact on a PYQ: how many different papers asked it.
export default function Tally({ count, size = 'md', label }) {
  const text = label ?? `Asked in ${count} paper${count === 1 ? '' : 's'}`
  return (
    <span className={`tally tally--${size}${count >= 3 ? ' tally--hot' : ''}`} role="img" aria-label={text} title={text}>
      <svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
        <path d="M30 4.5c13.5.4 22.6 6.4 21.7 15.2-.9 9.3-12.7 15.9-26.4 15.6C11.6 35 3 28.6 4.1 19.7 5.2 10.9 16.7 4.6 31.6 5.6" />
      </svg>
      <span className="tally__n">{count}<span className="tally__x">×</span></span>
    </span>
  )
}
