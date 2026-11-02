import { forwardRef, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { subjects } from '../content/subjects.js'
import { getPref, setPref } from '../lib/storage.js'
import { REPO } from '../config.js'
import Search from './Search.jsx'
import PillNav from './bits/PillNav.jsx'
import SquishSwitch from './bits/SquishSwitch.jsx'

// PillNav renders links as <LinkComponent href=…>; React Router's Link wants `to`.
const RouterLink = forwardRef(function RouterLink({ href, ...props }, ref) {
  return <Link ref={ref} to={href || '/'} {...props} />
})

const NAV_ITEMS = subjects.map((s) => ({ label: s.short, href: `/s/${s.id}`, ariaLabel: s.name }))

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState(() => getPref('theme', 'light'))
  const { pathname } = useLocation()
  const dark = theme === 'dark'

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

  const activeHref = NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.href ?? ''

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <header className="site-header">
        <div className="container bar">
          <Link to="/" className="brand" aria-label="V-SEM Mid-2 guide home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            V-SEM<span style={{ color: 'var(--coral)' }}>.</span>
          </Link>
          <div className="header-nav">
            <PillNav
              items={NAV_ITEMS}
              activeHref={activeHref}
              linkComponent={RouterLink}
              theme={dark ? 'dark' : 'light'}
              layout="joined"
              itemStyle="plain"
              hoverEffect="glide"
              indicator="pill"
              surface="solid"
              size="md"
              highlightColor="#f57757"
              highlightTextColor="#182d2a"
              collapse="auto"
              ariaLabel="Subjects"
            />
          </div>
          <button type="button" className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search (Ctrl+K)">
            <SearchIcon /> <span className="search-text">Search</span> <kbd>Ctrl K</kbd>
          </button>
          <div className="theme-switch" title={dark ? 'Dark mode on' : 'Dark mode off'}>
            <SquishSwitch
              checked={dark}
              onChange={(on) => setTheme(on ? 'dark' : 'light')}
              ariaLabel="Dark mode"
              trackColor="#e9e3d3"
              trackOnColor="#182d2a"
              thumbColor="#f57757"
              thumbOnColor="#f9db6d"
              width={58}
              height={30}
              radius={15}
            />
          </div>
        </div>
      </header>

      <div id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </div>

      <footer className="site-footer">
        <div className="container row">
          <span>V-SEM Mid-2 guide · notes rewritten in plain language from your course material.</span>
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
