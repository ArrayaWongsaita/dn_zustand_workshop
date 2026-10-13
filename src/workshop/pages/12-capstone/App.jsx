import { useEffect, useState } from 'react'

import SummaryCard from './components/SummaryCard.jsx'
import { useBoundStore } from './store/useBoundStore.js'

const styles = {
  panel: {
    display: 'grid',
    gap: '0.75rem',
    width: '22rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  button: {
    padding: '0.4rem 0.9rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
  },
  list: {
    display: 'grid',
    gap: '0.5rem',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  detail: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7,
  },
}

export default function App() {
  const categories = useBoundStore((state) => state.categories)
  const status = useBoundStore((state) => state.status)
  const error = useBoundStore((state) => state.error)
  const fetchCategories = useBoundStore((state) => state.fetchCategories)
  const entries = useBoundStore((state) => state.entries)
  const addEntry = useBoundStore((state) => state.addEntry)
  const removeEntry = useBoundStore((state) => state.removeEntry)
  const budgets = useBoundStore((state) => state.budgets)
  const setBudget = useBoundStore((state) => state.setBudget)

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const nameOf = (id) =>
    categories.find((category) => category.id === id)?.name ?? id

  const spentByCategory = entries.reduce((totals, entry) => {
    totals[entry.categoryId] = (totals[entry.categoryId] ?? 0) + entry.amount
    return totals
  }, {})

  const visibleEntries = entries.filter((entry) =>
    `${nameOf(entry.categoryId)} ${entry.note}`.includes(query.trim()),
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = Number(amount)
    if (!categoryId || !Number.isFinite(value) || value <= 0) return

    addEntry(categoryId, value, note.trim())
    setAmount('')
    setNote('')
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
      <SummaryCard />

      <div style={styles.panel}>
        <div style={styles.row}>
          <h2 style={{ margin: 0, fontSize: '1rem', flex: 1 }}>
            งบประมาณตามหมวด
          </h2>

          <button type="button" style={styles.button} onClick={fetchCategories}>
            {status === 'error' ? 'ลองใหม่' : 'โหลดใหม่'}
          </button>
        </div>

        {status === 'error' ? (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <p style={{ margin: 0 }}>โหลดหมวดหมู่ไม่สำเร็จ</p>
            <p style={styles.detail}>{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <p style={{ margin: 0 }}>กำลังโหลดหมวดหมู่...</p>
        ) : (
          <ul style={styles.list}>
            {categories.map((category) => {
              const budget = budgets.byCategory[category.id] ?? 0
              const spent = spentByCategory[category.id] ?? 0

              return (
                <li key={category.id} style={styles.row}>
                  <span style={{ flex: 1 }}>
                    {category.name} · ใช้ไป {spent} บาท
                  </span>
                  <input
                    type="number"
                    style={{ ...styles.input, width: '5rem' }}
                    placeholder="งบ"
                    value={budget === 0 ? '' : budget}
                    onChange={(event) =>
                      setBudget(category.id, Number(event.target.value) || 0)
                    }
                  />
                  <span style={{ minWidth: '7rem', textAlign: 'right' }}>
                    เหลือ {budget - spent} บาท
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {status === 'loading' && categories.length > 0 ? (
          <p style={styles.detail}>กำลังโหลด...</p>
        ) : null}
      </div>

      <form style={styles.panel} onSubmit={handleSubmit}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>เพิ่มรายจ่าย</h2>

        <div style={styles.row}>
          <input
            type="number"
            style={styles.input}
            placeholder="จำนวนเงิน"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <select
            style={styles.input}
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">เลือกหมวด</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <input
          style={styles.input}
          placeholder="หมายเหตุ"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />

        <button type="submit" style={styles.button}>
          เพิ่มรายจ่าย
        </button>
      </form>

      <div style={styles.panel}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>รายการรายจ่าย</h2>

        <input
          type="search"
          style={styles.input}
          placeholder="ค้นหารายจ่าย"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {entries.length === 0 ? (
          <p style={{ margin: 0 }}>ยังไม่มีรายจ่าย</p>
        ) : visibleEntries.length === 0 ? (
          <p style={{ margin: 0 }}>ไม่พบรายจ่ายที่ค้นหา</p>
        ) : (
          <ul style={styles.list}>
            {visibleEntries.map((entry) => (
              <li key={entry.id} style={styles.row}>
                <span style={{ flex: 1 }}>
                  {nameOf(entry.categoryId)} · {entry.amount} บาท
                  {entry.note ? ` · ${entry.note}` : ''}
                </span>
                <button
                  type="button"
                  style={styles.button}
                  onClick={() => removeEntry(entry.id)}
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
