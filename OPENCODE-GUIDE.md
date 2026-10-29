# The OpenCode guide for this studio

This studio began as a Claude Code course. Every step was rebuilt in OpenCode. This
file is the map: what each Claude Code piece became here, where it lives, and the
things that behave differently.

If you are picking the studio up cold, read `AGENTS.md` first. This file explains the
machinery behind it.

## The short version

| Claude Code | OpenCode | In this repo |
| --- | --- | --- |
| `CLAUDE.md` | `AGENTS.md` | `AGENTS.md` at the root |
| `.claude/skills/<name>/SKILL.md` | `.opencode/skills/<name>/SKILL.md` | `.opencode/skills/personalize/` |
| `.claude/commands/*.md` | `.opencode/commands/*.md` | `.opencode/commands/`, including `marketing/` |
| `.claude/agents/*.md` | `.opencode/agent/*.md` | `.opencode/agent/personalize.md`, `email-reviewer.md` |
| `.claude/hooks/*` | `.opencode/plugins/*.ts` | `send-guard.ts`, `email-format-guard.ts` |
| `.claude/rules/*.md` (path-scoped) | `instructions` in `opencode.json` plus a plugin | `.opencode/rules/emails.md` |
| `.mcp.json` | `opencode.json` → `mcp.servers` | the Resend server |
| `.claude/settings.local.json` | `.opencode/settings.local.json` | `MY_EMAIL` |
| `claude -p "..."` | `opencode run "..."` | see `notes/step-13-automatic-review.md` |
| `claude -n name` | `opencode run --title name --session <id>` | `notes/step-15-big-context.md` |
| `Task` tool | `task` tool, or the `subagent` tool | used throughout |
| `/compact` | `opencode api post /api/session/<id>/compact -d '{}'` | `notes/step-15-big-context.md` |
| `/resume`, `/fork` | `opencode run --session <id>`, `--fork` | `notes/step-12-sessions.md` |

Three folder names differ and they are easy to get wrong: skills and commands are
plural (`skills/`, `commands/`), agents are singular (`agent/`).

## `AGENTS.md` — the standing brief

`AGENTS.md` is loaded for every conversation in this folder, the same way `CLAUDE.md`
was. It holds the studio rules that are always true: plain English, practice addresses
only, commit at each step, ask before deleting.

Two things to know:

- There can be more than one. A nested `AGENTS.md` (for example `leads/AGENTS.md`)
  applies to files under that folder, which is how a subfolder gets its own rules.
- OpenCode also reads a global `~/.config/opencode/AGENTS.md`. Yours holds the GitHub
  rules, and it applies here too.

## `opencode.json` — the config file

