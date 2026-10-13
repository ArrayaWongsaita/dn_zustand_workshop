import counter from './01-counter/index.js'
import multiCounter from './02-multi-counter/index.js'
import todo from './03-todo/index.js'
import shoppingCart from './04-shopping-cart/index.js'
import derivedSelectors from './05-derived-selectors/index.js'
import selectorPerformance from './06-selector-performance/index.js'

// The registry: a hand-written array in ladder order. Ladder order is teaching
// data, not a filesystem fact, so pages are never discovered by a glob. Pages
// 01-06 exist: pages 07-12 arrive with their briefs (#8-#12).
export const pages = [
  counter,
  multiCounter,
  todo,
  shoppingCart,
  derivedSelectors,
  selectorPerformance,
]

export default pages
