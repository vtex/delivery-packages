# AGENTS.md

## Project purpose

`@vtex/delivery-packages` is a **published JavaScript library** (npm: `@vtex/delivery-packages`) that provides helper functions for separating order items into delivery parcels and rendering delivery selection UIs. It is consumed by other VTEX frontends as a runtime dependency.

The library's central function is **`parcelify(order, options)`**, which groups items by:

1. Seller
2. SLA options
3. Selected SLA ID
4. Selected SLA Shipping Estimate
5. Selected SLA Delivery Channel
6. Packages already delivered (post-purchase scenario)
7. SLAs grouped by valid `availableDeliveryWindows`
8. Selected SLA Type (pickup vs pickup checked-in / take-away)

Beyond `parcelify`, the library exposes helpers for addresses, delivery channels, items, SLAs, scheduled delivery, check-in flow, and shipping computations.

## Sources of truth

- `README.md` — full public API documentation (this is also the npm README)
- `CHANGELOG.md` — release history
- `package.json` — scripts, deps, the `main` (CJS) + `module` (ESM) entry points
- `rollup.config.js` — build pipeline producing `dist/index.js` and `dist/index.esm.js`
- `_releasy.json` — release tooling config (Releasy)
- `pachamama.config` — VTEX internal service config
- `.github/CODEOWNERS` — repo ownership

## Local setup

Prerequisites:

- **Node.js** — repo predates an `.nvmrc`. Babel 6 + Rollup 0.56 + Jest 22 is old; Node 8–12 is the safest target
- **Package manager:** both `yarn.lock` and `package-lock.json` are present. Yarn is the historical choice; npm also works. `packageManager` is not pinned

Install:

```sh
yarn install
# or
npm install
```

Library development is **not** a "run the server" workflow — there is no dev server. The expected loop is:

1. Edit a source file in `src/`
2. Add or update the matching test in `tests/`
3. Run `yarn test` (or `npm test`)
4. Build with `yarn build` only when verifying the dist output

## Verified commands

Taken verbatim from `package.json`. Do not invent variants.

| Purpose | Command |
|---|---|
| Install deps | `yarn install` |
| Run tests | `yarn test` *(= `cross-env NODE_ENV=test jest`)* |
| Tests in watch mode | `yarn jest` *(= `jest --watch --verbose --coverage=false`)* |
| Tests with coverage | `yarn test:coverage` *(= `jest --coverage`)* |
| Production build (CJS + ESM into `dist/`) | `yarn build` *(= `cross-env NODE_ENV=production rollup -c`)* |
| Lint | `yarn lint` *(= `eslint src`)* |
| Lint with auto-fix | `yarn lint-fix` *(= `eslint src --fix --max-warnings 0`)* |
| Lint only changed files (used by husky) | `yarn lint-only-changed` |
| Pre-publish build | `npm run prepublishOnly` *(= `npm run build`)* |
| Post-release publish | `npm run postreleasy` *(= `npm publish`)* |

> `lint-not-beta` and `test-not-beta` exist as husky escape hatches that skip lint/tests on the `beta` branch. Do not invoke them directly.

## Architectural limits

```
src/
├── index.js                  # Public API surface — what consumers import
├── address.js                # Address helpers (findAddress, isPickupAddress, etc.)
├── checkin.js                # Pickup check-in flow helpers
├── constants.js              # Shared enums/constants (delivery channel types, etc.)
├── delivery-channel.js       # Delivery channel classification
├── items.js                  # Item-level helpers (sellers, indexes)
├── parcel.js                 # Parcel construction logic
├── polyfills.js              # Cross-runtime polyfills used internally
├── scheduled-delivery.js     # Scheduled delivery window logic
├── shipping.js               # Shipping computation helpers
├── sla.js                    # SLA selection and matching
├── utils.js                  # Tiny shared utilities
└── uuid.js                   # UUID generation
```

```
tests/
├── Order.json                # Large fixture of a realistic order
├── mockGenerator.js          # Shared helpers for building test inputs
├── address.test.js
├── checkin.test.js
├── delivery-channel.test.js
├── index.test.js             # Tests for the public parcelify export
├── items.test.js
├── scheduled-delivery.test.js
├── shipping.test.js
├── sla.test.js
└── utils.test.js
```

