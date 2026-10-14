import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createBudgetsSlice } from './budgetsSlice.js'
import { createCategoriesSlice } from './categoriesSlice.js'
import { createEntriesSlice } from './entriesSlice.js'

export const useBoundStore = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createCategoriesSlice(...a),
        ...createEntriesSlice(...a),
        ...createBudgetsSlice(...a),
      })),
      {
        name: 'zustand-workshop-expense',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          entries: state.entries,
          budgets: state.budgets,
        }),
      },
    ),
    { name: 'zustand-workshop-expense' },
  ),
)
