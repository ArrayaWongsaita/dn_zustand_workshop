import { useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useCartStore } from './store/useCartStore.js'

const products = [
  { id: 'coffee', name: 'กาแฟ', price: 60 },
  { id: 'tea', name: 'ชา', price: 45 },
  { id: 'orange', name: 'น้ำส้ม', price: 55 },
]

const styles = {
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
  list: {
    display: 'grid',
    gap: '0.5rem',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    minWidth: '22rem',
  },
  note: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
  },
  block: {
    display: 'grid',
    gap: '0.75rem',
    width: '22rem',
  },
  counter: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.6,
  },
}

function useRenderCount() {
  const renders = useRef(0)
  renders.current += 1
  return renders.current
}

function ItemList() {
  const items = useCartStore((state) => state.cart.items)
  const addItem = useCartStore((state) => state.addItem)
  const changeQty = useCartStore((state) => state.changeQty)
  const removeItem = useCartStore((state) => state.removeItem)
  const renders = useRenderCount()

  return (
    <section style={styles.block}>
      <p style={styles.counter}>รายการสินค้า · render: {renders}</p>

      <ul style={styles.list}>
        {products.map((product) => (
          <li key={product.id} style={styles.row}>
            <span style={{ flex: 1 }}>
              {product.name} · {product.price} บาท
            </span>
            <button
              type="button"
              style={styles.button}
              onClick={() => addItem(product)}
            >
              เพิ่มลงตะกร้า
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p style={{ margin: 0 }}>ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <ul style={styles.list}>
          {items.map((item) => (
            <li key={item.id} style={styles.row}>
              <span style={{ flex: 1 }}>
                {item.name} · {item.price} บาท
              </span>
              <button
                type="button"
                style={styles.button}
                onClick={() => changeQty(item.id, -1)}
              >
                −
              </button>
              <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>
                {item.qty}
              </span>
              <button
                type="button"
                style={styles.button}
                onClick={() => changeQty(item.id, 1)}
              >
                +
              </button>
              <button
                type="button"
                style={styles.button}
                onClick={() => removeItem(item.id)}
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Summary() {
  const { count, total } = useCartStore(
    useShallow((state) => ({
      count: state.cart.items.reduce((sum, item) => sum + item.qty, 0),
      total: state.cart.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      ),
    })),
  )
  const renders = useRenderCount()

  return (
    <section style={styles.block}>
      <p style={styles.counter}>การ์ดสรุปยอด · render: {renders}</p>
      <p style={{ margin: 0 }}>
        รวม {count} ชิ้น · เป็นเงิน {total} บาท
      </p>
    </section>
  )
}

function NoteBox() {
  const note = useCartStore((state) => state.cart.note)
  const setNote = useCartStore((state) => state.setNote)
  const renders = useRenderCount()

  return (
    <label style={styles.block}>
      <span style={styles.counter}>หมายเหตุ · render: {renders}</span>
      <textarea
        style={styles.note}
        rows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
    </label>
  )
}

export default function App() {
  const renders = useRenderCount()

  return (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
      <p style={styles.counter}>App · render: {renders}</p>
      <ItemList />
      <Summary />
      <NoteBox />
    </div>
  )
}
