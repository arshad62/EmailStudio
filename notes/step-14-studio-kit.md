# Step 14 — package the studio kit

## What was built

`studio-kit`, a sibling folder of this studio, and `client-two`, a second made-up
client (Rise & Crumb, a bakery) that loads the kit instead of copying it.

| Kit file | What it replaces from the course | What changed |
| --- | --- | --- |
| `package.json` | `.claude-plugin/plugin.json` + `marketplace.json` | OpenCode has no marketplace file, so one manifest does both jobs: name, version, description, `exports` → `./server.ts` |
| `server.ts` | `hooks/hooks.json` + `hooks/send-guard.mjs` | a `PreToolUse` entry on `mcp__resend__.*` becomes `ctx.tool.hook("execute.before")`; `$CLAUDE_PROJECT_DIR` becomes `ctx.location.directory` |
| `skills/personalize/SKILL.md` | same skill | the three tea-group notes are gone; it reads the `Groups` section of the client's own `leads/AGENTS.md` |
| `agents/email-reviewer.md` | same agent | "Kettlebird" removed; it reads the client's own `brand/voice.md` and rules |
| `review/findings.schema.json` | same file | only the `$id` became generic |
| `scripts/review.mjs` | same script | `ROOT` is now `process.cwd()` and the schema comes from the kit, so it can live outside the client |
| `scripts/validate.mjs` | `claude plugin validate` | new: 19 checks, including "no client-specific words" |
| `scripts/test-guard.mjs` | new | 11 guard cases that need no model and no OpenCode |
| `README.md` | new | what is inside, the install steps, and why the voice and data stay behind |

## The five OpenCode differences

1. **A plugin is a package, not a folder with a manifest.** `package.json` with
   `exports` replaces `.claude-plugin/`. Loading is `"plugins": ["../studio-kit"]`
   in `opencode.json`.
2. **Skills and agents are loaded separately.** The course's `--plugin-dir` brings
   skills and agents along. Here the plugin loader only reads `server.ts`, so the
   skill comes from `"skills": ["../studio-kit/skills"]`, and the reviewer is copied
   into the client's `.opencode/agent/`. OpenCode's plugin API can update an agent
   but has no `add` for one.
3. **`PreToolUse` is `execute.before`.** Same moment, before the tool runs, and it
   can throw to block — which is what makes it the right hook rather than a
   `PostToolUse` one.
4. **There is no `claude plugin validate`.** `scripts/validate.mjs` stands in.
5. **`Plugin.define` is documented but not installed here.** V2's docs show
   `import { Plugin } from "@opencode/plugin"`; this machine has no such package, so
   `server.ts` exports a plain `{ id, setup }` object, which is the form that loads
   from a local directory. The guard is identical either way.

## What does not travel

`brand/voice.md`, `leads/leads.csv` and its group notes, everything under
`campaigns/`, the footer and link inside `.opencode/rules/emails.md`,
`opencode.json`, `MY_EMAIL`, and `scripts/resend-mcp.mjs`.

The clearest one is **`brand/voice.md`**. A kit that shipped a voice would be
shipping one client's way of speaking into another client's mouth. Rise & Crumb
signs off "Fresh from the oven," and Kettlebird signs off "Warm cups," — the same
machinery has to accept both, which it does because the voice is read at runtime.

## A real bug this step found

EmailStudio's format guard matched by path alone:

```ts
if (!/\/campaigns\/.*\/emails\/[^/]+\.md$/.test(withRoot)) return
```

So writing `client-two/campaigns/spring-bake/emails/01-hello.md` was judged against
**Kettlebird's** sign-off and footer, and was refused. This is the course's own
warning — "Kettlebird shows up in client-two" — arriving through a hook instead of a
copied file.

Fixed by resolving the target path and returning early when it is outside the
guard's own project. Two tests after the fix:

- a bakery email writes normally;
- a deliberately wrong Kettlebird email at
  `campaigns/steep-club-launch/emails/99-guard-test.md` is still refused, and no file
  is created.

Plugin reload needed `opencode api post /api/location/reload`. Editing the plugin
file and `touch opencode.json` both left the old code running; the API call took
effect immediately. Adding the reviewer agent needed the same reload — a new file in
`.opencode/agent/` is not picked up by a fresh `opencode run` until then.

## The check

| Test | Pass or Fail | What happened |
| --- | --- | --- |
| 1. Kit loaded; skills and agents visible | **Pass** | a headless request in `client-two` listed `personalize` and `email-reviewer` with the kit's own description; the log shows watchers on `studio-kit/server.ts` and `studio-kit/skills` |
| 2. Personalize skill writes one file per group | **Pass** | `campaigns/spring-bake/groups/{weekend-bakers,coffee-lovers}/emails/01-hello.md`, one per group in `leads.csv`; only line 6 changed in each |
| 3. Guard blocks a bakery lead | **Pass** | live: `Send guard blocked resend_send-email: nora.whitfield@example.com is not a practice address...`; also 11/11 in `test-guard.mjs` |
| 4. No "Kettlebird" in `studio-kit` | **Pass** | `grep` finds nothing; `validate.mjs` says "Validation passed. 19 checks." |
| Extra: review script from the client | **Pass** | `node ../studio-kit/scripts/review.mjs campaigns/spring-bake` → 0 findings, exit 0, wrote `client-two/review/findings.json` |

Two honest notes on check 2:

- The kit ships the **skill**, not a `personalize` agent. EmailStudio's
  `.opencode/agent/personalize.md` and `/personalize` command are studio-local
  extras that bound where the worker may write. With `--agent personalize` the
  client-two run failed with `Agent not found: "personalize"`; invoking the skill
  from the build agent worked.
- The model's coffee-lovers version invented "add a slice to your next coffee —".
  That is a product detail the skill does not allow, so I put the original sentence
  back. The skill held the structure, the facts did not fully hold — worth watching.

## The two questions

**What belongs in the plugin versus each client's repo?** The plugin holds behaviour
that is the same everywhere: the guard, the skill's procedure, the reviewer, the
schema, the scripts. Each repo holds what makes it *that* client: voice, leads and
groups, campaigns, the footer and link, the model and connection settings. The test:
would this line be wrong for any other client? If yes, it stays in the repo.

**Why is the guard a pre-tool hook and not a post-tool one?** Because a post-tool
hook runs after the send. The whole job is to stop the send from happening, and the
only place to do that is before the tool runs.
