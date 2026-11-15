// Cover illustrations, one per subject, drawn like ballpoint sketches on a booklet cover.
// Colour comes from the parent: `color` is the subject's pen, `--art-tint` its light wash.
// Classes (see styles/paper.css → .art): f-tint, f-paper, f-ink, soft, hot, hl.

const Art = ({ children, className = '' }) => (
  <svg className={`art ${className}`} viewBox="0 0 200 140" aria-hidden="true" focusable="false">
    <g filter="url(#rough)">{children}</g>
  </svg>
)

// Software Engineering: a flowchart that ends in a passed test.
function SE() {
  return (
    <Art>
      <rect className="f-tint" x="18" y="12" width="64" height="24" rx="12" />
      <path d="M50 36v14m-5-5 5 6 5-6" />
      <path className="f-paper" d="M50 52 78 72 50 92 22 72z" />
      <path className="soft" d="M40 72h20" />
      <path d="M78 72h22m-6-5 7 5-7 5" />
      <rect className="f-paper" x="102" y="54" width="62" height="36" rx="3" />
      <path className="soft" d="M112 64h30M112 72h42M112 80h22" />
      <path d="M50 92v12m-5-5 5 6 5-6" />
      <rect className="f-tint" x="20" y="106" width="60" height="24" rx="3" />
      <path className="soft" d="M30 118h40" />
      <path d="M134 90v12m-5-5 5 6 5-6" />
      <circle className="f-paper" cx="134" cy="118" r="13" />
      <path className="ok" d="M127 118l5 6 9-12" />
      <g transform="translate(176 30)">
        <circle className="f-tint" r="10" />
        <circle r="3.5" />
        <path d="M0-10v-6M0 10v6M-10 0h-6M10 0h6M-7-7l-4-4M7 7l4 4M-7 7l-4 4M7-7l4-4" />
      </g>
      <path className="hot" d="M168 104l14 14m0-14-14 14" />
    </Art>
  )
}

// Operating Systems: memory frames, a CPU and the process state ring.
function OS() {
  return (
    <Art>
      <g>
        <rect className="f-paper" x="16" y="14" width="44" height="112" rx="3" />
        <rect className="f-tint" x="16" y="14" width="44" height="22" />
        <rect className="f-tint" x="16" y="58" width="44" height="22" />
        <rect className="hl" x="17" y="81" width="42" height="21" />
        <path d="M16 36h44M16 58h44M16 80h44M16 102h44" />
        <rect x="16" y="14" width="44" height="112" rx="3" />
        <path className="soft" d="M26 25h24M26 47h16M26 69h24M26 113h18" />
      </g>
      <path className="hot" d="M66 91h14m-6-5 7 5-7 5" />
      <circle className="soft" cx="134" cy="68" r="42" strokeDasharray="3 6" />
      <path d="M134 26a42 42 0 0 1 36 20m6 22a42 42 0 0 1-21 37m-42 0a42 42 0 0 1-21-37m6-22a42 42 0 0 1 36-20" />
      <path d="M166 40l5 7-8 1M158 108l-4 6-3-8M97 73l-5-6 8-2" />
      <circle className="f-tint" cx="134" cy="26" r="9" />
      <circle className="f-paper" cx="176" cy="68" r="9" />
      <circle className="f-tint" cx="134" cy="110" r="9" />
      <circle className="f-paper" cx="92" cy="68" r="9" />
      <rect className="f-paper" x="118" y="52" width="32" height="32" rx="4" />
      <rect className="f-tint" x="126" y="60" width="16" height="16" rx="2" />
      <path d="M124 52v-6M134 52v-6M144 52v-6M124 84v6M134 84v6M144 84v6M118 60h-6M118 68h-6M118 76h-6M150 60h6M150 68h6M150 76h6" />
    </Art>
  )
}

// Computer Networks: routers, links and packets on the way.
function CN() {
  return (
    <Art>
      <path className="soft" d="M36 34 96 22M36 34 62 84M96 22l52 30M62 84l48 8M148 52l-38 40M148 52l26 54M110 92l64 14M62 84 30 116" />
      <path d="M36 34 96 22l52 30-38 40-48-8z" />
      <rect className="f-ink" x="62" y="24" width="9" height="7" rx="1.5" transform="rotate(-11 66 28)" />
      <rect className="hl" x="120" y="34" width="10" height="8" rx="1.5" transform="rotate(30 125 38)" />
      <rect className="f-ink" x="124" y="68" width="9" height="7" rx="1.5" transform="rotate(-46 128 72)" />
      <path className="hot" d="M78 78l8 10m0-10-8 10" />
      <circle className="f-tint" cx="36" cy="34" r="12" />
      <circle className="f-paper" cx="96" cy="22" r="10" />
      <circle className="f-tint" cx="148" cy="52" r="13" />
      <circle className="f-paper" cx="62" cy="84" r="11" />
      <circle className="f-tint" cx="110" cy="92" r="10" />
      <path d="M31 34h10m-5-5v10M143 52h10m-5-5v10" />
      <rect className="f-paper" x="160" y="98" width="28" height="18" rx="2" />
      <path d="M154 122h40M168 107h12" />
      <rect className="f-paper" x="16" y="108" width="28" height="18" rx="2" />
      <path d="M10 132h40M24 117h12" />
    </Art>
  )
}

