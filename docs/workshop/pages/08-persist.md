# Page 08 — Persist

- **Tier**: 3a
- **Status**: written — [Page briefs: Tier 3a (pages 7-8: async fetch, persist)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/10)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: จำตะกร้าไว้ในเครื่อง

## Learning objective

`persist` and `createJSONStorage` from `zustand/middleware`, wrapped around the store page 7 already built. The learner's state has so far lived only as long as the module; a reload re-creates the store and everything in it is gone. `persist` is the first thing on the ladder that changes a store's **lifetime**, which is the tier 3a → 3b boundary in miniature ([spec home, § Tier boundaries](../README.md#ladder)).

Two facts shape the page. First, the middleware takes the *existing* store recipe and adds a storage layer around it: no state, action, or component changes, so the page's own work is a wrapper and one option. Second, v5 no longer writes the initial state at store creation, so a reload of an untouched page shows nothing in storage — the failure look the trap callout exists to prevent. Keeping transient values out of storage is the second half of the same lesson, done with `partialize`.

Assumes pages 1–7. `version` / `migrate` are deliberately not taught (spec home, § Deliberately not in the ladder) — a single-sitting workshop has no schema history to migrate.

## Goal behaviour

Page 7's page, with the cart outliving the store module.

- `src/data/products.json`, `src/store/useCartStore.js` and `src/App.jsx` are page 7's three files; only the store gains anything — the middleware and its options.
- Add products and type a note, then reload: the cart rows, their quantities and the note are all still there, and the `รวม N ชิ้น · เป็นเงิน X บาท` line agrees with them on the first paint. Closing the tab and opening the page again is the same as a reload.
- The catalog still comes from the network: after a reload it is fetched again, `กำลังโหลดสินค้า...` shows, then the three products return. Only the cart survives; the fetched catalog, the status and any error do not.
- On a page that has never been touched, storage holds nothing at all: the key appears the first time cart state changes. Reloading before that first change is not a bug, and the trap callout says so before the learner can conclude otherwise.
- What is stored is the cart and nothing else. The stored JSON's `state` holds the cart; the loading status and the error message are not in it.
- Everything else is page 7 unchanged: the refresh and retry button, the four catalog states, the cart actions, the summary selectors, and StrictMode's double request in development.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
ทำให้ตะกร้าของหน้านี้อยู่ต่อหลังรีเฟรชหน้า ทั้งรายการสินค้าในตะกร้าและข้อความหมายเหตุ ส่วนรายการสินค้าที่โหลดมาจากไฟล์ต้องโหลดใหม่ทุกครั้งที่เปิดหน้า ปิดแท็บแล้วเปิดใหม่หรือรีเฟรช ตะกร้าต้องยังอยู่ครบเหมือนเดิม โดยไม่ต้องแก้ state หรือ action ข้างใน store เขียนสามไฟล์: src/data/products.json, src/store/useCartStore.js และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ
ปิดแท็บแล้วเปิดหน้าใหม่ ตะกร้ายังอยู่
หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ (เห็นข้อความกำลังโหลดก่อน) ไม่ได้ถูกจำมาจากครั้งก่อน
เปิด DevTools → Application → Local Storage เห็นคีย์ zustand-workshop-cart และข้อมูลที่เก็บเป็นของตะกร้าเท่านั้น
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector ([learner-setup.md](../learner-setup.md), § How a page phrases its exercise). Criterion 4 names the storage **key**, which the brief's trap callout also prints, and describes what is stored as "the cart" — a fact about the learner's own app, not the name of a field they invented; it never says `status`, `error` or `products`. Criterion 3 is what makes `partialize` visible from inside the app: a page that stored everything would come back with its catalog already on screen, and the fetched catalog staying fetched is the difference.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
ใช้ middleware persist จาก "zustand/middleware" ห่อ store ที่มีอยู่ ไม่ต้องแก้ state หรือ action ข้างใน
เลือกได้ว่าจะเก็บอะไรลงเครื่องด้วย partialize — ที่ต้องอยู่หลังรีเฟรชคือตะกร้า ไม่ใช่รายการสินค้าที่โหลดมาใหม่หรือสถานะการโหลด
เพิ่งเปิดหน้าแล้วยังไม่เห็นคีย์ใน DevTools (Application → Local Storage) เป็นเรื่องปกติของ v5 เพราะจะเขียนก็ต่อเมื่อมีการเปลี่ยนแปลงครั้งแรก
```

## Traps to document

The two **persist** traps the ladder gives this page: v5 writes no initial state at store creation, and state that should not outlive the session gets persisted anyway.

```
กับดัก: ตั้งแต่ v5 เป็นต้นมา persist จะยังไม่เขียนข้อมูลลงเครื่องตอนสร้าง store — คีย์จะโผล่ใน DevTools ก็ต่อเมื่อ state เปลี่ยนครั้งแรก ถ้าเปิดหน้าใหม่แล้วไม่เห็นคีย์ อย่าคิดว่าเขียนผิด อีกอย่างคืออย่าเก็บทุกอย่างลงเครื่อง ของชั่วคราวอย่างสถานะการโหลดหรือข้อความ error ไม่ควรถูกจำไว้ ใช้ partialize เลือกเก็บเฉพาะตะกร้า
```

Page 8 owns both, and it must not re-teach anything from page 7: the double-invoked Effect, the request-id guard and the four catalog states already have their page. `version` / `migrate` are not this page's traps and are not mentioned on it.

## Solution design

Files, in display order (all three complete and runnable on their own in the learner's project, [learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/data/products.json`
2. `src/store/useCartStore.js`
3. `src/App.jsx`

`src/data/products.json` and `src/App.jsx` are **page 7's files, byte for byte.** This page changes exactly one file, and the learner is meant to notice that: persistence is a wrapper around a store, not a rewrite of it. The brief still repeats all three files in full, because the learner builds their project from an empty folder and there is no diff to apply ([learner-setup.md](../learner-setup.md), § The learner's project).

Store — page 7's store, wrapped:

| Part | Shape |
| --- | --- |
| wrapper | `create(persist((set) => ({ … }), options))` — the initializer and every action inside are page 7's, untouched |
| `name` | `'zustand-workshop-cart'` — the storage key, and the string criterion 4 names |
| `storage` | `createJSONStorage(() => localStorage)`. This is `persist`'s default, written out on purpose: it is the option that answers "where does the data go", and the lazy getter is why it takes a function. |
| `partialize` | `(state) => ({ cart: state.cart })` — the cart, and nothing else |

What this produces, and why the page behaves as the goal behaviour says:

- The stored value is `{ state: { cart: { items, note } }, version: 0 }` ([research, § 8](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)); `version` defaults to `0` and no `migrate` is given, which is fine because nothing is versioned yet.
- Rehydration merges **shallowly** into the current state, so the restored `cart` lands in a store whose `products`, `status` and `error` are at their initial values. That is why the page still fetches on mount and still shows its loading state after a reload, with the cart already populated.
- With `localStorage` the hydration is **synchronous** and happens at store creation, so the first render already shows the restored cart; `hasHydrated` / `onFinishHydration` are for async storages and do not appear here.
- v5 writes nothing at creation: the key appears on the first `set` that changes the partialized state. Reading an empty store on a fresh page is correct behaviour and the callout says so.
- `createJSONStorage` does no validation of what it reads back ([research, § 8](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)); nothing in this workshop edits storage by hand, so the page does not guard it.

For the site-side suite ([learner-setup.md](../learner-setup.md), § Site-side test suite): one test per acceptance criterion, driving `<Demo />`, with `localStorage` cleared between cases so a previous test's cart cannot satisfy the next one's reload.

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
import { createJSONStorage, persist } from 'zustand/middleware'

let latestRequest = 0

export const useCartStore = create(
  persist(
    (set) => ({
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

Page 7's file, byte for byte — the point of the page.

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
