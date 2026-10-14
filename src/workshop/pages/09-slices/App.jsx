import { useEffect } from 'react'

import { useBoundStore } from './store/useBoundStore.js'

const selectCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0)

const selectTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)

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
  detail: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7,
  },
}

export default function App() {
  const products = useBoundStore((state) => state.products)
  const status = useBoundStore((state) => state.status)
  const error = useBoundStore((state) => state.error)
  const fetchProducts = useBoundStore((state) => state.fetchProducts)
  const items = useBoundStore((state) => state.cart.items)
  const note = useBoundStore((state) => state.cart.note)
  const addItem = useBoundStore((state) => state.addItem)
  const changeQty = useBoundStore((state) => state.changeQty)
  const removeItem = useBoundStore((state) => state.removeItem)
  const setNote = useBoundStore((state) => state.setNote)
  const count = useBoundStore(selectCount)
  const total = useBoundStore(selectTotal)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
      <div style={{ display: 'grid', gap: '0.75rem', width: '22rem' }}>
        <div style={styles.row}>
          <h2 style={{ margin: 0, fontSize: '1rem', flex: 1 }}>รายการสินค้า</h2>

          <button type="button" style={styles.button} onClick={fetchProducts}>
            {status === 'error' ? 'ลองใหม่' : 'โหลดใหม่'}
          </button>
        </div>

        {status === 'error' ? (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <p style={{ margin: 0 }}>โหลดข้อมูลไม่สำเร็จ</p>
            <p style={styles.detail}>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <p style={{ margin: 0 }}>กำลังโหลดสินค้า...</p>
        ) : (
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
        )}

        {status === 'loading' && products.length > 0 ? (
          <p style={styles.detail}>กำลังโหลด...</p>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', width: '22rem' }}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>ตะกร้าสินค้า</h2>

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

        <p style={{ margin: 0 }}>
          รวม {count} ชิ้น · เป็นเงิน {total} บาท
        </p>

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          หมายเหตุ
          <textarea
            style={styles.note}
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </div>
    </div>
  )
}
