import { pages } from '../pages/index.js'
import { TIER_ORDER } from './labels.js'

// One place the shell reads the page registry through, so routing, the sidebar
// and the home ladder never re-implement the same lookup or grouping. A falsy
// entry (a page whose module failed to load) is treated as absent here; the
// sidebar row keeps a defensive guard for a falsy record.
export function findPageBySlug(slug) {
  return pages.find((page) => page && page.slug === slug) ?? null
}

export function pagesByTier() {
  return TIER_ORDER.map((tier) => ({
    tier,
    rows: pages.filter((page) => page && page.tier === tier),
  }))
}

export function pagesInLadderOrder() {
  return pages.filter(Boolean).slice().sort((a, b) => a.number - b.number)
}
