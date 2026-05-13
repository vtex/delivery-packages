# .agents/skills

**Vendored verbatim** from [`vtex/vtex-agent-skills`](https://github.com/vtex/vtex-agent-skills) so CI sandboxes and fresh checkouts work without `npx skills add`.

| Skill | Invocation | Purpose |
|---|---|---|
| [`specification`](./specification/SKILL.md) | `/specification "<task>"` | Generate `specs/<feature-name>.md` (Business Context / Arch Decisions / Technical Contract). Opens spec PR on branch `spec/<feature-name>`. |
| [`implementing`](./implementing/SKILL.md) | `/implementing "specs/<feature-name>.md"` | **Non-interactive** sandbox: branch `feat/<feature-name>`, TDD loop in `tests/`, `yarn lint` + `yarn test`, PR with named sections. On block: opens a GitHub issue and ends. |

Status lifecycle: `Draft → Approved → Done`.

## Refreshing from upstream

```bash
# From the repo root:
git clone --depth 1 https://github.com/vtex/vtex-agent-skills /tmp/vtex-agent-skills

# Refresh the two vendored skills (verbatim — do not edit):
cp /tmp/vtex-agent-skills/skills/specification/SKILL.md .agents/skills/specification/SKILL.md
cp /tmp/vtex-agent-skills/skills/specification/references/template.md .agents/skills/specification/references/template.md
cp /tmp/vtex-agent-skills/skills/implementing/SKILL.md .agents/skills/implementing/SKILL.md
```

Or use the official install:

```bash
npx skills add vtex/vtex-agent-skills
```

…then sync the resulting files into this folder.

## How agents discover these

| Tool | Path | Mechanism |
|---|---|---|
| Claude Code | `.claude/skills` | symlink → `../.agents/skills` |
