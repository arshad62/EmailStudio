# Campaign folder rules

Every campaign lives in its own folder under `campaigns/`.

## Email files

- Put emails in `campaigns/<campaign>/emails/`, named `01-short-name.md`, `02-short-name.md`, and so on.
- Group versions go in `campaigns/<campaign>/groups/<group>/emails/` with the same file names.
- Every email must follow `.opencode/rules/emails.md` exactly. The format guard in `.opencode/plugins/email-format-guard.ts` enforces the mechanical parts.
- Read `brand/voice.md` before writing. The brand's claims rules outrank a good sentence.

## Plan and facts

- The plan in `plan.md` is the source of truth for dates, audience and purpose.
- Open questions in the plan are not facts. Never turn an open question into a price, date, discount, shipping promise or gifting flow.
- If a fact is missing, leave it out and list it for the studio owner.

## Group versions

- A group version keeps the original subject, structure, link and footer.
- Only the opening line and one example sentence should change to fit the group.
- Never change the offer, the claims or the call to action in a group version.
