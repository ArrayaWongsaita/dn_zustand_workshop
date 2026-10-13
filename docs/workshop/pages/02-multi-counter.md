# Page 02 — Multi counter

- **Tier**: 1
- **Status**: written — [Page briefs: Tier 1 (pages 1-4: counter, multi counter, todo, cart)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)

## Learning objective

The page-1 API over a harder shape: **several values in one store**. No new API. The learner must read each value with its own selector instead of pulling several values out together — the rule the ladder's performance trap (page 6) later explains the reason for. Assumes page 1 and nothing else.

## Goal behaviour

The page-1 counter, extended: two independent counters, A and B, in one store.

- Both start at `0`; each has its own `−` and `+`.
- The two counters never influence each other.
- One `รีเซ็ตทั้งหมด` button sets both back to `0` in a single action.
- `CounterA` and `CounterB` are separate components in the same `src/App.jsx`, each reading only its own value and its own two actions; `App` renders them and owns the reset button.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
สร้างตัวนับสองตัว (A และ B) ไว้ใน store เดียวกัน แต่ละตัวเริ่มที่ 0 และมีปุ่ม − กับ + ของตัวเอง สองตัวนี้ต้องไม่ขึ้นต่อกัน กดตัวหนึ่งแล้วอีกตัวต้องไม่เปลี่ยน และมีปุ่ม "รีเซ็ตทั้งหมด" ที่ตั้งทั้งสองตัวกลับเป็น 0 เขียนสองไฟล์: src/store/useCountersStore.js และ src/App.jsx โดยให้ตัวนับ A กับ B เป็นคนละคอมโพเนนต์ในไฟล์เดียวกัน
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เปิดหน้าแล้วเห็นตัวนับ A และ B เป็น 0 ทั้งคู่
กด + ของตัวนับ A แล้ว A เพิ่มขึ้น 1 และ B ยังเป็นค่าเดิม
กด − ของตัวนับ B แล้ว B ลดลง 1 และ A ยังเป็นค่าเดิม
กด "รีเซ็ตทั้งหมด" แล้วทั้ง A และ B กลับเป็น 0
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
เก็บสองค่าไว้ใน store เดียวกันได้ ตั้งชื่อให้ต่างกัน
อ่านค่าออกมาทีละค่าด้วย selector แยกกัน อย่าดึงหลายค่าออกมาพร้อมกันใน selector เดียว
set รวมค่าเดิมให้หนึ่งระดับ จึงส่งเฉพาะค่าที่เปลี่ยนกลับไปก็ได้
```

## Traps to document

The **atomic-selector** rule: one selector per value, never several values (or the whole state) at once.

```
กับดัก: ถ้าดึงหลายค่าออกจาก store พร้อมกันใน selector เดียว (หรือดึง state ทั้งก้อน) ทุกตัวนับจะอัปเดตพร้อมกันทุกครั้งที่ค่าใดค่าหนึ่งเปลี่ยน ให้อ่านทีละค่าด้วย selector แยกกัน
```

This is the one trap in the ladder whose symptom is **not** visible on the page: the extra work is a re-render, and page 6 is where the learner sees that cost and the failure it can become. Page 2 therefore states the rule and the demo *models* it — two components, one selector per value — while the criteria above check only that the two counters stay independent. Page 2 must not explain the page-6 symptom; each trap has exactly one owning page ([spec home, § Ladder](../README.md#ladder)).

## Solution design

Files, in display order (both complete and runnable on their own in the learner's project):

1. `src/store/useCountersStore.js`
2. `src/App.jsx`

Store — four flat values plus one action that writes two keys, so the learner sees `set` merge a partial into a shape with several fields:

| Part | Shape |
| --- | --- |
| state | `countA: 0`, `countB: 0` — flat, not nested: nesting is page 4 |
| `incrementA` / `decrementA` | `set((state) => ({ countA: state.countA ± 1 }))` |
| `incrementB` / `decrementB` | `set((state) => ({ countB: state.countB ± 1 }))` |
| `resetAll` | `set({ countA: 0, countB: 0 })` — one value-form `set` writing both keys |

Component: `src/App.jsx` holds three components. `CounterA` reads `countA`, `incrementA`, `decrementA` with three selectors; `CounterB` mirrors it for B; `App` reads only `resetAll` and renders `<CounterA />`, `<CounterB />`, and the reset button. A module-scope `button` style object is shared by all three. No Tailwind, no shadcn, no import from this repository.

The learner overwrites `src/App.jsx` from page 1 and adds a new store file. The old `src/store/useCounterStore.js` is no longer imported; the brief does not ask the learner to delete it, and a leftover file changes nothing.

## Solution code

### `src/store/useCountersStore.js`

```js
import { create } from 'zustand'

export const useCountersStore = create((set) => ({
  countA: 0,
  countB: 0,
  incrementA: () => set((state) => ({ countA: state.countA + 1 })),
  decrementA: () => set((state) => ({ countA: state.countA - 1 })),
  incrementB: () => set((state) => ({ countB: state.countB + 1 })),
  decrementB: () => set((state) => ({ countB: state.countB - 1 })),
  resetAll: () => set({ countA: 0, countB: 0 }),
}))
```

### `src/App.jsx`

```jsx
import { useCountersStore } from './store/useCountersStore.js'

const button = {
  padding: '0.4rem 0.9rem',
  border: '1px solid currentColor',
  borderRadius: '6px',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
}

const row = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
}

function CounterA() {
  const countA = useCountersStore((state) => state.countA)
  const incrementA = useCountersStore((state) => state.incrementA)
  const decrementA = useCountersStore((state) => state.decrementA)

  return (
    <div style={row}>
      <span style={{ minWidth: '5rem' }}>ตัวนับ A</span>
      <button type="button" style={button} onClick={decrementA}>
        −
      </button>
      <span style={{ minWidth: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
        {countA}
      </span>
      <button type="button" style={button} onClick={incrementA}>
        +
      </button>
    </div>
  )
}

function CounterB() {
  const countB = useCountersStore((state) => state.countB)
  const incrementB = useCountersStore((state) => state.incrementB)
  const decrementB = useCountersStore((state) => state.decrementB)

  return (
    <div style={row}>
      <span style={{ minWidth: '5rem' }}>ตัวนับ B</span>
      <button type="button" style={button} onClick={decrementB}>
        −
      </button>
      <span style={{ minWidth: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
        {countB}
      </span>
      <button type="button" style={button} onClick={incrementB}>
        +
      </button>
    </div>
  )
}

export default function App() {
  const resetAll = useCountersStore((state) => state.resetAll)

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <CounterA />
      <CounterB />
      <button type="button" style={button} onClick={resetAll}>
        รีเซ็ตทั้งหมด
      </button>
    </div>
  )
}
```
