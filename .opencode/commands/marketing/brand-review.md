---
description: Review email files against the brand voice and email rules
---

Review the email files named here:

$ARGUMENTS

Read `brand/voice.md`, `.opencode/rules/emails.md`, and every `.md` file under the target folder (use Glob, then read each file).

For each file, check:

- `Subject:` is 50 characters or fewer. Count the characters, do not estimate.
- `Preview:` is 90 characters or fewer. Count the characters.
- The greeting uses `{{first_name}}`.
- There is exactly one main link, and it uses the campaign's required URL.
- The file ends with the required sign-off and the exact two-line footer as plain text, not inside a code block.
- No word or claim from the brand's avoid list appears.
- The email is consistent with the campaign plan's goal, timing and audience.

Report every problem with:

- severity: `high`, `medium` or `low`
- file and line number
- the quoted text
- a concrete suggested fix

Do not edit any file. If there are no problems, say so explicitly.
