# Email Studio

A small email marketing studio that runs on [OpenCode](https://opencode.ai). It plans a
campaign, writes the emails, writes a version for each customer group, reviews them, and
sends them to a practice mail server.

The client is **Kettlebird Tea**, a made-up online tea shop, and the campaign is the
launch of **The Steep Club**, a monthly tea box. Both are invented for practice.

> **No real person is emailed from this repo.** Every lead address ends in `@example.com`,
> which cannot receive mail. Sends are only allowed to `@resend.dev` test addresses or to
> your own address saved in `.opencode/settings.local.json`. A guard plugin blocks
> everything else before the mail tool runs. Do not try to work around it.

## What is in here

| Folder | What it holds |
| --- | --- |
| `brand/` | `voice.md` — how the brand sounds, the words we use and avoid, and the claims we must never make. |
| `leads/` | `leads.csv` — 24 made-up practice people, each in one of three groups, plus the rules for handling them. |
| `campaigns/` | One folder per campaign. `steep-club-launch/` has the plan, four emails, and a version of each email for the three groups. `test-bad/` holds one deliberately broken email, used to prove the format guard blocks it. |
| `notes/` | Research and write-ups of the tricky parts: skills research, the send guard, sessions, the automatic review. |
| `.opencode/` | The studio's OpenCode setup: skills, agents, commands, rules and the two guard plugins. |
| `scripts/` | Node scripts: the Resend MCP wrapper, the headless email review, and the send-guard test. |
| `review/` | The schema and output for the review script. |

Three documents explain the rest:

- `AGENTS.md` — the studio's standing rules. Read this first.
- `OPENCODE-GUIDE.md` — how the OpenCode pieces map to the Claude Code course this studio came from.
- `Email Studio Lab.md` — the 15-step course brief that builds this studio.

## How a campaign moves through the studio

1. **Plan.** `/marketing/campaign-plan <brief>` turns a brief into a dated plan with goal,
   audience, messages, calendar, metrics and risks. It writes to `campaigns/<slug>/plan.md`.
2. **Write.** `/marketing/email-sequence <brief>` writes the emails, following the plan.
3. **Personalise.** `/personalize <campaign>` writes one version of each email per lead
   group. Only the opening line and one example change; the offer, link and footer do not.
4. **Review.** `/marketing/brand-review <folder>` checks the emails against the brand voice
   and the email rules. `node scripts/review.mjs <campaign>` does the same headlessly and
   writes machine-readable findings.
5. **Send.** The Resend MCP server sends to the practice server on `http://localhost:4000`.

Every email file must follow `.opencode/rules/emails.md`: a subject of 50 characters or
fewer, a preview of 90 or fewer, `{{first_name}}` in the first sentence, exactly one link,
the fixed sign-off, and the fixed two-line footer.

## The two guards

Both are TypeScript plugins in `.opencode/plugins/`, and both exist because a rule in a
prompt is a request, not a limit.

- **`email-format-guard.ts`** checks subject and preview length, the single link, the
  sign-off, the footer, and the brand's avoid-list. It refuses the write instead of
  fixing it, so you see the problem.
- **`send-guard.ts`** sits in front of every `resend_*` tool. It allows `@resend.dev` and
  your own address, and blocks list sends, automations, inbox replies and forwards
  outright, because those cannot be aimed at one safe address.

Test the send guard without OpenCode:

```bash
node --experimental-strip-types scripts/test-send-guard.mjs
```

## Try it

You need Node.js 22 or newer and OpenCode. No Resend account and no API key.

1. Start the practice mail server in a second terminal:

   ```bash
   npx emulate@0.12.3 start --service resend
   ```

2. Open this folder in OpenCode and ask it to plan a campaign, or run a command such as
   `/marketing/brand-review campaigns/steep-club-launch`.

3. Optionally copy `.opencode/settings.example.json` to `.opencode/settings.local.json`
   and put your own address in `MY_EMAIL` if you want to receive a test send. That file is
   gitignored.

The Resend wrapper in `scripts/resend-mcp.mjs` defaults to `re_practice`, the practice
base URL, and `onboarding@resend.dev`, so nothing points at the real service until you
set the environment variables yourself.

## What this repo is not

It is a teaching studio, not a product. The client, the leads, the tea and the campaign
numbers are all invented. There is no price, no discount and no real deadline anywhere,
because inventing one is exactly what the brand rules forbid. Facts the studio does not
have are listed as open questions in `campaigns/steep-club-launch/plan.md`, not guessed.

## Licence

There is no licence file in this repo yet, so treat it as all rights reserved until one
is added. No third-party skills are bundled: `notes/skills-i-chose.md` records what was
considered, who publishes it, and why nothing was installed.
