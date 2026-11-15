import { useEffect, useRef } from 'react'

// The desk during exam week: a stack of answer booklets, a ballpoint, a highlighter and a ruler.
// Layers carry data-depth; the pointer and the scroll position slide them by a few pixels (parallax).
// Decorative: hidden from assistive tech, and static under reduced motion.
export default function HeroDesk({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const layers = [...svg.querySelectorAll('[data-depth]')]
    let frame = 0
    let tx = 0, ty = 0, x = 0, y = 0
    const paint = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      for (const el of layers) {
        const d = Number(el.dataset.depth)
        el.style.transform = `translate(${(x * d).toFixed(2)}px, ${(y * d).toFixed(2)}px)`
      }
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(paint) : 0
    }
    const kick = () => { if (!frame) frame = requestAnimationFrame(paint) }
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2 + window.scrollY / 300
      kick()
    }
    const onScroll = () => { ty = window.scrollY / 300; kick() }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <svg ref={ref} className={`art hero-desk ${className}`} viewBox="0 0 520 440" aria-hidden="true" focusable="false">
      {/* Coffee ring and pencil scribbles on the desk itself */}
      <g data-depth="3" className="soft">
        <circle cx="86" cy="356" r="42" strokeWidth="5" strokeDasharray="150 30 60 24" opacity=".35" />
        <path d="M400 54c14-18 26-18 32-2s14 18 24 0 20-20 26-2" />
      </g>

      {/* Bottom booklet */}
      <g data-depth="6">
        <g transform="rotate(-9 250 250)" filter="url(#rough)">
          <rect className="f-b3" x="96" y="92" width="300" height="296" rx="5" />
          <path d="M112 92v296" strokeDasharray="2 9" />
        </g>
      </g>

      {/* Middle booklet */}
      <g data-depth="10">
        <g transform="rotate(5 270 240)" filter="url(#rough)">
          <rect className="f-b2" x="120" y="70" width="300" height="300" rx="5" />
          <path d="M136 70v300" strokeDasharray="2 9" />
          <rect className="f-paper" x="176" y="104" width="200" height="60" rx="3" />
          <path className="soft" d="M190 124h130M190 144h90" />
        </g>
      </g>

      {/* Top booklet: the answer booklet cover */}
      <g data-depth="16">
        <g transform="rotate(-3 250 230)" filter="url(#rough)">
          <rect className="f-b1" x="96" y="58" width="304" height="320" rx="5" />
          <path d="M114 58v320" strokeDasharray="2 9" />
          <rect className="f-staple" x="104" y="120" width="20" height="5" rx="2" />
          <rect className="f-staple" x="104" y="306" width="20" height="5" rx="2" />
          <rect className="f-paper" x="150" y="92" width="216" height="118" rx="3" />
          <path className="soft" d="M166 122h184M166 148h184M166 174h184" />
          <path className="pen" d="M172 116c16-8 24 2 38-4s22 4 40-2" />
          <path className="pen" d="M172 142c22-6 34 4 60-2" />
          <rect className="hl" x="170" y="160" width="96" height="16" />
          <path className="pen" d="M174 170c20-5 44 3 86-2" />
          {/* marks box */}
          <rect className="f-paper" x="286" y="238" width="80" height="62" rx="3" />
          <path className="soft" d="M286 258h80" />
          <path className="hot" d="M304 290c4-14 10-22 18-24-2 10-4 18-2 26m18-26c-10 2-14 12-10 20s14 4 12-6-8-10-12-6" strokeWidth="3" />
          <ellipse className="hot" cx="326" cy="278" rx="34" ry="19" transform="rotate(-6 326 278)" />
          {/* grid of small boxes: roll number */}
          <path className="soft" d="M150 244h110v24H150zM172 244v24M194 244v24M216 244v24M238 244v24" />
          <path className="pen" d="M157 262l6-12 6 12M179 250c8-2 8 8 0 8 9 0 9 8 0 6M202 250v14M222 250h10l-8 14M244 250c-5 2-5 14 2 14s6-9 0-9" />
          <path className="soft" d="M150 300h110M150 322h76" />
        </g>
      </g>

      {/* Ruler */}
      <g data-depth="20">
        <g transform="rotate(38 420 300)">
          <rect className="f-ruler" x="330" y="284" width="210" height="30" rx="3" />
          <path d="M344 284v12M358 284v7M372 284v12M386 284v7M400 284v12M414 284v7M428 284v12M442 284v7M456 284v12M470 284v7M484 284v12M498 284v7M512 284v12M526 284v7" strokeWidth="1.500" />
        </g>
      </g>

      {/* Highlighter */}
      <g data-depth="26">
        <g transform="rotate(-28 110 150)">
          <rect className="f-hl-body" x="20" y="134" width="118" height="30" rx="8" />
          <rect className="f-hl-cap" x="20" y="134" width="46" height="30" rx="8" />
          <path d="M138 140h14l10 9-10 9h-14" className="f-hl-tip" />
          <path className="soft" d="M78 142h44" />
        </g>
      </g>

      {/* Ballpoint */}
      <g data-depth="34">
        <g transform="rotate(-52 400 190)">
          <rect className="f-pen" x="300" y="182" width="170" height="14" rx="5" />
          <rect className="f-pen-grip" x="300" y="182" width="44" height="14" rx="5" />
          <path className="f-pen-tip" d="M300 184l-22 5 22 5z" />
          <path d="M470 185h14v8h-14" className="f-pen" />
          <path d="M392 182h66a4 4 0 0 0-4-7h-50" />
        </g>
      </g>

      {/* Eraser shavings */}
      <g data-depth="40" className="soft">
        <path d="M452 372l8 3M470 388l5-6M438 394l7 1M482 366l3 7" strokeWidth="3" />
      </g>
    </svg>
  )
}
