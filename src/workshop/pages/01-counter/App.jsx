import { useCounterStore } from './store/useCounterStore.js'

const button = {
  padding: '0.4rem 0.9rem',
  border: '1px solid currentColor',
  borderRadius: '6px',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
}

export default function App() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <p style={{ fontSize: '2rem', margin: 0 }}>{count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" style={button} onClick={decrement}>
          ลด
        </button>
        <button type="button" style={button} onClick={increment}>
          เพิ่ม
        </button>
        <button type="button" style={button} onClick={reset}>
          รีเซ็ต
        </button>
      </div>
    </div>
  )
}
