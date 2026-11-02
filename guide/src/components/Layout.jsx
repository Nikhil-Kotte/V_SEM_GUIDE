import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { subjects } from '../content/subjects.js'
import { getPref, setPref } from '../lib/storage.js'
import { REPO } from '../config.js'
import Search from './Search.jsx'

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState(() => getPref('theme', 'light'))
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    setPref('theme', theme)
  }, [theme])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName)) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll to top on page change, unless we're jumping to a specific topic/question.
  useEffect(() => {
    if (pathname.split('/').length <= 4) window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <header className="site-header">
        <div className="container bar">
          <Link to="/" className="brand" aria-label="Mid-2 Guide home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            mid2<span style={{ color: 'var(--coral)' }}>.</span>
          </Link>
          <nav className="header-nav" aria-label="Subjects">
            {subjects.map((s) => (
              <NavLink key={s.id} to={`/s/${s.id}`} className="navlink"
                aria-current={pathname.startsWith(`/s/${s.id}`) ? 'page' : undefined}>{s.short}</NavLink>
            ))}
          </nav>
          <button type="button" className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search (Ctrl+K)">
            <SearchIcon /> <span className="search-text">Search</span> <kbd>Ctrl K</kbd>
          </button>
          <button type="button" className="icon-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <div id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </div>

      <footer className="site-footer">
        <div className="container row">
          <span>Made for V Sem Mid-2 · notes rewritten in plain language from your course material.</span>
          <span><a href={REPO} target="_blank" rel="noreferrer">All files on GitHub ↗</a></span>
        </div>
      </footer>

      {searchOpen && <Search onClose={() => setSearchOpen(false)} />}
    </>
  )
}

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
)
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
