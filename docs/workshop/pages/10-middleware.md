# Page 10 — Middleware

- **Tier**: 3b
- **Status**: written — [Page briefs: Tier 3b (pages 9-10: slices, middleware)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/11)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: ห่อ store ด้วย middleware

## Learning objective

Two middleware, `immer` and `devtools`, wrapped around page 9's bound store — the page's *new API* ([spec home, § Step types](../README.md#ladder)). `immer` changes how `set`'s updater is written: the updater receives a mutable draft and mutates it instead of returning a new partial object, which removes the spread-every-level noise pages 4, 5 and 8 have carried. `devtools` connects the store to the Redux DevTools browser extension, so every state change appears in its timeline under a name the learner chose. This page is where the ladder stops asking the learner to *write* immutably by hand and starts asking them to *see* what the store is doing.

Assumes pages 1–9. The page changes no behaviour, adds no state and adds no action: it wraps page 9's bound store and rewrites the four nested cart updaters. Two facts shape the page. First, **middleware order is part of the API** — `devtools` must be outermost, wrapping `immer`, or it cannot see the final `set` ([research, § 9](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)). Second, an `immer` updater **mutates and returns nothing**; mixing the two styles — mutating *and* returning a value — is the silent bug the trap callout exists to prevent.

`immer` is the first dependency the ladder adds after `zustand`: `npm install immer` ([research, § 9](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)). `devtools` needs no package — it reads `window.__REDUX_DEVTOOLS_EXTENSION__` directly, so the learner only needs the Redux DevTools browser extension — and it is enabled only outside a production build, which is why the acceptance check is done with `npm run dev` open.

## Goal behaviour

Page 9's app, with its store wrapped in `devtools` and `immer`.

- Same three surfaces and same behaviour as page 9: the catalog with its four states, the cart rows with quantity controls and remove, the `หมายเหตุ` textarea, the `รวม N ชิ้น · เป็นเงิน X บาท` summary, the cart surviving a reload, and the catalog refetching.
- The cart's four updaters are now written as direct mutations — `state.cart.items.push(…)`, `item.qty += 1`, `state.cart.note = note` — with no `{ ...state.cart }` spreads and no returned partial.
- With the Redux DevTools extension open, the store appears under the name `zustand-workshop-store`, and each interaction logs one named action — `cart/addItem`, `cart/changeQty`, `cart/removeItem`, `cart/setNote`, `catalog/fetchStart`, `catalog/fetchSuccess` / `catalog/fetchError` — instead of `anonymous`.
- Everything else is page 9 unchanged, including the storage key, the partialized cart, and the request-id guard.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
ห่อ store ที่ประกอบจากสองส่วนของหน้านี้ด้วย middleware สองตัว: devtools เพื่อดูทุก action ที่เปลี่ยน state ใน Redux DevTools และ immer เพื่อเขียนการอัปเดต state ที่ซ้อนกันให้สั้นลงโดยไม่ต้อง spread เอง โดย state และ action ยังทำหน้าที่เหมือนเดิมทุกอย่าง ก่อนเริ่มติดตั้ง immer ด้วย npm install immer เขียนไฟล์: src/data/products.json, src/store/cartSlice.js, src/store/catalogSlice.js, src/store/useBoundStore.js และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ
เปิด Redux DevTools เห็น store ชื่อ zustand-workshop-store และทุก action ที่กดมีชื่อของตัวเอง ไม่ใช่ anonymous
โค้ดอัปเดต state ของตะกร้าเขียนแบบแก้ค่าใน state ตรง ๆ ไม่มี spread ซ้อนหลายชั้น และผลลัพธ์ยังเหมือนเดิม
หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ ไม่ได้ถูกจำมาจากครั้งก่อน
```

Criterion 1 and 4 are page 9's behavioural checks, still true because the page changes no behaviour; criterion 4 is also what shows `partialize` survived the new middleware stack. Criterion 2 is the `devtools` check and names the store **name** the brief prints, which is configuration the learner is told to write, not a state field they invented. Criterion 3 is the `immer` check — an observable read of the learner's own code, never a state or action name. Criterion 2 requires the Redux DevTools extension and a development build; a production build connects nothing, so the criterion is run under `npm run dev` ([research, § 10](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)).

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
ติดตั้ง immer ด้วย npm install immer แล้วห่อ store รวมด้วย devtools และ immer โดยให้ devtools อยู่ชั้นนอกสุด
ใน slice ของตะกร้า เขียน set((state) => { ... }) แบบแก้ค่าใน state ได้เลย เช่น state.cart.items.push(...) หรือ state.cart.note = ... โดยไม่ต้อง return อะไร
ตั้งชื่อ action ด้วย argument ตัวที่สามของ set เช่น set(fn, undefined, 'cart/addItem') ถ้าไม่ตั้งชื่อ DevTools จะแสดงเป็น anonymous
```

## Traps to document

The two traps the ladder gives this page: an `immer` updater must mutate and return nothing, and `devtools` must wrap `immer`.

```
กับดัก: updater ของ immer ต้องแก้ค่าใน state แล้วไม่ return อะไร ถ้า return ค่าออกมาด้วยจะพังเงียบ ๆ อีกอย่างคือ devtools ต้องอยู่ชั้นนอกสุดและห่อ immer ไว้ ถ้าสลับลำดับจะมองไม่เห็น state ที่เปลี่ยนจริง
```

Both are the documented failure modes. The zustand reference shows the immer updater mutating and returning nothing, and warns that mixing the two is a bug; the middleware-order rule is that `devtools` goes last/outermost — `devtools(immer(…))`, not `immer(devtools(…))` — because `devtools` replaces `setState` and must see the final one ([research, §§ 9–10](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md)). Page 10 owns both and must not re-teach anything from pages 1–9: the nested-state spreading, the persist options and the async guard already have their pages.

## Solution design

Files, in display order (all five complete and runnable on their own in the learner's project, [learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/data/products.json`
2. `src/store/cartSlice.js`
3. `src/store/catalogSlice.js`
4. `src/store/useBoundStore.js`
5. `src/App.jsx`

What changes from page 9, file by file:

| File | Change from page 9 |
| --- | --- |
| `src/data/products.json` | none — byte for byte |
| `src/store/cartSlice.js` | the four cart actions are rewritten as `immer` updaters (mutate, return nothing) and each is named `'cart/<action>'` |
| `src/store/catalogSlice.js` | the three `set` calls gain action names (`'catalog/fetchStart'` / `'catalog/fetchSuccess'` / `'catalog/fetchError'`); the object form is unchanged |
| `src/store/useBoundStore.js` | the bound store is wrapped `devtools(persist(immer(…)))` and `devtools` is given `{ name: 'zustand-workshop-store' }` |
| `src/App.jsx` | none — byte for byte |

The middleware stack, outermost first:

| Layer | Why it sits here |
| --- | --- |
| `devtools(…, { name: 'zustand-workshop-store' })` | outermost, per the ordering rule: it replaces `setState` and must wrap everything that changes state, `immer` included. The `name` is the store's label in the extension. |
| `persist(…, options)` | unchanged from pages 8–9: page 9's `name`, `storage` and `partialize` are copied across untouched. |
| `immer(…a) => ({ … })` | innermost, wrapping the slice-spreading initializer, so every action's `set` receives a draft. |

What this produces, and why the page behaves as the goal behaviour says:

- `immer` replaces the updater contract: `set((state) => { … })` now receives a mutable draft, and returning a value while mutating is the bug. The four cart actions were chosen because they are the ladder's only nested updates — page 9's `addItem`, `changeQty`, `removeItem` and `setNote` each spread `cart` by hand, and each becomes a direct mutation.
- `catalogSlice.js` needs no rewrite. Its `set` calls pass a plain object, not a function, so `immer` passes them straight through; the only change is the third `set` argument that names the action for `devtools`.
- Action naming uses `set(updater, undefined, '<slice>/<action>')`: the second argument must be `undefined` so the replace flag is left alone. `catalog/fetchStart` and `catalog/fetchSuccess` / `catalog/fetchError` name the three points in `fetchProducts`, so a double-invoked Effect in StrictMode reads as two named fetches rather than two anonymous changes.
- The order is what makes `devtools` work at all: it passes its own `api.setState` down as the inner `set`, so the named calls from both slices reach the connection. Swapping `devtools` inward is the trap, and the page states the rule rather than demonstrating the broken build.
- `persist` is unaffected: `partialize` still sees the bound store's state, and `immer`'s produced state is what gets stored.

For the site-side suite ([learner-setup.md](../learner-setup.md), § Site-side test suite): one test per acceptance criterion, driving `<Demo />`, with `localStorage` cleared between cases. The `devtools` criterion cannot be asserted through the DOM without the extension; the suite asserts the behaviour (criterion 1, 3, 4) and the store's shape, and the extension check stays a manual step in the brief. The site itself must install `immer` when page 10's demo is built.

> **Correction to the research doc.** [research, § 10](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md) says `devtools` "requires `@redux-devtools/extension` for the browser integration". The v5.0.15 source (`src/middleware/devtools.ts`, mirrored in `node_modules/zustand/esm/middleware.mjs`) reads `window.__REDUX_DEVTOOLS_EXTENSION__` directly and imports no such package; only the browser extension is needed, and `npm install immer` is the sole added dependency. This brief supersedes that line.

## Solution code

### `src/data/products.json`

Page 9's file, byte for byte.

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

### `src/App.jsx`

Page 9's file, byte for byte — the middleware stack is invisible to the components.

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
