# Page 12 — Capstone

- **Tier**: 3c
- **Status**: written — [Page briefs: Tier 3c (pages 11-12: shared store, capstone)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/12)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: โปรเจกต์ปิดท้าย

## Learning objective

No new API — the ladder's last *composition* step ([spec home, § Step types](../README.md#ladder)) and its only page the learner can fail without meeting a new idea. The learner builds a small app end to end from an empty folder, deciding the store's shape themselves: how many slices it splits into, what is fetched and what is persisted, which values are stored and which are derived, which surfaces share the store and which state stays in a component. It is **required**, not a bonus: the twelve-page ladder ends here, and it is the page where the traps of pages 4–11 all become available to make at once. It is also the longest page — the brief tells the learner to expect roughly two hours and that it does not have to be done in one sitting.

The domain is deliberately new. Pages 7–11 built a storefront; the capstone builds a **บันทึกรายจ่าย** (expense log), so nothing can be copied out of page 11's reveal — the learner re-derives the shape of a store for a domain they have not seen, using only concepts they already have.

Assumes pages 1–11. There is no new API, no new dependency (`immer`, `zustand` and the Redux DevTools extension are all installed by now), and no new failure mode — only the earlier ones, together.

## Goal behaviour

A one-screen expense log with two surfaces, a form, a filter and per-category budgets.

