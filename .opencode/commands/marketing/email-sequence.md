---
description: Write a campaign email sequence that follows the studio's email rules
---

Write the campaign email sequence described here:

$ARGUMENTS

Read these first:

1. `AGENTS.md`
2. `brand/voice.md`
3. `.opencode/rules/emails.md`
4. The campaign plan named in the brief, if one is named.

For every email:

- Start with `Subject: ` and keep the subject to 50 characters or fewer.
- Then a line `Preview: ` and keep the preview to 90 characters or fewer.
- Greet the reader with `{{first_name}}`.
- Include exactly one main link, written as `[Button text](https://kettlebird.example/steep-club)` unless the campaign rule file gives a different link.
- End with the sign-off required by `brand/voice.md`, then the exact two-line footer from `.opencode/rules/emails.md`, as plain text.
- Never use a word or claim that `brand/voice.md` forbids.

Save each email as its own Markdown file in the campaign's `emails/` folder, named `01-short-name.md`, `02-short-name.md`, and so on. If the brief gives a different folder, use that folder.

Do not add a notes section, alternative subject lines, or commentary inside the email files. Report the files you wrote in your reply.
