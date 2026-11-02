import { Link } from 'react-router-dom'

export default function ComingSoon() {
  return (
    <section className="soon-page">
      <div>
        <span className="label">DRRM · Disaster Risk Reduction &amp; Management</span>
        <h1>Coming soon.</h1>
        <p className="muted" style={{ maxWidth: '44ch', margin: '0 auto 28px' }}>
          The study material for this subject isn't in the guide yet. It will appear here, in the same format as the other subjects, once it's added.
        </p>
        <Link to="/" className="btn btn-ink">Back to all subjects <span className="arrow" aria-hidden="true">↖</span></Link>
      </div>
    </section>
  )
}
