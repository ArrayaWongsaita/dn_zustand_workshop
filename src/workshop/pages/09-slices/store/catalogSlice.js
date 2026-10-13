let latestRequest = 0

export const createCatalogSlice = (set) => ({
  products: [],
  status: 'idle',
  error: null,

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
})