- A summary card at the top shows `ใช้ไป`, `งบทั้งหมด` and `คงเหลือ`, in baht. It is a component of its own that imports the bound store directly, like page 11's header, and its numbers move whenever an expense is added or removed.
- **งบประมาณตามหมวด**: one row per category — the category's name, `ใช้ไป N บาท`, an inline budget field, and `เหลือ N บาท` for that category. Typing a budget changes the row's remainder immediately and survives a reload.
- **เพิ่มรายจ่าย**: a form with an amount, a category chosen from the fetched list, and an optional note; submitting appends a row and clears the form. The form's draft values live in the component, not the store.
- **รายการรายจ่าย**: the entries, newest last, each showing its category, amount and note, each removable. A `ค้นหารายจ่าย` box filters this list by the category name or the note as the learner types; the summary card does not move when the filter changes, because the totals come from the store and not from what is on screen.
- The categories are fetched from `src/data/categories.json` on mount, with a loading state and a retry path when the fetch fails — the same shape as page 7. Entries and budgets persist; the category list does not, so a reload refetches it.
- With the Redux DevTools extension open, the store appears as `zustand-workshop-expense` and every action the learner performs has its own name — `categories/fetchStart`, `entries/addEntry`, `entries/removeEntry`, `budgets/setBudget`, and so on — never `anonymous`.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
สร้างแอปบันทึกรายจ่ายตั้งแต่ต้น: โหลดหมวดหมู่จากไฟล์ ตั้งงบให้แต่ละหมวด เพิ่มและลบรายจ่าย และมีช่องค้นหารายจ่าย โดยด้านบนสุดมีสรุปยอดใช้ไป งบทั้งหมด และงบคงเหลืออยู่ตลอดเวลา ใช้ทุกอย่างที่เรียนมาในเวิร์กช็อปให้ครบ ทั้งการแบ่ง store เป็นส่วน ๆ การโหลดข้อมูลแบบ async การเก็บลง localStorage การคำนวณยอดด้วย selector และ middleware สองตัว และให้ทุก action ที่กดมีชื่อของตัวเองใน Redux DevTools เขียนไฟล์: src/data/categories.json, src/store/categoriesSlice.js, src/store/entriesSlice.js, src/store/budgetsSlice.js, src/store/useBoundStore.js, src/components/SummaryCard.jsx และ src/App.jsx หน้านี้ใช้เวลาประมาณ 2 ชั่วโมง และทำแบ่งเป็นหลายรอบได้
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เพิ่มรายจ่ายด้วยจำนวนเงินและหมวดหมู่ แล้วรายการใหม่ขึ้นในลิสต์ และยอดใช้ไปบนการ์ดสรุปเพิ่มขึ้นตามจำนวนนั้น
ตั้งงบให้หมวดหนึ่ง แล้วยอดคงเหลือของหมวดนั้นลดลงตามที่จ่ายไปในหมวดนั้น
พิมพ์ค้นหาแล้วลิสต์สั้นลง แต่ยอดใช้ไปและงบทั้งหมดบนการ์ดสรุปยังเท่าเดิม
ลบรายจ่ายแล้วยอดใช้ไปและยอดคงเหลือกลับมาเท่าเดิม
รีเฟรชหน้าแล้วรายจ่ายและงบประมาณที่ตั้งไว้ยังอยู่ครบ แต่รายการหมวดหมู่ถูกโหลดขึ้นมาใหม่
เปิด Redux DevTools เห็น store ชื่อ zustand-workshop-expense และทุก action ที่กดมีชื่อของตัวเอง ไม่ใช่ anonymous
```

Criterion 3 is the page's sharpest check: it is satisfied only when the totals are derived from the store rather than computed over the filtered rows on screen ([page 5](05-derived-selectors.md)). Criterion 5 is `partialize` doing its job — entries and budgets survive, the fetched catalogue does not ([page 8](08-persist.md)). Criterion 6 needs the Redux DevTools extension and a development build, exactly as on [page 10](10-middleware.md). No criterion names a state field, an action or a selector: every one of them is something the learner presses, types or sees.

## Hints (Thai)

Four hints, in this order, all visible from the start:

```
แบ่ง store เป็นสามส่วนตามความสนใจ: หมวดหมู่ที่โหลดจากไฟล์ รายจ่าย และงบประมาณ แล้วประกอบทั้งสามส่วนเป็น store เดียวด้วย middleware เรียงแบบหน้า 10
การโหลดหมวดหมู่ต้องมีสถานะกำลังโหลดและข้อผิดพลาด พร้อมตัวกันคำตอบที่มาช้ากว่า และให้ persist เก็บเฉพาะรายจ่ายกับงบประมาณ
งบประมาณซ้อนอยู่ชั้นหนึ่ง ใช้ immer เขียนแก้ค่าได้ตรง ๆ เช่น state.budgets.byCategory[categoryId] = amount โดยไม่ต้อง return อะไร
ยอดใช้ไป งบทั้งหมด และยอดคงเหลือ คำนวณใน selector ระดับโมดูล ถ้าเลือกหลายค่าเป็น object เดียวให้ครอบด้วย useShallow
```

## Traps to document

The ladder gives this page no trap of its own: its callout is the **union of the earlier traps**, and its job is to name the families rather than repeat the pages. Four families cover the whole ladder — the shape of the data, the arithmetic, the reads, and the things that are not ready yet.

```
กับดัก: หน้านี้รวมกับดักของทุกหน้าไว้ด้วยกัน แบ่งเป็นสี่ตระกูล ความไม่เปลี่ยนรูปของ state ในแต่ละชั้นข้อมูล · ยอดรวมและค่าที่คำนวณได้ต้องคำนวณจาก store ไม่ใช่เก็บลง state · ค่าที่เป็น object ใหม่ทุกครั้งต้องผ่าน useShallow และ selector ต้องนิ่งอยู่ระดับโมดูล · งานที่ไม่พร้อมใช้ทันทีอย่างการโหลดข้อมูลและการเก็บลง localStorage ต้องมีสถานะ มีตัวกันคำตอบเก่า มี partialize และเรียง middleware ให้ devtools อยู่ชั้นนอกสุด
```

The four families, and where each was taught: **shape** — nesting is not merged for you ([page 4](04-shopping-cart.md), [page 10](10-middleware.md)); **arithmetic** — derive, never store ([page 5](05-derived-selectors.md)); **reads** — a selector returning a fresh object breaks `Object.is` ([page 6](06-selector-performance.md), [page 2](02-multi-counter.md)); **not-ready-yet** — async needs a status and a stale-response guard ([page 7](07-async-fetch.md)), persistence needs `partialize` ([page 8](08-persist.md)), middleware belongs on the bound store and `devtools` outermost ([page 9](09-slices.md), [page 10](10-middleware.md)). Page 12 may point back at all of them and must not re-teach any of them in the brief's own prose.

## Solution design

Files, in display order (all seven complete and runnable on their own in the learner's project, [learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/data/categories.json`
2. `src/store/categoriesSlice.js`
3. `src/store/entriesSlice.js`
4. `src/store/budgetsSlice.js`
5. `src/store/useBoundStore.js`
6. `src/components/SummaryCard.jsx`
7. `src/App.jsx`

