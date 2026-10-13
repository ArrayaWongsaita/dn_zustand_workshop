import { useState } from 'react'
import { useTodoStore } from './store/useTodoStore.js'

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  input: {
    padding: '0.4rem 0.6rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
  },
  button: {
    padding: '0.4rem 0.9rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  },
  list: {
    display: 'grid',
    gap: '0.5rem',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    minWidth: '22rem',
  },
}

export default function App() {
  const [draft, setDraft] = useState('')
  const todos = useTodoStore((state) => state.todos)
  const add = useTodoStore((state) => state.add)
  const toggleDone = useTodoStore((state) => state.toggleDone)
  const remove = useTodoStore((state) => state.remove)

  function handleSubmit(event) {
    event.preventDefault()
    const text = draft.trim()
    if (text === '') return
    add(text)
    setDraft('')
  }

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <form onSubmit={handleSubmit} style={styles.row}>
        <input
          style={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="งานที่ต้องทำ"
        />
        <button type="submit" style={styles.button}>
          เพิ่ม
        </button>
      </form>

      {todos.length === 0 ? (
        <p style={{ margin: 0 }}>ยังไม่มีรายการ</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.row}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.done ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </span>
              <button
                type="button"
                style={styles.button}
                onClick={() => remove(todo.id)}
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
