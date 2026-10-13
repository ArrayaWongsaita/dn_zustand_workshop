# Zustand Workshop — spec

The decision-complete curriculum spec for the workshop site. This file is the **spec home**: read it first, then follow the parts below.

> **Status**: decision-complete. Every part below is settled; the build session starts once this map closes. The one physical step still outstanding is recorded under § Handoff → *Still unsettled at handoff*.

## Destination

A decision-complete curriculum spec for the Zustand workshop web app: the 12-page ladder, each page's exercise brief and solution design, the site shell, the page content model, and the learner setup/verification workflow — ready to hand off to a build session with no product or teaching decision left open.

## Audience

A **build session**, not a learner. Learners never see this repository (see [ADR-0003](../adr/0003-learners-never-clone-this-repo.md)): they view the deployed site and write their own Vite + React project. Repo docs are English; learner-facing copy is Thai and is quoted verbatim in the page briefs.

## Parts

| Part | Where | Status |
| --- | --- | --- |
| Ladder and difficulty calibration | this file, § Ladder | settled |
| Page brief format | this file, § Page briefs | settled |
| Page briefs | [`pages/NN-<slug>.md`](pages/) (12 files) | pages 1–4 written by *Page briefs: Tier 1* ([#8](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)); pages 5–6 written by *Page briefs: Tier 2* ([#9](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/9)); pages 7–8 written by *Page briefs: Tier 3a* ([#10](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/10)); pages 9–10 written by *Page briefs: Tier 3b* ([#11](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/11)); pages 11–12 written by *Page briefs: Tier 3c* ([#12](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/12)) |
| Page content model | [`content-model.md`](content-model.md) | settled |
| Site shell and page template | [`site-shell.md`](site-shell.md) | settled |
| Learner setup and verification | [`learner-setup.md`](learner-setup.md) | settled |
| Vocabulary | [`GLOSSARY.md`](../../GLOSSARY.md) | settled |
| Framing decisions | [`docs/adr/`](../adr/) | settled (0001–0004) |
| Handoff assembly and build order | this file, § Handoff | settled — assembled by *Assemble the workshop spec for handoff* ([#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13)) |

## Ladder

The accepted twelve-page framing. Page numbers are stable ids; they are the `NN` in each brief filename. One page, one new idea: no page merges with a neighbour and none splits — twelve stands.

| # | Page | Tier | New API | Step type | Requires | Trap this page owns | Brief |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Counter | 1 | `create`, the store hook, a selector, `set` (shallow merge) | new API | — | none; only the note that v5 uses a named import, never a default export | [`pages/01-counter.md`](pages/01-counter.md) |
| 2 | Multi counter | 1 | — | nastier state shape | 1 | select one field at a time (atomic selectors); never select a whole object | [`pages/02-multi-counter.md`](pages/02-multi-counter.md) |
| 3 | Todo | 1 | — | nastier state shape (list) | 1–2 | mutating the array in place does not re-render; replace with spread, `filter`, or `map` | [`pages/03-todo.md`](pages/03-todo.md) |
| 4 | Shopping cart | 1 | — | nastier state shape (nested) | 1–3 | nested state is not merged for you; spread every level | [`pages/04-shopping-cart.md`](pages/04-shopping-cart.md) |
| 5 | Derived & memoized selector | 2 | — | composition | 1–4 | storing derived state instead of deriving it in a selector | [`pages/05-derived-selectors.md`](pages/05-derived-selectors.md) |
| 6 | Selector performance | 2 | `useShallow` | performance trap | 1–5 | returning a fresh object, array, or function from a selector — `Object.is` never matches and v5 can loop | [`pages/06-selector-performance.md`](pages/06-selector-performance.md) |
| 7 | Async fetch | 3a | — (an async action) | new failure mode | 1–6 | an async action with no status; out-of-order responses; StrictMode's dev double-invoke | [`pages/07-async-fetch.md`](pages/07-async-fetch.md) |
| 8 | Persist | 3a | `persist`, `createJSONStorage` | new API | 1–7 | v5 writes no initial state at store creation; persisting transient fields (use `partialize`) | [`pages/08-persist.md`](pages/08-persist.md) |
| 9 | Slices | 3b | — | composition | 1–8 | applying middleware inside a slice; apply it to the bound store only | [`pages/09-slices.md`](pages/09-slices.md) |
| 10 | Middleware | 3b | `immer`, `devtools` | new API | 1–9 | an `immer` updater must mutate and return nothing; `devtools` must wrap `immer` | [`pages/10-middleware.md`](pages/10-middleware.md) |
| 11 | Shared store | 3c | — | composition | 1–10 | making more than the one thing that needs it global | [`pages/11-shared-store.md`](pages/11-shared-store.md) |
| 12 | Capstone | 3c | — | composition | 1–11 | none new — the union of the ladder's earlier traps | [`pages/12-capstone.md`](pages/12-capstone.md) |

**Prerequisite chain.** The ladder is cumulative: page *n* may assume every concept and API taught on pages 1…*n−1* and nothing else, so `Requires` names the pages whose material that page leans on while the whole prefix is assumed. A page that would need something taught later is a defect in the ladder, not in the page. Outside the ladder the only assumption is **React hooks** (§ Constraints); routing and TypeScript are never assumed.

**Step types.** Every transition is labelled with exactly one reason it is harder:

| Step type | Meaning |
| --- | --- |
| new API | an API the learner has not used before |
| nastier state shape | the same API over a harder shape: several values → a list → nesting |
| new failure mode | a way the store silently misbehaves that the learner has not met |
| performance trap | correct-looking code that costs re-renders or breaks `Object.is` |
| composition | no new API; the difficulty is arranging what is already known |

**Tier boundaries.** A tier is a difficulty band, not a navigation label (see [GLOSSARY](../../GLOSSARY.md)). The jump *between* tiers is larger than any jump within one: Tier 1 → Tier 2 changes what the learner is doing, from building the store to reading it back through selectors; Tier 2 → 3a turns the store outward, giving it side effects; 3a → 3b scales its structure; 3b → 3c changes its lifetime, from a store per page to one whose life is the app's.

**Traps.** Each trap has exactly one owning page — the page that introduces *and* fixes it (the `Trap this page owns` column). A page never documents a trap whose fix is taught later; page 2's rule (one selector per field) avoids the problem that page 6 explains and solves.

**Deliberately not in the ladder.** Named once here so no brief reaches for them: `createStore`/`useStore` (the vanilla, non-React store), `subscribe` and transient updates, `createWithEqualityFn`/`zustand/traditional`, `subscribeWithSelector`, `skipHydration`/SSR, `version`/`migrate` on `persist`, TypeScript, and routing.

Outside the ladder the site also carries the **start-here page** at `/start` — site chrome, not a page record: it holds the one-time project setup and the setup check ([learner-setup.md](learner-setup.md)).

Every API claim is grounded in [docs/research/zustand-v5-api.md on the throwaway `research/zustand-v5-api` branch](https://github.com/ArrayaWongsaita/dn_zustand_workshop/blob/research/zustand-v5-api/docs/research/zustand-v5-api.md).

## Constraints

Standing preferences for the whole effort:

- **JavaScript / JSX only.** No TypeScript in the site or in learner-facing material.
- **No starter code.** Each page states the expected end result; the learner writes everything themselves (see [ADR-0001](../adr/0001-no-starter-code.md)).
- **Routing is invisible plumbing.** The site has a URL per page; routing is never taught and never named to the learner. Learners know React hooks but have not learned react-router, and the learner's own project does not need it.
- **Minimal site UI.** Tailwind / shadcn defaults, no design effort, so attention stays on Zustand.
- **One store per page**, except the shared-store page (11), which is deliberately global.
- **The site's own Zustand use is not teaching material.** It uses Zustand only minimally (e.g. "solution revealed" and progress state).
- **Solutions are published on the learner-facing site** (see [ADR-0002](../adr/0002-solutions-published-on-the-learner-site.md)).
- **Learners never clone this repository** (see [ADR-0003](../adr/0003-learners-never-clone-this-repo.md)).

## Page briefs

One file per page: `docs/workshop/pages/NN-<slug>.md`, where `NN` is the page number in the ladder. The `<slug>` is final: the brief filename stem, the page's folder under `src/workshop/pages/`, and its URL segment are one string (see [content-model.md](content-model.md)).

A brief is **decision-complete**: a build session turns one brief into one page module without making any teaching decision of its own. English is the language of the design prose; every learner-facing string is Thai and is quoted in the brief as final copy, not as direction.

Section skeleton. Every learner-facing string here is Thai final copy and is carried verbatim into the page record ([content-model.md](content-model.md)); the surrounding prose is English design material for the build session. The brief's header block also names the page's **`titleTh`**, the Thai heading the shell renders — final copy like every other Thai string, and the one learner-facing string that is not inside a section.

**`titleTh` convention.** A heading is a short Thai noun phrase: no page number, no trailing punctuation, and never a repeat of a tier label ([GLOSSARY](../../GLOSSARY.md): *ชั้น*), which is what the sidebar groups by. English technical terms already in the ladder's vocabulary (`store`, `selector`, `async`, `middleware`) are allowed, as pages 7–12 do. A page that adds a new shape of state is named after the thing the learner builds (`ตะกร้าสินค้า`); a page whose work is a new way of reading or structuring the store is named after that technique (`ยอดรวมที่คำนวณจาก store`, `ห่อ store ด้วย middleware`). Settled for pages 1–6 by [Thai page headings (titleTh) for pages 1-6](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/14).

```markdown
- **ชื่อหน้า (titleTh)**: <the Thai page heading, final copy>

## Learning objective
The Zustand concept and exact API surface introduced, and what the learner must already know.

## Goal behaviour
What the goal demo does, concretely enough to implement.

## Exercise brief (Thai)
Final copy shown to the learner.

## Acceptance criteria (Thai)
Final copy; observable and self-checkable.

## Hints (Thai)
Final copy.

## Traps to document
The trap this page exposes and where the page must call it out.

## Solution design
Store shape, actions, components.

## Solution code
The files the learner must write, in display order, by the same learner-project-relative paths the site shows in the solution reveal ([content-model.md](content-model.md)).
```

## Handoff

Settled by *Assemble the workshop spec for handoff* ([#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13)). This section is the build session's entry point: read the parts above, then build the site in the order below.

### What already exists

The Vite + React scaffold, with Tailwind, the shadcn `@` alias, react-router and zustand installed (`package.json`, `vite.config.js`, `jsconfig.json`, `src/index.css`). The site's own store is written at `src/workshop/site-store.js`. Page 1 is built at `src/workshop/pages/01-counter/` as the shell prototype that validated the record shape: its behaviour and code are final, but its record still holds placeholder Thai copy and both files carry `PROTOTYPE NOTE` comments. The real shell and pages 2–12 do not exist yet.

Two planning artifacts are **not** part of the site and are deleted in build step 6: `src/prototype/shell/` (the three rejected shell variants) and `scripts/smoke-shell.mjs` (its smoke check). The throwaway `research/zustand-v5-api` branch never merges; every fact the briefs cite from it is quoted in the briefs, so the build does not depend on it.

### Build order

1. **Shell and page template** — implement [site-shell.md](site-shell.md) and [content-model.md](content-model.md) § The page template:
   - routes mounted once in `src/main.jsx`: `/` (home), `/start` (start-here), `/<slug>` (one page), unknown → home;
   - the one page template, its seven sections in order, the goal-demo stage and the code-only reveal;
   - the persistent sidebar grouped by the five tiers, rows built from the registry by `number`, the visited check, and previous/next;
   - home (heading, five tier cards, the start-here card last) and `/start` (the Thai copy of [learner-setup.md](learner-setup.md) verbatim, teaching no Zustand code);
   - the site store's settled semantics (visited on mount, revealed per page, session-only).
   Replaces the Vite scaffold in `src/App.jsx` / `src/main.jsx`.
2. **Finalize page 1** — remove the `PROTOTYPE NOTE` comments from `src/workshop/pages/01-counter/App.jsx` and `index.js`, and copy the final Thai copy (`briefTh`, `criteriaTh`, `hintsTh`, `trapsTh`) from [`pages/01-counter.md`](pages/01-counter.md) into the record.
3. **Pages 2–12 in ladder order**, one per the authoring steps in [content-model.md](content-model.md) § Authoring a page: create the page folder mirroring the learner's `src/` layout, write the brief's *Solution code* files verbatim, write the record with the brief's Thai copy verbatim, register it in `src/workshop/pages/index.js`, and confirm the seven sections render.
4. **Site-side tests as each page lands** — Vitest + React Testing Library, colocated `*.test.jsx`, one test per acceptance criterion driving `<Demo />`, and the `test` script in `package.json` ([learner-setup.md](learner-setup.md) § Site-side test suite). Stub `fetch` and `localStorage` as the briefs note. The criteria that need the Redux DevTools extension (pages 10, 11, 12) stay manual.
5. **Dependencies** — add `immer` for the page 10 and page 12 demos. `devtools` needs no package (the browser extension only); there is no `@redux-devtools/extension` (see [`pages/10-middleware.md`](pages/10-middleware.md), the correction to the research doc).
6. **Cleanup** — delete the prototype artifacts named above, drop scaffold files no surface uses, and confirm no demo imports Tailwind, shadcn, or any module from this repository.

### Definition of done

The built workshop is done when all of the following hold.

- `/`, `/start` and `/<slug>` render; an unknown path falls back to home; nothing learner-facing ever names routing.
- All twelve page folders exist and `src/workshop/pages/index.js` lists all twelve records in ladder order; the sidebar, home cards and previous/next all derive from that registry.
- Every page renders the seven template sections in order, its Thai copy equal to its brief verbatim, and its `solutionFiles` in the brief's display order under the learner's own paths.
- Home shows the five tier cards and the start-here card; `/start` carries [learner-setup.md](learner-setup.md)'s copy and teaches no Zustand code.
- Site state matches [site-shell.md](site-shell.md) § State: `visited` marked on mount, `revealed` toggled per page, both session-only, no persistence, no progress percentage.
- Every demo is plain React with inline styles and runs in a bare Vite + React project; no demo imports this repository's Tailwind, shadcn, or modules.
- `npm run lint`, `npm run build` and `npm test` all pass. `npm test` covers every page with one passing test per acceptance criterion, colocated with its page.
- A production build serves the fetched JSON on pages 7–12 (the `new URL(…, import.meta.url)` path) and the persisted cart rehydrates on reload.
- No `PROTOTYPE NOTE` comments remain, and `src/prototype/` and `scripts/smoke-shell.mjs` are gone.
- Learner-facing language is Thai; the only English a learner sees is the raw fetch error detail on pages 7 and 12.
- **Not** part of done: deployment and hosting — the human handles it after the spec (map, Out of scope).

### Still unsettled at handoff

- **The spec is not committed or pushed.** `origin/main` holds only the initial commit; the spec home, every brief, the ADRs and the glossary live in the working tree and in local commits, while the tickets on the map link to `main`. The spec must be committed and pushed before a build session starts, or those links 404.
- **The test toolchain is specified but not installed.** [learner-setup.md](learner-setup.md) fixes Vitest + React Testing Library and `npm test`; `package.json` has neither yet. Installing and configuring them is build step 4, not a design decision.