All seven are new — the capstone reuses none of pages 7–11's files, which is why the labels differ from the storefront's. The two store-side conventions they keep are page 9's (a slice per concern, assembled by a bound store) and page 10's (one middleware stack on the bound store).

### The store

| Concern | Slice | State | Actions |
| --- | --- | --- | --- |
| The category list, fetched | `categoriesSlice.js` | `categories`, `status`, `error` | `fetchCategories` |
| The expense log, persisted | `entriesSlice.js` | `entries` | `addEntry`, `removeEntry` |
| The budgets, persisted | `budgetsSlice.js` | `budgets.byCategory` | `setBudget` |

- **Three slices, one bound store.** The split is by concern, and the page exists partly to show that page 9's rule survives a third slice: middleware is applied in `useBoundStore.js` only, never inside a slice.
- **`entries` is a flat list** (`{ id, categoryId, amount, note }`, `id` from a module-scope counter) — the shape the ladder taught on pages 3 and 4, and the one a list of rows wants.
- **`budgets` is nested on purpose.** `budgets: { byCategory: {} }` is the ladder's one remaining nested object after the storefront, and it is what makes `immer` worth having: `state.budgets.byCategory[categoryId] = amount` is the whole action, and it stays correct only because `immer`'s updater mutates and returns nothing ([page 10](10-middleware.md)). A learner who writes it by hand must spread two levels ([page 4](04-shopping-cart.md)).
- **`persist` keeps two of the three concerns.** `partialize: (state) => ({ entries: state.entries, budgets: state.budgets })`, so a reload refetches the categories and keeps the learner's own data ([page 8](08-persist.md)). The storage key is `zustand-workshop-expense`, and `devtools` labels the store `zustand-workshop-expense` too.
- **`fetchCategories` is page 7's action, renamed.** `status: 'idle' | 'loading' | 'success' | 'error'`, an error message in `error`, a module-scope `latestRequest` counter incremented before the first `await` and compared before every `set`, and a retry that is the same button calling the same action.

### The components

| Surface | File | What it reads | What it writes |
| --- | --- | --- | --- |
| Summary card | `src/components/SummaryCard.jsx` | `used` (Σ of `entries[].amount`) and `totalBudget` (Σ of `budgets.byCategory`) through **one object selector wrapped in `useShallow`**; `remaining` is subtraction in render | nothing |
| The app | `src/App.jsx` | `categories`, `status`, `error`, `entries`, `budgets` — plus the six actions | every action |

- **The summary card is a second surface, not a decoration.** It is the page-11 lesson in a new domain: it imports the bound store itself, receives no props, and its two numbers are the derived values the ladder taught on page 5. It selects them as one object with `useShallow` because that is the shape page 6 taught, and a bare object selector here is exactly the loop page 6 warns about.
- **The arithmetic lives in module-scope selectors.** `selectUsed`, `selectBudgetTotal` and the per-category sums are computed from store state on every read; nothing is copied into state. The per-category spend is a `reduce` over the selected `entries` during render, so no selector builds a fresh object per category.
- **The component state is the trap kept alive.** The search text and the three form fields are `useState` in `App.jsx`, per the page-11 rule; the filter is applied to `entries` during render and never reaches the store — which is what keeps criterion 3 true.
- **The demo is plain React with inline styles**, like every page's, because the displayed source is the learner's own file ([content-model.md](../content-model.md), § Solution code).

