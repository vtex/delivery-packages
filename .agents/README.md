# .agents/

Canonical home for AI-agent artifacts in this repo. Follows the **VTEX Engineering Golden Path** layout:

```
.agents/
├── skills/         # Slash-invokable skills — vendored verbatim from vtex/vtex-agent-skills
│   ├── specification/{SKILL.md, references/template.md}
│   └── implementing/SKILL.md
├── commands/       # Custom slash commands (workflow bootstraps for THIS repo)
│   ├── sdd-full-bootstrap.md
│   └── sdd-lite-bootstrap.md
└── rules/          # Always-on rules applied to every conversation (REPO-SPECIFIC)
    ├── 00-delivery-packages.md
    ├── 10-test-discipline.md
    └── 20-api-discipline.md
```

> **Note:** this is a **published library** (`@vtex/delivery-packages` on npm), not an application. Rules emphasize public-API discipline because every change reaches every consumer.

Each agent reads from a different place. We use symlinks to fan this folder out without duplicating content:

| Tool | Reads from | Mechanism |
|---|---|---|
| Claude Code | `.claude/skills`, `.claude/commands`, `.claude/rules` | Symlinks → `../.agents/*` |
| Cursor | `.cursor/rules/` | Symlink → `../.agents/rules` |
| Copilot | `.github/copilot-instructions.md` | Symlink → `../AGENTS.md` |
| Generic | `AGENTS.md` at repo root | Native to Cursor, Copilot; Claude Code reads via `CLAUDE.md` symlink |

## Editing rules

- One rule per file. Filename prefix sets ordering (`00-`, `10-`, `20-`).
- Each rule file has YAML frontmatter with `name`, `description`, and an `applyTo` glob.
- **Skills are vendored verbatim** from upstream. Do not edit `.agents/skills/specification/SKILL.md` or `.agents/skills/implementing/SKILL.md` — refresh from upstream instead (see `skills/README.md`). Repo-specific guidance goes in `rules/`.
- Commands are short workflow bootstraps; their filename (without `.md`) becomes the slash command.
