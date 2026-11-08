// Two fixed lines, each inside a mask, so the reveal never depends on where the text wraps.
// avoid-ai-design-ignore-file: SD5
// Why: the highlighter on "made simple" is the signature moment approved in DESIGN.md, not a reflex accent.
// Kept separate from HeroTitle so the static heading never pulls GSAP into the first download.
export default function HeroHeading({ innerRef, pending }) {
  return (
    <h1 className={`hero-title${pending ? ' is-pending' : ''}`} ref={innerRef} aria-label="Mid-2, made simple.">
      <span className="hero-mask" aria-hidden="true"><span className="hero-line">Mid-2,</span></span>
      <span className="hero-mask" aria-hidden="true">
        <span className="hero-line"><span className="hl-wrap"><span className="hl-bar" />made simple.</span></span>
      </span>
    </h1>
  )
}
