# Page 11 — Shared store

- **Tier**: 3c
- **Status**: written — [Page briefs: Tier 3c (pages 11-12: shared store, capstone)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/12)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: ใช้ store ร่วมกันทั้งแอป

## Learning objective

No new API. The page's *composition* step ([spec home, § Step types](../README.md#ladder)) is a change of **lifetime**: pages 1–10 gave each page a store of its own, and this page makes the store the app's — one module that two unrelated surfaces import and read directly. The learner learns that a store is a module-level singleton: any component can import it, everybody sees the same values, and nothing has to be lifted to a common parent, passed down as props, or put in a context provider. That is the whole answer to "why a store and not `useState`", and it is the reason the ladder has a page for it.

The page's second lesson is **scope**: a store is for state that more than one surface needs. It is not "the app's state bucket", and the page makes the boundary concrete by adding a catalogue search box whose text is used by exactly one component — so it stays in that component's `useState` while the cart lives in the store next to it. The trap this page owns is *making more than the one thing that needs it global*.

Assumes pages 1–10. Nothing new is taught about `create`, selectors, `persist`, `devtools`, `immer` or slices; every one of those appears here exactly as an earlier page left it.

## Goal behaviour

Page 10's app, re-cut so that one store feeds two surfaces at once.

- A bar across the top carries `ตะกร้า N ชิ้น · เป็นเงิน X บาท` and a `ล้างตะกร้า` button. It is the app's second surface: a component of its own that imports the bound store and reads it directly, receiving no props and sitting under no provider.
- Below the bar, page 10's catalogue and cart panels are unchanged except in two places:
  - the catalogue gains a `ค้นหาสินค้า` box that filters the product list by name as the learner types, and shows `ไม่พบสินค้าที่ค้นหา` when the filter matches nothing;
  - the cart panel loses its `รวม N ชิ้น · เป็นเงิน X บาท` line, because that summary now lives on the bar above.
- The two surfaces are visibly one store: adding a product from the body moves the numbers on the bar; `ล้างตะกร้า` on the bar empties the list in the body; a reload brings the cart back, because the `persist` options were not touched.
- Typing in the search box changes the catalogue and nothing else — the bar does not move, and with the Redux DevTools extension open no action appears while typing, because the text never reaches the store.
- The store itself is page 10's, plus **one** action: `clearCart`, the write the bar needs. Everything else — the two slices, the storage key, `partialize`, the request guard, the middleware order — is copied across untouched.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
แยกแอปของหน้านี้ให้มีสองส่วนที่ใช้ store เดียวกัน: แถบด้านบนที่แสดงจำนวนชิ้นกับยอดเงินในตะกร้าและมีปุ่มล้างตะกร้า และส่วนเนื้อหาด้านล่างที่มีแคตตาล็อกกับตะกร้าเหมือนเดิม ทั้งสองส่วนต้องอ่านและเขียน store ก้อนเดียวกันโดยไม่ส่งค่าผ่าน props และไม่ครอบด้วย provider เพิ่มช่องค้นหาสินค้าในแคตตาล็อก โดยเก็บข้อความที่พิมพ์ไว้ใน state ของคอมโพเนนต์ ไม่ต้องเก็บลง store เพราะมีแค่ส่วนนี้ที่ใช้ เขียนไฟล์: src/store/cartSlice.js, src/store/catalogSlice.js, src/store/useBoundStore.js, src/components/Header.jsx และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เพิ่มสินค้าลงตะกร้าแล้วจำนวนชิ้นและยอดเงินบนแถบด้านบนเปลี่ยนตามทันที
กดปุ่มล้างตะกร้าบนแถบด้านบนแล้วรายการในตะกร้าด้านล่างหายหมด และยอดบนแถบด้านบนกลับเป็น 0
พิมพ์คำค้นหาแล้วรายการสินค้าถูกกรอง แต่ยอดในตะกร้ายังเท่าเดิม
พิมพ์คำค้นหาแล้วไม่มี action ใหม่ขึ้นใน Redux DevTools
รีเฟรชหน้าแล้วตะกร้ายังอยู่ครบเหมือนก่อนแยกคอมโพเนนต์
```

Criterion 1 is one direction of the sharing and criterion 2 the other — read in one surface of a write made in the other. Criterion 3 shows the search text is not store state without naming any state field: the cart it does not touch is the evidence. Criterion 4 is the trap's own check and needs the Redux DevTools extension and `npm run dev`; a production build connects nothing ([research, § 10](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)). Criterion 5 confirms the split did not disturb page 8's `persist`.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
สร้าง src/components/Header.jsx แล้ว import useBoundStore เข้าไปใช้ในนั้นเลย ไม่ต้องรับค่าที่แชร์ผ่าน props หรือ context
เขียน selector สำหรับจำนวนชิ้นและยอดเงินไว้ระดับโมดูล แล้วให้แถบด้านบนอ่านค่าผ่าน selector เหล่านั้น
เก็บข้อความในช่องค้นหาด้วย useState ในคอมโพเนนต์ เพราะมีแค่แคตตาล็อกที่ใช้ ถ้าใส่ลง store ทุกตัวอักษรที่พิมพ์จะกลายเป็น action ใหม่ใน DevTools
```

