# Shell prototype (throwaway)

Three structurally different variants of the site shell and page template,
switchable on one route. Owned by *Site shell and page template prototype*
([#7](https://github.com/ArrayaWongsaita/dn_zustand_workshop/issues/7)).

```
pnpm dev
/prototype/shell?variant=A            ← home, three variants
/prototype/shell/01-counter?variant=A ← a real page 01 rendered by the shell
```

← / → cycle the variant; the choice lives in the URL.

- **A — Sidebar ladder**: persistent left sidebar grouped by tier, content column, prev/next at the top.
- **B — Top rail + reading column**: sticky top rail of twelve stops, full-bleed demo band, narrow reading column, reveal as a full-width band.
- **C — Split workspace (demo first)**: number rail + large live demo pane on the left, docs column on the right.

Notes:

- Thai copy for page 01 is **placeholder**; final copy comes from the briefs (#8–#12).
- The prototype deliberately renders page 01 through the real content model
  (`src/workshop/pages/01-counter/`) so the record, the one-implementation rule
  and the `?raw` reveal are exercised end to end.
- This directory is throwaway: the winning structure is folded into the real
  site and the full variant set moves to the throwaway branch (see the
  `prototype` skill).
