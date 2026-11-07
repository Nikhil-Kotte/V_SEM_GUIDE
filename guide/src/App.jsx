import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Subject from './pages/Subject.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Lab from './pages/Lab.jsx'

// HashRouter keeps deep links working on GitHub Pages, which has no SPA fallback.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="s/:subj/:tab?/:item?" element={<Subject />} />
          <Route path="lab/:subj/:item?" element={<Lab />} />
          <Route path="lab" element={<Navigate to="/lab/cn" replace />} />
          <Route path="drrm" element={<ComingSoon />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
