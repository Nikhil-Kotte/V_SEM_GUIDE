import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LazyMotion, MotionConfig, m as M } from 'motion/react'
import { Search01Icon, Moon02Icon, Sun03Icon, Menu01Icon, Cancel01Icon, GithubIcon } from '@hugeicons/core-free-icons'
import { subjects } from '../content/subjects.js'
import { getPref, setPref } from '../lib/storage.js'
import { REPO } from '../config.js'
import Icon from './Icon.jsx'
import TabBar from './TabBar.jsx'

const Search = lazy(() => import('./Search.jsx'))
const loadFeatures = () => import('./motionFeatures.js').then((mod) => mod.default)

const LABS = ['cn', 'os', 'se']
const NAV = [
  ...subjects.map((s) => ({ to: `/s/${s.id}`, label: s.short, ariaLabel: s.name })),
  ...LABS.map((id) => ({ to: `/lab/${id}`, label: `${id.toUpperCase()} Lab`, ariaLabel: `${id.toUpperCase()} lab external guide` })),
]

const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => getPref('theme', null) || systemTheme())
  const { pathname } = useLocation()
  const dark = theme === 'dark'
  const menuBtn = useRef(null)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const toggleTheme = () => { const next = dark ? 'light' : 'dark'; setTheme(next); setPref('theme', next) }

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

  const items = NAV.map((i) => ({ ...i, current: pathname === i.to || pathname.startsWith(i.to + '/') }))
  // Animate between sections (home, a subject, a lab), not between tabs of the same subject.
  const section = pathname.split('/').slice(0, 3).join('/') || '/'

  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
        <header className="site-header">
          <div className="container bar">
            <Link to="/" className="brand" aria-label="V-SEM Mid-2 guide home">V-SEM <small>Mid-2</small></Link>
            <TabBar items={items} ariaLabel="Subjects and labs" className="site-nav" />
            <div className="bar-actions">
              <button type="button" className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search (press /)" aria-keyshortcuts="/ Control+K">
                <Icon icon={Search01Icon} /> <span className="search-text">Search</span> <kbd>/</kbd>
              </button>
              <button type="button" className="icon-btn" onClick={toggleTheme} aria-pressed={dark} aria-label="Dark mode">
                <Icon icon={dark ? Sun03Icon : Moon02Icon} />
              </button>
              <button type="button" ref={menuBtn} className="icon-btn menu-btn" aria-expanded={menuOpen} aria-controls="site-menu"
                aria-label="All subjects and labs" onClick={() => setMenuOpen((o) => !o)}>
                <Icon icon={menuOpen ? Cancel01Icon : Menu01Icon} />
              </button>
            </div>
          </div>
          {menuOpen && (
            <nav id="site-menu" className="site-menu" aria-label="All subjects and labs">
              <div className="container">
                <p className="site-menu__title">Subjects</p>
                <ul>
                  {subjects.map((s) => (
                    <li key={s.id}><Link to={`/s/${s.id}`} aria-current={items.find((i) => i.to === `/s/${s.id}`)?.current ? 'page' : undefined}>
                      <span className="badge" style={{ background: s.tint, color: s.accent }}>{s.short}</span>{s.name}
                    </Link></li>
                  ))}
                </ul>
                <p className="site-menu__title">Lab externals</p>
                <ul className="site-menu__labs">
                  {LABS.map((id) => <li key={id}><Link to={`/lab/${id}`}>{id.toUpperCase()} Lab</Link></li>)}
                </ul>
              </div>
            </nav>
          )}
        </header>

        <M.div id="main" tabIndex={-1} key={section} className="route"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}>
          <Outlet />
        </M.div>

        <footer className="site-footer">
          <div className="container row">
            <span>Notes rewritten in plain language from your V Sem course material.</span>
            <a href={REPO} target="_blank" rel="noreferrer" className="footer-link"><Icon icon={GithubIcon} /> All files on GitHub</a>
          </div>
        </footer>

        {searchOpen && <Suspense fallback={null}><Search onClose={() => setSearchOpen(false)} /></Suspense>}
      </MotionConfig>
    </LazyMotion>
  )
}
