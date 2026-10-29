# Email Studio

This studio plans and writes email campaigns for a small business. The current client is **Kettlebird Tea**, a made-up online tea shop launching a monthly tea box called **The Steep Club**.

## What is in each folder

- `brand/` — how the brand sounds and what it must never say.
- `leads/` — made-up practice customers and the rules for handling them.
- `campaigns/` — one folder per campaign, with its plan, emails and group versions.
- `notes/` — research, scratchpads and handoff notes.
- `.opencode/` — the studio's OpenCode setup: skills, agents, commands, rules and guard plugins.
- `scripts/` — small Node scripts for reviews and the Resend connection.

## Studio rules

1. Write in plain English. Short sentences. No marketing jargon.
2. Never send email to real people. Only practice addresses are allowed.
3. Ask me before deleting anything.
4. Ask me before changing a rule in `.opencode/rules/` or a safety guard in `.opencode/plugins/`.
5. Keep all customer data made up. Every lead address must end in `@example.com`.
6. When a task changes an email, re-read `brand/voice.md` and `.opencode/rules/emails.md` first.
7. Commit work with a clear message when a step is finished.

## Tooling note

This studio runs in **OpenCode**, not Claude Code. The equivalent files are:

- `AGENTS.md` instead of `CLAUDE.md`
- `.opencode/skills/` instead of `.claude/skills/`
- `.opencode/plugins/` instead of `.claude/hooks/`
- `opencode.json` instead of `.mcp.json`
- `opencode run` instead of `claude -p`

See `OPENCODE-GUIDE.md` for the full mapping.
