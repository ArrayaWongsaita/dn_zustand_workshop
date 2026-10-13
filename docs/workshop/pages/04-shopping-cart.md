# Page 04 — Shopping cart

- **Tier**: 1
- **Status**: written — [Page briefs: Tier 1 (pages 1-4: counter, multi counter, todo, cart)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)

## Learning objective

A **nested** store shape. No new API: the difficulty is that `set` shallow-merges only the top level, so a value living inside a nested object has to be written by spreading every level down to it. Reads take a path through the nested object. Assumes pages 1–3.

## Goal behaviour

A cart over a fixed three-product catalog.

- The catalog is a module-scope `products` array in `src/App.jsx`: `กาแฟ` 60, `ชา` 45, `น้ำส้ม` 55. Each has a `เพิ่มลงตะกร้า` button.
- The store holds one nested object, `cart`, with two fields: `items` (an array of `{ id, name, price, qty }`) and `note` (a string).
- `เพิ่มลงตะกร้า` adds the product with `qty: 1`; adding a product already in the cart raises its `qty` instead of adding a row.
- In the cart, `−` and `+` change that row's quantity; `−` at 1 removes the row. `ลบ` removes the row outright.
- Below the cart is a `หมายเหตุ` textarea bound to `cart.note`. The empty cart shows `ยังไม่มีสินค้าในตะกร้า`.
- **No total and no line total.** The first value derived from store state in the ladder belongs to page 5; page 4 shows each item's unit price only. Nothing on this page multiplies or sums.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
สร้างตะกร้าสินค้า มีสินค้าให้เลือก 3 อย่าง คือ กาแฟ 60 บาท ชา 45 บาท และน้ำส้ม 55 บาท กด "เพิ่มลงตะกร้า" แล้วสินค้าเข้าไปอยู่ในตะกร้า ถ้าเพิ่มสินค้าเดิมซ้ำให้จำนวนของรายการนั้นเพิ่มขึ้น ไม่ใช่เพิ่มบรรทัดใหม่ ในตะกร้าปรับจำนวนด้วยปุ่ม − และ + (ลดจนเหลือ 0 แล้วรายการนั้นหายไป) และกด "ลบ" เพื่อเอาออกได้ ท้ายตะกร้ามีช่อง "หมายเหตุ" ที่พิมพ์ข้อความได้ เขียนสองไฟล์: src/store/useCartStore.js (เก็บตะกร้าทั้งก้อนและคำสั่งทั้งหมด) และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
กด "เพิ่มลงตะกร้า" ที่สินค้าหนึ่ง สินค้านั้นปรากฏในตะกร้าด้วยจำนวน 1
กด "เพิ่มลงตะกร้า" ที่สินค้าเดิมอีกครั้ง จำนวนของรายการนั้นเพิ่มขึ้น และไม่มีบรรทัดใหม่เกิดขึ้น
ปุ่ม − และ + เปลี่ยนจำนวนเฉพาะรายการนั้น และลดจนเหลือ 0 แล้วรายการนั้นหายไป
กด "ลบ" ของรายการหนึ่ง รายการนั้นหายไปจากตะกร้า
พิมพ์ข้อความในช่อง "หมายเหตุ" แล้วข้อความยังอยู่ และรายการสินค้าในตะกร้ายังอยู่ครบ
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector. The last one is the page's trap, stated as something the learner can see: forgetting to spread the cart while writing the note wipes the items.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
เก็บทั้งตะกร้าไว้ใน object เดียว เช่น { items, note } แล้วอ่านออกมาทีละค่าด้วย selector
set รวมค่าเดิมให้แค่ระดับบนสุด การแก้ค่าที่อยู่ใน object ซ้อนต้อง spread object นั้นด้วยทุกครั้ง ไม่งั้นค่าอื่นใน object จะหาย
เพิ่ม แก้ หรือลบรายการ ต้องสร้าง array ใหม่และสร้าง object ของรายการใหม่ด้วย อย่าแก้ของเดิม
```

## Traps to document

The nested-merge trap. The symptom is dramatic and visible: the item list empties or the page throws.

```
กับดัก: set รวมค่าเดิมให้แค่ระดับบนสุด ถ้าแก้ค่าที่อยู่ใน object ซ้อนโดยไม่ spread object เดิม ค่าอื่นที่อยู่ใน object นั้นจะหายไปทั้งก้อน เช่น พิมพ์หมายเหตุแล้วรายการสินค้าหายหมด — ต้อง spread ทุกระดับ
```

## Solution design

Files, in display order (both complete and runnable on their own in the learner's project):

1. `src/store/useCartStore.js`
2. `src/App.jsx`

Store — one nested object with **two** fields, so a partial `set` that forgets to spread it visibly loses data:

| Part | Shape |
| --- | --- |
| state | `cart: { items: [], note: '' }` |
| `addItem(product)` | if the product is already in `items`, map and increment its `qty`; otherwise append `{ ...product, qty: 1 }`. Either way, write `{ cart: { ...state.cart, items } }` |
| `changeQty(id, delta)` | map the item and add `delta` to its `qty`, then filter out any row whose `qty` reached `0`; write through `{ cart: { ...state.cart, items } }` |
| `removeItem(id)` | filter the row out; write through `{ cart: { ...state.cart, items } }` |
| `setNote(note)` | `set((state) => ({ cart: { ...state.cart, note } }))` — the smallest place the trap shows: drop the spread and `items` disappears |

Component: one `App`. It reads `items` with `(state) => state.cart.items` and `note` with `(state) => state.cart.note` — a path through the nested object, each with its own selector — plus `addItem`, `changeQty`, `removeItem`, and `setNote`. The catalog is a module-scope const in this file, not store state and not a separate data file: page 4 is about the nested update, not project layout. Rows are rendered with `key={item.id}`; the note is a `<textarea rows={2}>` wrapped in a `<label>`. Module-scope inline-style objects only; no Tailwind, no shadcn, no import from this repository.

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