One JSON file replaces `.mcp.json`, the settings file and the rule wiring:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["brand/voice.md", ".opencode/rules/emails.md"],
  "permissions": [
    { "action": "edit", "resource": ".opencode/rules/*", "effect": "ask" },
    { "action": "edit", "resource": ".opencode/plugins/*", "effect": "ask" },
    { "action": "edit", "resource": "opencode.json", "effect": "ask" }
  ],
  "mcp": {
    "servers": {
      "resend": {
        "type": "local",
        "command": ["node", "scripts/resend-mcp.mjs"],
        "codemode": false
      }
    }
  }
}
```

- `instructions` is the always-loaded reading list. It is the closest thing OpenCode has
  to Claude Code's path-scoped rules.
- `permissions` are checked before a tool runs. The three `ask` rules mean the agent
  cannot quietly edit its own rules, its own guards, or its own config. That is a
  speed bump, not a lock — the work is in git, so it is reviewable either way.
- `mcp.servers` is `.mcp.json`. `codemode: false` keeps the Resend tools out of the
  scripted `execute` tool and inside the plugin hooks, which is what the send guard
  needs.

`opencode.json` must stay valid JSON. There are no comments in JSON, and a trailing
comma makes the whole file silently ignored.

## Skills

A skill is a folder with a `SKILL.md`. The frontmatter is two fields:

```markdown
---
name: Personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
---
```

The `description` is the trigger. It is the only thing the model sees until the skill
is loaded, so it has to say both what the skill does and when to use it. "Personalize"
alone would never fire.

There is no `SKILL.md` `allowed-tools` field in use here. Permissions live on the agent
instead — which is the next section, and the one real trap in this migration.

### The trap: a skill is not an agent

In Claude Code a skill and a subagent were close enough to blur. In OpenCode they are
separate:

- A **skill** is instructions the current agent loads and follows.
- An **agent** is a separate worker with its own context window and its own permissions.

Step 8 used both. The skill holds the method; `agent/personalize.md` is the wrapper
that gives it a clean context and a narrow write permission. Without the agent, running
the skill just makes the main conversation do the work, and the main conversation can
write anywhere.

Proof this matters: `studio-kit` ships the skill but not an agent wrapper, so
`opencode run --agent personalize` fails there with `Agent not found: "personalize"`.
Copy the skill, and copy the agent with it.

## Agents

`.opencode/agent/personalize.md`, frontmatter then the brief:

```markdown
---
description: Writes one version of each campaign email for every lead group
mode: subagent
permissions:
  - action: edit
    resource: "*"
    effect: deny
  - action: edit
    resource: "campaigns/**"
    effect: allow
  - action: shell
    resource: "*"
    effect: deny
  - action: subagent
    resource: "*"
    effect: deny
---
```

Read the permissions top to bottom, first match wins — deny everything, then allow one
folder. `mode: subagent` means it is not something you chat with directly; it is
something another agent (or a command) calls. `email-reviewer.md` is the same shape with
no `allow` at all, because a reviewer must not edit.

Two useful defaults in this studio:

- `shell: deny` stops a content-checking agent from wandering off through the shell.
- `subagent: deny` stops runaway nesting.

## Commands

`.opencode/commands/personalize.md` is a saved prompt. `$ARGUMENTS` is whatever follows
the command name:

```markdown
---
description: Write one version of each campaign email for every lead group
agent: personalize
subagent: true
---

Follow `.opencode/skills/personalize/SKILL.md` for this campaign folder:

