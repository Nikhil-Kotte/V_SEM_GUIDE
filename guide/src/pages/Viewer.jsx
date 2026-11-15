import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft01Icon, Download04Icon, MinusSignIcon, PlusSignIcon, LinkSquare02Icon } from '@hugeicons/core-free-icons'
import Icon from '../components/Icon.jsx'
import { fileUrl, isPdf } from '../lib/files.js'

// PDF.js renders the pages on canvases, so PDFs open inside the site on every browser,
// phones included. It is loaded from the CDN the first time a PDF is opened.
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build'
let pdfjsPromise = null
// A same-origin module worker script that imports the CDN worker (a cross-origin worker URL is not allowed).
let workerUrl = null
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import(/* @vite-ignore */ `${PDFJS}/pdf.min.mjs`)
    pdfjsPromise.catch(() => { pdfjsPromise = null })
  }
  if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([`import "${PDFJS}/pdf.worker.min.mjs";`], { type: 'text/javascript' }))
  return pdfjsPromise
}

// One page: a placeholder of the right size that draws itself when it comes near the screen.
function Page({ doc, n, scale, ratio, width }) {
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '1200px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let task
    let live = true
    doc.getPage(n).then((page) => {
      if (!live) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const base = page.getViewport({ scale: 1 })
      const vp = page.getViewport({ scale: (width / base.width) * scale * dpr })
      const canvas = canvasRef.current
      canvas.width = vp.width
      canvas.height = vp.height
      task = page.render({ canvasContext: canvas.getContext('2d'), viewport: vp })
      task.promise.catch(() => {})
    })
    return () => { live = false; task?.cancel() }
  }, [visible, doc, n, scale, width])

  return (
    <div ref={ref} className="pdf-page" style={{ width: width * scale, aspectRatio: ratio }} aria-label={`Page ${n}`} role="img">
      {visible && <canvas ref={canvasRef} />}
      <span className="pdf-page__n" aria-hidden="true">{n}</span>
    </div>
  )
}

export default function Viewer() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const path = params.get('f') || ''
  const title = params.get('t') || path.split('/').pop()
  const [doc, setDoc] = useState(null)
  const [ratio, setRatio] = useState(1 / Math.SQRT2)
  const [error, setError] = useState(null)
  const [scale, setScale] = useState(1)
  const [width, setWidth] = useState(800)
  const [page, setPage] = useState(1)
  const stage = useRef(null)
  const url = fileUrl(path)

  // Fit the page width to the screen.
  useEffect(() => {
    const measure = () => setWidth(Math.min(1000, (stage.current?.clientWidth || 800) - 2))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (!isPdf(path)) return
    let live = true
    let task, worker, port
    setDoc(null)
    setError(null)
    // Each document gets its own worker, so closing one PDF never breaks the next.
    loadPdfjs()
      .then((lib) => {
        if (!live) return null
        port = new Worker(workerUrl, { type: 'module' })
        worker = new lib.PDFWorker({ port })
        task = lib.getDocument({ url, worker, disableAutoFetch: true })
        return task.promise
      })
      .then(async (d) => {
        if (!live || !d) return
        const first = await d.getPage(1)
        const vp = first.getViewport({ scale: 1 })
        setRatio(vp.width / vp.height)
        setDoc(d)
      })
      .catch((e) => live && setError(e?.message || 'Could not open this PDF.'))
    return () => {
      live = false
      Promise.resolve(task?.destroy()).catch(() => {}).finally(() => { worker?.destroy(); port?.terminate() })
    }
  }, [path, url])

  // Which page is in view.
  useEffect(() => {
    if (!doc) return
    const pages = [...stage.current.querySelectorAll('.pdf-page')]
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setPage(Number(e.target.getAttribute('aria-label').split(' ')[1]))
    }, { rootMargin: '-45% 0px -50% 0px' })
    pages.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [doc, scale])

  const zoom = useCallback((d) => setScale((s) => Math.max(0.5, Math.min(3, Math.round((s + d) * 100) / 100))), [])
  const back = () => (window.history.length > 1 ? navigate(-1) : navigate('/'))

  if (!isPdf(path)) {
    return <div className="container viewer-empty"><p>This file can't be shown here.</p><Link to="/" className="btn">Back to the guide</Link></div>
  }

  return (
    <div className="viewer">
      <div className="viewer__bar">
        <div className="container viewer__bar-in">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back"><Icon icon={ArrowLeft01Icon} /></button>
          <h1 className="viewer__title" title={title}>{title.replace(/\.pdf$/i, '')}</h1>
          {doc && <span className="viewer__pages num" aria-live="polite">{page} / {doc.numPages}</span>}
          <div className="viewer__tools">
            <button type="button" className="icon-btn" onClick={() => zoom(-0.25)} aria-label="Zoom out" disabled={scale <= 0.5}><Icon icon={MinusSignIcon} /></button>
            <button type="button" className="btn btn-sm viewer__zoom num" onClick={() => setScale(1)} aria-label="Fit to width">{Math.round(scale * 100)}%</button>
            <button type="button" className="icon-btn" onClick={() => zoom(0.25)} aria-label="Zoom in" disabled={scale >= 3}><Icon icon={PlusSignIcon} /></button>
            <a className="icon-btn" href={url} target="_blank" rel="noreferrer" aria-label="Open in a new tab"><Icon icon={LinkSquare02Icon} /></a>
            <a className="btn btn-sm btn-primary" href={url} download={title}><Icon icon={Download04Icon} /> <span className="viewer__dl">Download</span></a>
          </div>
        </div>
      </div>
      <div className="viewer__stage" ref={stage}>
        {error && (
          <div className="viewer-empty">
            <p>The viewer couldn't load ({error}). You can still open the file directly.</p>
            <a className="btn btn-primary" href={url} target="_blank" rel="noreferrer">Open the PDF</a>
          </div>
        )}
        {!doc && !error && <p className="viewer__loading" aria-busy="true">Opening {title}...</p>}
        {doc && Array.from({ length: doc.numPages }, (_, i) => (
          <Page key={`${i}-${scale}`} doc={doc} n={i + 1} scale={scale} ratio={ratio} width={width} />
        ))}
      </div>
    </div>
  )
}
