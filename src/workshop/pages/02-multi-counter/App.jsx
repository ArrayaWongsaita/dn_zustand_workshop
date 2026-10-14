import { useCountersStore } from './store/useCountersStore.js'

const button = {
  padding: '0.4rem 0.9rem',
  border: '1px solid currentColor',
  borderRadius: '6px',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
}

const row = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
}

function CounterA() {
  const countA = useCountersStore((state) => state.countA)
  const incrementA = useCountersStore((state) => state.incrementA)
  const decrementA = useCountersStore((state) => state.decrementA)

  return (
    <div style={row}>
      <span style={{ minWidth: '5rem' }}>ตัวนับ A</span>
      <button type="button" style={button} onClick={decrementA}>
        −
      </button>
      <span style={{ minWidth: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
        {countA}
      </span>
      <button type="button" style={button} onClick={incrementA}>
        +
      </button>
    </div>
  )
}

function CounterB() {
  const countB = useCountersStore((state) => state.countB)
  const incrementB = useCountersStore((state) => state.incrementB)
  const decrementB = useCountersStore((state) => state.decrementB)

  return (
    <div style={row}>
      <span style={{ minWidth: '5rem' }}>ตัวนับ B</span>
      <button type="button" style={button} onClick={decrementB}>
        −
      </button>
      <span style={{ minWidth: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
        {countB}
      </span>
      <button type="button" style={button} onClick={incrementB}>
        +
      </button>
    </div>
  )
}

export default function App() {
  const resetAll = useCountersStore((state) => state.resetAll)

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <CounterA />
      <CounterB />
      <button type="button" style={button} onClick={resetAll}>
        รีเซ็ตทั้งหมด
      </button>
    </div>
  )
}
