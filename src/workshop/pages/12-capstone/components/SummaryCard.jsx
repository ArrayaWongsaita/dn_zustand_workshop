import { useShallow } from 'zustand/react/shallow'

import { useBoundStore } from '../store/useBoundStore.js'

const selectUsed = (state) =>
  state.entries.reduce((sum, entry) => sum + entry.amount, 0)

const selectBudgetTotal = (state) =>
  Object.values(state.budgets.byCategory).reduce(
    (sum, amount) => sum + amount,
    0,
  )

const styles = {
  card: {
    display: 'flex',
    gap: '1rem',
    width: '22rem',
    padding: '0.75rem 1rem',
    border: '1px solid currentColor',
    borderRadius: '8px',
  },
  column: {
    flex: 1,
    display: 'grid',
    gap: '0.25rem',
  },
  label: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7,
  },
  value: {
    margin: 0,
    fontSize: '1.25rem',
  },
}

export default function SummaryCard() {
  const { used, budgetTotal } = useBoundStore(
    useShallow((state) => ({
      used: selectUsed(state),
      budgetTotal: selectBudgetTotal(state),
    })),
  )

  return (
    <div style={styles.card}>
      <div style={styles.column}>
        <p style={styles.label}>ใช้ไป</p>
        <p style={styles.value}>{used} บาท</p>
      </div>
      <div style={styles.column}>
        <p style={styles.label}>งบทั้งหมด</p>
        <p style={styles.value}>{budgetTotal} บาท</p>
      </div>
      <div style={styles.column}>
        <p style={styles.label}>คงเหลือ</p>
        <p style={styles.value}>{budgetTotal - used} บาท</p>
      </div>
    </div>
  )
}
