import { useEffect, useState } from 'react'

const reducedQuery = '(prefers-reduced-motion: reduce)'

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

// Decorative WebGL/GSAP effects only run when the device can handle them and the user hasn't asked for less motion.
export function useFancyMotion() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(reducedQuery)
    const lowPower = (navigator.hardwareConcurrency || 8) <= 2 || navigator.connection?.saveData
    const update = () => setOk(!mq.matches && !lowPower && hasWebGL2())
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return ok
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(reducedQuery).matches)
  useEffect(() => {
    const mq = window.matchMedia(reducedQuery)
    const update = () => setReduced(mq.matches)
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}
