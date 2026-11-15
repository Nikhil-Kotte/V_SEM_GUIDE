import { useDrawOn } from './useDrawOn.js'

// Hand-drawn pen strokes. All are decorative (aria-hidden) and draw themselves on first view.
// `delay` (ms) staggers a stroke after its neighbours; `draw={false}` shows it at once.

function Svg({ viewBox, className = '', draw = true, delay, dur, stretch, children, style }) {
  const ref = useDrawOn(draw)
  const vars = { ...(delay ? { '--ink-delay': `${delay}ms` } : null), ...(dur ? { '--ink-dur': `${dur}ms` } : null), ...style }
  return (
    <svg ref={ref} className={`ink ${className}`} viewBox={viewBox} preserveAspectRatio={stretch ? 'none' : undefined}
      aria-hidden="true" focusable="false" style={vars}>
      {children}
    </svg>
  )
}

// A quick double underline, the kind you draw under a heading.
export function Underline({ className = '', double, ...rest }) {
  return (
    <Svg viewBox="0 0 200 12" stretch className={`ink-underline ${className}`} {...rest}>
      <path pathLength={1} d="M3 6.5c28-3.4 58-4.2 92-3.1 34 1.1 66 .2 102-1.6" />
      {double && <path pathLength={1} data-late d="M22 10.4c40-2 96-2.6 150-1.2" />}
    </Svg>
  )
}

// The examiner's circle (also used by Tally).
export function Circle({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 56 40" className={className} {...rest}>
      <path pathLength={1} d="M30 4.5c13.5.4 22.6 6.4 21.7 15.2-.9 9.3-12.7 15.9-26.4 15.6C11.6 35 3 28.6 4.1 19.7 5.2 10.9 16.7 4.6 31.6 5.6" />
    </Svg>
  )
}

// A loose oval for circling a word or a number of any width.
export function Loop({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 120 44" stretch className={className} {...rest}>
      <path pathLength={1} d="M66 3.6c30 .5 50 7.6 49.2 18.6-.9 11.4-27.6 18.8-58.4 18.4C26.6 40.2 3.4 33.2 4.6 21.4 5.8 10.2 30.6 3.2 70 5" />
    </Svg>
  )
}

// A curved arrow. Rotate or flip it with CSS to point where you need.
export function Arrow({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 60 40" className={`ink-arrow ${className}`} {...rest}>
      <path pathLength={1} d="M4 8c10 16 26 24 48 22" />
      <path pathLength={1} data-late d="M42 22.5l10.5 7.6-9.4 7.4" />
    </Svg>
  )
}

// Straight arrow for flows (boxes joined left to right).
export function FlowArrow({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 30 16" className={className} {...rest}>
      <path pathLength={1} d="M2 8.6c7-.9 15-1.1 24-.4" />
      <path pathLength={1} data-late d="M20 3.2l6.6 5-6.2 5" />
    </Svg>
  )
}

export function Tick({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" className={`ink-tick ${className}`} {...rest}>
      <path pathLength={1} d="M4 13.5c2.4 2 4 3.9 5.4 6.2C12 13.4 15.800 8.200 21 4" />
    </Svg>
  )
}

export function Strike({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 200 10" stretch className={className} {...rest}>
      <path pathLength={1} d="M2 6c40-3 110-3.600 196-1" />
    </Svg>
  )
}

// Square bracket in the margin, grouping a few lines.
export function Bracket({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 12 100" stretch className={className} {...rest}>
      <path pathLength={1} d="M10 2C5 2.600 3.400 3 3 6c-.6 30 .2 60-.2 88 .2 3 2.200 3.800 7.200 4" />
    </Svg>
  )
}

// One pass of a highlighter behind a word or a line. Put it inside a positioned parent.
export function HighlightStroke({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 200 30" stretch className={`ink-hl ${className}`} dur={520} {...rest}>
      <path pathLength={1} d="M2 16c50-1.600 130-2 196-.6" />
    </Svg>
  )
}

// A wavy scribble, for filling a corner or crossing something out.
export function Scribble({ className = '', ...rest }) {
  return (
    <Svg viewBox="0 0 120 30" className={className} {...rest}>
      <path pathLength={1} d="M3 20C10 4 16 4 20 16s9 12 14-2 10-14 14 0 9 14 14 0 9-13 14 1 10 13 14-1 9-12 14 2" />
    </Svg>
  )
}
