// Pointer tilt for cards: sets --rx / --ry (degrees) and --mx / --my (0..1) on the element,
// which CSS turns into a 3D rotation and a moving sheen. Mouse only; touch and reduced motion skip it.
export function tiltHandlers(max = 7) {
  const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return {
    onPointerMove(e) {
      if (e.pointerType !== 'mouse' || still()) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${((0.5 - y) * 2 * max).toFixed(2)}deg`)
      el.style.setProperty('--mx', x.toFixed(3))
      el.style.setProperty('--my', y.toFixed(3))
    },
    onPointerLeave(e) {
      const el = e.currentTarget
      el.style.removeProperty('--rx')
      el.style.removeProperty('--ry')
    },
  }
}
