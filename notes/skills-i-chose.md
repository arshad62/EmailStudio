# Skills I chose

Research date: 30 October 2026. I ran four searches on skills.sh (`email marketing`,
`email sequence`, `campaign plan`, `resend`), then checked each publisher and its GitHub
repository with `gh`. Nothing was installed.

## Use these

**1. `anthropics/knowledge-work-plugins` — for writing campaigns.**
- The `campaign-plan` skill (3.3K installs) builds the brief: goal, audience, message, channels, calendar, metrics. The `email-sequence` skill (3.0K installs) writes the actual emails, timing and branching.
- Publisher is Anthropic itself. The repository has 34,061 stars, an Apache-2.0 licence, and was pushed today. All three security audits on skills.sh pass.
- Why: the two skills cover plan-then-write, which is exactly how this studio works. First-party publisher, readable source, current.

**2. `resend/resend-skills@resend` — for sending email.**
- 24.0K installs; the repository has 208 stars, an MIT licence, and was pushed on 28 October 2026. It is listed in skills.sh's Official directory.
- Publisher is Resend, the company whose API we actually send through. The `send-email` skill in the same repository covers the sending side.
- Why: when the skill and the service come from the same company, the instructions match the API we use. Low stars here is fine — it is a small, young, official repo.
- Companion: `resend/email-best-practices` (146 stars) covers deliverability and compliance, and is also first-party.

Close runner-up: `coreyhaines31/marketingskills@emails` is the most popular email-writing skill
(81.3K installs, 57.5K stars, MIT, active). I did not pick it first only because it is one
person's library rather than the vendor's own.

## Avoid these

**1. `open.feishu.cn@lark-mail` — 832.8K installs, nothing to check.**
- It is the top result for "email marketing", but its skills.sh page returns a 404. There is no repository, no star count, no SKILL.md I can read.
- The publisher is a domain name, not an account I can look up. I cannot see what the skill tells the agent to do, so I will not run it.
- It is also a Lark/Feishu mail-client skill, not campaign writing. Big install numbers prove popularity, not fit.

**2. `claude-office-skills/skills@email-marketing` — 5.1K installs, borrowed authority.**
- The name sounds official, but the organisation behind it is called "AGI Lab", was created on 29 January 2026, and lists no website. It has no link to Anthropic.
- The repository has 552 stars and has not been pushed since 31 January 2026 — nine months stale, while Resend's own repos shipped this week.
- A generic "comprehensive email marketing" skill is also the kind of thing that quietly smuggles in claims and tactics that clash with our brand voice.

## How I decided

Three checks before I install any skill:

1. **Who publishes it, and can I verify that?** Vendor-owned (anthropics, resend) is accountable and easy to check. A name that merely sounds official is not.
2. **Is there a repository I can read?** Stars, licence, last push date, open issues, and the actual SKILL.md text. If the page or repo is missing, the skill is unauditable — no install.
3. **Does it do this job and nothing more?** A writing skill should not need to send mail or touch the API key.

Install counts come last. They can be mirrored or inherited from an unrelated popular repo:
`affaan-m/ECC` shows 292.8K stars on a personal account for a whole agent harness, and its
`marketing-campaign` skill is one of hundreds bundled in, so that star count says nothing
about the skill itself.
