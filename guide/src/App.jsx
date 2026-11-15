import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

// Subject and Coming soon load on demand so the first download is only the home page.
const Subject = lazy(() => import('./pages/Subject.jsx'))
const ComingSoon = lazy(() => import('./pages/ComingSoon.jsx'))
const Viewer = lazy(() => import('./pages/Viewer.jsx'))

const page = (el) => <Suspense fallback={<div className="page-loading" aria-busy="true" />}>{el}</Suspense>

// HashRouter keeps deep links working on GitHub Pages, which has no SPA fallback.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="s/:subj/:tab?/:item?" element={page(<Subject />)} />
          <Route path="drrm" element={page(<ComingSoon />)} />
          <Route path="view" element={page(<Viewer />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
