# Skills I chose

Research date: 29 October 2026. I searched skills.sh and checked each publisher's GitHub repository. Nothing was installed yet.

## Use these

**1. `coreyhaines31/marketingskills@emails` — for writing campaigns.**
- 80.1K installs on skills.sh; the GitHub repository has 57,151 stars, an MIT licence, and was pushed on 27 October 2026.
- It is a focused email-writing skill in a large, active marketing library. The publisher is a known developer, and the repository is the source of the skill, so I can read it before installing.
- I would install it into `.agents/skills/` (or `.claude/skills/`) because OpenCode reads both compatibility folders.

**2. `resend/resend-skills@resend` — for sending email.**
- 23.7K installs; the repository has 207 stars, an MIT licence, and was pushed on 28 October 2026.
- The publisher is Resend itself, the company that runs the email service. Official publisher beats a bigger install count from an unknown account.
- I would pair it with the Resend MCP server rather than asking a skill to send mail on its own.

**Also worth knowing:** Anthropic publishes `anthropics/knowledge-work-plugins` (33,686 stars, Apache-2.0), which contains a marketing plugin for planning work. In Claude Code that is a plugin; in OpenCode the same ideas are best copied into local commands such as `/marketing/campaign-plan`.

## Avoid these

**1. `open.feishu.cn@lark-mail` — 821K installs, wrong job.**
- It is a mail-client skill for Lark/Feishu, not an email-marketing skill. Its publisher is a product site, not a public repository I can inspect and count stars for.
- Huge install numbers prove popularity, not fit, provenance, or safety. I would not give it access to a marketing studio.

**2. `caffeinelabs/skills@extension-email-marketing` — 28.6K installs, 2 GitHub stars.**
- The install count looks respectable next to the 2 stars on the repository.
- A brand-new or tiny repository can accumulate installs through promotion or mirrors. With almost no community review, I cannot tell whether the instructions are safe or useful.

## How I decided

Before installing any skill I check three things:

1. **Who published it.** Is it the company that owns the service, a known maintainer, or an anonymous account? Official is not automatically safe, but it is accountable.
2. **The repository behind it.** Stars, recent commits, licence, open issues, and whether the skill's text is readable in the repo. Install counts alone can be bought, mirrored, or inherited from a popular unrelated skill.
3. **Scope and permissions.** Does the skill do the job I need, and does it ask for tools or secrets it does not need? A writing skill should not need to send mail.

## OpenCode note

OpenCode does not have Claude Code's plugin marketplace command. It reads skills from `.opencode/skills/`, `.claude/skills/`, and `.agents/skills/`; `npx skills add` writes into the compatibility folders, so the skills above can still be installed. For this lab I wrote the studio's own skill locally instead of installing a third-party one.
