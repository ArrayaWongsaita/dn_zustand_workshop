# Site shell and page template

The site chrome (home, navigation, per-page URL) and the page template that renders a page's fields.

**Status**: settled. Decided by *Site shell and page template prototype* ([#7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/7)) on the map "Map: Zustand workshop curriculum spec" ([#1](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/1)), from a three-variant prototype at `src/prototype/shell/` (throwaway branch `prototype/site-shell`, never merged). The page's content and the record's shape are [content-model.md](content-model.md); expert setup copy shown on the start-here page is [learner-setup.md](learner-setup.md).

Three variants were built and driven side by side — a sidebar ladder, a top rail with a reading column, and a split workspace with the live demo beside the docs. **The sidebar ladder won**; the two rejected variants are recorded at the end so a build session does not resurrect them.

## Routes

react-router, mounted once in `src/main.jsx`. Routing is invisible plumbing (see [ADR-0003](../adr/0003-learners-never-clone-this-repo.md)): nothing learner-facing ever names a route, shows a URL, or explains navigation, and the learner's own project does not use react-router at all.

| Path | Surface |
| --- | --- |
| `/` | Home: the ladder, grouped by tier |
| `/start` | Start-here page (site chrome, not a page record) |
| `/<slug>` | One ladder page, slug equal to the record's `slug` (`/01-counter`, `/12-capstone`) |

`/start` is a fixed segment with no clash: every page slug is `<NN>-<slug>`, so no page can claim it. A path matching nothing falls back to home.

## Layout

One shell for every surface: a fixed-width sidebar and a scrolling content column beside it.

```
┌──────────────┬────────────────────────────────────────────┐
│ เวิร์กช็อป Zustand │  หน้า 1 · ชั้น 1        ← ก่อนหน้า  ถัดไป → │
│              │                                            │
│ ชั้น 1        │  ตัวนับ                                    │
│ 1 ตัวนับ     │                                            │
│ 2 …          │  ┌──────────────────────────────────────┐  │
│ 3 …          │  │           เดโมเป้าหมาย                │  │
│ 4 …          │  │        [ - ]  0  [ + ]  [reset]      │  │
│ ชั้น 2        │  └──────────────────────────────────────┘  │
│ …            │                                            │
│ ชั้น 3c       │  โจทย์ / เกณฑ์ความสำเร็จ / กับดัก / คำใบ้    │
│ …            │  ส่วนเฉลย  [ ดูเฉลย ]                       │
│              │                                            │
│ หน้าเริ่มต้น   │                                            │
└──────────────┴────────────────────────────────────────────┘
```

- Sidebar: `w-64`, `border-r`, its own scroll container, sticky full height; the content column scrolls independently and centres a `max-w-3xl` column with generous vertical padding.
- Desktop-first, as decided: no breakpoint work and no mobile layout. A comfortable minimum width is acceptable.
- Minimal UI: Tailwind and shadcn defaults, no design effort (spec home, § Constraints). The whole chrome is one neutral surface; the demo is the only thing on the page that should draw the eye.

## Sidebar

The ladder is visible at all times — that is the whole point of the sidebar: the learner can see where they are in twelve pages, and what is left.

1. Site title, linking home.
2. Five groups in tier order (1, 2, 3a, 3b, 3c). Group heading is the tier's Thai label ([GLOSSARY](../../GLOSSARY.md): *ชั้น*).
3. One row per page in the group: page number, then `titleTh`. The current page's row is filled (inverted) so "where am I" is answered before reading. A visited page's row carries a subtle check.
4. Last, after the ladder: a link to the start-here page.

Sidebar rows are built from the registry in ladder order, grouped by `tier`. Prev/next links also derive from `number`, never from a second hand-written order.

A page whose record is missing is rendered dimmed and inert rather than hidden — defensive only: once the ladder is complete, all twelve are reachable. No count, percentage, or progress bar anywhere.

## Home

Purpose: "what is this, and where do I start". No marketing.

1. Heading and one line of Thai copy: twelve pages, from a plain store to one that lives as long as the app.
2. The ladder as a grid of five tier cards, one per tier, each listing its pages as number + `titleTh` and linking to them. Cards are grouped by difficulty, not numbered 1–12 as a flat list.
3. One full-width card for the start-here page, last: project setup comes before page 1.

There is no hero image, no call to action beyond "เริ่มที่หน้า 1" living in the first tier card's first row, and no mention of Zustand versions or React versions here — page 1 introduces the API.

## Start-here page

`/start` is site chrome, not a page record: it has no `number`, no tier badge, and no goal demo, and the registry never contains it. The sidebar stays visible so navigation behaviour does not change mid-way through the workshop. The page carries exactly what [learner-setup.md](learner-setup.md) defines: the one-time learner-project commands, the file-path convention, and the setup check — with the same section headings the page template uses, so it reads as the same site.

## Page template

One template renders every page from its record; the record supplies content and the shell supplies chrome. Sections in this fixed order, exactly as [content-model.md](content-model.md) specifies:

| # | Section | Heading | Rendered from |
| --- | --- | --- | --- |
| 1 | Page header | — | `หน้า <number> · <tier label>` + `titleTh`; previous/next links at the top-right |
| 2 | Goal demo | *เดโมเป้าหมาย* | `<Demo />` inside a bordered, centred stage |
| 3 | Exercise brief | *โจทย์* | `briefTh` |
| 4 | Acceptance criteria | *เกณฑ์ความสำเร็จ* | `criteriaTh`, each row with a check glyph (not an interactive tick) |
| 5 | Trap callout | *กับดัก* | `trapsTh` in an amber-bordered callout |
| 6 | Hints | *คำใบ้* | `hintsTh` as a flat numbered list, all visible |
| 7 | Solution reveal | *ส่วนเฉลย* | collapsed by default; on open, `solutionFiles` as code blocks |

- **Goal demo, always visible, from the first paint.** It is the same component the reveal's code comes from, so the reveal shows code only and never a second mount.
- **The demo stage is the site's frame, not the demo's styling.** A page's implementation is displayed verbatim to the learner, so it is plain React with inline styles (content-model.md, § Solution code); the stage gives it a border, a soft background, and generous padding. Nothing in the shell may restyle the demo's own markup.
- **Reveal control**: a single button, `ดูเฉลย` closed and `ซ่อนเฉลย` open, at the section heading. When open, the file blocks render in `solutionFiles` order: the learner-project path as a heading, a per-file copy button, and the source in a `<pre>` — no syntax highlighting.
- **Previous/next** are titled links at the header's top-right; the first page has no previous and the last has no next. They do not appear on `/start`.
- Every heading and label above is static chrome, written once in the template, never in a record (content-model.md, § The page template).

## State

The site's own store lives at `src/workshop/site-store.js`, outside every page folder, and holds two lists keyed by slug:

- `visited` — a page is marked on mount; drives the sidebar's checks.
- `revealed` — toggled by the reveal button; drives whether a page's code blocks are open.

Settled semantics:

- **Progress means "this page has been opened"**, nothing more. Acceptance criteria are the learner's own self-check and never become site state — the tick glyphs in section 4 are decorative, and no criterion is stored, counted, or shown on the home page.
- **Reveal state is per page and lives for the session only.** It is not persisted: a refresh closes every reveal and clears `visited`. There is no localStorage, no progress reset control, and no "resume where you left off".
- **A page's store is its own**, per the one-store-per-page rule; navigating away and back does not reset a demo, because a store is a module-level singleton and the shell does nothing to work around that. A refresh is the reset. No reset button is added to the chrome.
- The site uses Zustand for this and nothing else; it is never teaching material (spec home, § Constraints).

## What the shell must not do

- Never name routing, never show a URL, breadcrumb, or "slug" to the learner.
- Never restyle a demo, and never give a page its own theme, colours, or layout.
- Never render teaching metadata — concept, step type, prerequisites, trap ownership — which lives in the spec home's § Ladder.
- Never add a progress percentage, streak, timer, or completion badge.

## Rejected variants

Built during the prototype and dropped; recorded so they are not rebuilt by accident. The full set is on the throwaway branch `prototype/site-shell`.

- **Top rail + reading column** — a sticky rail of twelve numbered stops, the demo as a full-bleed band, the reveal as a full-width band at the bottom. Dropped: twelve bare numbers carry no page titles, so finding "the persist page" means hovering or counting; the sidebar's tier grouping is the more useful navigation.
- **Split workspace (demo first)** — a number rail, the live demo on the left, docs in a scrolling right column. Dropped: it needs a wide viewport to survive, and it turns reading the brief into a second scroll region, which fights a page whose whole job is read → build → check.
