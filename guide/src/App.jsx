import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

// Subject, Lab and Coming soon load on demand so the first download is only the home page.
const Subject = lazy(() => import('./pages/Subject.jsx'))
const Lab = lazy(() => import('./pages/Lab.jsx'))
const ComingSoon = lazy(() => import('./pages/ComingSoon.jsx'))

const page = (el) => <Suspense fallback={<div className="page-loading" aria-busy="true" />}>{el}</Suspense>

// HashRouter keeps deep links working on GitHub Pages, which has no SPA fallback.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="s/:subj/:tab?/:item?" element={page(<Subject />)} />
          <Route path="lab/:subj/:item?" element={page(<Lab />)} />
          <Route path="lab" element={<Navigate to="/lab/cn" replace />} />
          <Route path="drrm" element={page(<ComingSoon />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
