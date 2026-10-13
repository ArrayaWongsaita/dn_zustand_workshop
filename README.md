# dn_zustand_workshop

Source of the **Zustand workshop site** — a web app that teaches Zustand v5 through a twelve-page ladder of exercises.

Learners never clone this repository (see [ADR-0003](docs/adr/0003-learners-never-clone-this-repo.md)): they view the deployed site and write their own Vite + React project. Everything here is either the site itself or the spec for building it.

- **Curriculum spec (start here)**: [docs/workshop/README.md](docs/workshop/README.md)
- **Vocabulary**: [GLOSSARY.md](GLOSSARY.md)
- **Decisions**: [docs/adr/](docs/adr/)
- **Planning**: GitHub issues, on the map "Map: Zustand workshop curriculum spec"

## Development

Requires Node and pnpm.

```sh
pnpm install
pnpm dev      # dev server
pnpm build    # production build
pnpm lint     # oxlint
pnpm preview  # preview the build
```
