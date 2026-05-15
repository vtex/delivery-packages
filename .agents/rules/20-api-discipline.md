---
name: api-discipline
description: Rules for changes to the public API surface of @vtex/delivery-packages.
applyTo: "src/**/*.js"
---

# Public API discipline — vtex/delivery-packages

This rule is **specific to libraries** — most VTEX repos are applications. This repo publishes to npm, and every named export from `src/index.js` is a public contract with downstream consumers.

## What counts as the public API

- Every named export re-exported from `src/index.js`
- The signature (parameter names, order, types) of those functions
- The return shape (field names, optionality, types) of those functions
- The default value of any optional parameter
- The semantics of side-effects-free operations (idempotence, ordering)

## What is internal

- Functions in `src/<module>.js` that are **not** re-exported from `src/index.js`
- Helpers in `tests/mockGenerator.js`
- Constants in `src/constants.js` that are not re-exported

Internal helpers may change freely without a breaking-change ceremony — but they still require updated tests when their behavior changes.

## Adding a new public function

1. Implement the function in the appropriate `src/<module>.js`
2. Re-export it from `src/index.js`
3. Write a test in `tests/<module>.test.js` covering at least the happy path and one failure case
4. Add a test in `tests/index.test.js` confirming the function is exported (smoke check)
5. Document the function in `README.md` under the appropriate section (Address, SLA, etc.)
6. Add an entry to `CHANGELOG.md` under `### Added`

## Changing an existing public function

Decide whether the change is:

| Change | Type | Required ceremony |
|--------|------|-------------------|
| Add a new optional parameter at the end | Non-breaking | `### Changed` in CHANGELOG |
| Change a default value | **Breaking** | `BREAKING CHANGE:` footer + `### Breaking Changes` |
| Rename a parameter | **Breaking** (named-arg consumers) | full ceremony |
| Add a parameter in the middle | **Breaking** | full ceremony |
| Add a new field to the returned object | Non-breaking | `### Changed` |
| Rename a field on the returned object | **Breaking** | full ceremony |
| Remove a field from the returned object | **Breaking** | full ceremony |
| Change return semantics (e.g., sorted → unsorted) | **Breaking** | full ceremony |
| Add a new throw case | **Breaking** | full ceremony |
| Tighten input validation | **Possibly breaking** | flag for human review |

When in doubt, treat the change as breaking and flag it for human review before implementing.

## Removing a public function

1. The removal is **always** a breaking change
2. `BREAKING CHANGE:` footer in the Conventional Commit
3. `### Breaking Changes` entry in `CHANGELOG.md`
4. Justify why removal (rather than deprecation) is acceptable
5. Coordinate with downstream consumers — agents do not make this call alone

## Deprecation path

When a function is becoming undesirable but cannot be removed immediately:

1. Add a deprecation notice in JSDoc (`@deprecated`)
2. Add an entry in `CHANGELOG.md` under `### Deprecated`
3. Keep the function working for the entire current major version
4. Remove only in the next major version, with a `BREAKING CHANGE:` footer

## Cross-consumer impact awareness

Before changing the public API, consider that consumers include multiple VTEX frontends. A subtle return-shape change that "looks the same" to a unit test may break a consumer that destructures the result with property access.

If a change feels risky:

1. Stop and document the risk in the spec
2. Ask for human review of the cross-consumer impact
3. Prefer additive changes (new function, new optional parameter) over modifying an existing surface
