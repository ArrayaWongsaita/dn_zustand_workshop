import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cart: {
    items: [],
    note: '',
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
