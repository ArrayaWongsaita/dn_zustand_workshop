# Zustand Workshop — spec

The decision-complete curriculum spec for the workshop site. This file is the **spec home**: read it first, then follow the parts below.

> **Status**: in progress. Parts marked *not yet written* are owned by open planning tickets on the map "Map: Zustand workshop curriculum spec" (issue #1).

## Destination

A decision-complete curriculum spec for the Zustand workshop web app: the 12-page ladder, each page's exercise brief and solution design, the site shell, the page content model, and the learner setup/verification workflow — ready to hand off to a build session with no product or teaching decision left open.

## Audience

A **build session**, not a learner. Learners never see this repository (see [ADR-0003](../adr/0003-learners-never-clone-this-repo.md)): they view the deployed site and write their own Vite + React project. Repo docs are English; learner-facing copy is Thai and is quoted verbatim in the page briefs.

## Parts

| Part | Where | Status |
| --- | --- | --- |
| Ladder and difficulty calibration | this file, § Ladder | settled |
| Page brief format | this file, § Page briefs | settled |
| Page briefs | [`pages/NN-<slug>.md`](pages/) (12 files) | pages 1–4 written by *Page briefs: Tier 1* ([#8](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/8)); pages 5–6 written by *Page briefs: Tier 2* ([#9](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/9)); pages 7–8 written by *Page briefs: Tier 3a* ([#10](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/10)); pages 9–10 owned by *Tier 3b* ([#11](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/11)), 11–12 by *Tier 3c* ([#12](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/12)) |
| Page content model | [`content-model.md`](content-model.md) | settled |
| Site shell and page template | [`site-shell.md`](site-shell.md) | settled |
| Learner setup and verification | [`learner-setup.md`](learner-setup.md) | settled |
| Vocabulary | [`GLOSSARY.md`](../../GLOSSARY.md) | settled |
| Framing decisions | [`docs/adr/`](../adr/) | settled (0001–0004) |
| Handoff assembly and build order | this file, § Handoff | not yet written — owned by *Assemble the workshop spec for handoff* ([#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13)) |

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

Not yet written. Owned by *Assemble the workshop spec for handoff* ([#13](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/13)): one entry point a fresh build session can read end-to-end, a build order for the site, and a definition of done for the built workshop.
