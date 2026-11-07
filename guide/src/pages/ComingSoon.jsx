import { Link } from 'react-router-dom'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import Icon from '../components/Icon.jsx'

export default function ComingSoon() {
  return (
    <section className="soon-page">
      <div className="container">
        <div className="soon-card">
          <span className="badge" aria-hidden="true">DRRM</span>
          <h1>Disaster Risk Reduction and Management</h1>
          <p className="muted">
            The study material for this subject isn&apos;t in the guide yet. It will appear here, in the same format as the other subjects, once it&apos;s added.
          </p>
          <Link to="/" className="btn"><Icon icon={ArrowLeft01Icon} /> Back to all subjects</Link>
        </div>
      </div>
    </section>
  )
}
