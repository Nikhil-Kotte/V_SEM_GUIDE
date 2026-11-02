import { lazy, Suspense } from 'react'
import { useFancyMotion } from '../lib/motion.js'

const SplitText = lazy(() => import('./bits/SplitText.jsx'))

// Section heading that rises in word by word when scrolled into view; a plain heading otherwise.
export default function RevealHeading({ text, tag = 'h2' }) {
  const fancy = useFancyMotion()
  const Plain = tag
  if (!fancy) return <Plain>{text}</Plain>
  return (
    <Suspense fallback={<Plain>{text}</Plain>}>
      <SplitText text={text} tag={tag} splitType="words" effect="rise" mask textAlign="left" delay={70} duration={0.9} />
    </Suspense>
  )
}
