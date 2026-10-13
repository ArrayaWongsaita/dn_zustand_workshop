# Page 09 — Slices

- **Tier**: 3b
- **Status**: written — [Page briefs: Tier 3b (pages 9-10: slices, middleware)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/11)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: แยก store ออกเป็นส่วน ๆ

## Learning objective

The **slices pattern**: splitting one store's state and actions across several creator functions and assembling them into a single **bound store**. No new API — every call here is a call the learner has already made — so this page's step type is *composition* ([spec home, § Step types](../README.md#ladder)): the difficulty is arranging what is already known, not meeting a new function. It is the tier 3a → 3b boundary made concrete: the store's *structure* scales, while its behaviour does not change.

Assumes pages 1–8. Page 8's store already holds two concerns that have nothing to do with each other — the fetched catalog and the persisted cart — and the page's own work is to give each its own file without changing a single state field, action, or component. Two facts shape the page. First, a slice is just a creator function `(set, get) => ({ … })` returning its own state and actions; the bound store spreads them into one object, so the store the app sees is the same object it saw on page 8. Second, **middleware belongs to the bound store, never to a slice** — `persist` stays exactly where page 8 put it, wrapped around the combined initializer, and the trap callout is why.

`src/store/catalogSlice.js` sits at the same `src/store/` depth page 8's store did, so `new URL('../data/products.json', import.meta.url)` still resolves to `src/data/products.json` and page 8's async code moves across unchanged. The module-scope `latestRequest` counter moves with it, still created once when its module loads.

## Goal behaviour

Page 8's app, re-cut so its store is assembled from two files.

- Same three surfaces as page 8: the catalog with its four states and refresh button, the cart rows with quantity controls and remove, and the `หมายเหตุ` textarea.
- The behaviour is page 8's, unchanged: adding and adjusting products, the `รวม N ชิ้น · เป็นเงิน X บาท` summary, the note, the cart surviving a reload, the catalog refetching, and the request-id guard against out-of-order responses.
- What changed is only the store's shape: `src/store/cartSlice.js` and `src/store/catalogSlice.js` each export one creator function, and `src/store/useBoundStore.js` spreads both into the store the app imports. `App.jsx` differs from page 8 only in the import path and the hook's name.
- `persist` still wraps the bound store and still partializes to the cart, so the stored value and the storage key are page 8's exactly.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
แยก store ของหน้านี้ที่รวมทุกอย่างไว้ในไฟล์เดียวออกเป็นสองส่วนตามหน้าที่ ส่วนของตะกร้าและส่วนของรายการสินค้า แล้วประกอบทั้งสองส่วนกลับเป็น store เดียวที่แอปใช้เหมือนเดิม โดย state และ action ข้างในห้ามเปลี่ยน พฤติกรรมของแอปต้องเหมือนหน้าเดิมทุกอย่าง รวมถึงตะกร้าที่อยู่ต่อหลังรีเฟรช เขียนไฟล์: src/data/products.json, src/store/cartSlice.js, src/store/catalogSlice.js, src/store/useBoundStore.js และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ
หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ (เห็นข้อความกำลังโหลดก่อน) ไม่ได้ถูกจำมาจากครั้งก่อน
store แยกเป็นสองไฟล์ src/store/cartSlice.js และ src/store/catalogSlice.js แล้วถูกประกอบกลับเป็น store เดียวที่ App.jsx ใช้
เปิด DevTools → Application → Local Storage เห็นคีย์ zustand-workshop-cart และข้อมูลที่เก็บเป็นของตะกร้าเท่านั้น
```

Criteria 1, 2 and 4 are page 8's behavioural checks, still true because the page changes no behaviour. Criterion 3 is the structural check this page exists for: it names the two slice **files**, which are instruction the brief already gives, and never names a state field, action, or selector of the learner's own ([learner-setup.md](../learner-setup.md), § How a page phrases its exercise). Criterion 4 is also what shows `partialize` still reaches into a slice: the persisted value is the cart and nothing else.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
แยก state กับ action ที่เกี่ยวกับตะกร้าไปไว้ไฟล์หนึ่ง และที่เกี่ยวกับรายการสินค้าไปอีกไฟล์หนึ่ง แต่ละไฟล์เขียนเป็นฟังก์ชันที่รับ (set, get) แล้วคืน state กับ action ของส่วนนั้น
ไฟล์ store รวมทำหน้าที่แค่เรียกฟังก์ชันของแต่ละส่วนมาประกอบกันเป็น store เดียว
middleware อย่าง persist ให้ครอบ store ที่ประกอบเสร็จแล้วเท่านั้น ห้ามใส่ไว้ใน slice แต่ละอัน
```

## Traps to document

The trap the ladder gives this page: applying middleware inside a slice instead of to the bound store.

```
กับดัก: ถ้าเอา middleware ไปใส่ไว้ใน slice แต่ละอันจะเกิดปัญหาที่คาดไม่ถึง เพราะ middleware ต้องครอบ store ที่ประกอบเสร็จแล้วเท่านั้น ให้แต่ละ slice เป็นแค่ฟังก์ชันที่คืน state กับ action ของตัวเอง แล้วเอา persist มาครอบ store รวมไว้ชั้นนอกสุด
```

The zustand guide is explicit — applying middleware inside individual slices "can lead to unexpected issues" — and its own example wraps the combined initializer: `create(persist((...a) => ({ ...createBearSlice(...a), ...createFishSlice(...a) }), { name }))` ([research, § 11](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)). Page 9 owns this trap and must not re-teach anything from pages 1–8: the async status, the request-id guard, StrictMode's double request, and the persist options already have their pages.

## Solution design

Files, in display order (all five complete and runnable on their own in the learner's project, [learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/data/products.json`
2. `src/store/cartSlice.js`
3. `src/store/catalogSlice.js`
4. `src/store/useBoundStore.js`
5. `src/App.jsx`

`src/data/products.json` is page 8's file byte for byte. `src/App.jsx` is page 8's file with two names changed — the import path `./store/useCartStore.js` → `./store/useBoundStore.js` and the hook `useCartStore` → `useBoundStore` — and nothing else. The brief still repeats all five files in full, because the learner builds their project from an empty folder and there is no diff to apply.

The split is by concern, not by size:

| File | Holds | Page 8 equivalent |
| --- | --- | --- |
| `src/store/cartSlice.js` | `cart` (`items`, `note`) and its four actions `addItem`, `changeQty`, `removeItem`, `setNote` | the cart half of page 8's store |
| `src/store/catalogSlice.js` | `products`, `status`, `error`, `fetchProducts`, and the module-scope `latestRequest` counter | the catalog half of page 8's store |
| `src/store/useBoundStore.js` | the assembly — `create(persist((...a) => ({ ...createCartSlice(...a), ...createCatalogSlice(...a) }), options))` — with page 8's `name`, `storage` and `partialize` | page 8's `create(persist(…))` wrapper |

What this produces, and why the page behaves as the goal behaviour says:

- Each creator takes `(set)` and returns a plain object; `useBoundStore.js` spreads them, so the bound store's state and actions are exactly page 8's, one property at a time. Nothing in either slice knows about the other, which is why no cross-slice `get()` is needed and none appears.
- `persist` wraps the *combined* initializer. A slice is a plain function with no middleware of its own; putting `persist` inside `cartSlice` instead would persist only that slice's `set` calls, which is the trap this page documents.
- `partialize` still selects `state.cart`, which now lives in `cartSlice` — a slice's state is just state on the bound store, so nothing about `persist` changes.
- `latestRequest` is module scope in `catalogSlice.js`, created once when the module loads, exactly as on page 7; the guard's meaning is unchanged.

For the site-side suite ([learner-setup.md](../learner-setup.md), § Site-side test suite): one test per acceptance criterion, driving `<Demo />`, with `localStorage` cleared between cases. Criterion 3 is a static check on the page's own file layout rather than a DOM interaction; the other three drive the demo as on page 8.

## Solution code

### `src/data/products.json`

Page 8's file, byte for byte.

```json
[
  { "id": "coffee", "name": "กาแฟ", "price": 60 },
  { "id": "tea", "name": "ชา", "price": 45 },
  { "id": "orange", "name": "น้ำส้ม", "price": 55 }
]
```

### `src/store/cartSlice.js`

```js
export const createCartSlice = (set) => ({
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
})
```

### `src/store/catalogSlice.js`

```js
let latestRequest = 0

export const createCatalogSlice = (set) => ({
  products: [],
  status: 'idle',
  error: null,

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
})
```

### `src/store/useBoundStore.js`

```js
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createCartSlice } from './cartSlice.js'
import { createCatalogSlice } from './catalogSlice.js'

export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createCatalogSlice(...a),
    }),
    {
      name: 'zustand-workshop-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
)
```

### `src/App.jsx`

Page 8's file, with only the store import path and the hook's name changed.

```jsx
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
```
