import { Outlet, useLocation } from 'react-router'
import { findPageBySlug } from './registry.js'
import Sidebar from './Sidebar.jsx'

// One shell for every surface: a fixed-width sidebar and an independently
// scrolling content column beside it. Desktop-first, no breakpoints.
export default function Shell() {
  // The layout route has no :slug param of its own, so read the URL it wraps.
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+/, '')
  const current = findPageBySlug(slug)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar currentSlug={current?.slug ?? null} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
