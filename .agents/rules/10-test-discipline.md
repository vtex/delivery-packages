---
name: test-discipline
description: Test-first conventions for delivery-packages changes.
applyTo: "src/**/*.js"
---

# Test discipline — vtex/delivery-packages

## Order of operations

1. Read the spec or bug description
2. Identify the function(s) in `src/` that change
3. Write or extend the corresponding test in `tests/<name>.test.js` (red first)
4. Implement the minimum code in `src/<name>.js` to flip them green
5. Run `yarn lint` and `yarn test` before opening a PR

Husky enforces lint + tests on push (`lint-not-beta` and `test-not-beta`).

## Test runner

- Test framework: **Jest 22**, run via `yarn test` (= `cross-env NODE_ENV=test jest`)
- Watch mode: `yarn jest` (= `jest --watch --verbose --coverage=false`)
- With coverage: `yarn test:coverage` (= `jest --coverage`)
- Pick **either** yarn or npm and stay consistent within a single PR

## File convention

- **Tests live in `tests/`** at repo root — they are **not colocated** with source
- File naming: `<name>.test.js` to mirror the source module
- Example: `src/parcel.js` → `tests/parcel.test.js`
- The public API tests (the `parcelify` function exported from `src/index.js`) live in `tests/index.test.js`

## Shared test helpers

- **`tests/Order.json`** — a large realistic fixture representing a VTEX order. Prefer extending it carefully over creating ad-hoc fixtures from scratch
- **`tests/mockGenerator.js`** — shared helper for building test inputs. Use it in new tests for consistency

## What requires a unit test

- Every new function added to `src/`
- Every change to an exported function's behavior (including parameter handling, return shape, edge cases)
- Every bug fix — add a failing regression test before the fix
- Logic that depends on `@vtex/estimate-calculator` — mock the dependency at the test boundary
- Breaking-change PRs — the test must explicitly verify the new behavior **and** the old behavior must be documented as removed in the CHANGELOG

## What does NOT require a unit test

- Pure dependency version bumps within the same major (when allowed)
- Documentation-only changes (`README.md`, `CHANGELOG.md`, inline comments)
- Changes to `.eslintrc`, `.prettierrc`, `.babelrc` configuration (which would themselves need team approval)

## Mocking conventions

- Use Jest's built-in mocking (`jest.fn`, `jest.mock`)
- Mock `@vtex/estimate-calculator` at the boundary — do not let real estimate calculations run inside helper tests
- Prefer constructing the input object directly (or via `mockGenerator.js`) over loading the full `Order.json` fixture when a small subset is sufficient
- Do not use `jest.config.js` overrides — the default Jest config is intentional

## Snapshot tests

- **Avoid snapshot tests in this repo.** Use explicit assertions on the return shape
- If a snapshot is unavoidable (e.g., for a large parcelify output), commit it deliberately and review every diff
- Never use `--updateSnapshot` to clear noise

## Coverage

- `yarn test:coverage` produces a report
- **No coverage threshold is enforced today**
- Do not let coverage drop on changed files
- Do not add a coverage threshold unilaterally — team decision
