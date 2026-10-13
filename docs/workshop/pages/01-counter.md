# Page 01 — Counter

- **Tier**: 1
- **Status**: written — [Page briefs: Tier 1 (pages 1-4: counter, multi counter, todo, cart)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)

## Learning objective

The first Zustand store. The learner meets `create` from `zustand` as a **named** import (v5 has no default export), gets back a hook that reads the store, pulls a single value out of it with a selector, and changes it through an action built on `set`, relying on `set`'s one-level shallow merge.

Assumed already known: the Vite project from the start-here page, React function components, `useState`, and event handlers. No other Zustand API appears here. This page owns the ladder's **named-import** trap.

## Goal behaviour

One integer counter starting at `0`, owned by the store.

- The number on screen is read from the store; `useState` never holds it.
- `เพิ่ม` adds 1, `ลด` subtracts 1, `รีเซ็ต` sets it back to `0`.
- No component split: `App` reads `count` and each of the three actions with its own selector.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
สร้างตัวนับตัวแรกด้วย Zustand เขียน src/store/useCounterStore.js ให้เก็บค่าตัวนับพร้อมคำสั่ง เพิ่ม ลด และรีเซ็ต และเขียน src/App.jsx ให้แสดงตัวเลขกับปุ่มทั้งสาม โดยตัวเลขบนหน้าจอต้องมาจาก store ไม่ใช่ useState — เปิดหน้าแล้วต้องเห็น 0 กด "เพิ่ม" แล้วเพิ่มทีละ 1 กด "ลด" แล้วลดทีละ 1 กด "รีเซ็ต" แล้วกลับเป็น 0
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เปิดหน้าแล้วเห็นเลข 0
กด "เพิ่ม" แล้วตัวเลขเพิ่มขึ้น 1
กด "ลด" แล้วตัวเลขลดลง 1
กด "รีเซ็ต" แล้วตัวเลขกลับเป็น 0
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector ([learner-setup.md](../learner-setup.md), § How a page phrases its exercise).

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
v5 ไม่มี default export — ต้องใช้ import { create } from "zustand"
เก็บตัวนับไว้ใน store แล้วอ่านออกมาทีละค่าด้วย selector
set รวมค่าเดิมให้หนึ่งระดับ จึงส่งเฉพาะค่าที่เปลี่ยนก็ได้
```

## Traps to document

The named-import trap. The symptom (the app throws at import time) is visible immediately, so it is stated as something the learner can observe:

```
กับดัก: Zustand v5 ไม่มี default export — เขียน import create from "zustand" แล้วจะพังตั้งแต่ตอน import ต้องใช้ import { create } from "zustand"
```

## Solution design

Files, in display order. Both are complete and runnable on their own in the learner's project ([learner-setup.md](../learner-setup.md), § The learner's project):

1. `src/store/useCounterStore.js`
2. `src/App.jsx`

Store:

| Part | Shape |
| --- | --- |
| state | `count: 0` |
| `increment` | `set((state) => ({ count: state.count + 1 }))` — updater form, because the next value depends on the previous one |
| `decrement` | `set((state) => ({ count: state.count - 1 }))` |
| `reset` | `set({ count: 0 })` — value form; `set` shallow-merges it into the existing state |

Component: a single `App`. `count` is read with `(state) => state.count`; each action with its own selector. Three `<button type="button">` elements labelled `ลด`, `เพิ่ม`, `รีเซ็ต`, styled with a module-scope `button` object of inline styles. No Tailwind, no shadcn, no import from this repository — the displayed string is the learner's own `src/App.jsx` ([content-model.md](../content-model.md), § Solution code).

The prototype at `src/workshop/pages/01-counter/` already implements this behaviour. The build session keeps the behaviour and the code, and **drops the `PROTOTYPE NOTE` comments** from `App.jsx` and `index.js`: they are scaffolding, and the displayed string must be the learner's file, not this repository's commentary.

## Solution code

### `src/store/useCounterStore.js`

```js
import { create } from 'zustand'

export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### `src/App.jsx`

```jsx
import { useCounterStore } from './store/useCounterStore.js'

const button = {
  padding: '0.4rem 0.9rem',
  border: '1px solid currentColor',
  borderRadius: '6px',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
}

export default function App() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <p style={{ fontSize: '2rem', margin: 0 }}>{count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" style={button} onClick={decrement}>
          ลด
        </button>
        <button type="button" style={button} onClick={increment}>
          เพิ่ม
        </button>
        <button type="button" style={button} onClick={reset}>
          รีเซ็ต
        </button>
      </div>
    </div>
  )
}
```
