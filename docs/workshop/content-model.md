# Page content model

How a workshop page is authored in this repository, and what a page is made of. This file is the contract between a page brief (`pages/NN-<slug>.md`) and the built site: a build session turns one brief into one page record plus its components without making a layout decision of its own.

Settled by *Workshop page content model and authoring layout* ([#5](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/5)) on the map "Map: Zustand workshop curriculum spec" ([#1](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/1)). The template's chrome and the site's routing are specified in [site-shell.md](site-shell.md).

## Source layout

One folder per page, named after the brief it implements.

```
src/workshop/
  site-store.js               the site's own store (progress, solution revealed) — never teaching material
  pages/
    index.js                  the registry: all twelve records, in ladder order
    01-counter/
      index.js                the page record
      App.jsx                 the one implementation: the goal demo, and the source the reveal displays
      store/
        useCounterStore.js    the page's own store
    09-slices/
      index.js
      App.jsx
      store/
        cartSlice.js
        uiSlice.js
        useSlicesStore.js
    …
```

Rules:

- **A page folder mirrors the learner's `src/` layout.** A displayed file's path inside the page folder is the path it has in the learner's own project, minus the `src/` the folder already stands in for: `01-counter/App.jsx` is displayed as `src/App.jsx`, and `01-counter/store/useCounterStore.js` as `src/store/useCounterStore.js`. This is what makes byte-identical display possible: every import inside a displayed file resolves in this repository and in the learner's project, under the same relative path, so the reveal never has to rewrite a string it shows. The folder also holds site-side files that are never displayed, `index.js` above all.

- The folder name is `<NN>-<slug>`, identical to the brief's filename stem, `docs/workshop/pages/<NN>-<slug>.md`. One page, one name: the folder, the brief file, and the record's `slug` are the same string, and the slug is the page's URL segment. The record's `number` field is the page's position in the ladder; the shell renders it as the page number and uses it for previous/next ([site-shell.md](site-shell.md)).
- `pages/index.js` is a hand-written array in ladder order. Pages are not discovered by a glob: ladder order is teaching data, not a filesystem fact.
- Each page folder owns its store, per the one-store-per-page rule; only page 11 is deliberately global. The site's own store lives outside every page folder, at `src/workshop/site-store.js`, so a page folder never mixes teaching state with site state.
- Routing is invisible plumbing (see [ADR-0003](../adr/0003-learners-never-clone-this-repo.md)): the slug is a URL segment and nothing learner-facing ever names routing.

## The page record

A page record is a plain object in `src/workshop/pages/<NN>-<slug>/index.js`, default-exported. It carries **only what the template renders** — nothing else.

```js
// src/workshop/pages/01-counter/index.js
import App from './App.jsx'
import appSource from './App.jsx?raw'
import storeSource from './store/useCounterStore.js?raw'

export default {
  number: 1,
  slug: '01-counter',
  tier: '1',
  titleTh: '…',
  briefTh: '…',
  criteriaTh: ['…'],
  hintsTh: ['…'],
  trapsTh: '…',
  Demo: App,
  solutionFiles: [
    { name: 'src/store/useCounterStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
```

| Field | Type | What the template does with it |
| --- | --- | --- |
| `number` | number | Page order: the heading's page number and the previous/next links. |
| `slug` | string | The URL segment; identical to the folder name and the brief filename stem. |
| `tier` | `'1' \| '2' \| '3a' \| '3b' \| '3c'` | The tier badge. |
| `titleTh` | string | The page heading. |
| `briefTh` | string | The exercise brief body. |
| `criteriaTh` | string[] | The acceptance-criteria list. |
| `hintsTh` | string[] | The hints, in the order they are shown. |
| `trapsTh` | string | The trap callout. |
| `Demo` | component | The goal demo, always visible. |
| `solutionFiles` | `{ name, source }[]` | The code blocks inside the solution reveal, in display order. |

All fields are required; a record has no optional fields. Every page has a trap to call out, including page 1 (the named-import note) and page 12 (the union of the ladder's traps).

**Deliberately not in the record.** The concept taught, the step type, the prerequisite pages, and trap ownership stay in the spec home's [§ Ladder](README.md#ladder). The site never renders them, so duplicating them into code would create a second place to keep true.

## One implementation for the goal demo and the solution

A page has exactly one implementation of its behaviour: the folder's `App.jsx`, displayed to the learner as `src/App.jsx`. It is what the learner sees as the goal demo, and its source is what the solution reveal displays — the record's `Demo` field holds it. There is no separate goal implementation, and the reveal mounts no second copy. See [ADR-0004](../adr/0004-one-implementation-per-page.md).

Why: [ADR-0002](../adr/0002-solutions-published-on-the-learner-site.md) requires the content model to define how the goal demo and the solution are stored and kept in sync, and the cheapest correct sync is one artifact — two implementations would need a stated sync discipline and would drift silently. A second mount would also share the page's store, because a store is a module-level singleton: on page 11, where the store is global by design, the reveal's demo would move whenever the goal demo above it moved.

Consequences:

- The reveal contains **code only**. The solution's live behaviour is the goal demo already on the page, which satisfies ADR-0002's live solution demo: the goal demo is visible from the start, so the reveal is a fallback, not the first move.
- The learner cannot read the goal demo's source until they open the reveal, but they can interact with it from the moment the page loads.
- Page 11's global store needs no special case: there is still one instance per page.

## Solution code

The code a reveal displays is the file that actually runs, imported with Vite's `?raw`, so the string shown is byte-identical to the source and there is nothing to keep in sync by hand. Both imports coexist — `import App from './App.jsx'` renders the component, `import appSource from './App.jsx?raw'` yields its source as a string.

Because the displayed string is the running source, a page's implementation must run in the learner's own project, which is a bare Vite + React app: **plain React and inline styles only**, never this site's Tailwind classes or `components/ui` imports. The site supplies the frame around the demo, not its styling (see [site-shell.md](site-shell.md)).

- A page may ship any number of files; the order of `solutionFiles` is display order.
- `name` is the path as it must exist in the **learner's own Vite project**, not this repository's path (for example `src/store/useCounterStore.js`). The brief's Solution code section names the same files in the same order: the learner builds their own project from an empty folder, so the displayed path is instruction.
- The reveal shows each file under its `name` heading with a per-file copy-to-clipboard button. There is no syntax highlighting: the site UI is deliberately minimal.
- Not every file in a page folder is displayed. The record itself (`index.js`) is never part of the solution; `solutionFiles` lists only files the learner must write.

## The page template

One template renders every page from its record. Static chrome is written once; the record supplies content.

| # | Section | Heading | Source |
| --- | --- | --- | --- |
| 1 | Page header | — | static: page number, `titleTh`, tier badge, previous/next links |
| 2 | Goal demo | *เดโมเป้าหมาย* | `<Demo />`, always visible |
| 3 | Exercise brief | *โจทย์* | `briefTh` |
| 4 | Acceptance criteria | *เกณฑ์ความสำเร็จ* | `criteriaTh` list |
| 5 | Trap callout | *กับดัก* | `trapsTh` |
| 6 | Hints | *คำใบ้* | `hintsTh` ordered list, all visible |
| 7 | Solution reveal | *ส่วนเฉลย* | collapsed by default; on open, `solutionFiles` as code blocks |

Static across all pages: the layout, every section heading and label, the tier badge, the previous/next links, the reveal toggle, and the copy buttons. Authored per page: every field of the record.

The order reads as the learner's path through the page — what to reproduce, what to build, how to know it is done, the trap to avoid, a nudge if stuck, and only then the answer.

## Learner-facing copy: Thai, and deliberately duplicated

Learner-facing copy is Thai and lives in the record verbatim. The brief quotes the same strings verbatim as final copy.

The brief is authoritative for the English design prose (learning objective, goal behaviour, traps to document, solution design); the record is what the site actually renders. The duplication is deliberate: the spec is a frozen handoff artifact, and the site must not parse its own documentation. Changing learner-facing copy means changing the brief and the record together.

## Hints are a flat list for now

`hintsTh` is an ordered array and the template renders all of it. Whether hints escalate one at a time remains unspecified on the map; if that lands, it changes the template, not the record.

## Authoring a page

1. Read the brief at `docs/workshop/pages/<NN>-<slug>.md`.
2. Create `src/workshop/pages/<NN>-<slug>/`.
3. Write the learner-layout files (`App.jsx` and its store, in the learner's own paths; page 9 and later may split the store across several files).
4. Fill `index.js` with the record, copying the brief's Thai strings verbatim.
5. List the learner's files in `solutionFiles`, in the order the brief names them, with `?raw` imports.
6. Add the record to `src/workshop/pages/index.js` at its ladder position.
7. Load the page and check all seven sections render.

## No stub page was built here

This ticket produced the schema only. Building page 01 against it is the first task of *Site shell and page template prototype* ([#7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/7)), which this ticket unblocks.