## Traps to document

The trap the ladder gives this page: making more than the one thing that needs it global. It is observable, which is why the page carries a search box at all: the text is the obvious candidate for the store, and watching the DevTools timeline stay silent while typing is what shows it does not belong there.

```
กับดัก: อย่าเอาค่าที่มีคอมโพเนนต์เดียวใช้ขึ้นไปไว้ใน store กลาง store มีไว้ให้ค่าที่หลายส่วนของแอปต้องเห็นตรงกัน ถ้าคำค้นหาถูกเก็บใน store ทุกตัวอักษรที่พิมพ์จะสร้าง action ใหม่และทำให้ทุกส่วนที่อ่าน store วาดใหม่โดยไม่จำเป็น
```

The two strands of the trap: **scope** (a value one component owns stays in that component's `useState`; a store is not the app's state bucket) and **cost** (every store change notifies every subscriber, so a keystroke in the store re-renders the bar, the catalogue and the cart). Page 11 owns both and must not re-teach page 6: the problem here is not a selector returning a fresh value, it is a value that should never have been in the store. The page states the rule rather than demonstrating a broken build, and it never shows page 12's territory.

## Solution design

Files, in display order (all five complete and runnable on their own in the learner's project, [learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/store/cartSlice.js`
2. `src/store/catalogSlice.js`
3. `src/store/useBoundStore.js`
4. `src/components/Header.jsx`
5. `src/App.jsx`

What changes from page 10, file by file:

| File | Change from page 10 |
| --- | --- |
| `src/store/cartSlice.js` | gains one action, `clearCart`, named `'cart/clearCart'`; the other four actions are byte for byte |
| `src/store/catalogSlice.js` | none — byte for byte |
| `src/store/useBoundStore.js` | none — byte for byte (same two slices, same `devtools(persist(immer(…)))` order, same storage key, same `partialize`) |
| `src/components/Header.jsx` | new — the app's second surface; imports the bound store itself and defines the two selectors it reads |
| `src/App.jsx` | renders `<Header />` first, drops the `รวม N ชิ้น · เป็นเงิน X บาท` paragraph (it moved to the header) and gains the search box plus the filtered product list |

Why the page is shaped this way:

- **Two surfaces, one import.** `Header.jsx` and `App.jsx` both do `import { useBoundStore } from '…/useBoundStore.js'` and neither receives shared state as a prop. This is the page's whole point: the store is a module-level singleton, so there is nothing to thread between them. `src/components/` is the folder the brief fixes for the sibling components a page may add ([learner-setup.md](../learner-setup.md), § The learner's project).
- **The bar owns the summary.** Moving `รวม N ชิ้น · เป็นเงิน X บาท` out of the cart panel and onto the header is what makes the second surface earn its place: it is not decoration, it is the same two derived values the body used to render. `selectCount` and `selectTotal` are defined once, at module scope in `Header.jsx`, exactly as page 5 left them — no second definition appears anywhere.
- **`clearCart` is the page's only store change, and it is an action, not an API.** Page 10's cart slice has `addItem`, `changeQty` and `removeItem`, all of which need a product or an item id the header does not have; a header that can only read would demonstrate sharing in one direction only. One new action on an existing slice — `clearCart`, still written in `immer`'s mutate-and-return-nothing style and still named for DevTools — gives the header a write, and adds no new concept. Everything else in all three store files is untouched, so the page still reads as "the same store, a second consumer".
- **The search text is component state.** `const [query, setQuery] = useState('')` in `App.jsx`, and the product list is `products.filter((product) => product.name.includes(query.trim()))` computed during render. Nothing new is stored: the filtered list is derived, and the text is transient and used by one component.
- **The persistence story does not move.** `partialize` still keeps only the cart, and the storage key is unchanged, so a cart built in pages 8–10 is still in the browser after this page; the storage key keeping page 8's name is deliberate — the state it describes is the same state.

