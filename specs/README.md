# specs/

This directory contains SDD (Spec Driven Development) specification files for features in `@vtex/delivery-packages`.

## Structure

```
specs/
└── <feature-name>/
    └── spec.md          # committed — the source of truth for the feature
```

Ephemeral artifacts (`plan.md`, `tasks.md`, `analysis.md`) are **not committed** — they live only in the agent session.

## How specs get created

- **SDD Lite** (most work in this repo): run `/sdd-lite-bootstrap` → `/specification "<task>"` generates `specs/<feature-name>.md`
- **SDD Full** (rare — public-API-changing work): run `/sdd-full-bootstrap` → `/speckit.specify` generates `specs/<feature>/spec.md`

See `.agents/commands/` for the full workflow details.

## Spec lifecycle

| Status | Meaning |
|--------|---------|
| `Draft` | Created by agent, pending review |
| `Approved` | Reviewed and approved — safe to implement |
| `Done` | Implementation merged |

Flip `Status` in the spec frontmatter manually after review. Do not merge a spec in `Draft` state.

## What goes in a spec

Each spec follows the SDD template with three sections:

1. **Business Context** — user story, acceptance criteria, key scenarios
2. **Arch Decisions** — key decisions, risks, mitigations
3. **Technical Contract** — interfaces, data shapes, integration points

## delivery-packages specific notes

- Specs touching the **public API** (any export from `src/index.js`) must list the affected exports and classify the change as additive vs breaking — see `.agents/rules/20-api-discipline.md`
- Specs proposing a breaking change must include cross-consumer impact analysis in Arch Decisions / Risks & Mitigations
- Specs adding a runtime dependency (`dependencies` in `package.json`) must justify why an existing dep (`@vtex/estimate-calculator`) or a small internal helper isn't sufficient
- Specs touching `rollup.config.js`, `_releasy.json`, or `pachamama.config` require team approval and are rarely appropriate as a routine spec
- All implementation must follow `.agents/rules/` — JS only, tests in `tests/`, ESLint clean, Prettier-formatted
