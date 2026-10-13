# Page 07 — Async fetch

- **Tier**: 3a
- **Status**: written — [Page briefs: Tier 3a (pages 7-8: async fetch, persist)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/10)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: โหลดข้อมูลแบบ async

## Learning objective

The store's first **asynchronous action**, and the ladder's *new failure mode* ([spec home, § Step types](../README.md#ladder)). There is no new API: an async action is an ordinary `async` function in the store's initializer that calls `set` when its promise settles, and `set` after an `await` is fine because the store is a module singleton, not React state ([research, § 7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)).

What is new is what the learner *cannot see* without a status. The store passes through loading, success and error, and a page that renders only the data renders the wrong thing in two of them; so the page introduces an explicit `status` field, an `error`, and a retry. It also carries the ladder's async trap in full — an action with no status, out-of-order responses, and StrictMode's double-invoked Effect — and it moves the catalog out of the code into a file that is fetched.

The cart keeps its page-5 shape: `src/store/useCartStore.js` holds the same four cart actions, and the summary stays two module-scope selectors read one value at a time. Page 6's split components, render counters and `useShallow` are gone: they were that page's measurement device, not a pattern to carry forward.

Assumes pages 1–6. `persist` is page 8's subject and does not appear here.

## Goal behaviour

Page 5's cart, with its catalog fetched at mount instead of declared in the component.

- `src/data/products.json` is the catalog: the same three products pages 4–6 held as a module-scope const — กาแฟ 60, ชา 45, น้ำส้ม 55. Nothing in `src/App.jsx` declares them any more.
- On mount the page fetches that file. Until the response arrives the catalog area reads `กำลังโหลดสินค้า...`; after it, the three products render with their `เพิ่มลงตะกร้า` buttons.
- A `โหลดใหม่` button refetches at any time. While a refetch is in flight the products already on screen **stay visible**, with a small `กำลังโหลด...` line under them; the cart and its summary line are untouched.
- When the fetch fails the catalog area is replaced by `โหลดข้อมูลไม่สำเร็จ`, the error's own message in small type, and the button, now labelled `ลองใหม่`. Pressing it retries; bringing the connection back and pressing it restores the catalog.
- The cart is usable throughout: adding products, `−` / `+` / `ลบ`, the `หมายเหตุ` textarea, the empty-cart message `ยังไม่มีสินค้าในตะกร้า`, and the `รวม N ชิ้น · เป็นเงิน X บาท` line, which is still read through two module-scope selectors, one atomic value each.
- "Not loaded yet" is read from the store's status, never inferred from an empty list: the page distinguishes the four states on screen, and the learner can move through loading, success and error without editing code.
- In development StrictMode invokes the mount Effect twice, so the Network tab shows two requests for the JSON. That is expected React behaviour and is what hint 3 and the trap callout exist to explain.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
เปลี่ยนรายการสินค้าในหน้านี้ให้โหลดมาจากไฟล์ src/data/products.json ตอนเปิดหน้า ไม่ใช่ประกาศไว้ในโค้ด ระหว่างโหลดต้องเห็นข้อความบอกว่ากำลังโหลด แล้วจึงเห็นสินค้าสามรายการพร้อมราคา กด "โหลดใหม่" แล้วรายการต้องถูกโหลดมาใหม่อีกครั้งโดยที่ตะกร้าไม่หาย ถ้าโหลดไม่สำเร็จต้องมีข้อความบอกและปุ่มให้ลองใหม่ ไม่ใช่จอว่างหรือค้าง ตะกร้าและบรรทัดสรุปยอดยังทำงานเหมือนเดิม เขียนสามไฟล์: src/data/products.json, src/store/useCartStore.js และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เปิดหน้าแล้วเห็นข้อความกำลังโหลดก่อน แล้วจึงเห็นสินค้าสามรายการ: กาแฟ 60 บาท ชา 45 บาท น้ำส้ม 55 บาท
กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท
กด "โหลดใหม่" แล้วสินค้าถูกโหลดมาใหม่ และรายการในตะกร้ายังอยู่ครบพร้อมยอดเดิม
เปิด DevTools แท็บ Network แล้วเลือก Offline กด "โหลดใหม่" เห็นข้อความว่าโหลดไม่สำเร็จพร้อมปุ่มลองใหม่ กลับมาออนไลน์แล้วกดลองใหม่ สินค้ากลับมาแสดง
ใช้งานต่อได้ปกติ หน้าไม่ค้าง และ console ไม่มี error เรื่องการอัปเดตซ้ำ
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector ([learner-setup.md](../learner-setup.md), § How a page phrases its exercise). Criterion 1 asserts *the order* of the two screens, not how long loading lasts: the status is set before the first `await`, so at least one frame shows it, and with the file served locally that frame is brief. Criteria 3 and 4 are comfortably checkable, and the learner can hold the loading state still with the same DevTools network throttling criterion 4 already asks them to open.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
แยกสถานะการโหลดไว้ใน store เป็นค่าเดียว เช่น idle / loading / success / error แล้วให้หน้าจอแสดงตามสถานะนั้น ไม่ต้องเดาจากจำนวนสินค้า
อ่านไฟล์ด้วย fetch โดยอ้าง path จากตำแหน่งไฟล์ store เอง ผ่าน new URL("../data/products.json", import.meta.url) จะถูกต้องทั้งตอน dev และตอน build
ตอน dev โหมด StrictMode ของ React เรียก effect ซ้ำ จึงเห็นคำขอสองครั้งในแท็บ Network เป็นเรื่องปกติ ไม่ใช่บั๊ก
```

Hint 2 carries a code fragment, as page 1's hint does: the `new URL(…, import.meta.url)` form is the non-obvious half of the path and the answer to "where does the file live", not the page's lesson. It is also the only form that works in both projects: in the learner's Vite dev server the file is served at `/src/data/products.json`, and in a production build Vite inlines or emits it as an asset URL — `fetch` succeeds either way. A plain `fetch('/src/data/products.json')` works in dev and breaks in a build, so the hint exists to stop the learner guessing.

## Traps to document

The **async-failure** trap, in the three forms the ladder gives this page: an action with no status, out-of-order responses, and StrictMode's double-invoked Effect. All three are stated as things the learner can observe, and StrictMode is stated as *not* a bug so nobody "fixes" it:

```
กับดัก: ถ้าไม่เก็บสถานะการโหลดไว้ใน store จะแยกไม่ออกว่ากำลังโหลด ข้อมูลว่าง หรือโหลดพัง ต้องตั้งสถานะเป็น loading ก่อน await แรก และมีข้อความ error เมื่อโหลดพลาด อีกอย่างคือถ้ากด "โหลดใหม่" รัว ๆ คำตอบของคำขอเก่าที่กลับมาทีหลังจะทับคำขอใหม่ (โค้ดเฉลยกันด้วย request id แล้วทิ้งคำตอบที่ไม่ใช่คำขอล่าสุด) และตอน dev โหมด StrictMode เรียก effect ซ้ำทำให้เห็นคำขอสองครั้ง เป็นพฤติกรรมปกติของ React ไม่ใช่บั๊ก ไม่ต้องแก้
```

Page 7 is the only page that owns these three. It must not explain re-render cost, `Object.is` or `useShallow` (page 6's), and it must not mention persistence or `localStorage` (page 8's).

## Solution design

Files, in display order (all three complete and runnable on their own in the learner's project, [learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/data/products.json`
2. `src/store/useCartStore.js`
3. `src/App.jsx`

`src/data/products.json` is a file the learner writes: it holds the catalog that pages 4–6 kept in `App.jsx`, so the page has something real to fetch without an API key, without a network dependency, and with fixed content the criteria can assert. `src/data/` is the learner's own folder and the page folder mirrors it like any other path ([content-model.md](../content-model.md), § Source layout).

Store — page 5's cart, plus the fetched catalog and its status:

| Part | Shape |
| --- | --- |
| state | `products: []`, `status: 'idle'`, `error: null`, `cart: { items: [], note: '' }` |
| `fetchProducts()` | `async`: bump the request id, `set({ status: 'loading', error: null })` **before the first `await`**, `fetch` the JSON, `if (!response.ok) throw`, then `set({ products, status: 'success' })`; `catch` sets `{ error: error.message, status: 'error' }` |
| `addItem(product)` | unchanged from pages 4–6 |
| `changeQty(id, delta)` | unchanged |
| `removeItem(id)` | unchanged |
| `setNote(note)` | unchanged |

The request id is a module-scope `let latestRequest = 0`, not store state. The store is already a module singleton — the fact the ladder has relied on since page 1 — and the counter is a bookkeeping value the page never renders, so it does not belong in the state shape the learner is being taught to keep honest. Every `set` after an `await` is preceded by `if (requestId !== latestRequest) return`, which is what makes a stale response harmless without `AbortController`.

Component — one `App`, page 5's component plus the catalog block:

| Part | Shape |
| --- | --- |
| mount | `useEffect(() => { fetchProducts() }, [fetchProducts])` — store actions keep their identity for the life of the store, so the effect runs once per mount; in dev StrictMode mounts twice, hence two requests |
| reads | `products`, `status`, `error`, `fetchProducts`, the four cart actions, `items`, `note`, plus `useCartStore(selectCount)` and `useCartStore(selectTotal)` — one atomic value per selector |
| catalog | a heading row holding `รายการสินค้า` and the refresh button, labelled `โหลดใหม่` normally and `ลองใหม่` while the status is `error` |
| states | `error` → `โหลดข้อมูลไม่สำเร็จ` and the error message; empty product list → `กำลังโหลดสินค้า...`; otherwise the product rows; `loading` with products already on screen → a small `กำลังโหลด...` line |
| cart | page 5's markup, unchanged |

The error's message is shown in small type under the Thai sentence. It is the one English string the page puts on screen, and it is there for debugging: a learner who is offline should see *why*, not just that it failed. Nothing is styled with Tailwind, shadcn, or anything imported from this repository — the displayed string is the learner's own `src/App.jsx`.

For the site-side suite ([learner-setup.md](../learner-setup.md), § Site-side test suite): the demo fetches on mount, so each test stubs `fetch` (or the module's URL) to return the JSON, or rejects it for the error criterion. One test per acceptance criterion, driving `<Demo />`.

## Solution code

### `src/data/products.json`

```json
[
  { "id": "coffee", "name": "กาแฟ", "price": 60 },
  { "id": "tea", "name": "ชา", "price": 45 },
  { "id": "orange", "name": "น้ำส้ม", "price": 55 }
]
```

### `src/store/useCartStore.js`

```js
import { create } from 'zustand'

let latestRequest = 0

export const useCartStore = create((set) => ({
  products: [],
  status: 'idle',
  error: null,
  cart: {
    items: [],
    note: '',
  },

  fetchProducts: async () => {
    const requestId = ++latestRequest
    set({ status: 'loading', error: null })

    try {
      const response = await fetch(
        new URL('../data/products.json', import.meta.url),
      )
      if (!response.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`)
      const products = await response.json()

      if (requestId !== latestRequest) return
      set({ products, status: 'success' })
    } catch (error) {
      if (requestId !== latestRequest) return
      set({ error: error.message, status: 'error' })
    }
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
import { useEffect } from 'react'

import { useCartStore } from './store/useCartStore.js'

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
  const products = useCartStore((state) => state.products)
  const status = useCartStore((state) => state.status)
  const error = useCartStore((state) => state.error)
  const fetchProducts = useCartStore((state) => state.fetchProducts)
  const items = useCartStore((state) => state.cart.items)
  const note = useCartStore((state) => state.cart.note)
  const addItem = useCartStore((state) => state.addItem)
  const changeQty = useCartStore((state) => state.changeQty)
  const removeItem = useCartStore((state) => state.removeItem)
  const setNote = useCartStore((state) => state.setNote)
  const count = useCartStore(selectCount)
  const total = useCartStore(selectTotal)

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
```
