import materials from '../content/materials.json'
import { rawUrl, viewUrl } from '../config.js'

const size = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

export default function DownloadsTab({ subject }) {
  const files = materials.filter((m) => m.subject === subject.id)
  const groups = [
    ['Study material', 'Slides, notes and textbooks from your course.', files.filter((f) => f.group === 'material')],
    ['Past papers', 'Full question papers, newest first.', files.filter((f) => f.group === 'paper').sort((a, b) => (b.year || '').localeCompare(a.year || ''))],
    ['Compiled question bank', 'Unit-wise collection of older questions.', files.filter((f) => f.group === 'bank')],
  ]

  return (
    <div style={{ padding: '36px 0 96px' }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <span className="label">Originals</span>
        <div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}>Download the actual files</h2>
          <p>
            <b>Open</b> previews the file on GitHub. <b>Download</b> fetches the original. Some browsers open PDFs in a new tab instead of saving them; use your browser's save button there.
          </p>
        </div>
      </div>
      {groups.map(([title, sub, list]) => list.length > 0 && (
        <section key={title} className="dl-group">
          <h3>{title}</h3>
          <p className="muted" style={{ marginTop: -6, fontSize: 15 }}>{sub}</p>
          <div className="dl-list">
            {list.map((f) => (
              <div key={f.path} className="dl-row">
                <span className={`dl-ext ${f.ext}`} aria-hidden="true">{f.ext}</span>
                <div>
                  <div className="dl-name">{f.name}</div>
                  <div className="dl-sub">{f.year ? `${f.year} · ` : ''}{size(f.size)}{f.ext === 'ppt' || f.ext === 'pptx' ? ' · opens in PowerPoint / Google Slides' : ''}</div>
                </div>
                <div className="dl-actions">
                  <a className="btn btn-sm" href={viewUrl(f.path)} target="_blank" rel="noreferrer">Open</a>
                  <a className="btn btn-sm btn-ink" href={rawUrl(f.path)} download={f.name} rel="noreferrer">Download</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      {subject.id === 'pdt' && (
        <p className="faint" style={{ fontSize: 14 }}>The May 2026 paper is for 22MEC36 (Fundamentals of Design Thinking), which covers the same Define, Ideate, Prototype and Test phases.</p>
      )}
    </div>
  )
}
