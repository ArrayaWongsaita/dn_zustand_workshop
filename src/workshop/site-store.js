import { create } from 'zustand'

// The site's own store: progress and which solutions the learner has revealed.
// Never teaching material (content-model.md): it lives outside every page folder
// so a page folder never mixes teaching state with site state.
export const useSiteStore = create((set) => ({
  visited: [],
  revealed: [],

  markVisited: (slug) =>
    set((state) =>
      state.visited.includes(slug) ? {} : { visited: [...state.visited, slug] },
    ),

  toggleRevealed: (slug) =>
    set((state) => ({
      revealed: state.revealed.includes(slug)
        ? state.revealed.filter((s) => s !== slug)
        : [...state.revealed, slug],
    })),
}))
