import MicroSlats from './bits/MicroSlats.jsx'

// Cream slats on Otto coral. Kept at reduced opacity so the ink headline always stays readable.
export default function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-bg static" />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <MicroSlats
          preset="swell"
          color="#faf7ee"
          glintColor="#ffffff"
          backgroundColor="transparent"
          slatWidth={9}
          slatHeight={22}
          gap={4}
          roundness={0.9}
          interactive
          cursorStrength={0.7}
          cursorSize={50}
          trail={1.2}
          intro
        />
      </div>
    </div>
  )
}
