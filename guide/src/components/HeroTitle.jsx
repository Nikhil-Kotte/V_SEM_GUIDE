import RotatingText from './bits/RotatingText.jsx'
import './bits/RotatingText.css'

const NAMES = ['Operating Systems', 'Software Engineering', 'Computer Networks', 'Data Science', 'Big Data', 'Design Thinking']

export default function HeroTitle() {
  return (
    <>
      <h1>Mid-2, made simple.</h1>
      <div className="hero-rotate" aria-label="Subjects covered">
        <span>Now revising</span>
        <RotatingText
          texts={NAMES}
          effect="slide"
          splitBy="characters"
          staggerDuration={0.015}
          staggerFrom="first"
          rotationInterval={2400}
          highlight
          highlightColor="#182d2a"
          mainClassName="hero-rotate-pill"
        />
      </div>
    </>
  )
}
