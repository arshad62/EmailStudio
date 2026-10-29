---
name: Personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
---

# Personalize a campaign

Take one campaign folder and write one version of each email for each lead group.

## Input

The campaign folder is the text after the command, for example `campaigns/steep-club-launch`.

If no campaign folder is given, stop. List the folders under `campaigns/` and ask which one to use. Do not guess.

## Read first

1. `leads/leads.csv` — read the `group` column and use the real group names found there.
2. `leads/AGENTS.md` — the rules for the leads folder.
3. `brand/voice.md` — voice and claims.
4. `.opencode/rules/emails.md` — the format every version must keep.
5. The campaign's `plan.md`.
6. Every `.md` file in `<campaign>/emails/`.

## Write

For every email file `<name>.md` and every group, write:

`<campaign>/groups/<group>/emails/<name>.md`

Each version must keep, unchanged:

- the `Subject:` line and its character count
- the `Preview:` line and its character count
- the structure and length
- the single main link and its URL
- the exact sign-off and the exact two-line footer
- every fact, claim and call to action

Change only:

1. The opening line after the greeting, so it speaks to that group.
2. One example or one sentence in the body, so it fits that group.

Never add a discount, a price, a deadline, a health claim, a testimonial or a new promise. Never introduce a word from the brand's avoid list.

## Group notes

- `tea-curious` — permission to be new. The opening should lower the pressure to know about tea.
- `gift-buyers` — the idea of choosing for someone else. Do not invent gifting mechanics, prices or shipping dates.
- `daily-drinkers` — a habit they already have. The opening should add something new to an existing routine, not ask them to build one.

If a group name in the CSV is not covered here, write a neutral opening that fits the group name without inventing facts.

## Reply

Reply with a short summary only:

- how many files you wrote
- one example opening line per group

Do not paste the emails into the reply. Do not explain your process.
