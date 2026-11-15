import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LazyMotion, MotionConfig, m as M } from 'motion/react'
import { Search01Icon, Moon02Icon, Sun03Icon, Menu01Icon, Cancel01Icon, GithubIcon } from '@hugeicons/core-free-icons'
import { subjects } from '../content/subjects.js'
import { syllabus } from '../content/syllabus.js'
import { getPref, setPref, useStore } from '../lib/storage.js'
import { REPO } from '../config.js'
import Icon from './Icon.jsx'
import CoverArt from './art/covers.jsx'
import { Star } from './art/doodles.jsx'
import { InkDefs } from './ink/Desk.jsx'

const Search = lazy(() => import('./Search.jsx'))
const loadFeatures = () => import('./motionFeatures.js').then((mod) => mod.default)

const ALL_TOPICS = subjects.flatMap((s) => syllabus[s.id].flatMap((u) => u.topics.map((t) => t.id)))

// The first paint shows content at once; only later navigations slide in.
let firstPaint = true

const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
const isCurrent = (pathname, to) => pathname === to || pathname.startsWith(to + '/')

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => getPref('theme', null) || systemTheme())
  const { pathname } = useLocation()
  const store = useStore()
  const dark = theme === 'dark'
  const menuBtn = useRef(null)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  // The new theme spreads out from the button like ink, where the browser can do it.
  const toggleTheme = (e) => {
    const next = dark ? 'light' : 'dark'
    const apply = () => {
      flushSync(() => setTheme(next))
      document.documentElement.dataset.theme = next
    }
    setPref('theme', next)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || still) { apply(); return }
    const r = e.currentTarget.getBoundingClientRect()
    const root = document.documentElement
    root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`)
    root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`)
    document.startViewTransition(apply)
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName)) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    // Home's search field opens the same dialog.
    const onOpen = () => setSearchOpen(true)
    window.addEventListener('open-search', onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-search', onOpen) }
  }, [])

  // Scroll to top on page change, unless we're jumping to a specific topic/question.
  useEffect(() => {
    if (pathname.split('/').length <= 4) window.scrollTo({ top: 0 })
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); menuBtn.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Animate between sections (home, a subject), not between tabs of the same subject.
  const section = pathname.split('/').slice(0, 3).join('/') || '/'
  // A new section arrives like a sheet laid on the desk.
  const initial = firstPaint ? false : { opacity: 0, x: 34, y: 10, rotate: 0.7 }
  useEffect(() => { firstPaint = false }, [])

  const doneCount = ALL_TOPICS.filter((id) => store.done(id)).length

  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">
        <InkDefs />
        <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
        <header className="site-header">
          <div className="container bar">
            <Link to="/" className="brand rough-box" aria-label="V SEM External Guide, home">V SEM <small>EXTERNAL GUIDE</small></Link>
            <nav className="site-nav" aria-label="Subjects">
              <ul>
                {subjects.map((s) => (
                  <li key={s.id}>
                    <Link to={`/s/${s.id}`} className="divider" style={{ '--pen': s.accent, '--pen-tint': s.tint }}
                      aria-label={s.name} aria-current={isCurrent(pathname, `/s/${s.id}`) ? 'page' : undefined}>{s.short}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="bar-actions">
              <button type="button" className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search (press /)" aria-keyshortcuts="/ Control+K">
                <Icon icon={Search01Icon} /> <span className="search-text">Search</span> <kbd>/</kbd>
              </button>
              <button type="button" className="icon-btn" onClick={toggleTheme} aria-pressed={dark} aria-label="Dark mode">
                <Icon icon={dark ? Sun03Icon : Moon02Icon} />
              </button>
              <button type="button" ref={menuBtn} className="icon-btn menu-btn" aria-expanded={menuOpen} aria-controls="site-menu"
                aria-label="All subjects" onClick={() => setMenuOpen((o) => !o)}>
                <Icon icon={menuOpen ? Cancel01Icon : Menu01Icon} />
              </button>
            </div>
          </div>
          {menuOpen && (
            <nav id="site-menu" className="site-menu" aria-label="All subjects">
              <div className="container">
                <p className="site-menu__title">Subjects</p>
                <ul>
                  {subjects.map((s, i) => (
                    <li key={s.id} style={{ '--i': i }}>
                      <Link to={`/s/${s.id}`} style={{ '--pen': s.accent, '--pen-tint': s.tint }}
                        aria-current={isCurrent(pathname, `/s/${s.id}`) ? 'page' : undefined}>
                        <CoverArt id={s.id} />{s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}
        </header>

        <M.div id="main" tabIndex={-1} key={section} className="route"
          initial={initial} animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}>
          <Outlet />
        </M.div>

        <footer className="site-footer">
          <div className="container row">
            <span className="footer-note">
              <Star className="doodle--gold" />
              <span>Notes rewritten in plain language from your V Sem course material.</span>
            </span>
            <span className="footer-done"><b className="num">{doneCount}</b> of <span className="num">{ALL_TOPICS.length}</span> topics ticked off</span>
            <a href={REPO} target="_blank" rel="noreferrer" className="footer-link"><Icon icon={GithubIcon} /> All files on GitHub</a>
          </div>
        </footer>

        {searchOpen && <Suspense fallback={null}><Search onClose={() => setSearchOpen(false)} /></Suspense>}
      </MotionConfig>
    </LazyMotion>
  )
}