For the site-side suite ([learner-setup.md](../learner-setup.md), § Site-side test suite): one test per acceptance criterion, driving `<Demo />`, with `localStorage` cleared between cases. Criteria 1–5 are DOM and storage assertions, including the fetch (the page fetches a JSON path that resolves in this repository exactly as it does in the learner's project, as pages 7 and 10 already rely on). Criterion 6 needs the Redux DevTools extension and stays a manual step, as on page 10. A page is covered when every criterion has a test that fails if the behaviour stops holding; `npm test` green is part of *Assemble the workshop spec for handoff*'s definition of done ([#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13)).

## Solution code

### `src/data/categories.json`

```json
[
  { "id": "food", "name": "อาหาร" },
  { "id": "travel", "name": "เดินทาง" },
  { "id": "home", "name": "ของใช้ในบ้าน" }
]
```

### `src/store/categoriesSlice.js`

```js
let latestRequest = 0

export const createCategoriesSlice = (set) => ({
  categories: [],
  status: 'idle',
  error: null,

  fetchCategories: async () => {
    const requestId = ++latestRequest
    set({ status: 'loading', error: null }, undefined, 'categories/fetchStart')

    try {
      const response = await fetch(
        new URL('../data/categories.json', import.meta.url),
      )
      if (!response.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`)
      const categories = await response.json()

      if (requestId !== latestRequest) return
      set(
        { categories, status: 'success' },
        undefined,
        'categories/fetchSuccess',
      )
    } catch (error) {
      if (requestId !== latestRequest) return
      set(
        { error: error.message, status: 'error' },
        undefined,
        'categories/fetchError',
      )
    }
  },
})
```

### `src/store/entriesSlice.js`

```js
let nextId = 1

export const createEntriesSlice = (set) => ({
  entries: [],

  addEntry: (categoryId, amount, note) =>
    set(
      (state) => {
        state.entries.push({
          id: nextId++,
          categoryId,
          amount,
          note,
        })
      },
      undefined,
      'entries/addEntry',
    ),

  removeEntry: (id) =>
    set(
      (state) => {
        state.entries = state.entries.filter((entry) => entry.id !== id)
      },
      undefined,
      'entries/removeEntry',
    ),
})
```

### `src/store/budgetsSlice.js`

```js
export const createBudgetsSlice = (set) => ({
  budgets: {
    byCategory: {},
  },

  setBudget: (categoryId, amount) =>
    set(
      (state) => {
        state.budgets.byCategory[categoryId] = amount
      },
      undefined,
      'budgets/setBudget',
    ),
})
```

### `src/store/useBoundStore.js`

```js
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createBudgetsSlice } from './budgetsSlice.js'
import { createCategoriesSlice } from './categoriesSlice.js'
import { createEntriesSlice } from './entriesSlice.js'

export const useBoundStore = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createCategoriesSlice(...a),
        ...createEntriesSlice(...a),
        ...createBudgetsSlice(...a),
      })),
      {
        name: 'zustand-workshop-expense',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          entries: state.entries,
          budgets: state.budgets,
        }),
      },
    ),
    { name: 'zustand-workshop-expense' },
  ),
)
```

### `src/components/SummaryCard.jsx`

```jsx
import { useShallow } from 'zustand/react/shallow'

import { useBoundStore } from '../store/useBoundStore.js'

const selectUsed = (state) =>
  state.entries.reduce((sum, entry) => sum + entry.amount, 0)

const selectBudgetTotal = (state) =>
  Object.values(state.budgets.byCategory).reduce(
    (sum, amount) => sum + amount,
    0,
  )

const styles = {
  card: {
    display: 'flex',
    gap: '1rem',
    width: '22rem',
    padding: '0.75rem 1rem',
    border: '1px solid currentColor',
    borderRadius: '8px',
  },
  column: {
    flex: 1,
    display: 'grid',
    gap: '0.25rem',
  },
  label: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7,
  },
  value: {
    margin: 0,
    fontSize: '1.25rem',
  },
}

export default function SummaryCard() {
  const { used, budgetTotal } = useBoundStore(
    useShallow((state) => ({
      used: selectUsed(state),
      budgetTotal: selectBudgetTotal(state),
    })),
  )

  return (
    <div style={styles.card}>
      <div style={styles.column}>
        <p style={styles.label}>ใช้ไป</p>
        <p style={styles.value}>{used} บาท</p>
      </div>
      <div style={styles.column}>
        <p style={styles.label}>งบทั้งหมด</p>
        <p style={styles.value}>{budgetTotal} บาท</p>
      </div>
      <div style={styles.column}>
        <p style={styles.label}>คงเหลือ</p>
        <p style={styles.value}>{budgetTotal - used} บาท</p>
      </div>
    </div>
  )
}
```

### `src/App.jsx`

```jsx
import { useEffect, useState } from 'react'

import SummaryCard from './components/SummaryCard.jsx'
import { useBoundStore } from './store/useBoundStore.js'

