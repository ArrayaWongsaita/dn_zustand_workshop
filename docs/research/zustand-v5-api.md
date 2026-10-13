# Zustand v5 API facts for the workshop ladder

Research note for issue #2 (`Part of #1`). Verified against primary sources only:
the official docs at <https://zustand.docs.pmnd.rs>, the zustand source at tag
`v5.0.15` (the current `latest` on npm), and the React docs at <https://react.dev>.
The source at `v5.0.15` matches the published npm tarball for `zustand@5.0.15`.

This note is the ground truth for the 12 page briefs. Where a tutorial habit is
wrong for v5, it is called out explicitly under "Facts that contradict common
tutorial advice".

## 0. Version facts

- Current zustand is **v5** (`zustand@5.0.15`, npm `latest`). The workshop should
  teach v5 imports and v5 behavior; v4 tutorials on the web differ in ways listed
  in section 14.
  Source: `npm view zustand version` / <https://www.npmjs.com/package/zustand>.
- v5 peer requirements: `react >= 18.0.0`, `typescript >= 4.5`
  (`package.json` `peerDependencies`; `react`, `@types/react`,
  `use-sync-external-store`, and `immer` are all optional peers).
  Source: <https://github.com/pmndrs/zustand/blob/v5.0.15/package.json>.
- React 19 is supported. The zustand repo itself develops and tests against
  `react@19.2.8` / `react-dom@19.2.8` (`devDependencies`, same `package.json`).
- Import paths are defined by the package `exports` map: `zustand`,
  `zustand/vanilla`, `zustand/react`, `zustand/shallow`, `zustand/react/shallow`,
  `zustand/vanilla/shallow`, `zustand/traditional`, `zustand/middleware`,
  `zustand/middleware/immer` (source: `package.json` `exports`).

## 1. Minimal learner setup (what the briefs can assume)

```
npm create vite@latest zustand-workshop -- --template react
cd zustand-workshop
npm install
npm install zustand
npm run dev
```

- `npm create vite@latest <name> -- --template react` is the Vite scaffold
  documented by Vite; `react` is the JavaScript template (`react-ts` for TS).
  Zustand install is just `npm install zustand` (no peer install needed for the
  React `create` API).
  Source: <https://zustand.docs.pmnd.rs/learn/getting-started/introduction>
  ("Installation: npm install zustand").
- Store file location is **convention, not API**: docs examples put the store in
  a module, commonly `./stores/useBoundStore` or `./bearStore`.
  Source: <https://zustand.docs.pmnd.rs/learn/guides/slices-pattern>
  (`import { useBoundStore } from './stores/useBoundStore'`).
- A store is a React hook; no provider is required. "You can use the hook
  anywhere, without the need of providers."
  Source: <https://zustand.docs.pmnd.rs/learn/getting-started/introduction>.

## 2. `create`, `createStore`, `useStore`, `traditional`

- `create(stateCreatorFn)` from `zustand` returns a **React hook with the store
  API attached** (`setState`, `getState`, `getInitialState`, `subscribe`).
  Signature: `create<T>()(stateCreatorFn: StateCreator<T, [], []>): UseBoundStore<StoreApi<T>>`.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create>;
  implementation `src/react.ts` in
  <https://github.com/pmndrs/zustand/blob/v5.0.15/src/react.ts>.
- The initializer receives `(set, get, store)`. `set` shallow-merges; `get`
  reads fresh state; `store` is the API.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create>.
- **Actions are declared inside the initializer, colocated with state** — this is
  the recommended shape:
  ```js
  const useBearStore = create((set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
  }))
  ```
  Source: <https://zustand.docs.pmnd.rs/learn/guides/practice-with-no-store-actions>
  ("The recommended usage is to colocate actions and states within the store").
- `createStore(stateCreatorFn)` from `zustand/vanilla` returns a **vanilla store**
  (no React hook) with the same API. `useStore(api, selector)` binds it to React.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create-store>;
  `src/vanilla.ts`.
- `create` also re-exports everything from `zustand/vanilla`
  (`src/index.ts` = `export * from './vanilla.ts'; export * from './react.ts'`),
  so `import { create, createStore } from 'zustand'` works; the docs convention is
  `createStore` from `zustand/vanilla`.
