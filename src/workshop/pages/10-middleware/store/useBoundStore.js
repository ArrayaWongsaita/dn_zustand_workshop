import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createCartSlice } from './cartSlice.js'
import { createCatalogSlice } from './catalogSlice.js'

export const useBoundStore = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createCartSlice(...a),
        ...createCatalogSlice(...a),
      })),
      {
        name: 'zustand-workshop-cart',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ cart: state.cart }),
      },
    ),
    { name: 'zustand-workshop-store' },
  ),
)