const styles = {
  panel: {
    display: 'grid',
    gap: '0.75rem',
    width: '22rem',
  },
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
  input: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
  },
  list: {
    display: 'grid',
    gap: '0.5rem',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  detail: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7,
  },
}

export default function App() {
  const categories = useBoundStore((state) => state.categories)
  const status = useBoundStore((state) => state.status)
  const error = useBoundStore((state) => state.error)
  const fetchCategories = useBoundStore((state) => state.fetchCategories)
  const entries = useBoundStore((state) => state.entries)
  const addEntry = useBoundStore((state) => state.addEntry)
  const removeEntry = useBoundStore((state) => state.removeEntry)
  const budgets = useBoundStore((state) => state.budgets)
  const setBudget = useBoundStore((state) => state.setBudget)

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const nameOf = (id) =>
    categories.find((category) => category.id === id)?.name ?? id

  const spentByCategory = entries.reduce((totals, entry) => {
    totals[entry.categoryId] = (totals[entry.categoryId] ?? 0) + entry.amount
    return totals
  }, {})

  const visibleEntries = entries.filter((entry) =>
    `${nameOf(entry.categoryId)} ${entry.note}`.includes(query.trim()),
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = Number(amount)
    if (!categoryId || !Number.isFinite(value) || value <= 0) return

    addEntry(categoryId, value, note.trim())
    setAmount('')
    setNote('')
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
      <SummaryCard />

      <div style={styles.panel}>
        <div style={styles.row}>
          <h2 style={{ margin: 0, fontSize: '1rem', flex: 1 }}>
            งบประมาณตามหมวด
          </h2>

          <button type="button" style={styles.button} onClick={fetchCategories}>
            {status === 'error' ? 'ลองใหม่' : 'โหลดใหม่'}
          </button>
        </div>

        {status === 'error' ? (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <p style={{ margin: 0 }}>โหลดหมวดหมู่ไม่สำเร็จ</p>
            <p style={styles.detail}>{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <p style={{ margin: 0 }}>กำลังโหลดหมวดหมู่...</p>
        ) : (
          <ul style={styles.list}>
            {categories.map((category) => {
              const budget = budgets.byCategory[category.id] ?? 0
              const spent = spentByCategory[category.id] ?? 0

              return (
                <li key={category.id} style={styles.row}>
                  <span style={{ flex: 1 }}>
                    {category.name} · ใช้ไป {spent} บาท
                  </span>
                  <input
                    type="number"
                    style={{ ...styles.input, width: '5rem' }}
                    placeholder="งบ"
                    value={budget === 0 ? '' : budget}
                    onChange={(event) =>
                      setBudget(category.id, Number(event.target.value) || 0)
                    }
                  />
                  <span style={{ minWidth: '7rem', textAlign: 'right' }}>
                    เหลือ {budget - spent} บาท
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {status === 'loading' && categories.length > 0 ? (
          <p style={styles.detail}>กำลังโหลด...</p>
        ) : null}
      </div>

      <form style={styles.panel} onSubmit={handleSubmit}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>เพิ่มรายจ่าย</h2>

        <div style={styles.row}>
          <input
            type="number"
            style={styles.input}
            placeholder="จำนวนเงิน"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <select
            style={styles.input}
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">เลือกหมวด</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <input
          style={styles.input}
          placeholder="หมายเหตุ"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />

        <button type="submit" style={styles.button}>
          เพิ่มรายจ่าย
        </button>
      </form>

      <div style={styles.panel}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>รายการรายจ่าย</h2>

        <input
          type="search"
          style={styles.input}
          placeholder="ค้นหารายจ่าย"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {entries.length === 0 ? (
          <p style={{ margin: 0 }}>ยังไม่มีรายจ่าย</p>
        ) : visibleEntries.length === 0 ? (
          <p style={{ margin: 0 }}>ไม่พบรายจ่ายที่ค้นหา</p>
        ) : (
          <ul style={styles.list}>
            {visibleEntries.map((entry) => (
              <li key={entry.id} style={styles.row}>
                <span style={{ flex: 1 }}>
                  {nameOf(entry.categoryId)} · {entry.amount} บาท
                  {entry.note ? ` · ${entry.note}` : ''}
                </span>
                <button
                  type="button"
                  style={styles.button}
                  onClick={() => removeEntry(entry.id)}
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```
