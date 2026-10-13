let latestRequest = 0

export const createCategoriesSlice = (set) => ({
  categories: [],
  status: 'idle',
  error: null,

  fetchCategories: async () => {
    const requestId = ++latestRequest
    set({ status: 'loading', error: null }, undefined, 'categories/fetchStart')

    try {
      const response = await fetch(
        new URL('../data/categories.json', import.meta.url),
      )
      if (!response.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`)
      const categories = await response.json()

      if (requestId !== latestRequest) return
      set(
        { categories, status: 'success' },
        undefined,
        'categories/fetchSuccess',
      )
    } catch (error) {
      if (requestId !== latestRequest) return
      set(
        { error: error.message, status: 'error' },
        undefined,
        'categories/fetchError',
      )
    }
  },
})