- `zustand/traditional` exposes `createWithEqualityFn` / `useStoreWithEqualityFn`
  for a custom equality function. It requires the `use-sync-external-store`
  package. This is the v4 escape hatch, not the main teaching API.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create-with-equality-fn>;
  <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>.
- v5 **dropped default exports** ("Drop default exports"). `import create from 'zustand'`
  is gone; use `import { create } from 'zustand'`.
  Source: <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>.

## 3. Selecting state and re-render semantics

- A component re-renders when the **selector's return value changes by
  `Object.is`** — that is React's default comparison for the external store, not a
  zustand option.
  Source: <https://react.dev/reference/react/useSyncExternalStore> ("If the store
  changes and the returned value is different (as compared by `Object.is`), React
  re-renders"); zustand's `useStore` is a thin wrapper over
  `React.useSyncExternalStore(api.subscribe, () => selector(api.getState()), () => selector(api.getInitialState()))`
  in `src/react.ts`.
- The selector re-runs on every store notification (and whenever React re-reads the
  snapshot), even for components that will not re-render. Keep selectors pure and
  cheap.
  Source: `src/react.ts`; <https://react.dev/reference/react/useSyncExternalStore>
  ("`getSnapshot`: … While the store has not changed, repeated calls to
  `getSnapshot` must return the same value").
- **Returning a fresh object/array/function from a selector is the classic v5
  footgun.** Because the wrapper/reference is recreated on every read, `Object.is`
  never matches, and v5 can enter an infinite update loop:
  `"Maximum update depth exceeded"` / React's
  `"The result of getSnapshot should be cached to avoid an infinite loop"`.
  Source: <https://zustand.docs.pmnd.rs/reference/hooks/use-shallow#i-get-maximum-update-depth-exceeded-when-reading-multiple-values-from-the-store>;
  <https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached>.
- Two safe fixes: one selector per field, or wrap the multi-value selector in
  `useShallow`. Example from the docs:
  ```js
  const { searchValue, setSearchValue } = useStore(
    useShallow((state) => ({
      searchValue: state.searchValue,
      setSearchValue: state.setSearchValue,
    })),
  )
  ```
  Source: same `use-shallow` troubleshooting section.
- **Derived state** belongs in a selector, not duplicated in the store. If the
  derivation allocates (`map`, `filter`, `Object.keys`, object literals), the
  selector returns a new reference; wrap it in `useShallow`, or accept a re-render
  per store change. `useShallow` does not make the computation cheaper — it only
  stabilizes the returned reference.
  Source: <https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow>.
- Declaring selectors inline is not itself a bug; the danger is an unstable
  **return value**. Hoisting selectors is still good practice. `useStore` passes
  the selector through `React.useCallback(..., [api, selector])`, so a new selector
  each render changes the snapshot callback, but React only re-renders on an
  `Object.is` change of the returned slice.

## 4. `useShallow`: exactly what it guards

- Signature: `useShallow<T, U = T>(selectorFn: (state: T) => U): (state: T) => U`.
  It returns a **memoized selector**: it calls the selector, then returns the
  previous result if the new one is shallow-equal to it.
  Source: <https://zustand.docs.pmnd.rs/reference/hooks/use-shallow>;
  `src/react/shallow.ts`.
- Implementation (v5.0.15) holds one `useRef` per hook instance:
  ```js
  function useShallow(selector) {
    const prev = React.useRef()
    return (state) => {
      const next = selector(state)
      return shallow(prev.current, next) ? prev.current : (prev.current = next)
    }
  }
  ```
  Source: `src/react/shallow.ts`.
- `shallow` compares **one level only** (`src/vanilla/shallow.ts`):
  `Object.is` first; then both values must be objects with the **same prototype**;
  iterables are compared element-wise (`Map`/`Set` by entries); plain objects by
  `Object.entries` with `Object.is` on each value. Nested objects are compared by
  reference. Source: `src/vanilla/shallow.ts`.
- It is a **React hook** — call it inside a component/hook, at the top level, like
  any hook. Do not call it in a store initializer or a non-React module.
- It guards only the selector's returned slice; it does not stop the selector from
  running and does not deep-compare nested structures.
- Import paths: `zustand/react/shallow`, or `zustand/shallow` (which also exports
  the vanilla `shallow`). Source: `package.json` `exports`; `src/shallow.ts`.
- For vanilla (non-React) subscriptions, the equivalent is `shallow` as the
  `equalityFn` of `subscribeWithSelector` (section 6).

## 5. Updating state

- `set(partial)` performs a **shallow merge** at the top level. `set(partial, true)`
  / `setState(partial, true)` **replaces** the whole state.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create>;
  <https://zustand.docs.pmnd.rs/learn/guides/immutable-state-and-merging>.
- Nested objects are **not** merged one level deep: you must spread each level, or
  use the `immer` middleware.
  Source: <https://zustand.docs.pmnd.rs/learn/guides/immutable-state-and-merging>;
  <https://zustand.docs.pmnd.rs/learn/guides/updating-state>.
- State must be updated immutably. Mutating in place does not notify subscribers
  (`Object.is(next, prev)` is true), so the UI does not update:
  `person.firstName = e.target.value` is the documented "screen doesn't update"
  bug.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create#ive-updated-the-state-but-the-screen-doesnt-update>.
- `set` accepts either a value or an updater function `(state) => partial`.
  Prefer the updater form when the next value depends on the previous one.
  Source: <https://zustand.docs.pmnd.rs/reference/apis/create>.
- **v5 TypeScript change:** with `replace: true`, `setState` now requires a complete
  `T`, not `Partial<T>`. `store.setState({}, true)` no longer compiles.
  Source: <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>
  ("Stricter types when setState's replace flag is set").

## 6. Reading/writing state outside a component

- A `create` store exposes `getState()`, `setState(...)`,
  `getInitialState()`, and `subscribe(listener) => unsubscribe`.
  `subscribe` fires **synchronously on every change** with `(state, prevState)`.
  Source: <https://github.com/pmndrs/zustand/blob/v5.0.15/readme.md>
  ("Reading/writing state and reacting to changes outside of components");
  `src/vanilla.ts`.
- `subscribeWithSelector` middleware adds the selector form:
  `subscribe(selector, listener, { equalityFn, fireImmediately })`, where the
  listener gets `(selected, previousSelected)`.
  Source: <https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector>;
  `src/middleware/subscribeWithSelector.ts`.
- "Transient updates" (subscribe into a ref, mutate the DOM directly) are the
  documented way to avoid re-renders for high-frequency changes.
  Source: same readme section.
- Docs warning: middlewares that wrap `set`/`get` are **not** applied to
  `getState`/`setState` (the `immer` middleware is the exception: it explicitly
  patches `store.setState` — see section 9).
  Source: same readme section; `src/middleware/immer.ts`.
- **Does the workshop site need this?** For the 12 teaching pages, no — every page
  can be built with the hook plus selectors. `getState()`/`subscribe()` are worth
  one optional "escape hatch" mention (event handlers outside React, transient
  updates, `persist.rehydrate()`), not a required page. `useShallow` +
  selectors cover the performance page. This is a curriculum call, flagged as
  such (not a zustand API fact).

## 7. Async actions inside a store

- Async actions are just async functions in the initializer; they call `set` when
  the promise resolves. Minimal documented shape:
  ```js
  export const useBearStore = create((set) => ({
    bears: 0,
    fetchBears: async () => {
      const res = await fetch('/api/bears')
      const data = await res.json()
      set({ bears: data.count })
    },
  }))
  ```
  Source: <https://github.com/pmndrs/zustand/blob/v5.0.15/docs/learn/guides/beginner-typescript.md>
  ("Async Actions").
- The docs only show the happy path. A shape that "keeps the store honest"
  (derived from the docs' immutable-update rules, not a dedicated docs page) is an
  explicit status field plus `try`/`catch`/`finally`:
  ```js
  fetchTodos: async () => {
    set({ status: 'loading', error: null })
    try {
      const res = await fetch('/api/todos')
      if (!res.ok) throw new Error(res.statusText)
      set({ todos: await res.json(), status: 'success' })
    } catch (error) {
      set({ error, status: 'error' })
    }
  }
  ```
  Recommended: `status: 'idle' | 'loading' | 'success' | 'error'`, a separate
  `error`, and set loading before the first `await`. Because a store action can be
  fired twice, guard against out-of-order responses (request id or
  `AbortController`) if the brief asks for it — **the docs do not document a
  race-handling pattern**, so this is engineering guidance, not a cited zustand
  fact (see "Unanswered / not authoritative").
- `set` after an `await` is fine: the store is a plain module singleton, not
  React state.
- StrictMode can double-fire an Effect that calls `fetchX()`; see section 12.

## 8. `persist` middleware

Import: `import { persist, createJSONStorage } from 'zustand/middleware'`.
`persist(stateCreatorFn, options)` returns a state creator.
Source: <https://zustand.docs.pmnd.rs/reference/middlewares/persist>.

Options (all from the type `PersistOptions` in
`src/middleware/persist.ts` / the docs page):

| Option | Behavior |
| --- | --- |
| `name` (required) | Storage key. |
| `storage` | `PersistStorage`; defaults to `createJSONStorage(() => localStorage)`. `createJSONStorage`'s getter is lazy, avoiding SSR crashes. |
| `partialize` | `(state) => persistedState`; filters what is written. Default is identity (whole state). |
| `version` | Number. On mismatch vs. the stored value, `migrate` runs; if no `migrate`, the stored value is discarded. Default `0`. |
| `migrate` | `(persistedState, version) => PersistedState \| Promise<PersistedState>`. |
| `merge` | `(persistedState, currentState) => S`. Default is a **shallow** merge `{ ...currentState, ...persistedState }`. |
| `onRehydrateStorage` | `(state) => ((state?, error?) => void) \| void`. Outer runs before rehydration, returned inner runs after (or on error). |
| `skipHydration` | Default `false`. If `true`, call `store.persist.rehydrate()` yourself (SSR). |

- Stored JSON shape: `{ state: <partialized state>, version: <version> }`.
  Source: `src/middleware/persist.ts` (`setItem`).
- Extra API on the store: `persist.setOptions`, `clearStorage`, `rehydrate`,
  `hasHydrated`, `onHydrate`, `onFinishHydration`, `getOptions`.
  Source: `PersistOptions` / `StorePersist` in `src/middleware/persist.ts`.
- **What the learner observes on reload (sync `localStorage`):** hydration is
  synchronous and happens at store creation, so the first render already shows the
  persisted value. With an **async** storage (e.g. `AsyncStorage`), the store is
  hydrated in a microtask after the first render; wait via `persist.hasHydrated()` /
  `onFinishHydration` before rendering persisted-dependent UI.
  Source: <https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data>
  ("Hydration and asynchronous storages").
- `createJSONStorage` does no runtime validation; corrupt/stale/tampered data is
  cast to the state type. The docs recommend a validating `PersistStorage` in
  production. Source: `persist` docs page warning.
- **v5 behavior change:** v5 no longer writes the initial state to storage **at
  store creation** (the change was also backported to v4.5.5). Before that, the
  initial value was stored immediately; in v5 the storage entry appears only after
  the first update. A workshop demo that
  "create the store, reload, expect localStorage to have a value" looks broken if
  written the v4 way.
  Source: <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>
  ("Persist middleware no longer stores item at store creation").
- Version/migrate example from the docs:
  ```js
  persist(initializer, {
    name: 'position-storage',
    version: 1,
    migrate: (persisted, version) => {
      if (version === 0) {
        persisted.position = { x: persisted.x, y: persisted.y }
        delete persisted.x
        delete persisted.y
      }
      return persisted
    },
  })
  ```
  Source: <https://zustand.docs.pmnd.rs/reference/middlewares/persist>
  ("Persisting a state through versioning and migrations").

## 9. `immer` middleware

- `import { immer } from 'zustand/middleware/immer'`; requires `immer` installed
  (`immer >= 9.0.6` peer). Source: <https://zustand.docs.pmnd.rs/reference/middlewares/immer>.
- Usage: `create(immer((set) => ({ ... })))`.
- **Call-signature change under `immer`:** the updater passed to `set` receives a
  mutable `Draft<T>` and **must mutate and return nothing**:
  ```js
  set((state) => {
    state.deep.nested.obj.count += 1   // no return
  })
  ```
  Contrast with plain `set`, where the updater **returns** a new partial object.
  Mixing the two (mutating and returning a value) is a bug.
  Source: <https://zustand.docs.pmnd.rs/reference/middlewares/immer>;
  `src/middleware/immer.ts` (`produce(updater)`).
- `immer` wraps both the `set` given to the initializer and `api.setState`, so
  `useStore.setState((draft) => { ... })` also works. Source: `src/middleware/immer.ts`.
- Middleware order: put `devtools` **last/outermost**:
  `devtools(immer(...))`, not `immer(devtools(...))`, because `devtools` mutates
  `setState` and must see the final one.
  Source: <https://github.com/pmndrs/zustand/blob/v5.0.15/docs/learn/guides/advanced-typescript.md>
  ("Using middlewares").

## 10. `devtools` middleware

- `import { devtools } from 'zustand/middleware'`; requires
  `@redux-devtools/extension` for the browser integration.
  Source: <https://zustand.docs.pmnd.rs/reference/middlewares/devtools>.
- Enabled in development, disabled in production by default (`enabled` option
  overrides). Options: `name`, `enabled`, `anonymousActionType`, `store`,
  `actionsDenylist`. Source: same docs page; `src/middleware/devtools.ts`.
- **Action naming:** the third argument to `set` names the action; the second must
  be `undefined` unless you also want to change the replace flag:
  `set((state) => ({ ... }), undefined, 'jungle/addBear')`. Without a name, actions
  show as `anonymous` (or the value of `anonymousActionType`).
  Source: same docs page ("All action names are labeled as 'anonymous'").
- In the slices pattern, each slice's `set` needs the third argument; the docs show
  the exact `StateCreator<JungleStore, [['zustand/devtools', never]], [], BearSlice>`
  typing. Source: same docs page.
- Cleanup: `useStore.devtools.cleanup()`.
  Source: same docs page ("Cleanup").

## 11. Slices pattern (recommended shape)

- Language-agnostic shape: each feature exports a slice creator taking `(set, get)`
  and returning its own state+actions; the bound store spreads them:
  ```js
  export const createBearSlice = (set) => ({
    bears: 0,
    addBear: () => set((state) => ({ bears: state.bears + 1 })),
  })
  export const createFishSlice = (set) => ({
    fishes: 0,
    addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
  })
  export const useBoundStore = create((...a) => ({
    ...createBearSlice(...a),
    ...createFishSlice(...a),
  }))
  ```
  Source: <https://zustand.docs.pmnd.rs/learn/guides/slices-pattern>.
- Cross-slice actions use `get()`:
  `addBearAndFish: () => { get().addBear(); get().addFish() }`.
  Source: same guide.
- **Apply middleware only in the combined store, never inside individual slices**
  ("Applying them inside individual slices can lead to unexpected issues").
  Persist example wraps the combined initializer:
  ```js
  create(persist((...a) => ({ ...createBearSlice(...a), ...createFishSlice(...a) }), { name: 'bound-store' }))
  ```
  Source: same guide.
- TypeScript slices need the explicit `StateCreator<BearSlice & FishSlice, [], [], BearSlice>`
  annotation; the shared slice uses both `set` and `get`. The docs note this shape
  is a deliberate "lie" that works because each slice type is a subtype of the
  combined state. Source:
  <https://github.com/pmndrs/zustand/blob/v5.0.15/docs/learn/guides/advanced-typescript.md#slices-pattern>.

## 12. React 19 and StrictMode gotchas

Verified from the React docs (React 19 behavior is the same as React 18 here):

- In development, StrictMode **re-renders components an extra time**, **re-runs
  Effects an extra time** (setup → cleanup → setup), and **re-runs ref callbacks
  an extra time**. It also calls functions passed to `useState`, `set`
  functions, `useMemo`, and `useReducer` twice.
  Source: <https://react.dev/reference/react/StrictMode>.
- Consequence for this ladder:
  - A store created at **module scope** (the docs' pattern) is created once. Its
    initializer is **not** re-invoked by StrictMode.
  - A store created inside a component body (e.g. `useState(() => create(...))`
    or calling `create(...)` in render) **is** affected: the initializer can run
    twice in dev, and a store created without `useState`/`useRef` is created on
    every render. Teach module-scope stores.
  - A `useEffect(() => { store.fetch() }, [])` fires **twice in dev StrictMode**,
    so a fetch-on-mount demo shows two network requests. This is expected React
    behavior, not a zustand bug; mention it in the async page so learners don't
    "fix" a non-bug.
- The v5 `"Maximum update depth exceeded"` / `"The result of getSnapshot should
  be cached"` failure is the most common way a "goal demo" looks broken; it is the
  selector-reference problem from section 3, and it is a **v5 behavior change**
  from v4. Source: `use-shallow` docs troubleshooting; React
  `useSyncExternalStore`.
- `useStore` uses `React.useSyncExternalStore` (not
  `useSyncExternalStoreWithSelector`), which is why there is no built-in custom
  equality and why the snapshot must be cached. Source: `src/react.ts`.
- React 19 sets no new requirement for zustand beyond React 18; zustand v5's peer
  is `react >= 18`. Source: `package.json`.

## 13. Facts that contradict common tutorial advice

1. **`create` no longer takes an equality function.** v4's
   `useStore(selector, shallow)` / `create(...)` + custom equality is gone; use
   `useShallow(selector)` or `createWithEqualityFn` from `zustand/traditional`.
   Many blog posts still show the v4 form.
   Source: <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>.
2. **Returning `{...}` or `[...]` from a selector can infinite-loop in v5.** v4
   tolerated it (via `useSyncExternalStoreWithSelector`); v5 will not. Common
   tutorials teach the object-returning selector without `useShallow`.
   Source: migrating-to-v5 "Requiring stable selector outputs".
3. **`persist` no longer writes initial state at store creation.** The v4 "reload
   and see it in localStorage immediately" demo needs an explicit `setState` after
   creation in v5.
   Source: migrating-to-v5.
4. **`zustand/shallow`'s `shallow` is not a deep compare and is not the default.**
   The default is `Object.is`; `shallow`/`useShallow` are opt-in, one level deep.
   Source: `src/vanilla/shallow.ts`.
5. **`set((state) => { ... })` under `immer` returns nothing.** Plain `set`
   updaters return a partial; immer updaters mutate a draft. Tutorials that mix
   the two produce silent bugs.
   Source: `src/middleware/immer.ts`.
6. **`subscribe` is synchronous and fires on every `set`, not only when the
   selected slice changes.** To filter, use `subscribeWithSelector` +
   `equalityFn`.
   Source: `src/vanilla.ts`; `src/middleware/subscribeWithSelector.ts`.
7. **`set` only shallow-merges one level.** Nested updates require spreading each
   level or `immer`; this contradicts "zustand handles immutability for you".
   Source: immutable-state-and-merging guide.
8. **`create` is not a context/provider.** There is no provider; the store is a
   module singleton. Multiple stores are separate modules, not `Provider`s.
   Source: introduction; flux-inspired-practice ("Single store").

## 14. v4 → v5 differences relevant to the ladder

From <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>:

- No default exports.
- No custom equality function on `create` (use `useShallow` or
  `zustand/traditional`).
- Selectors that return new references can infinite-loop (stable selector outputs
  required).
- React 18 minimum; `use-sync-external-store` is a peer for the
  `zustand/traditional` entry only.
- TypeScript 4.5 minimum.
- `setState(x, true)` typed as full `T`, not `Partial<T>`.
- `persist` does not write state at store creation.
- Dropped deprecated features, UMD/SystemJS, and ES5 output.

## 15. Unanswered / not authoritative

- **Race handling for async actions:** the official docs show only the happy-path
  `fetch`; there is no first-party documented pattern for out-of-order responses,
  cancellation, or request de-duplication. Section 7's guard is engineering
  guidance, not a cited zustand fact.
- **"Does the site need `getState`/`setState`/`subscribe` outside components?"** is
  a curriculum decision, not something the docs answer. This note records the API
  facts and a recommendation (section 6, marked as a judgment call).
- The docs' `persist` "Troubleshooting" section is literally `TBD`, so failure-mode
  claims are traced to source code and the two persist pages instead.
  Source: `src/middleware/persist.ts`; persisting-store-data guide.
- The docs site's old `/guides/...` and `/apis/...` URLs 404; the current scheme is
  `/reference/...` and `/learn/...` (confirmed by fetching each page's `<title>`).
  Any learner-facing link should use the current paths.

## 16. Sources

Primary docs (all verified live):

- create: <https://zustand.docs.pmnd.rs/reference/apis/create>
- createStore: <https://zustand.docs.pmnd.rs/reference/apis/create-store>
- createWithEqualityFn: <https://zustand.docs.pmnd.rs/reference/apis/create-with-equality-fn>
- useShallow: <https://zustand.docs.pmnd.rs/reference/hooks/use-shallow>
- prevent re-renders with useShallow: <https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow>
- updating state: <https://zustand.docs.pmnd.rs/learn/guides/updating-state>
- immutable state and merging: <https://zustand.docs.pmnd.rs/learn/guides/immutable-state-and-merging>
- practice with no store actions: <https://zustand.docs.pmnd.rs/learn/guides/practice-with-no-store-actions>
- flux inspired practice: <https://zustand.docs.pmnd.rs/learn/guides/flux-inspired-practice>
- slices pattern: <https://zustand.docs.pmnd.rs/learn/guides/slices-pattern>
- how to reset state: <https://zustand.docs.pmnd.rs/learn/guides/how-to-reset-state>
- persist: <https://zustand.docs.pmnd.rs/reference/middlewares/persist>
- persisting store data: <https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data>
- immer: <https://zustand.docs.pmnd.rs/reference/middlewares/immer>
- devtools: <https://zustand.docs.pmnd.rs/reference/middlewares/devtools>
- subscribeWithSelector: <https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector>
- migrate to v5: <https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5>
- introduction: <https://zustand.docs.pmnd.rs/learn/getting-started/introduction>

Source code (tag `v5.0.15`, equals the published `zustand@5.0.15`):

- `package.json` (peer deps, `exports`): <https://github.com/pmndrs/zustand/blob/v5.0.15/package.json>
- `src/react.ts` (`create`, `useStore` → `useSyncExternalStore`): <https://github.com/pmndrs/zustand/blob/v5.0.15/src/react.ts>
- `src/vanilla.ts` (`createStore`, `setState` shallow merge / replace / `Object.is`, `subscribe`): <https://github.com/pmndrs/zustand/blob/v5.0.15/src/vanilla.ts>
- `src/react/shallow.ts` (`useShallow`): <https://github.com/pmndrs/zustand/blob/v5.0.15/src/react/shallow.ts>
- `src/vanilla/shallow.ts` (`shallow` one-level semantics): <https://github.com/pmndrs/zustand/blob/v5.0.15/src/vanilla/shallow.ts>
- `src/middleware/persist.ts` (options, merge, version/migrate, hydration): <https://github.com/pmndrs/zustand/blob/v5.0.15/src/middleware/persist.ts>
- `src/middleware/immer.ts` (`produce`, patches `store.setState`): <https://github.com/pmndrs/zustand/blob/v5.0.15/src/middleware/immer.ts>
- `src/middleware/devtools.ts`: <https://github.com/pmndrs/zustand/blob/v5.0.15/src/middleware/devtools.ts>
- `src/middleware/subscribeWithSelector.ts`: <https://github.com/pmndrs/zustand/blob/v5.0.15/src/middleware/subscribeWithSelector.ts>
- `readme.md` (non-React API, transient updates): <https://github.com/pmndrs/zustand/blob/v5.0.15/readme.md>
- `docs/learn/guides/beginner-typescript.md` (async actions): <https://github.com/pmndrs/zustand/blob/v5.0.15/docs/learn/guides/beginner-typescript.md>
- `docs/learn/guides/advanced-typescript.md` (TS slices, middleware order): <https://github.com/pmndrs/zustand/blob/v5.0.15/docs/learn/guides/advanced-typescript.md>

React docs:

- StrictMode: <https://react.dev/reference/react/StrictMode>
- useSyncExternalStore: <https://react.dev/reference/react/useSyncExternalStore>
