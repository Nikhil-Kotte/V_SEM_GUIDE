import { Download04Icon, File01Icon, Pdf01Icon, Ppt01Icon, Doc01Icon, Csv01Icon, FileScriptIcon, ViewIcon } from '@hugeicons/core-free-icons'
import materials from '../content/materials.json'
import { rawUrl, viewUrl } from '../config.js'
import Icon from './Icon.jsx'

const size = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)
const FILE_ICON = { pdf: Pdf01Icon, ppt: Ppt01Icon, pptx: Ppt01Icon, doc: Doc01Icon, docx: Doc01Icon, csv: Csv01Icon, ipynb: FileScriptIcon }

export default function DownloadsTab({ subject }) {
  const files = materials.filter((m) => m.subject === subject.id)
  const groups = [
    ['material', 'Study material', 'Slides, notes and textbooks from your course.', files.filter((f) => f.group === 'material')],
    ['papers', 'Past papers', 'Full question papers, newest first.', files.filter((f) => f.group === 'paper').sort((a, b) => (b.year || '').localeCompare(a.year || ''))],
    ['bank', 'Compiled question bank', 'Unit-wise collection of older questions.', files.filter((f) => f.group === 'bank')],
  ]

  return (
    <div className="tab-body">
      <div className="section-head">
        <h2>Download the original files</h2>
        <p>
          <b>Open</b> previews the file on GitHub. <b>Download</b> fetches the original. Some browsers open PDFs in a new tab instead of saving them; use your browser&apos;s save button there.
        </p>
      </div>
      {groups.map(([key, title, sub, list]) => list.length > 0 && (
        <section key={key} className="dl-group" aria-labelledby={`dl-${key}`}>
          <div className="unit-head is-compact">
            <h2 id={`dl-${key}`}>{title}</h2>
            <span className="unit-note">{sub}</span>
          </div>
          <ul className="dl-list">
            {list.map((f) => (
              <li key={f.path} className="dl-row">
                <span className={`dl-ext ${f.ext}`} aria-hidden="true"><Icon icon={FILE_ICON[f.ext] || File01Icon} size={22} /></span>
                <div className="dl-info">
                  <div className="dl-name">{f.name}</div>
                  <div className="dl-sub"><span className="dl-type">{f.ext}</span>{f.year ? `${f.year}, ` : ''}{size(f.size)}{f.ext === 'ppt' || f.ext === 'pptx' ? ', opens in PowerPoint or Google Slides' : ''}</div>
                </div>
                <div className="dl-actions">
                  <a className="btn btn-sm" href={viewUrl(f.path)} target="_blank" rel="noreferrer" aria-label={`Open ${f.name} on GitHub`}><Icon icon={ViewIcon} /> Open</a>
                  <a className="btn btn-sm btn-primary" href={rawUrl(f.path)} download={f.name} rel="noreferrer" aria-label={`Download ${f.name}`}><Icon icon={Download04Icon} /> Download</a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {subject.id === 'pdt' && (
        <p className="faint" style={{ fontSize: 14.5 }}>The May 2026 paper is for 22MEC36 (Fundamentals of Design Thinking), which covers the same Define, Ideate, Prototype and Test phases.</p>
      )}
    </div>
  )
}
