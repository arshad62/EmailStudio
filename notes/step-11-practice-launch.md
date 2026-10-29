# Step 11 — practice launch

## What was sent

Email 01 for each group, to the Resend test address `delivered@resend.dev`.
Each subject carries the group name in square brackets.

| Group | Subject | Status |
| --- | --- | --- |
| tea-curious | `[tea-curious] The Steep Club is open` | delivered |
| gift-buyers | `[gift-buyers] The Steep Club is open` | delivered |
| daily-drinkers | `[daily-drinkers] The Steep Club is open` | delivered |

Sent ids: `88b7514a-ee02-4053-b271-c9c4beb1b2d0`,
`eb3a9907-c672-4a53-ae5b-bc1a1c0aa32a`,
`4703c25a-8dba-4e2b-bc02-b3ebf5002203`.

## The fresh-eyes check

A new session was asked to list the sent mail, look up each status, confirm every
recipient was `@resend.dev` or `MY_EMAIL`, and compare each subject with the group
file.

| Test | Result | What it saw |
| --- | --- | --- |
| Three tagged emails in the sent list | Pass | Exactly three, all at 05:06:46Z |
| Delivery status | Pass | All three `email.delivered` |
| Only allowed recipients | Pass | Only `delivered@resend.dev` |
| Subject matches the group file | Pass | Identical apart from the `[group]` tag |

## Two things worth knowing

**The mailbox was reset first.** The first run of the check found two older test
emails to `ayesha.khan@example.com`. They came from step 10, when I proved the
send guard by sending before the guard had loaded. Nothing left the machine —
`example.com` is a reserved domain and the practice server is local — but a
launch record with stray recipients in it is not a record you can trust. I asked
first, stopped the practice server, started it again with an empty mailbox, and
re-sent. The check then passed cleanly.

**The greeting says "there", on purpose.** The lab replaces `{{first_name}}` with
`there` for a practice send, because a test address has no name. The fresh-eyes
check flagged it both times as a mismatch with the `Hi {{first_name}},` line in
the file. That is the check being careful rather than wrong: the file keeps the
placeholder, and only the rendered copy substitutes a word. Do not "fix" the file
to say `Hi there,`.

## What a real launch would still need

- A verified sending domain. The practice server accepts `onboarding@resend.dev`;
  a real account needs DNS records.
- Real names in `{{first_name}}` from the lead list, not the word `there`.
- `{{company_address}}` and `{{unsubscribe_url}}` filled with real values.
- A reason to email each group, and a way to stop. Right now the waitlist is the
  only reason we have.
