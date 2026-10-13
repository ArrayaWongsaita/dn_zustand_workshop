import { create } from 'zustand'

let latestRequest = 0

export const useCartStore = create((set) => ({
  products: [],
  status: 'idle',
  error: null,
  cart: {
    items: [],
    note: '',
  },

  fetchProducts: async () => {
    const requestId = ++latestRequest
    set({ status: 'loading', error: null })

    try {
      const response = await fetch(
        new URL('../data/products.json', import.meta.url),
      )
      if (!response.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`)
      const products = await response.json()

      if (requestId !== latestRequest) return
      set({ products, status: 'success' })
    } catch (error) {
      if (requestId !== latestRequest) return
      set({ error: error.message, status: 'error' })
    }
  },

  addItem: (product) =>
    set((state) => {
      const exists = state.cart.items.some((item) => item.id === product.id)
      const items = exists
        ? state.cart.items.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...state.cart.items, { ...product, qty: 1 }]

      return { cart: { ...state.cart, items } }
    }),

  changeQty: (id, delta) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items
          .map((item) =>
            item.id === id ? { ...item, qty: item.qty + delta } : item,
          )
          .filter((item) => item.qty > 0),
      },
    })),

  removeItem: (id) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter((item) => item.id !== id),
      },
    })),

  setNote: (note) =>
    set((state) => ({
      cart: { ...state.cart, note },
    })),
}))
