<!--
Applies to: campaigns/**/emails/*.md

OpenCode V2 does not have Claude Code's path-scoped rule files. This file is loaded
through "instructions" in opencode.json, and .opencode/plugins/email-format-guard.ts
enforces it only when an email file is written or edited.
-->

# Rules for every email file

Every file under a campaign's `emails/` folder must follow this format. The format is not a suggestion: the studio's format guard checks it before a write is allowed.

## First two lines

1. Start with a line `Subject: ` followed by the subject. The subject must be **50 characters or fewer**, including spaces.
2. Then a line `Preview: ` followed by the preview text. The preview must be **90 characters or fewer**, including spaces.

Do not add alternative subject lines, emoji, or a notes section.

## Body

3. Greet the reader with `{{first_name}}` in the first sentence.
4. Include **exactly one** main link. Write it as:

   `[Button text](https://kettlebird.example/steep-club)`

5. Use plain text. Do not put the footer inside a code block, and do not use triple backticks anywhere in an email file.
6. Do not use any word or claim that `brand/voice.md` says to avoid. The claims rules apply even when the wording is softened.

## Ending

7. End with the sign-off from `brand/voice.md`, exactly:

   `Warm cups,`
   `The Kettlebird Tea team`

8. Then this two-line footer as plain text, exactly:

   `You're getting this because you joined the Kettlebird Tea waitlist.`
   `Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}`

## What "exactly" means

- Keep the punctuation, the apostrophe in "You're", the middle dot `·`, and the placeholder braces.
- Do not translate the footer, shorten it, or turn it into a link.
- Keep the footer as the last two lines of the file. A single blank line before it is fine.
