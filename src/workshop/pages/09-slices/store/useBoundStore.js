import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createCartSlice } from './cartSlice.js'
import { createCatalogSlice } from './catalogSlice.js'

export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createCatalogSlice(...a),
    }),
    {
      name: 'zustand-workshop-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
)
