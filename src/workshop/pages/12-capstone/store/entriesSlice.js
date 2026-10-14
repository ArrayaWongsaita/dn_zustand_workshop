let nextId = 1

export const createEntriesSlice = (set) => ({
  entries: [],

  addEntry: (categoryId, amount, note) =>
    set(
      (state) => {
        state.entries.push({
          id: nextId++,
          categoryId,
          amount,
          note,
        })
      },
      undefined,
      'entries/addEntry',
    ),

  removeEntry: (id) =>
    set(
      (state) => {
        state.entries = state.entries.filter((entry) => entry.id !== id)
      },
      undefined,
      'entries/removeEntry',
    ),
})
