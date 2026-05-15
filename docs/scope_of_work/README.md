# Scope of Work

This directory contains scoped scope-of-work documents for features and tasks in `@vtex/delivery-packages`. Each file scopes a specific initiative before the SDD Full workflow begins.

> **Reminder:** this is a **published library**. Most legitimate work fits SDD Lite or doesn't need a scope-of-work document. Use this folder only when SDD Full is genuinely warranted — typically when the public API is changing in a non-trivial way.

## When to create a scope-of-work document

Create a file here before running `/sdd-full-bootstrap` for tasks that are:

- Estimated at >5 days of effort
- Cross-consumer in impact (breaking changes to the public API that affect multiple downstream consumers)
- Major-version dependency upgrades (Babel, Jest, ESLint, Rollup)
- Significant architectural changes
- Driven by a PRD, RFC, or Jira ticket

For smaller tasks, go directly to `/sdd-lite-bootstrap` — no scope-of-work document needed.

## File naming

```
docs/scope_of_work/<feature-name>.md
```

Use the same `<feature-name>` that will be used for the spec (`specs/<feature-name>/spec.md`) and the branch (`feat/<feature-name>`).

## Template

```markdown
# Scope of Work — <feature name>

## Context

<One paragraph describing the business problem and why it needs to be solved.>

## Goal

<What success looks like. 2-3 bullet points max.>

## Out of scope

<What this initiative explicitly does NOT cover.>

## Inputs

- PRD / RFC: <link>
- Jira ticket: <link>
- Related specs: <link>

## Public API impact

<Whether this work adds, removes, or modifies any export in src/index.js. List affected exports explicitly.>

## Cross-consumer impact

<List the known downstream consumers of @vtex/delivery-packages and the exported functions they depend on. For breaking changes, propose a deprecation path.>

## Key constraints

<Relevant technical constraints — e.g., "must keep CJS + ESM dist outputs", "must not add a new runtime dependency", "must work with Babel 6".>

## Open questions

<Unresolved questions to clarify before speccing.>
```
