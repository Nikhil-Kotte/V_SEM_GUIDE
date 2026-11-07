import { useEffect, useState } from 'react'
import { asset } from '../config.js'
import Inline from './Inline.jsx'

// A source file: name bar + copy button + the code.
export function CodeFile({ file, code }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="codefile">
      <div className="codefile__bar">
        <span className="codefile__name">{file}</span>
        <button type="button" className="codefile__copy" onClick={copy} aria-label={`Copy ${file}`}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className="code"><code>{code.replace(/\s+$/, '')}</code></pre>
    </div>
  )
}

// What the terminal shows: prompts, typed input and output, in a dark terminal box.
export function Terminal({ title = 'Output', text }) {
  return (
    <div className="terminal" role="region" aria-label={title}>
      <div className="terminal__bar"><i /><i /><i /><span>{title}</span></div>
      <pre><code>{text.replace(/\s+$/, '')}</code></pre>
    </div>
  )
}

// A screenshot from the lab record; tap to enlarge.
export function Shot({ src, caption }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const url = asset(`lab/${src}.webp`)
  return (
    <figure className="diagram shot">
      <button type="button" onClick={() => setOpen(true)} aria-label={`Enlarge: ${caption}`}>
        <img src={url} alt={caption} loading="lazy" decoding="async" />
      </button>
      <figcaption><Inline text={caption} /><span className="src">From your lab record</span></figcaption>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={caption} onClick={() => setOpen(false)}>
          <img src={url} alt={caption} />
        </div>
      )}
    </figure>
  )
}
