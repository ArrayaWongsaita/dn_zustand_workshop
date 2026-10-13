export const createCartSlice = (set) => ({
  cart: {
    items: [],
    note: '',
  },

  addItem: (product) =>
    set(
      (state) => {
        const item = state.cart.items.find((entry) => entry.id === product.id)
        if (item) {
          item.qty += 1
        } else {
          state.cart.items.push({ ...product, qty: 1 })
        }
      },
      undefined,
      'cart/addItem',
    ),

  changeQty: (id, delta) =>
    set(
      (state) => {
        const item = state.cart.items.find((entry) => entry.id === id)
        if (item) {
          item.qty += delta
          if (item.qty <= 0) {
            state.cart.items = state.cart.items.filter(
              (entry) => entry.id !== id,
            )
          }
        }
      },
      undefined,
      'cart/changeQty',
    ),

  removeItem: (id) =>
    set(
      (state) => {
        state.cart.items = state.cart.items.filter((item) => item.id !== id)
      },
      undefined,
      'cart/removeItem',
    ),

  setNote: (note) =>
    set(
      (state) => {
        state.cart.note = note
      },
      undefined,
      'cart/setNote',
    ),
})
