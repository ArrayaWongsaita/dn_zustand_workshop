# Page 03 — Todo

- **Tier**: 1
- **Status**: written — [Page briefs: Tier 1 (pages 1-4: counter, multi counter, todo, cart)](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)
- **Brief format**: [spec home, § Page briefs](../README.md#page-briefs)
- **ชื่อหน้า (titleTh)**: รายการสิ่งที่ต้องทำ

## Learning objective

A **list** as store state: an array of flat objects, each holding an `id`, its text, and a done flag. No new API. The learner learns that every action replaces the array — and the object it changes — instead of mutating either. Assumes pages 1–2.

## Goal behaviour

A small todo list.

- An input and a `เพิ่ม` button. Submitting adds a row with `done: false` and clears the input. A blank (or whitespace-only) input adds nothing.
- Each row: a checkbox reflecting `done`, the text struck through when done, and a `ลบ` button that removes the row.
- The list starts empty, showing `ยังไม่มีรายการ`. The input's placeholder reads `งานที่ต้องทำ`.
- `src/store/useTodoStore.js` holds `todos` and the three actions; `src/App.jsx` holds one `App` component, the form, and the row rendering.

## Exercise brief (Thai)

Final copy. One paragraph, no line breaks: the template renders `briefTh` inside a `<p>` ([site-shell.md](../site-shell.md), § Page template).

```
สร้างรายการสิ่งที่ต้องทำ มีช่องกรอกกับปุ่ม "เพิ่ม" กดเพิ่มแล้วรายการใหม่ต่อท้ายลิสต์ และช่องกรอกกลับมาว่าง ถ้าช่องกรอกว่างให้กดแล้วไม่มีอะไรเกิดขึ้น แต่ละรายการมี checkbox สำหรับติ๊กว่าทำเสร็จแล้ว (ข้อความถูกลากเส้นทับ) และปุ่ม "ลบ" สำหรับเอาออก เขียนสองไฟล์: src/store/useTodoStore.js (เก็บรายการและคำสั่ง เพิ่ม ติ๊กเสร็จ ลบ) และ src/App.jsx
```

## Acceptance criteria (Thai)

Final copy, in this order, one string per list item:

```
เปิดหน้าแล้วเห็นข้อความ "ยังไม่มีรายการ"
พิมพ์ข้อความแล้วกด "เพิ่ม" รายการใหม่ปรากฏขึ้น และช่องกรอกกลับมาว่าง
ติ๊ก checkbox ของรายการหนึ่ง ข้อความถูกลากเส้นทับ และรายการอื่นไม่เปลี่ยน
กด "ลบ" ของรายการหนึ่ง รายการนั้นหายไปจากลิสต์
```

Every criterion is an observable check on the learner's own app and names no state field, action, or selector.

## Hints (Thai)

Three hints, in this order, all visible from the start:

```
เก็บรายการเป็น array ของ object โดยแต่ละ object มี id ข้อความ และสถานะว่าทำเสร็จหรือยัง
เพิ่มรายการด้วยการสร้าง array ใหม่ เช่น [...เดิม, รายการใหม่] อย่า push ใส่ array เดิม
ติ๊กเสร็จหรือลบ ให้สร้าง array ใหม่ด้วย map หรือ filter พร้อมสร้าง object ของรายการนั้นใหม่ด้วย
```

## Traps to document

The list-mutation trap. The symptom is visible: the click happens and the list does not change.

```
กับดัก: การแก้ array หรือ object ของ state ตรง ๆ (เช่น push เข้า array เดิม หรือแก้ค่าใน object เดิม) จะไม่ทำให้จออัปเดต เพราะค่าเดิมกับค่าใหม่ถูกมองว่าเป็นตัวเดียวกัน — ต้องสร้าง array และ object ใหม่เสมอ (spread, map, filter)
```

## Solution design

Files, in display order (both complete and runnable on their own in the learner's project):

1. `src/store/useTodoStore.js`
2. `src/App.jsx`

Store:

| Part | Shape |
| --- | --- |
| state | `todos: []` — array of `{ id, text, done }`, flat objects |
| `add(text)` | appends `{ id: crypto.randomUUID(), text, done: false }` via `[...state.todos, …]` |
| `toggleDone(id)` | `state.todos.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo)` — new array, new object |
| `remove(id)` | `state.todos.filter((todo) => todo.id !== id)` — new array |

`crypto.randomUUID()` is the id source: it is available in the browser on the Vite dev server, and it keeps the store free of a counter the learner would otherwise have to invent. The blank-input rule lives in the component's submit handler (`if (text === '') return`), not in the store.

Component: one `App`. The draft text is component state (`useState('')`), never store state — the store holds the data, the draft is UI. The input and button are wrapped in a `<form onSubmit={…}>` with `event.preventDefault()`, so Enter submits as well as the button. `todos`, `add`, `toggleDone`, and `remove` are each read with their own selector. Rows are rendered with `key={todo.id}`, `type="checkbox"` with `checked`/`onChange`, a `<span>` whose `textDecoration` is `line-through` when done, and a `ลบ` button. Module-scope inline-style objects only; no Tailwind, no shadcn, no import from this repository.

## Solution code

### `src/store/useTodoStore.js`

```js
import { create } from 'zustand'

export const useTodoStore = create((set) => ({
  todos: [],
  add: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: crypto.randomUUID(), text, done: false },
      ],
    })),
  toggleDone: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    })),
  remove: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}))
```

### `src/App.jsx`

```jsx
import { useState } from 'react'
import { useTodoStore } from './store/useTodoStore.js'

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  input: {
    padding: '0.4rem 0.6rem',
    border: '1px solid currentColor',
    borderRadius: '6px',
    background: 'transparent',
    color: 'inherit',
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
}

export default function App() {
  const [draft, setDraft] = useState('')
  const todos = useTodoStore((state) => state.todos)
  const add = useTodoStore((state) => state.add)
  const toggleDone = useTodoStore((state) => state.toggleDone)
  const remove = useTodoStore((state) => state.remove)

  function handleSubmit(event) {
    event.preventDefault()
    const text = draft.trim()
    if (text === '') return
    add(text)
    setDraft('')
  }

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <form onSubmit={handleSubmit} style={styles.row}>
        <input
          style={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="งานที่ต้องทำ"
        />
        <button type="submit" style={styles.button}>
          เพิ่ม
        </button>
      </form>

      {todos.length === 0 ? (
        <p style={{ margin: 0 }}>ยังไม่มีรายการ</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.row}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.done ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </span>
              <button
                type="button"
                style={styles.button}
                onClick={() => remove(todo.id)}
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```
