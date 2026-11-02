import { Suspense } from 'react'
import { sims } from './registry.js'

export default function SimEmbed({ id }) {
  const sim = sims[id]
  if (!sim) return null
  const C = sim.Component
  return (
    <Suspense fallback={<div className="sim">Loading tool…</div>}>
      <C />
    </Suspense>
  )
}
