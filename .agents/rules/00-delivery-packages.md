---
name: delivery-packages-baseline
description: Baseline rules every agent must follow when editing this repo.
applyTo: "**/*"
---

# Baseline rules — vtex/delivery-packages

These rules apply to **every** agent conversation in this repo. They override generic best practices and codify the library's standards.

## Repository purpose

`@vtex/delivery-packages` is a **published JavaScript library** (npm: `@vtex/delivery-packages`) that provides helper functions for splitting order items into delivery parcels and supporting delivery-selection UIs. It is consumed as a runtime dependency by multiple VTEX frontends.

Because this is a published library — not an application — **every change to the public API affects every consumer**.

## Stack (do not invent alternatives — versions are deliberately frozen)

- **Build system:** Rollup 0.56 driven by `rollup.config.js`. Produces two dist outputs:
  - `dist/index.js` — CommonJS (`main` in package.json)
  - `dist/index.esm.js` — ES Modules (`module` in package.json, for tree-shaking)
- **Transpilation:** Babel 6 with `babel-preset-env` and `babel-plugin-transform-object-rest-spread`. Production build uses `external-helpers` to keep dist size small. The `production` env preset sets `modules: false` so Rollup can do the ESM emission
- **Source language:** JavaScript only — pure ES modules using `import`/`export`. No TypeScript
- **Testing:** Jest 22 + babel-jest 22
- **Linting:** ESLint 4 with `eslint-config-vtex` + `eslint-plugin-jest`
- **Formatting:** Prettier — no semicolons, single quotes, trailing comma es5
- **Git hooks:** Husky 1
- **Package manager:** both `yarn.lock` and `package-lock.json` exist; Yarn is the historical choice but npm works
- **The single runtime dependency** is `@vtex/estimate-calculator`. Adding a second is a deliberate decision

## Code style — non-negotiable

- New code is **JavaScript only** — no TypeScript
- 2 spaces, LF, UTF-8
- ESLint authority: `eslint-config-vtex` via `.eslintrc`. Plugin: `eslint-plugin-jest`
- Prettier authority: `.prettierrc` (no semicolons, single quotes, trailing comma es5)
- **Always run `yarn lint` and `yarn test` before opening a PR** — husky enforces this on push
- Never disable an ESLint rule without an inline comment explaining why

## Public API discipline

This is the most important rule for this repo:

- **The public API is whatever `src/index.js` re-exports.** Adding, removing, or renaming a named export is a **breaking change**
- **Parameter signatures are part of the contract.** Adding a parameter at the end is non-breaking; adding it in the middle, renaming it, or changing its semantics is breaking
- **Return shape is part of the contract.** Renaming a field on a returned object is breaking
- **Defaults are part of the contract.** Changing a default value is breaking
- Breaking changes require:
  - `BREAKING CHANGE:` footer in the Conventional Commit
  - Explicit call-out in the PR description
  - A `### Breaking Changes` section in `CHANGELOG.md`
  - Coordination with downstream consumers — agents do not make this call alone

## Architectural rules

- **Source files in `src/` are pure helpers.** No side effects beyond returning values. No network calls. No DOM access. No storage access
- **`src/index.js` is the public surface.** Internal-only helpers must not be re-exported from `index.js`
- **`src/constants.js` is the place for shared enums.** Do not duplicate string literals across modules
- **`src/polyfills.js` is intentionally minimal** — only polyfills strictly required by the helpers
- **No runtime side effects on import.** Importing any module from `src/` must not register globals, attach listeners, or run network calls
- **`dist/` is generated** — never commit, never edit by hand

## Dependency rules

- **The single runtime dependency is `@vtex/estimate-calculator`.** Adding another `dependencies` entry requires explicit justification — every byte ships to every consumer
- **devDependencies are pinned to old major versions** (Babel 6, Jest 22, ESLint 4, Rollup 0.56) — bumping is a coordinated tooling decision, not a casual change
- **Do not add a `peerDependency`** without team approval — peer deps complicate consumer installs
- **Do not switch package manager** between yarn and npm in a single PR — pick one and stay consistent with the surrounding commits

## Versioning & releases

- Releases are gated by **Releasy** (`_releasy.json`)
- Agents do **not** bump the version in `package.json` or run `npm publish` / `yarn publish`
- `CHANGELOG.md` follows Keep a Changelog. Breaking changes go under `### Breaking Changes` — not under `### Changed`
- The `prepublishOnly` hook ensures `dist/` is rebuilt before publishing

## Husky hooks

- `lint-not-beta` and `test-not-beta` are husky hooks that run lint and tests on changed files. They skip on the `beta` branch (which is the release-staging branch)
- Do not bypass husky with `--no-verify` to "make CI pass" — fix the underlying issue instead

## Sensitive areas — extra caution

- `src/index.js` — public API surface
- `src/parcel.js` — parcelify is the central function of the library; bugs here propagate to every consumer
- `src/sla.js` — SLA selection logic; bugs affect shipping options shown to shoppers
- `src/shipping.js` — shipping computation; bugs may show wrong delivery dates
- `tests/Order.json` — shared fixture; changing it can break unrelated tests
- `rollup.config.js` — changing dist output structure affects downstream resolution

## Autonomy limits — always ask before crossing these

- **Do not change the public API surface** (`src/index.js` re-exports, parameter signatures, return shapes, default values)
- **Do not modify `rollup.config.js`** or `package.json` `main`/`module` fields
- **Do not bump major versions** of Babel 6, Jest 22, ESLint 4, Rollup 0.56
- **Do not add a new runtime dependency** to `dependencies`
- **Do not modify `_releasy.json`, `pachamama.config`, or `.github/CODEOWNERS`**
- **Do not modify `.eslintrc`, `.babelrc`, or `.prettierrc`**
- **Do not run `npm publish` / `yarn publish`** — releases are team-gated
- **Do not bump the repo version** in `package.json` — Releasy manages it
- **Do not add CI/CD workflows** under `.github/workflows/` without team approval
- **Do not introduce TypeScript wholesale**

## Things NOT to do

- Do not re-export internal helpers from `src/index.js` to make them "easier to test" — write the test against the internal module directly
- Do not write tests in CommonJS (`require`/`module.exports`) — the Jest setup uses Babel to transform ES modules
- Do not commit `dist/`
- Do not commit `.env`, real credentials, or API keys
- Do not use `--no-verify` to bypass husky
- Do not introduce snapshot tests as a primary verification mechanism — prefer explicit assertions
