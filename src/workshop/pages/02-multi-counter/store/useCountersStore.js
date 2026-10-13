import { create } from 'zustand'

export const useCountersStore = create((set) => ({
  countA: 0,
  countB: 0,
  incrementA: () => set((state) => ({ countA: state.countA + 1 })),
  decrementA: () => set((state) => ({ countA: state.countA - 1 })),
  incrementB: () => set((state) => ({ countB: state.countB + 1 })),
  decrementB: () => set((state) => ({ countB: state.countB - 1 })),
  resetAll: () => set({ countA: 0, countB: 0 }),
}))