For the site-side suite ([learner-setup.md](../learner-setup.md), § Site-side test suite): one test per acceptance criterion, driving `<Demo />`, with `localStorage` cleared between cases. Criteria 1, 2, 3 and 5 are DOM and storage assertions; criterion 4 needs the Redux DevTools extension and stays a manual step in the brief, exactly as page 10's `devtools` criterion does. The site itself already renders a page's component tree, so mounting two surfaces is nothing new for the suite.

## Solution code

### `src/store/cartSlice.js`

Page 10's file plus `clearCart`; everything else is unchanged.

```js
export const createCartSlice = (set) => ({
  cart: {
    items: [],
    note: '',
  },

  addItem: (product) =>
    set(
      (state) => {
        const item = state.cart.items.find((entry) => entry.id === product.id)
        if (item) {
          item.qty += 1
        } else {
          state.cart.items.push({ ...product, qty: 1 })
        }
      },
      undefined,
      'cart/addItem',
    ),

  changeQty: (id, delta) =>
    set(
      (state) => {
        const item = state.cart.items.find((entry) => entry.id === id)
        if (item) {
          item.qty += delta
          if (item.qty <= 0) {
            state.cart.items = state.cart.items.filter(
              (entry) => entry.id !== id,
            )
          }
        }
      },
      undefined,
      'cart/changeQty',
    ),

  removeItem: (id) =>
    set(
      (state) => {
        state.cart.items = state.cart.items.filter((item) => item.id !== id)
      },
      undefined,
      'cart/removeItem',
    ),

  clearCart: () =>
    set(
      (state) => {
        state.cart.items = []
      },
      undefined,
      'cart/clearCart',
    ),

  setNote: (note) =>
    set(
      (state) => {
        state.cart.note = note
      },
      undefined,
      'cart/setNote',
    ),
})
```

### `src/store/catalogSlice.js`

Page 10's file, byte for byte.

```js
let latestRequest = 0

export const createCatalogSlice = (set) => ({
  products: [],
  status: 'idle',
  error: null,

  fetchProducts: async () => {
    const requestId = ++latestRequest
    set({ status: 'loading', error: null }, undefined, 'catalog/fetchStart')

    try {
      const response = await fetch(
        new URL('../data/products.json', import.meta.url),
      )
      if (!response.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`)
      const products = await response.json()

      if (requestId !== latestRequest) return
      set({ products, status: 'success' }, undefined, 'catalog/fetchSuccess')
    } catch (error) {
      if (requestId !== latestRequest) return
      set(
        { error: error.message, status: 'error' },
        undefined,
        'catalog/fetchError',
      )
    }
  },
})
```

### `src/store/useBoundStore.js`

Page 10's file, byte for byte — the store the two surfaces both import.

```js
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createCartSlice } from './cartSlice.js'
import { createCatalogSlice } from './catalogSlice.js'

export const useBoundStore = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createCartSlice(...a),
        ...createCatalogSlice(...a),
      })),
      {
        name: 'zustand-workshop-cart',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ cart: state.cart }),
      },
    ),
    { name: 'zustand-workshop-store' },
  ),
)
```

### `src/components/Header.jsx`

New. The second surface: it imports the store itself, reads two derived values and writes one action — no props, no provider.

```jsx
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
```

### `src/App.jsx`

Page 10's file with three edits: `<Header />` is rendered first, the cart summary paragraph is gone (it is on the header now), and the catalogue gains the search box and the filtered list.

```jsx
import { useEffect, useState } from 'react'

import Header from './components/Header.jsx'
import { useBoundStore } from './store/useBoundStore.js'

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
  input: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
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
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const visibleProducts = products.filter((product) =>
    product.name.includes(query.trim()),
  )

  return (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
      <Header />

      <div style={{ display: 'grid', gap: '0.75rem', width: '22rem' }}>
        <div style={styles.row}>
          <h2 style={{ margin: 0, fontSize: '1rem', flex: 1 }}>รายการสินค้า</h2>

          <button type="button" style={styles.button} onClick={fetchProducts}>
            {status === 'error' ? 'ลองใหม่' : 'โหลดใหม่'}
          </button>
        </div>

        <input
          type="search"
          style={styles.input}
          placeholder="ค้นหาสินค้า"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {status === 'error' ? (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <p style={{ margin: 0 }}>โหลดข้อมูลไม่สำเร็จ</p>
            <p style={styles.detail}>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <p style={{ margin: 0 }}>กำลังโหลดสินค้า...</p>
        ) : visibleProducts.length === 0 ? (
          <p style={{ margin: 0 }}>ไม่พบสินค้าที่ค้นหา</p>
        ) : (
          <ul style={styles.list}>
            {visibleProducts.map((product) => (
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
