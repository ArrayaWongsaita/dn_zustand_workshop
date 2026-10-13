# Page 05 — Derived & memoized selector

- **Tier**: 2
- **Status**: written — [Page briefs: Tier 2 (pages 5-6: derived selector, selector performance)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/9)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)

## Learning objective

The first value **derived** from store state: a total and a count computed inside a selector instead of kept in the store. No new API — the difficulty is arranging what the learner already knows (*composition*, [spec home, § Step types](../README.md#ladder)).

The page keeps page 4's store **exactly as it is** and changes only how the component reads it. That is the lesson made concrete: there is no store code to edit, because a derived value has no place in the store. Each derivation is defined once at module scope as an ordinary function (`const selectTotal = (state) => …`) and passed to the hook, so the same function body is reused by every render instead of being written inline.

Assumes pages 1–4.

**What "memoized" means here, and what it does not.** zustand does not memoize a selector: the selector runs again on every store notification, and the read is React's, not the store's. The page title keeps the ladder's wording, and the brief uses it in its only honest sense — the derived value is *read through a selector defined once* rather than stored and kept in sync. No `useMemo` appears: both values are cheap numbers. The cost of a selector that returns a fresh reference, and `useShallow`, are page 6's subject and are not taught here.

## Goal behaviour

Page 4's cart, whole, plus one derived summary line.

- Everything from page 4 stays: the three-product catalog with `เพิ่มลงตะกร้า`, the cart rows with `−` / `+` / `ลบ`, the `หมายเหตุ` textarea, the empty-cart message `ยังไม่มีสินค้าในตะกร้า`.
- Under the cart rows, above the note field, one summary line: `รวม N ชิ้น · เป็นเงิน X บาท`.
- `N` is the sum of every row's `qty`; `X` is the sum of `price × qty` over every row.
- On an empty cart the line reads `รวม 0 ชิ้น · เป็นเงิน 0 บาท`.
- The line follows every change immediately — adding, changing a quantity, and removing a row all move it.
- Nothing on the page stores the summary: the store is page 4's store, byte for byte, with no `count` or `total` key.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
หน้าตะกร้าสินค้าเดิม เพิ่มบรรทัดสรุปใต้รายการสินค้า บอกจำนวนชิ้นรวมกับยอดเงินรวมของทั้งตะกร้า (ยอดเงินรวมคือราคาสินค้าคูณจำนวนของทุกรายการ) ตัวเลขนี้ต้องตรงกับตะกร้าเสมอ ทั้งตอนเพิ่มสินค้า เปลี่ยนจำนวน และลบรายการ และต้องไม่เปลี่ยนตอนพิมพ์หมายเหตุ เขียนสองไฟล์: src/store/useCartStore.js (เหมือนหน้า 4) และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เปิดหน้าแล้วบรรทัดสรุปบอก 0 ชิ้น เป็นเงิน 0 บาท
กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท
กด + ที่กาแฟ หนึ่งครั้ง บรรทัดสรุปบอก 3 ชิ้น เป็นเงิน 165 บาท
กด − ที่กาแฟจนรายการหายไป บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท
พิมพ์ข้อความในช่อง "หมายเหตุ" แล้วบรรทัดสรุปยังเป็นตัวเลขเดิม
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector ([learner-setup.md](../learner-setup.md), § How a page phrases its exercise). The brief states the end result — the summary stays correct — and never says where the value may live; that rule is the trap below.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
ยอดรวมไม่ใช่ค่าที่เก็บไว้ใน store แต่คำนวณจาก items ทุกครั้งที่อ่าน
นิยาม selector ไว้นอกคอมโพเนนต์เป็นฟังก์ชันธรรมดา เช่น const selectTotal = (state) => ... แล้วส่งเข้า hook ได้เลย
อ่านทีละค่าด้วย selector แยกกัน (จำนวนชิ้น กับ ยอดเงิน) อย่าดึงหลายค่าออกมาพร้อมกันใน selector เดียว
```

## Traps to document

The **stored-derived-state** trap. Unlike page 2's rule, its symptom is visible when it happens — the summary goes stale — but the page does not rig a demo to produce it; the callout states the rule and the demo models the right shape.

```
กับดัก: ค่าที่คำนวณได้จาก state (เช่น ยอดรวม) ไม่ควรถูกเก็บเป็นอีกค่าหนึ่งใน store เพราะจะกลายเป็นข้อมูลสองชุดที่ต้องคอยอัปเดตให้ตรงกันเอง พลาดคำสั่งใดคำสั่งหนึ่งแล้วยอดรวมจะค้างอยู่ค่าเก่าทั้งที่ตะกร้าเปลี่ยนไปแล้ว ให้คำนวณจาก items ใน selector ทุกครั้งที่อ่าน
```

Page 5 must not explain re-render cost, `Object.is`, or `useShallow`: each trap has exactly one owning page, and that one is page 6 ([spec home, § Ladder](../README.md#ladder)).

## Solution design

Files, in display order (both complete and runnable on their own in the learner's project):

1. `src/store/useCartStore.js`
2. `src/App.jsx`

Store — **page 4's file, byte for byte.** Nothing is added: no `count`, no `total`. The one point of a *composition* step made visible.

| Part | Shape |
| --- | --- |
| state | `cart: { items: [], note: '' }` |
| `addItem(product)` | existing row → map and increment `qty`; otherwise append `{ ...product, qty: 1 }`; both write through `{ cart: { ...state.cart, items } }` |
| `changeQty(id, delta)` | map `qty + delta`, then drop rows that reached `0` |
| `removeItem(id)` | filter the row out |
| `setNote(note)` | `set((state) => ({ cart: { ...state.cart, note } }))` |

Component: one `App`, page 4's component plus two module-scope selector functions and the summary line. The catalog stays a module-scope const in this file.

| Part | Shape |
| --- | --- |
| `selectCount` | `(state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0)` |
| `selectTotal` | `(state) => state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)` |
| reads | `items`, `note`, and the four actions as before, plus `useCartStore(selectCount)` and `useCartStore(selectTotal)` — one atomic value per selector |
| summary | a `<p>` under the cart rows: `รวม {count} ชิ้น · เป็นเงิน {total} บาท` |

The summary is rendered from the two hook reads, never from a local variable computed at mount, so it is recomputed from the store on every render. Module-scope inline-style objects only; no Tailwind, no shadcn, no import from this repository.

## Solution code

### `src/store/useCartStore.js`

```js
import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cart: {
    items: [],
    note: '',
  },

  addItem: (product) =>
    set((state) => {
      const exists = state.cart.items.some((item) => item.id === product.id)
      const items = exists
        ? state.cart.items.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...state.cart.items, { ...product, qty: 1 }]

      return { cart: { ...state.cart, items } }
    }),

  changeQty: (id, delta) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items
          .map((item) =>
            item.id === id ? { ...item, qty: item.qty + delta } : item,
          )
          .filter((item) => item.qty > 0),
      },
    })),

  removeItem: (id) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter((item) => item.id !== id),
      },
    })),

  setNote: (note) =>
    set((state) => ({
      cart: { ...state.cart, note },
    })),
}))
```

### `src/App.jsx`

```jsx
import { useCartStore } from './store/useCartStore.js'

const products = [
  { id: 'coffee', name: 'กาแฟ', price: 60 },
  { id: 'tea', name: 'ชา', price: 45 },
  { id: 'orange', name: 'น้ำส้ม', price: 55 },
]

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
}

export default function App() {
  const items = useCartStore((state) => state.cart.items)
  const note = useCartStore((state) => state.cart.note)
  const addItem = useCartStore((state) => state.addItem)
  const changeQty = useCartStore((state) => state.changeQty)
  const removeItem = useCartStore((state) => state.removeItem)
  const setNote = useCartStore((state) => state.setNote)
  const count = useCartStore(selectCount)
  const total = useCartStore(selectTotal)

  return (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
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
```
