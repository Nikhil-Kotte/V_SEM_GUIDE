import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroHeading from './HeroHeading.jsx'

gsap.registerPlugin(useGSAP)

// Home hero entrance (GSAP): each line rises out of its mask, then the highlighter sweeps
// behind "made simple". Transform-only. Lazy-loaded; Home shows the static heading until it's ready.
export default function HeroTitle() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-line', { yPercent: 110, duration: 0.7, stagger: 0.1 })
        .fromTo('.hl-bar', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, '-=0.3')
    })
  }, { scope: ref })
  return <HeroHeading innerRef={ref} />
}
