# Learner setup and verification

What the learner does on their own machine, from opening the site to knowing a page is done: one-time project setup, how an exercise is phrased, how the learner verifies themselves, and the scope of the site-side test suite.

**Status**: settled by *Learner setup and verification workflow* ([#6](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/6)) on the map "Map: Zustand workshop curriculum spec" ([#1](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/1)).

This file has two audiences at once, like a page brief: the English prose is design material for the build session, and every Thai block is **final copy** to be placed on the site verbatim.

## The learner's project

The learner builds all twelve pages in **one project**, created once on the start-here page. There is no project per page and no scaffold handed out ([ADR-0001](../adr/0001-no-starter-code.md)).

| Rule | Decision |
| --- | --- |
| Project | One Vite + React project named `zustand-workshop`, created on the start-here page and used for all twelve pages. |
| Per page | The learner writes the files the brief's *Solution code* section lists, at exactly those paths. When a path repeats from an earlier page (`src/App.jsx`), the learner overwrites it. |
| Store | One store file per page at `src/store/<name>Store.js` — `useCounterStore.js`, `useTodoStore.js`, `useCartStore.js`, and so on. Pages 9–12 may add further files under `src/store/` (slices, the bound store). |
| Components | `src/App.jsx` holds the page's component. A page may add sibling components when its brief says so. |
| Not installed | react-router (routing is this repo's plumbing and is never taught), TypeScript, any CSS framework or component library, any test runner. |
| Git | Not taught. If the learner commits, those commits are where earlier pages' code survives. |

Consequences for the page briefs:

- A brief's *Solution code* section lists **every file the learner must write, complete and runnable on its own** — a page that builds on an earlier page repeats that earlier page's files in full rather than describing a diff. `solutionFiles` in the page record has no notion of a change set ([content-model.md](content-model.md)).
- The file names in `solutionFiles` are these paths, since the reveal is instruction about the learner's own project.

## The start-here page

The one-time setup is taught on a **start-here page** at `/start`, outside the ladder: no tier, no page number, no previous/next links. It is not a page record — the record shape is ladder data, and a thirteenth record would corrupt page order. It is site chrome, and *Site shell and page template prototype* ([#7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/7)) renders it.

It teaches **no Zustand code** ([ADR-0001](../adr/0001-no-starter-code.md)): a counter written here would hand the learner page 1's answer. The setup check is a package listing, not a working store.

Final copy, Thai, to be placed verbatim:

```markdown
# เริ่มต้นใช้งาน

เวิร์กช็อปนี้มี 12 หน้า คุณจะสร้างโปรเจกต์ React ของตัวเอง แล้วทำโจทย์ทีละหน้าตามลำดับ
เว็บนี้ให้ดูเดโมเป้าหมาย โจทย์ และเฉลยเท่านั้น โค้ดทั้งหมดคุณเขียนเองในโปรเจกต์ของคุณ

## 1. ตรวจสอบเครื่องก่อน

node -v

ต้องได้ v20.19 ขึ้นไป หรือ v22.12 ขึ้นไป
ถ้าไม่เห็นเวอร์ชัน หรือขึ้นว่าไม่รู้จักคำสั่ง ให้ติดตั้ง Node.js รุ่น LTS จาก nodejs.org แล้วเปิด terminal ใหม่

## 2. สร้างโปรเจกต์

npm create vite@latest zustand-workshop -- --template react --no-interactive --no-immediate
cd zustand-workshop
npm install
npm install zustand
npm run dev

เปิดที่อยู่ที่ terminal แสดง (ปกติคือ http://localhost:5173) จะเห็นหน้าเริ่มต้นของ Vite

## 3. โครงไฟล์ที่ใช้ตลอดเวิร์กช็อป

zustand-workshop/
└─ src/
   ├─ store/     เก็บ store ของแต่ละหน้า เช่น useCounterStore.js
   └─ App.jsx    คอมโพเนนต์ที่แสดงผลของแต่ละหน้า

โจทย์แต่ละหน้าจะบอกว่าต้องเขียนไฟล์อะไรบ้าง ใช้ path เดียวกับที่เว็บแสดงในส่วนเฉลย
ถ้าซ้ำกับหน้าเดิม ให้เขียนทับไฟล์เดิมได้เลย

ไม่ต้องติดตั้งอะไรเพิ่มนอกจาก zustand — ไม่ต้องใช้ react-router, TypeScript หรือ CSS framework

## 4. เช็คว่าพร้อมแล้ว

npm ls zustand

ต้องเห็น zustand เวอร์ชัน 5.x
เห็นครบทั้งหน้า Vite และ zustand 5.x แล้ว = พร้อมเริ่มหน้า 1
```

Command notes for the build session (not shown to the learner): the commands were verified against `create-vite@9.2.1`; `--template react` is the JavaScript template, `--no-interactive` skips the framework menu, and `--no-immediate` stops the scaffolder from installing and starting a dev server before `zustand` is added.

## How a page phrases its exercise

Rules the page briefs ([#8](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)–[#12](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/12)) follow. Each brief quotes its Thai strings as final copy, as it does today.

- **Goal statement** (*โจทย์*): states the end result the learner must reach, never the implementation. No starter code, no skeleton beyond the file paths the learner must create.
- **Acceptance criteria** (*เกณฑ์ความสำเร็จ*): each criterion is an **observable check the learner performs on the goal demo on the same page** — something they press, type, or see. A criterion never names a state field, an action, or a selector: those are the learner's own inventions, and the site cannot know them.
- **Criteria are self-checkable without the solution reveal.** Every criterion can be checked by using the learner's own app, not by reading code.
- **Hints** (*คำใบ้*): an ordered list, all visible from the start, one nudge each toward the concept the page teaches. A hint never contains the code that is the answer; the answer is the solution reveal.
- **Trap callout** (*กับดัก*): the trap the page owns, stated as something the learner could observe in their own app, with the fix in those terms.

A good criterion versus a bad one, on page 1:

| | |
| --- | --- |
| Good | `กดปุ่ม + แล้วตัวเลขบนหน้าจอเพิ่มขึ้น 1` |
| Bad | `ใช้ selector แยกค่าออกจาก store` — names an implementation the learner chose, and cannot be seen in the app |

## The verification loop

The loop the learner runs on every page:

1. Reproduce the goal demo's behaviour in their own project.
2. Check the acceptance criteria in order, on their own app.
3. If something does not match: read the trap callout, then the hints, and only then open the solution reveal.
4. If they open the reveal: **copying is allowed** — the reveal has a per-file copy button by design ([ADR-0002](../adr/0002-solutions-published-on-the-learner-site.md)). The one expectation is that they re-run the acceptance criteria on their own project afterwards, so the page is done when their app behaves, not when the code is pasted.
5. Move to the next page.

The learner is never asked to write a test, and the site never mentions tests to them.

## Site-side test suite

The site's own solutions are guarded by a test suite that belongs to **this repository only**. The learner never sees it, never installs it, and never runs it.

| | |
| --- | --- |
| Runner | Vitest with React Testing Library, in this repository. |
| Location | Colocated with the page: `src/workshop/pages/<NN>-<slug>/*.test.jsx`. |
| Coverage | One test per acceptance criterion, driving the page's `<Demo />`. A page is covered when every criterion in its brief has a test that fails if the behaviour stops holding. |
| Run by | `npm test` in this repository. |
| Purpose | Keep the published solution code equal to the behaviour the page advertises ([ADR-0002](../adr/0002-solutions-published-on-the-learner-site.md), [ADR-0004](../adr/0004-one-implementation-per-page.md)). It tests the site's solutions, never the learner's work. |

Consequences: *Assemble the workshop spec for handoff* ([#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13)) counts a green `npm test` as part of the definition of done for the built workshop. Browser-level end-to-end tests of the shell and template are **not** in scope here; the shell's own verification belongs to *Site shell and page template prototype* ([#7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/7)).

## Not settled here

- How the shell renders `/start` and where the link to it sits: [#7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/7).
- The Thai copy of each page (goal, criteria, hints, trap): [#8](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)–[#12](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/12).
- Build order and the handoff entry point: [#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13).