Module boundaries:

- **`src/index.js` is the public API.** Adding, removing, or changing the signature of a named export is a **breaking change** for downstream consumers
- **Source files in `src/` are mostly pure helper modules.** They should not pull in side-effectful dependencies or call any network/storage API
- **`src/polyfills.js` is intentionally minimal** — only polyfills required by helpers that ship to legacy runtimes
- **`src/constants.js` is the place for shared enums.** Do not duplicate string literals across modules
- **`tests/` mirrors `src/` one-to-one** (with the exception that `tests/index.test.js` covers `src/index.js` and the public `parcelify`)
- **`tests/Order.json` is a shared fixture.** Prefer extending it (carefully) over creating ad-hoc fixtures
- **`tests/mockGenerator.js` is the shared test helper.** Use it for constructing inputs in new tests

## Project-specific patterns

- **Pure ES modules in source.** Babel 6 transforms them, and Rollup builds two outputs: CommonJS (`dist/index.js`) and ESM (`dist/index.esm.js`). The `module` field in `package.json` points consumers to the ESM build for tree-shaking
- **No TypeScript.** JSDoc may be used for parameter documentation but is not enforced
- **The single npm dependency is `@vtex/estimate-calculator`** — adding a runtime dependency is a deliberate decision because every dep ships to every consumer of the library
- **Husky pre-push hooks** run lint and tests on changed files (with a `beta`-branch escape hatch)
- **Releases are gated by Releasy** (`_releasy.json`). Do not bump the version manually; do not run `npm publish` directly
- **`prepublishOnly` runs the build automatically** before publishing — relying on this hook is intentional

## Testing expectations

- Test framework: **Jest 22**, run via `yarn test`
- **Tests live in `tests/`** (not colocated with source). File naming: `<name>.test.js` to mirror the source module
- The large fixture `tests/Order.json` and the helper `tests/mockGenerator.js` are shared resources
- **What requires a unit test:**
  - Every new exported function added to `src/`
  - Every change to an exported function's behavior
  - Every bug fix — add a failing regression test before the fix
  - Logic that depends on `@vtex/estimate-calculator` outputs — mock the dependency in the test
- **What does NOT require a unit test:**
  - Pure dependency version bumps within the same major
  - Documentation-only changes to `README.md`
  - CHANGELOG updates
- Snapshot tests are not used in this repo. Prefer explicit assertions
- Coverage is collected via `yarn test:coverage` but no threshold is enforced today

## Expected skills

- **`specification`** — use for planning non-trivial changes before implementation (SDD Lite flow). Generates a spec under `specs/<feature>.md`
- **`implementing`** — use to implement an approved spec end-to-end
- **`context7-mcp`** — query up-to-date library docs (especially relevant for the very old versions of Babel 6, Jest 22, ESLint 4, Rollup 0.56 in this repo)

## Expected MCPs

- **GitHub MCP** — for cross-repo PR/issue context; this library is consumed by multiple VTEX frontends
- **VTEX External Docs MCP** — for VTEX Checkout API `orderForm` shape and SLA / delivery-channel definitions

## Autonomy limits

The agent **must not** do any of the following without explicit human approval:

- **Change the public API surface** — adding, removing, or renaming an export from `src/index.js`, or changing a parameter signature
- Modify `rollup.config.js` build pipeline — affects dist artifact shape and downstream consumers
- Modify `package.json` `main` / `module` entry-point fields
- Bump or change major versions of devDependencies (Babel 6, Jest 22, ESLint 4, Rollup 0.56) — coordinated tooling decision
- Add a runtime dependency (`dependencies` in `package.json`) — every dep ships to every consumer
- Modify `_releasy.json`, `pachamama.config`, or `.github/CODEOWNERS`
- Modify `.eslintrc`, `.babelrc`, or `.prettierrc` — toolchain authority
- Run `npm publish` or `yarn publish` — releases are gated by the team's process
- Bump the repository version (`package.json#version`) — managed by Releasy
- Add CI/CD workflows (`.github/workflows/`) without team approval
- Introduce TypeScript wholesale — incremental migration could be considered but is not routine