$ARGUMENTS
```

`agent: personalize` means the command runs as that agent; `subtask: true` means it
runs in a child context, so the main conversation stays small. This is the pairing that
makes step 9 cheap: twelve group files written without twelve files of text landing in
your conversation.

The key is `subtask`, not `subagent`. A subagent-mode agent already runs as a subtask by
default, so a typo here is easy to miss — the command still works, it just quietly stops
doing what you asked. `.opencode/commands/personalize.md` had exactly this typo for a
while.

Subfolders work — `.opencode/commands/marketing/*.md` shows up as `marketing/...` in the
command list, which is the role namespacing that Claude Code handled with subfolders too.

## Plugins — the replacement for hooks

A hook and a plugin are not quite the same thing. A Claude Code hook is a shell command
on an event. An OpenCode plugin is a TypeScript module that runs in the session and can
inspect and refuse tool calls. That extra power is why both guards in this repo are
plugins.

The shape, from `send-guard.ts`:

```ts
export default {
  id: "send-guard",
  async setup(ctx: any) {
    const root = ctx.location?.directory ?? process.cwd()

    await ctx.tool.hook("execute.before", (event: any) => {
      const name = normalize(String(event.tool ?? ""))
      if (!name.startsWith("resend_")) return
      // ... throw to block, return to allow
    })
  },
}
```

Throwing is the block. Returning lets the call through. There is no "exit 1" and no
JSON decision object.

### What the two guards do

`send-guard.ts` — before any `resend_*` tool runs:

1. Broadcast, automation and inbox sends are refused outright. Practice mode is
   one-to-one or nothing.
2. Every recipient address is collected, including `cc`, `bcc`, batch entries and
   `Name <address>` forms.
3. Each one must end in `@resend.dev`, or match `MY_EMAIL` from
   `.opencode/settings.local.json`. `MY_EMAIL` is empty here, so only Resend's test
   addresses work.
4. A call with no recipient found is refused too, rather than waved through.

`email-format-guard.ts` — before an email file is written: subject under 50 characters,
preview under 90, `{{first_name}}` in the first sentence, exactly one link, no backticks,
and the exact sign-off and footer. It only checks paths that look like
`campaigns/*/emails/*.md`, so a client's files are not judged by this studio's rules.

Neither guard is a suggestion. Do not edit them to get a send through. That is a rule in
`AGENTS.md` and the reason both paths are set to `ask`.

### Testing a guard

`scripts/test-send-guard.mjs` runs twelve cases and prints one line each. It imports the
plugin and calls the hook directly, so it needs no network and no email:

```sh
node scripts/test-send-guard.mjs
```

Change a guard, run this, then do one live allow and one live block. `notes/step-10-send-guard.md`
has the transcript.

## Rules without path scoping

This is the biggest gap. Claude Code could attach a rule file to a path with frontmatter.
OpenCode cannot. Step 5 replaced it with two halves:

- **Loading** — `"instructions": ["brand/voice.md", ".opencode/rules/emails.md"]` in
  `opencode.json`. The rule text is in context whenever the session works in this folder.
- **Enforcement** — `email-format-guard.ts`, which only fires on email files.

The trade-off, stated plainly: the rule is loaded even when you are editing the plan,
and the guard is the only thing that actually scopes it. That is why the rule file opens
with an HTML comment explaining the arrangement. A reader who does not know this will
assume the rule is scoped when it is not.

## Running without a chat window

`opencode run` is `claude -p`:

```sh
opencode run "Summarise leads/leads.csv" --format json
```

Flags that matter here:

| Flag | What it does |
| --- | --- |
| `--title "review-dig"` | Sets the session title |
| `--session <id>` | Continues an existing session (the id must start with `ses`) |
| `--fork` | Branches a session instead of continuing it |
| `--agent <name>` | Runs as that agent |
| `--auto` | Approves tool calls without asking |
| `--format json` | Machine-readable output |

`scripts/review.mjs` is the practical version of this: it reads the files in Node, builds
one prompt, and makes a single model request. One request per run matters on a free tier.
Set `REVIEW_MODEL` to change the model.

### Sessions and compaction through the API

```sh
# the sessions in this folder
opencode api get "/api/session?directory=$PWD&limit=8"

# compact a session's memory
opencode api post /api/session/<ses-id>/compact -d '{}'
```

`opencode session list` prints nothing here. Use the API call.

## Things that will waste your afternoon

1. **Editing a plugin or agent does nothing until you reload.** The file is read once at
   startup. Reload with
   `opencode api post /api/location/reload -d '{"directory":"<absolute path>"}'`.
   This is the one that catches everybody.
2. **`opencode api` resolves its own location**, which is your home folder, not the
   project. Listing models or skills that way ignores this repo. Use a single
   `opencode run` to see what this folder actually has.
3. **The compact endpoint needs a body.** Without `-d '{}'` it does not queue. It also
   needs a model run to write the summary, so it can fail while new top-level runs are
   capped — it still works from inside a live session.
4. **A skill needs its agent.** See the trap above.
5. **`codemode: false` on the Resend server is not optional** if you want the send guard
   to see every send. The scripted tool path bypasses it.
6. **The practice server must be running** for anything Resend-shaped:
   `npx emulate@0.12.3 start --service resend` in a second terminal, on port 4000.

## Where each step is written up

`notes/` has one file per step that needed explaining: `skills-i-chose.md`,
`step-10-send-guard.md`, `step-11-practice-launch.md`, `step-12-sessions.md`,
`step-13-automatic-review.md`, `step-14-studio-kit.md`, `step-15-big-context.md`.
