import { Navigate, Route, Routes, useParams } from 'react-router'
import Home from './workshop/shell/Home.jsx'
import PageTemplate from './workshop/shell/PageTemplate.jsx'
import { findPageBySlug } from './workshop/shell/registry.js'
import Shell from './workshop/shell/Shell.jsx'
import StartHere from './workshop/shell/StartHere.jsx'

// Routing is invisible plumbing (ADR-0003): nothing learner-facing names it.
// One route per surface; a path matching nothing falls back to home.
function PageRoute() {
  const { slug } = useParams()
  const page = findPageBySlug(slug)

  return page ? <PageTemplate page={page} /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<StartHere />} />
        <Route path="/:slug" element={<PageRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
