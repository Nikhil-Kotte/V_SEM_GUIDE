// Things that sit on the desk: tape, rubber stamps, sticky notes, paper clips, staples.
// All decorative; styles live in styles/paper.css.

export function Tape({ side, className = '' }) {
  return <span className={`tape${side ? ` tape--${side}` : ''} ${className}`} aria-hidden="true" />
}

// A rubber stamp. `thump` plays the stamping animation when it appears.
// Stamps repeat text that is already on the page, so they are hidden from screen readers by default.
export function Stamp({ children, tone, size, thump, className = '', label }) {
  return (
    <span className={`stamp${tone ? ` stamp--${tone}` : ''}${size ? ` stamp--${size}` : ''}${thump ? ' is-thump' : ''} ${className}`}
      aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined}>
      {children}
    </span>
  )
}

export function StickyNote({ as = 'div', color, tilt, className = '', style, children, ...rest }) {
  const Tag = as
  return (
    <Tag className={`sticky${color ? ` sticky--${color}` : ''} ${className}`} style={{ ...(tilt != null ? { '--tilt': `${tilt}deg` } : null), ...style }} {...rest}>
      {children}
    </Tag>
  )
}

export function PaperClip({ className = '' }) {
  return (
    <svg className={`paperclip ${className}`} viewBox="0 0 22 52" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 14v24a5 5 0 0 0 10 0V10a7 7 0 0 0-14 0v30a9 9 0 0 0 18 0V16" />
    </svg>
  )
}

export function Staple({ style, className = '' }) {
  return <span className={`staple ${className}`} style={style} aria-hidden="true" />
}

// Mounted once by Layout: the displacement filter that makes borders and stamps look hand-made.
export function InkDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough-strong" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}
