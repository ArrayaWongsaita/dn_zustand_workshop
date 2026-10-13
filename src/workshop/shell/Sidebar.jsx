import { Link } from 'react-router'
import { pages } from '../pages/index.js'
import { useSiteStore } from '../site-store.js'
import { TIER_LABELS, TIER_ORDER } from './labels.js'

// One row of the ladder. The current page's row is filled and a visited page's
// row carries a check. A falsy record is defensive only: render it dimmed and
// inert rather than crashing.
function SidebarRow({ page, currentSlug, visited }) {
  if (!page) {
    return (
      <span
        aria-disabled="true"
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground/40"
      >
        <span className="tabular-nums opacity-60">–</span>
        <span className="truncate">…</span>
      </span>
    )
  }

  const isCurrent = page.slug === currentSlug
  const isVisited = visited.includes(page.slug)

  return (
    <Link
      to={`/${page.slug}`}
      aria-current={isCurrent ? 'page' : undefined}
      className={
        'flex items-center gap-2 rounded-md px-2 py-1 text-sm ' +
        (isCurrent ? 'bg-foreground text-background' : 'hover:bg-muted')
      }
    >
      <span className="tabular-nums opacity-60">{page.number}</span>
      <span className="truncate">{page.titleTh}</span>
      {isVisited ? <span className="ml-auto text-xs">✓</span> : null}
    </Link>
  )
}

// The ladder is visible at all times: five tier groups in order, built from the
// registry, then a link to the start-here page. No count, percentage, or
// progress bar anywhere.
export default function Sidebar({ currentSlug }) {
  const visited = useSiteStore((state) => state.visited)

  const groups = TIER_ORDER.map((tier) => ({
    tier,
    rows: pages.filter((page) => page && page.tier === tier),
  }))
  const missing = pages.filter((page) => !page)

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r bg-muted/20 p-4">
      <Link to="/" className="text-sm font-medium">
        เวิร์กช็อป Zustand
      </Link>
      <nav className="flex flex-col gap-4">
        {groups.map(({ tier, rows }) => (
          <div key={tier} className="flex flex-col gap-0.5">
            <p className="px-2 text-xs text-muted-foreground">
              {TIER_LABELS[tier]}
            </p>
            {rows.map((page) => (
              <SidebarRow
                key={page.slug}
                page={page}
                currentSlug={currentSlug}
                visited={visited}
              />
            ))}
          </div>
        ))}
        {missing.map((_, index) => (
          <SidebarRow
            key={`missing-${index}`}
            page={null}
            currentSlug={currentSlug}
            visited={visited}
          />
        ))}
      </nav>
      <Link to="/start" className="mt-auto text-xs underline">
        หน้าเริ่มต้น
      </Link>
    </aside>
  )
}
