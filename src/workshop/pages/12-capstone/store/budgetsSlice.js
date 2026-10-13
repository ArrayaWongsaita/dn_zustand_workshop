export const createBudgetsSlice = (set) => ({
  budgets: {
    byCategory: {},
  },

  setBudget: (categoryId, amount) =>
    set(
      (state) => {
        state.budgets.byCategory[categoryId] = amount
      },
      undefined,
      'budgets/setBudget',
    ),
})
