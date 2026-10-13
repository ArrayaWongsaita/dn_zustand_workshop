import counter from './01-counter/index.js'

// The registry: a hand-written array in ladder order. Ladder order is teaching
// data, not a filesystem fact, so pages are never discovered by a glob.
// Only page 01 exists: pages 02-12 arrive with their briefs (#8-#12).
export const pages = [counter]

export default pages
