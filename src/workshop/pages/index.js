import counter from './01-counter/index.js'
import multiCounter from './02-multi-counter/index.js'
import todo from './03-todo/index.js'
import shoppingCart from './04-shopping-cart/index.js'
import derivedSelectors from './05-derived-selectors/index.js'
import selectorPerformance from './06-selector-performance/index.js'
import asyncFetch from './07-async-fetch/index.js'
import persist from './08-persist/index.js'
import slices from './09-slices/index.js'
import middleware from './10-middleware/index.js'
import sharedStore from './11-shared-store/index.js'
import capstone from './12-capstone/index.js'

// The registry: a hand-written array in ladder order. Ladder order is teaching
// data, not a filesystem fact, so pages are never discovered by a glob.
export const pages = [
  counter,
  multiCounter,
  todo,
  shoppingCart,
  derivedSelectors,
  selectorPerformance,
  asyncFetch,
  persist,
  slices,
  middleware,
  sharedStore,
  capstone,
]

export default pages
