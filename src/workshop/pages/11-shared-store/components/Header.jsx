import { useBoundStore } from '../store/useBoundStore.js'

const selectCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0)

const selectTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '22rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid currentColor',
  },
  button: {
    padding: '0.4rem 0.9rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  },
}

export default function Header() {
  const count = useBoundStore(selectCount)
  const total = useBoundStore(selectTotal)
  const clearCart = useBoundStore((state) => state.clearCart)

  return (
    <div style={styles.bar}>
      <span style={{ flex: 1 }}>
        ตะกร้า {count} ชิ้น · เป็นเงิน {total} บาท
      </span>
      <button type="button" style={styles.button} onClick={clearCart}>
        ล้างตะกร้า
      </button>
    </div>
  )
}
