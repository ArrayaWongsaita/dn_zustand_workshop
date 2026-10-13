# Page 06 — Selector performance

- **Tier**: 2
- **Status**: written — [Page briefs: Tier 2 (pages 5-6: derived selector, selector performance)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/9)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: selector กับปัญหาการ render

## Learning objective

`useShallow` from `zustand/react/shallow` — the ladder's performance trap, and the payoff of page 2's atomic-selector rule.

The page makes the cost visible before it names a fix: every part of the page carries a **render counter**, so "this part was drawn again" becomes something the learner reads instead of infers. They then meet the failure the page exists for — a selector that returns a freshly built object never compares equal, because the comparison is `Object.is` on the selector's result, and in v5 that can repeat without end — and fix it one of two ways: go back to one selector per atomic value (page 2's rule), or wrap a selector that genuinely reads several values at once in `useShallow`. `useShallow` stabilizes the returned **reference** by shallow-comparing it with the previous one; it does not make the selector run less often and does not compare deeply.

Assumes pages 1–5.

## Goal behaviour

Page 5's cart, with the page split into four parts that each report their own render count.

- The store does not change: page 5's store, byte for byte, still with no `count` or `total` key.
- `src/App.jsx` holds four components in one file: `App`, `ItemList`, `Summary`, `NoteBox`.
- `ItemList` renders the three-product catalog with `เพิ่มลงตะกร้า` and the cart rows with `−` / `+` / `ลบ`; `Summary` renders the line `รวม N ชิ้น · เป็นเงิน X บาท`; `NoteBox` renders the `หมายเหตุ` textarea; `App` renders the page title line and the three parts.
- Each of the four shows its own counter, labelled `<part> · render: N`, so the four counts sit on screen at the same time.
- `Summary` reads its two values together in **one** selector that builds an object — the selection the trap is about.
- Behaviour the counters must show: typing in the note moves only `NoteBox`'s counter; adding a product or changing a quantity moves `ItemList` and `Summary`; `App`'s counter never moves after first paint, because `App` subscribes to nothing.
- The page stays usable: no repeating update, no console error.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
หน้าตะกร้าสินค้าเดิม เพิ่มตัวเลขการ render ของแต่ละส่วนไว้บนหน้าจอเพื่อให้เห็นว่าส่วนไหนถูกวาดใหม่ตอนไหน แบ่งหน้าจอเป็นสี่ส่วนคือ App รายการสินค้า (รวมปุ่มเพิ่มสินค้าและปุ่มปรับจำนวน) การ์ดสรุปยอด (บอกจำนวนชิ้นกับยอดเงินรวม) และช่องหมายเหตุ โดยพิมพ์ข้อความในช่องหมายเหตุแล้วตัวเลข render ของรายการสินค้ากับการ์ดสรุปยอดต้องไม่เพิ่มขึ้น กดปุ่มในตะกร้าแล้วตัวเลข render ของ App ต้องไม่เพิ่มขึ้น และการ์ดสรุปยอดต้องไม่ถูกวาดใหม่เมื่อค่าที่มันแสดงไม่ได้เปลี่ยน เขียนสองไฟล์: src/store/useCartStore.js (เหมือนหน้า 5) และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เปิดหน้าแล้วเห็นตัวเลข render ของทั้งสี่ส่วน และตัวเลขของ App ไม่เพิ่มขึ้นอีกหลังจากการวาดครั้งแรก
กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา ตัวเลข render ของรายการสินค้าและการ์ดสรุปยอดเพิ่มขึ้น แต่ของ App ไม่เพิ่ม และการ์ดสรุปยอดบอก 2 ชิ้น เป็นเงิน 105 บาท
กด + ที่กาแฟ หนึ่งครั้ง ตัวเลข render ของรายการสินค้าและการ์ดสรุปยอดเพิ่มขึ้น แต่ของหมายเหตุไม่เพิ่ม และการ์ดสรุปยอดบอก 3 ชิ้น เป็นเงิน 165 บาท
พิมพ์ข้อความในช่อง "หมายเหตุ" ตัวเลข render ของหมายเหตุเพิ่มขึ้น แต่ของรายการสินค้าและการ์ดสรุปยอดไม่เพิ่ม
ใช้งานต่อไปสักครู่แล้วหน้าไม่ค้าง และ console ไม่มี error เรื่องการอัปเดตซ้ำหรือ getSnapshot
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector ([learner-setup.md](../learner-setup.md), § How a page phrases its exercise). The counters are what make "which part re-rendered" observable: every criterion compares whether a counter **moved**, never the absolute number, because development mode renders twice (hint 3).

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
การ์ดสรุปยอดอ่านสองค่าพร้อมกันใน selector เดียว จึงต้องห่อ selector ด้วย useShallow จาก "zustand/react/shallow"
อีกทางหนึ่งคือแยกอ่านทีละค่าเป็น selector หลายตัวแล้วรวมผลในคอมโพเนนต์ ไม่ต้องใช้ useShallow เลย
ตัวเลข render ในโหมด development จะเป็นสองเท่าของจริง เพราะ React เรียก render ซ้ำเพื่อตรวจ bug ให้ดูว่าตัวเลขขยับหรือไม่ ไม่ต้องเทียบจำนวน
```

## Traps to document

The **fresh-reference** trap. The learner is likely to hit it while writing the summary selector, so the callout names the exact messages the browser shows.

```
กับดัก: selector ที่คืน object, array หรือฟังก์ชันที่สร้างใหม่ทุกครั้ง (เช่น { count, total }) จะถูกเทียบด้วย Object.is แล้วไม่เท่ากันเลย ทำให้คอมโพเนนต์ถูกวาดใหม่ทุกครั้งที่ store เปลี่ยน และใน v5 อาจวนซ้ำไม่จบจนขึ้น "Maximum update depth exceeded" หรือ "The result of getSnapshot should be cached to avoid an infinite loop" — แก้ด้วยการห่อ selector ด้วย useShallow หรือแยกอ่านทีละค่า
```

This is the page that explains the symptom page 2 stated the rule for; the atomic-selector rule itself was taught there and is not re-taught here. Page 6 must not explain StrictMode's double-invoked Effects or out-of-order async responses — page 7 owns those.

## Solution design

Files, in display order (both complete and runnable on their own in the learner's project):

1. `src/store/useCartStore.js`
2. `src/App.jsx`

Store — **page 5's file, byte for byte.** Unchanged, as on page 5.

| Part | Shape |
| --- | --- |
| state | `cart: { items: [], note: '' }` |
| `addItem(product)` | existing row → map and increment `qty`; otherwise append `{ ...product, qty: 1 }`; both write through `{ cart: { ...state.cart, items } }` |
| `changeQty(id, delta)` | map `qty + delta`, then drop rows that reached `0` |
| `removeItem(id)` | filter the row out |
| `setNote(note)` | `set((state) => ({ cart: { ...state.cart, note } }))` |

Component file — one `App.jsx` with a module-scope `useRenderCount` helper, a module-scope `products` const, one styles object, and four components:

| Component | Subscribes to | Counter |
| --- | --- | --- |
| `App` | nothing — it renders the three parts | its own; it never moves after first paint, which is the visible difference between "subscribes to nothing" and "subscribes to everything" |
| `ItemList` | `items`, `addItem`, `changeQty`, `removeItem` — four atomic selectors | moves when a row or quantity changes |
| `Summary` | **one** selector returning `{ count, total }`, wrapped in `useShallow` | moves only when count or total changes — typing the note leaves it alone |
| `NoteBox` | `note`, `setNote` — two atomic selectors | moves only when the note changes |

`Summary` is the page's point: it is page 5's two derivations selected **together**, an object built fresh on every read. `useShallow` compares that object one level deep (both values are numbers) and hands React the previous object when nothing changed, so no re-render happens. Without the wrapper, the object is new every time, `Object.is` fails, and React reports the repeating update the trap quotes. The store is not the problem and is not touched: the same two derivations expressed as two atomic selectors need no helper at all — that alternative is the second hint and the honest choice when the values are read independently.

`useRenderCount` is a debug device, not a pattern to generalize:

```js
function useRenderCount() {
  const renders = useRef(0)
  renders.current += 1
  return renders.current
}
```

It writes a ref during render, which React dissuades in application code; on this page it is the whole point (the counter must change on every render, including renders React throws away), so it is stated as a measurement device in the counter's own label rather than presented as something to reuse. In development mode React renders twice, so the number starts at 2 and steps by 2 — hint 3 says so, and every criterion only compares whether a counter moved.

Page 6 must not introduce a store field, a second store, or a second implementation of the cart: the only new import is `useShallow`, and the only new behaviour is the counters.

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
```
