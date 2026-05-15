---
name: sdd-lite-bootstrap
description: Walk through the SDD Lite workflow for a small task or bug fix in this repo.
---

# /sdd-lite-bootstrap

Use this command when the work is **small, contained, and lower risk**: bug fixes, additive helpers, focused refactors of internal modules. Most legitimate work in `@vtex/delivery-packages` fits here.

## Sequence

1. `/specification "<task description with definition of done>"`
   - Skill produces `specs/<feature-name>.md` with `status: Draft`
   - The skill opens a PR on branch `spec/<feature-name>` containing **only** the spec file
2. Review the PR, ask the PM if needed, edit the spec
3. **Manually flip** the spec's frontmatter `Status` from `Draft` to `Approved` and merge the spec PR
4. `/implementing "specs/<feature-name>.md"`
   - The skill runs non-interactively: branches `feat/<feature-name>` (or `fix/<feature-name>` for bug fixes), writes failing tests in `tests/`, implements minimal code in `src/`, runs `yarn lint` + `yarn test`, updates CHANGELOG, opens an implementation PR with named sections
   - On success, status moves to `Done`. If the spec is contradictory or blocked, the skill opens a GitHub issue titled `implementing blocked: <feature-name>` and ends — no half-baked PR
5. Standard code review and merge

## delivery-packages specific notes

- New source code is `.js` only — no TypeScript
- New tests go in `tests/<name>.test.js` (not colocated with source)
- Use `tests/mockGenerator.js` for building test inputs when possible
- For logic that depends on `@vtex/estimate-calculator`, mock the dependency at the test boundary
- Run `yarn lint` (= `eslint src`) and `yarn test` (= Jest) — husky enforces this on push
- New public functions must be re-exported from `src/index.js` and documented in `README.md`
- Do not write tests in CommonJS — use ES modules (Babel transforms them at test time)
- Do not commit `dist/` — it's generated at publish time by Rollup

## When to NOT use SDD Lite

Switch to `/sdd-full-bootstrap` if any of the following apply:

- Estimated effort >5 days
- **The work changes the public API** in a breaking way (removing exports, renaming parameters, changing return shapes, changing defaults) — see `.agents/rules/20-api-discipline.md`
- Adding a new runtime dependency to `dependencies` — every byte ships to every consumer; this is a coordinated decision
- Bumping a major version of a devDependency (Babel 6, Jest 22, ESLint 4, Rollup 0.56) — coordinated tooling decision
- Changes to `rollup.config.js` build configuration
- Changes to `package.json` `main`/`module` entry-point fields
- High ambiguity, unresolved product decisions
- Cross-consumer coordination needed for a breaking change
- Adding CI/CD workflows under `.github/workflows/`
