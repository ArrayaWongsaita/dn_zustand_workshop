# Zustand Workshop

A teaching site for Zustand v5: a twelve-page ladder of exercises that a learner works through on their own machine, building a Vite + React project while the site shows the goal behaviour and reveals a solution on demand. The learner never sees this repository.

## Language

**Workshop site**:
The web app in this repo that learners view and work from.
_ไทย_: เว็บเวิร์กช็อป
_Avoid_: demo, app, tutorial

**Learner**:
The person working through the ladder on their own machine, in their own Vite project.
_ไทย_: ผู้เรียน
_Avoid_: student, user, attendee

**Learner project**:
The Vite + React project the learner creates and writes their own code in; it is not this repository and it contains none of the site's source.
_ไทย_: โปรเจกต์ของผู้เรียน
_Avoid_: app, workspace, learner repo, sandbox

**Ladder**:
The fixed sequence of twelve exercises, ordered by difficulty.
_ไทย_: บันได
_Avoid_: course, curriculum, syllabus

**Tier**:
A group of consecutive ladder pages that share a difficulty band: tier 1 (pages 1–4), tier 2 (pages 5–6), tier 3a (7–8), 3b (9–10), 3c (11–12).
_ไทย_: ชั้น
_Avoid_: level, module, group

**Step type**:
The single reason one ladder page is harder than the page before it: a new API, a nastier state shape, a new failure mode, a performance trap, or composition. Every page transition carries exactly one.
_ไทย_: ประเภทความยาก
_Avoid_: difficulty, level, category

**Trap**:
A way the store silently misbehaves that a page both exposes and fixes; each trap has exactly one owning page.
_ไทย_: กับดัก
_Avoid_: pitfall, gotcha, mistake

**Slice**:
A part of a store holding one concern's state and actions, written as a creator function; slices are assembled into a single bound store.
_ไทย_: สไลซ์
_Avoid_: module, chunk, piece, store part

**Bound store**:
The single store assembled from several slices, and the store the app actually imports and uses.
_ไทย_: store ที่ประกอบแล้ว
_Avoid_: combined store, root store, main store

**Surface**:
A distinct region of the learner's app that shows part of the app's state; two surfaces on one page read the same store directly instead of passing values between each other.
_ไทย_: พื้นที่แสดงผล
_Avoid_: component, view, panel, section

**Middleware**:
A wrapper around a store's state creator that changes how `set` behaves or adds a capability, such as persisting, draft updates, or devtools logging.
_ไทย_: มิดเดิลแวร์
_Avoid_: plugin, extension, wrapper

**Start-here page**:
The site's one-time setup surface at `/start`, outside the ladder: it carries the project setup commands, the file convention, and the setup check. It is site chrome, not a page.
_ไทย_: หน้าเริ่มต้น
_Avoid_: setup page, intro, page 0, onboarding

**Page**:
One exercise in the ladder: its own URL, exercise brief, goal demo, hints, and solution reveal.
_ไทย_: หน้า
_Avoid_: lesson, chapter, step

**Exercise brief**:
The statement of what the learner must build on a page — goal, acceptance criteria, and hints — given with no starter code.
_ไทย_: โจทย์
_Avoid_: assignment, task, description

**Acceptance criteria**:
Observably checkable conditions that tell the learner a page's exercise is done.
_ไทย_: เกณฑ์ความสำเร็จ
_Avoid_: requirements, checklist, rubric

**Goal demo**:
The always-visible component on a page that exhibits the behaviour the learner must reproduce; it is also the solution, so the page has one implementation, not two.
_ไทย_: เดโมเป้าหมาย
_Avoid_: demo, example, preview, spec, solution demo

**Goal behaviour**:
What the goal demo does, stated concretely enough to implement.
_ไทย_: พฤติกรรมเป้าหมาย
_Avoid_: requirement, feature, behaviour (bare)

**Solution reveal**:
The click-to-open section on a page that reveals the solution code; the solution running live is the page's goal demo.
_ไทย_: ส่วนเฉลย
_Avoid_: solution, answer, เฉลย (bare)

**Solution code**:
The source of the implementation inside a solution reveal.
_ไทย_: โค้ดเฉลย
_Avoid_: snippet, listing, answer

**Hints**:
Optional nudges offered before the learner opens the solution reveal.
_ไทย_: คำใบ้
_Avoid_: tips, clues, help