// Data Science: a scatter plot, the line through it and a small table.
function FDS() {
  return (
    <Art>
      <path d="M26 12v104h152" />
      <path d="M22 18l4-7 4 7M172 112l7 4-7 4" />
      <path className="soft" d="M26 90h150M26 64h150M26 38h150" strokeDasharray="2 6" />
      <path className="hot" d="M32 104 172 26" />
      <g className="f-tint">
        <circle cx="44" cy="96" r="5" /><circle cx="58" cy="82" r="5" /><circle cx="70" cy="90" r="5" />
        <circle cx="84" cy="70" r="5" /><circle cx="94" cy="80" r="5" />
      </g>
      <g className="f-ink">
        <circle cx="112" cy="54" r="5" /><circle cx="124" cy="62" r="5" /><circle cx="134" cy="42" r="5" />
        <circle cx="150" cy="46" r="5" /><circle cx="160" cy="28" r="5" />
      </g>
      <circle className="soft" cx="70" cy="86" r="34" strokeDasharray="4 5" />
      <circle className="soft" cx="138" cy="46" r="34" strokeDasharray="4 5" />
      <rect className="hl" x="118" y="94" width="18" height="10" />
      <path className="f-paper" d="M100 84h56v40h-56z" />
      <rect className="hl" x="119" y="95" width="18" height="9" />
      <path d="M100 84h56v40h-56zM100 94h56M100 104h56M100 114h56M118 84v40M137 84v40" />
    </Art>
  )
}

// Big Data: many small blocks mapped, shuffled and reduced on a cluster.
function BDA() {
  const Cyl = ({ x, y, tint }) => (
    <g transform={`translate(${x} ${y})`}>
      <path className={tint ? 'f-tint' : 'f-paper'} d="M0 6c0-8 34-8 34 0v26c0 8-34 8-34 0z" />
      <path d="M0 6c0 8 34 8 34 0M0 15c0 8 34 8 34 0M0 24c0 8 34 8 34 0" />
    </g>
  )
  return (
    <Art>
      <g>
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} className={(r + c) % 3 === 0 ? 'f-ink' : (r + c) % 3 === 1 ? 'f-tint' : 'f-paper'}
            x={14 + c * 14} y={18 + r * 14} width="10" height="10" rx="1.5" />
        )))}
      </g>
      <path d="M60 28c14 0 12 14 26 14M60 46c12 0 14 6 26 6M60 62c14 0 12 4 26 4" />
      <path className="soft" d="M60 28c16 4 12 36 26 38M60 62c14-6 12-18 26-20" />
      <path className="f-tint" d="M88 34h40l-12 20v18l-16 8V54z" />
      <path d="M128 60h14m-6-5 7 5-7 5" />
      <rect className="hl" x="146" y="48" width="38" height="24" rx="3" />
      <rect x="146" y="48" width="38" height="24" rx="3" />
      <path d="M154 56h22M154 64h14" />
      <Cyl x={30} y={92} tint />
      <Cyl x={84} y={92} />
      <Cyl x={138} y={92} tint />
      <path className="soft" d="M64 110h20M118 110h20" strokeDasharray="3 4" />
    </Art>
  )
}

// Design Thinking: an idea, a wall of sticky notes and the loop back.
function PDT() {
  return (
    <Art>
      <path className="hl" d="M44 16c17 0 28 12 28 26 0 10-5 16-10 22-3 4-4 8-4 12H30c0-4-1-8-4-12-5-6-10-12-10-22 0-14 11-26 28-26z" />
      <path d="M44 16c17 0 28 12 28 26 0 10-5 16-10 22-3 4-4 8-4 12H30c0-4-1-8-4-12-5-6-10-12-10-22 0-14 11-26 28-26z" />
      <path d="M30 84h28M32 92h24M38 100h12" />
      <path className="soft" d="M36 54l8-10 8 10M44 44v32" />
      <path className="hot" d="M44 2v6M12 14l5 5M76 14l-5 5M2 44h6M80 44h6" />
      <rect className="f-tint" x="98" y="14" width="34" height="34" transform="rotate(-6 115 31)" />
      <rect className="f-paper" x="142" y="20" width="34" height="34" transform="rotate(5 159 37)" />
      <rect className="hl" x="104" y="62" width="34" height="34" transform="rotate(4 121 79)" />
      <rect x="104" y="62" width="34" height="34" transform="rotate(4 121 79)" />
      <rect className="f-tint" x="148" y="66" width="34" height="34" transform="rotate(-5 165 83)" />
      <path className="soft" d="M105 26l20-2M106 34l14-1.500M150 32l20 2M150 40l12 1M111 76l20 1.500M111 84l12 1M154 80l20-2M155 88l12-1" />
      <path d="M92 124c22 10 62 10 84-4" />
      <path d="M168 114l9 6-9 8" />
      <path d="M100 116l-9 8 11 4" />
    </Art>
  )
}

const COVERS = { se: SE, os: OS, cn: CN, fds: FDS, bda: BDA, pdt: PDT }

export default function CoverArt({ id }) {
  const C = COVERS[id]
  return C ? <C /> : null
}
