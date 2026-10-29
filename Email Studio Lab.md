A hands-on Claude Code course · no coding needed

# Email Studio Lab

You will set up an email marketing studio and run it with Claude Code. Claude plans a launch campaign, writes the emails, personalizes them for each group of customers, and sends them, safely, to a practice email server. Along the way you use every Claude Code feature on the CCAR-F exam.

15 steps about 30–60 min each no real emails are sent no Resend account needed

## Before you start

1. Install **Node.js 22 or newer** from nodejs.org. Check with `node --version`.
2. Install **Git**. Check with `git --version`. On Windows, install Git for Windows, because Claude Code uses its Git Bash.
3. Install **Claude Code**: `npm install -g @anthropic-ai/claude-code`, then sign in when you first run `claude`.
4. Make your studio folder and open Claude Code in it:\
   `mkdir my-email-studio` · `cd my-email-studio` · `git init` · `claude`

#### How every step works

1. 1 · BUILD**Paste the build prompt**In Claude Code, in your studio folder.
2. 2 · FRESH**Start a new session**Type `/exit`, then run `claude` again.
3. 3 · CHECK**Paste the check prompt**A fresh Claude tests your work. It didn't build it, so it's honest.
4. 4 · DONE**Answer its questions**Then tick Done on the step.

## Your studio at the end

```
my-email-studio/
├── CLAUDE.md            the studio's rules
├── brand/voice.md       how the brand sounds
├── leads/
│   ├── leads.csv        24 practice customers
│   └── CLAUDE.md        rules for this folder only
├── campaigns/steep-club-launch/
│   ├── plan.md          the campaign plan
│   ├── emails/          4 launch emails
│   └── groups/          a version per customer group
├── .claude/
│   ├── rules/emails.md  rules for every email file
│   ├── skills/personalize/
│   └── hooks/send-guard.mjs
├── .mcp.json            connection to Resend
└── scripts/review.mjs   automatic review
```

**Claude will ask permission** before it writes inside `.claude/` or to `.mcp.json`. That's normal. Read what it wants to do, then approve.

**No brand of your own?** Use the sample: Kettlebird Tea, a made-up tea shop launching a monthly tea box called The Steep Club. The prompts below use it.

0 of 15 done

#### Part 1 · Plan and write

#### Part 2 · Send safely

#### Part 3 · Work like a team

#### Stretch

1. [Before you start](#start)
2. [Exam map](#exam-map)
3. [Words you'll see](#words)

Part 1 · Steps 1–8

## Plan and write

Set up the studio, give it a brand voice, plan a campaign and write the emails. Nothing gets sent in this part.

1

Real-world habit2.4

### Look before you build

Search for skills other people made, and decide which ones to trust.

[ ] Done

**In plain words:** a skill is like an app for Claude. Before you build one, look in the app store. Download counts can be faked, so also check who made it.

BuildPaste in Claude Code

```
I'm setting up an email marketing studio in this folder. Before I build anything myself, I want to find skills other people have already made.

1. Search the skills directory at skills.sh by running these one at a time:
   npx skills find email marketing
   npx skills find email sequence
   npx skills find campaign plan
   npx skills find resend
2. For the most promising results, find out who publishes each one and how many stars its GitHub repository has. Look out for official publishers such as anthropics and resend.
3. Write notes/skills-i-chose.md in plain English with three short sections:
   - Use these: the two sources you recommend for writing campaigns and sending email, and why.
   - Avoid these: two results you would not trust, and why.
   - How I decided: the three things I should check before installing any skill.

Don't install anything yet.
```

CheckNew session: /exit, then claude, then paste

```
Check my work in notes/skills-i-chose.md. Don't change any files. Test it, don't just read it:

1. For each skill the note recommends, confirm it still exists today: look at its page on skills.sh or its folder in the GitHub repository. Tell me if any has been renamed, merged or removed.
2. Run one of the searches again (for example npx skills find email marketing) and confirm the install numbers in the note are roughly right.
3. Is anything recommended from a publisher whose repository has very few GitHub stars?

Give me a short table: Check | OK or Problem | What you found.
Then ask me two quick questions, one at a time, to see if I understand why install counts alone aren't enough.
```

#### You'll know it worked when

- The note picks official or well-known sources, like Anthropic's marketing plugin and Resend's own skills.
- It warns you off a result with thousands of installs but only a handful of GitHub stars.
- The check may find a skill that was renamed. When we tried this, a popular "email-sequence" skill had been merged into one called "emails". Ask Claude to fix the note.

#### Exam note

The exam asks the same question about MCP servers: for a standard need, use an existing community server first, and build your own only for work that is special to your team.

2

3.1

### Set up your studio

Install a plugin for this project only, and write the studio's CLAUDE.md.

[ ] Done

**In plain words:** CLAUDE.md is the studio's notice board. Claude reads it every time it starts work here. A plugin installed for this project is like equipment fixed to this studio's wall: anyone who joins the studio gets it too.

BuildPaste in Claude Code

```
Let's set up my email studio in this folder.

1. Install Anthropic's official marketing plugin for this project only, by running these two commands:
   claude plugin marketplace add anthropics/knowledge-work-plugins --scope project
   claude plugin install marketing@knowledge-work-plugins --scope project
2. Create four folders: brand, leads, campaigns and notes.
3. Write a CLAUDE.md for the studio in plain English. Include: what the studio is for (planning and writing email campaigns for a small business), a one-line description of each folder, and these rules: write in plain English, never send email to real people, and ask me before deleting anything.
4. Create a .gitignore that ignores .claude/settings.local.json and system files like .DS_Store.
5. Commit everything with a clear message.

Then tell me what I have to do so the plugin loads.
```

**Then**

1. Type `/exit` and run `claude` again. Plugins load when a session starts.
2. Accept the prompts to trust the folder and the plugin.
3. Type `/marketing:` and you should see the plugin's commands appear.

CheckNew session, then paste

```
Check that my studio is set up correctly. Don't change any files. Test it, don't just read it:

1. Is the marketing plugin turned on for this project only? Compare .claude/settings.json with what `claude plugin list` says about its scope.
2. Can you use the plugin here right now? List the plugin commands you can see whose names include campaign, email or brand.
3. If a classmate clones this repo, will they get the same plugin? Explain why, using what is actually in the repo.
4. Is .claude/settings.local.json ignored by git? Prove it with `git check-ignore -v .claude/settings.local.json`.

Give me a short table: Check | OK or Problem | What you saw.
Then ask me two quick questions, one at a time, about the difference between files the whole team shares and files that are only mine.
```

#### You'll know it worked when

- `claude plugin list` shows **marketing** with **Scope: project**.
- You can see `/marketing:campaign-plan`, `/marketing:email-sequence` and `/marketing:brand-review`.
- `git check-ignore` names your `.gitignore` line.

#### Exam note

Team standards go at project level: CLAUDE.md in the repo, `.claude/settings.json`. Teammates get them when they clone. Your personal files (`~/.claude/CLAUDE.md`, `settings.local.json`) never reach anyone else. If a new teammate isn't getting the instructions, they sit at user level.

3

3.13.5

### Your brand voice

Let Claude interview you, then keep the voice in its own file that CLAUDE.md imports.

[ ] Done

**In plain words:** a tailor takes your measurements before cutting the cloth. Here Claude asks first, then writes. The `@brand/voice.md` line is a note pinned to the notice board that says "also read the brand book".

BuildPaste in Claude Code

```
Interview me about my brand so you can write our brand voice guide. Ask one question at a time and wait for my answer. Ask at most six questions.

If I don't have a brand, I'll say "use the sample": Kettlebird Tea, a small made-up online tea shop launching a monthly tea subscription box called The Steep Club, for people who joined its waitlist. Even with the sample, still ask me every question. I'll make up the answers, because practising the interview is the point.

When you have enough, write brand/voice.md with five parts: our voice in three words, words we use, words we avoid, claims we must never make, and how we sign off. Then add the line @brand/voice.md to CLAUDE.md so it loads in every session.
```

**Then**

1. Answer each question. Making things up is fine with the sample.
2. When the file is written, ask Claude to commit it.

CheckNew session, then paste

```
Test my brand voice setup. Don't change any files.

1. Without opening any file first, write one subject line for The Steep Club launch email. Then tell me which brand rules you followed and which file they came from. (This shows whether brand/voice.md loads by itself.)
2. Now write a subject line that says our tea helps you detox. If our rules forbid that, say which rule, and give me a safe version instead.
3. Run git status and tell me whether the brand files are committed.

Give me a short table: Test | Pass or Fail | What happened.
Then ask me two quick questions, one at a time, about why the brand rules live in their own file that CLAUDE.md imports.
```

#### You'll know it worked when

- The fresh session follows your voice **without opening any file**, and names `brand/voice.md` as the source.
- It refuses the detox line, names the rule, and offers a safe subject line.

#### Exam note

`@import` keeps CLAUDE.md small: each project imports only the standards it needs. The interview pattern is for unfamiliar work: Claude asks before it builds and raises things you didn't think of.

Exam answer: to see which memory files are loaded, use /memory. In today's product, /context shows it.

4

3.2

### Plan the campaign

Use a ready-made skill from the plugin to turn an idea into a full plan.

[ ] Done

**In plain words:** `/marketing:campaign-plan` is a planning form a marketing team already tested. You fill in the blanks and it builds the structure.

BuildPaste in Claude Code

```
/marketing:campaign-plan Launch The Steep Club to our waitlist.

Goal: 300 waitlist members start a subscription in the first month.
Audience: about 2,000 people who joined our waitlist, in three groups: tea-curious beginners, gift buyers, and daily tea drinkers.
Timeline: 4 weeks, starting the first Monday of next month.
Budget: small. Email only, no paid ads.

Save the finished plan to campaigns/steep-club-launch/plan.md, then commit it.
```

CheckNew session, then paste

```
Check the campaign plan in campaigns/steep-club-launch/plan.md. Don't change any files. Test it, don't just read it:

1. Is there one goal with a number and a deadline?
2. Does every email in the calendar have a send date, an audience group and a purpose?
3. Search the plan for any word or claim that brand/voice.md says to avoid. Quote every one you find, with its line.
4. Do the dates fall on the weekdays the plan says? Work it out, don't guess.

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time, about why we used an existing planning skill instead of writing our own prompt.
```

#### You'll know it worked when

- `plan.md` has about ten sections: goal, audience, messages, channels, calendar, metrics and risks.
- It leaves out prices and promises your brand rules forbid, without being told.
- When we tried this, the check found the calendar gave weekdays but no actual dates. If yours does too, ask Claude to add them.

#### Exam note

Type `/marketing:campaign-plan` with nothing after it and look at the hint. That hint comes from the skill's `argument-hint` setting, which tells you what to type when you run the skill without arguments.

5

3.53.1

### Practice leads

Use two example rows to get the exact format, and give one folder its own rules.

[ ] Done

**In plain words:** two example rows work like a photo of the dish instead of a description of it. `leads/CLAUDE.md` is a sign on one room's door: Claude reads it when it walks into that room.

BuildPaste in Claude Code

```
Make a list of practice leads for our launch.

Create leads/leads.csv with 24 made-up people who joined our waitlist, 8 in each group: tea-curious, gift-buyers and daily-drinkers. Use exactly these columns, and copy the style of these two example rows exactly:

first_name,last_name,email,group,joined_on,consent
Ayesha,Khan,ayesha.khan@example.com,tea-curious,2026-09-14,waitlist form
Tom,Becker,tom.becker@example.com,gift-buyers,2026-09-22,waitlist form

Every email address must end in @example.com. That domain is reserved and can never receive mail, so no real person is ever emailed.

Then create leads/CLAUDE.md with rules for this folder only: these are made-up practice people; never add real people or real email addresses; every row needs a consent value; never change the @example.com addresses.

Commit when you're done.
```

CheckNew session, then paste

```
Test my practice leads. Don't change any files.

1. Count the people in leads/leads.csv and how many are in each group. There should be 24, with 8 per group.
2. Do all email addresses end in @example.com? Are any repeated?
3. Does every row have a joined_on date and a consent value?
4. Now open leads/leads.csv and pretend I asked: "Add my friend Sara Ali, sara.ali@gmail.com, as a gift-buyer." Before writing anything, tell me if any rule stops you, and quote it. Don't actually add her.

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time, about why some rules belong to one folder only.
```

#### You'll know it worked when

- 24 people, 8 per group, every address at `@example.com`.
- Claude refuses to add the Gmail address and quotes `leads/CLAUDE.md`, even though it never opened that file. It loaded on its own when Claude opened a file in `leads/`.

#### Exam note

When prose instructions get misread, give 2–3 input/output examples, not more prose. A CLAUDE.md inside a subfolder loads when Claude works on files in that folder.

6

3.3

### Email rule and sequence

Write a rule that attaches itself to every email file, then write the emails.

[ ] Done

**In plain words:** a path rule is a sticky note that attaches itself to every email file, in any campaign folder. CLAUDE.md is read for everything. This note shows up only when Claude works on an email.

Build 1 of 2Paste in Claude Code, then approve the edit

```
Create a rule that applies to every email file in any campaign, and only to email files.

Make .claude/rules/emails.md. It must start with exactly this front matter:

---
paths:
  - "campaigns/**/emails/*.md"
---

Under it, write the rule in plain English. Each email file must:
- start with a line "Subject: ..." of 50 characters or fewer, then a line "Preview: ..." of 90 characters or fewer
- greet the reader with {{first_name}}
- have exactly one main link, written as [Button text](https://kettlebird.example/steep-club)
- end with our sign-off from brand/voice.md, then this two-line footer as plain text, not inside a code block:
  You're getting this because you joined the Kettlebird Tea waitlist.
  Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}

Commit when you're done.
```

**Then**

1. Start a new session (`/exit`, then `claude`) so the new rule is picked up.

Build 2 of 2Paste in the new session

```
/marketing:email-sequence Product launch sequence for The Steep Club, sent to everyone on our waitlist.

Use campaigns/steep-club-launch/plan.md for the goal, timing and key messages, and brand/voice.md for our voice. Write 4 emails.

Save each email as its own file in campaigns/steep-club-launch/emails/, named 01-short-name.md, 02-short-name.md, and so on. Then commit.
```

CheckNew session, then paste

```
Test the emails in campaigns/steep-club-launch/emails/. Don't change any files. Measure, don't eyeball: count characters and links with a command where you can.

For each email file, check:
1. The Subject line is 50 characters or fewer, and the Preview line is 90 or fewer. Give the real counts.
2. It greets the reader with {{first_name}}.
3. It has exactly one link.
4. It ends with a sign-off from brand/voice.md and the exact footer from .claude/rules/emails.md, as plain text.
5. It uses no word or claim that brand/voice.md says to avoid.

Give me one table with a row per email and a column per check (Pass or Fail, with the number or quote when it fails).
Then ask me two quick questions, one at a time, about why this rule uses a paths pattern instead of living in CLAUDE.md.
```

#### You'll know it worked when

- Four email files, each starting with `Subject:` and `Preview:`, with real character counts under the limits.
- One link per email, and the footer as plain text.
- When we tried this without the rule, the plugin wrote three subject options and a notes section in each file. With the rule, every email followed the studio's format.

#### Exam note

For conventions that apply to files spread across folders, use `.claude/rules/` with `paths:` patterns. A subfolder CLAUDE.md covers one folder only. One big CLAUDE.md with headings relies on Claude guessing. A skill only works when someone runs it. Use `/context` to see which rules loaded.

7

3.63.52.5

### Fresh-eyes review

Review in a new session, fix related problems in one message, then confirm with search.

[ ] Done

**In plain words:** when you proofread your own letter, you see what you meant to write. A new session is a second reader who didn't write it.

Build 1 of 2New session, then paste

```
/marketing:brand-review campaigns/steep-club-launch/emails/

Review all four emails against brand/voice.md and .claude/rules/emails.md. List every problem by severity (high, medium or low), with the file, the line and a suggested fix. Don't change any files yet.
```

Build 2 of 2Same session, after you read the review

```
Fix all the problems from your review in one message, keeping all four emails consistent with each other. If a fix means changing a rule file too, change it. Leave anything only I can confirm, like what the launch page says, and list it for me. Then commit.
```

CheckNew session, then paste

```
Check that the review fixes worked. Don't change any files.

1. Use Glob to list every email file in every campaign.
2. Use Grep to search all of them for three backticks in a row, and for every word that brand/voice.md says to avoid. There should be no matches.
3. Run git show --stat HEAD and tell me which files the last commit changed.
4. Confirm the footer is plain text in every email.

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why the review happened in a new session, and why all the fixes went in one message.
```

#### You'll know it worked when

- The review lists problems by severity. Ours found small but real ones, like a promise to "read every reply" that the team might not keep.
- After the fixes, Grep finds nothing, and the last commit touched only email files and maybe the rule.

#### Exam note

The session that wrote something keeps its own reasoning and rarely questions it, so review in a fresh, independent session. Fixes that affect each other go in one detailed message; separate fixes can go one at a time. Glob finds files by name; Grep finds text inside files.

8

3.2

### Your own skill: personalize

Build a skill with the three settings the exam asks about, and use it.

[ ] Done

**In plain words:** a skill is a recipe card. Claude always sees the card's title, and reads the whole card only when it cooks that dish. `context: fork` sends a helper to another kitchen to do the messy work; only the finished dish comes back to you.

Build 1 of 2Paste in Claude Code, then approve the edit

```
Create my own skill for this project at .claude/skills/personalize/SKILL.md.

What it does: it takes a campaign folder and writes one version of each email for each lead group in leads/leads.csv (tea-curious, gift-buyers and daily-drinkers). Each version keeps the same structure, subject, link and footer, but changes the opening line and one example so it fits that group. It saves each version to <campaign folder>/groups/<group>/emails/ with the same file name. When it finishes, it replies with a short summary only: how many files it wrote, plus one example opening line per group.

Use exactly this front matter:
---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

If no campaign folder is given, it should stop and list the campaign folders that exist. Commit when you're done.
```

**Then**

1. Start a new session so the skill is picked up.

Build 2 of 2Paste in the new session

```
/personalize campaigns/steep-club-launch
```

**Then**

1. Ask Claude: *"Commit the new files with a clear message."*

CheckNew session, then paste

```
Test my personalize skill and what it made. Don't change any files.

1. Count the email files under campaigns/steep-club-launch/groups/. There should be one per email per group: 4 emails times 3 groups is 12.
2. Compare the original email 01 with each group's version using diff. Only the opening line and one example should differ. Tell me if anything else changed.
3. Check that every version still follows .claude/rules/emails.md: subject 50 characters or fewer, preview 90 or fewer, one link, and the footer as plain text. Measure, don't eyeball.
4. Does any version use a word or claim that brand/voice.md forbids? Quote it if so.

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time: what "context: fork" changed about how the skill ran, and what "allowed-tools" did.
```

#### You'll know it worked when

- 12 new files. Only the opening line and one sentence differ from the original.
- Your main chat shows only a short summary, not the work itself.
- The email rule applied to the new files too, because they also sit in an `emails/` folder.

#### Exam note

`context: fork` runs the skill in its own context, so long output stays out of your chat. `argument-hint` tells you what to type when you run it with no arguments. A personal copy goes in `~/.claude/skills/` under a different name, so it doesn't clash with the team's.

Exam answer: allowed-tools restricts which tools the skill can use. In the product it pre-approves the listed tools, and other tools still ask permission. You may see that happen. On the exam, answer "restricts".

Not real: a `.claude/config.json` file with a commands list.

Part 2 · Steps 9–11

## Send safely

Connect a real email service through MCP, but point it at a practice server on your own computer. Then add a guard that makes sure no email can reach the wrong person.

9

2.4

### Connect Resend in practice mode

Connect an email service through MCP, with settings that are safe by default.

[ ] Done

**In plain words:** an MCP server is a phone line from Claude to another service. In practice mode that line goes to a pretend post office on your own computer, so nothing leaves your machine.

**Before you start**

1. Open a **second terminal** window and run: `npx emulate@0.12.3 start --service resend`
2. Wait until it says **Ready** and shows `http://localhost:4000`. Leave that window open for steps 9 to 11.

BuildPaste in Claude Code, then approve the edit

```
Connect our studio to Resend, the email service, in practice mode.

Create .mcp.json in the project root with exactly this content:

{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "resend-mcp@2.27.1"],
      "env": {
        "RESEND_API_KEY": "${RESEND_API_KEY:-re_practice}",
        "RESEND_BASE_URL": "${RESEND_BASE_URL:-http://localhost:4000}",
        "SENDER_EMAIL_ADDRESS": "${SENDER_EMAIL_ADDRESS:-onboarding@resend.dev}"
      }
    }
  }
}

Then update the rule in CLAUDE.md that says never to send email to real people. Keep that rule, and add that sending through Resend is allowed only to Resend's test addresses (ending in @resend.dev) and to my own email address, and that a guard will enforce this in the next step.

Commit. Then explain in two plain sentences what happens when I set nothing, and what I would set to send for real.
```

**Then**

1. Start a new session and approve the **resend** server when Claude Code asks.
2. Type `/mcp`. You should see resend connected.

CheckNew session, then paste

```
Test my Resend connection. Don't change any files.

1. Use the resend MCP tools to send one email to delivered@resend.dev with the subject "Connection test" and a one-line body. Did it go through? Give me the email id.
2. Use the resend tools to list sent emails, and confirm that one shows up as delivered.
3. Search the whole repo, including git history, for anything that looks like a real Resend key: "re_" followed by a long string, other than re_practice. There should be none.
4. Is .mcp.json committed, so a classmate who clones the repo gets the same connection?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why the key is written as ${RESEND_API_KEY:-re_practice} instead of the real key, and what happens if I forget to set anything.
```

#### You'll know it worked when

- The test email gets an id and shows as delivered.
- No real key appears anywhere in the repo or its history.

#### If something goes wrong

- **Connection refused:** the practice server isn't running. Start it again in your second terminal.
- **Pending approval:** start `claude` and approve the resend server.

#### Exam note

The team's servers go in `.mcp.json`, which is committed. Your personal or experimental servers go in `~/.claude.json`. Credentials use `${VAR}` expansion, so no secret ever lands in the repo. `${VAR:-default}` means "use my setting if I have one, otherwise this safe value". If Claude keeps picking Grep over an MCP tool, the tool's description is too thin.

10

1.5

### The safety guard

Make a rule Claude cannot break, using a hook.

[ ] Done

**In plain words:** CLAUDE.md asks Claude to behave. A hook is a guard at the post office door who checks every letter before it leaves. Claude can't talk its way past the guard.

BuildReplace \[your email\] before you press Enter

```
Add a safety guard so Claude can never send email to the wrong people, even by mistake. CLAUDE.md asks nicely. This guard makes sure.

1. Write .claude/hooks/send-guard.mjs, a small Node script for a PreToolUse hook. It reads the tool call as JSON from standard input and looks at tool_name and tool_input:
   - For send-email and send-batch-emails: every address in to, cc and bcc must end in @resend.dev or match my own email, which comes from the MY_EMAIL environment variable. If any address doesn't, print a short reason that names the address and exit with code 2 to block the call.
   - For send-broadcast, create-automation, send-inbox-draft and send-new-inbox-email: always block, with a short reason, because they can reach whole lists of people.
   - For anything else: exit 0 to allow it.
2. Register it in .claude/settings.json as a PreToolUse hook with the matcher mcp__resend__.* and this command:
   node "$CLAUDE_PROJECT_DIR/.claude/hooks/send-guard.mjs"
   Keep everything that is already in that file.
3. Put my own email in .claude/settings.local.json like this: "env": { "MY_EMAIL": "[your email]" }. That file is only mine and is not committed.
4. Commit the hook and .claude/settings.json.
```

**Tip**

Use the same email you would sign up to Resend with. If you ever send for real, Resend's free sandbox can only deliver to that address.

CheckNew session, then paste

```
Test the send guard for real. Don't change any files.

1. Use the resend send-email tool to send email 01 from campaigns/steep-club-launch/emails/ to Ayesha, the first person in leads/leads.csv, at her address. This should be blocked. Quote the block message word for word.
2. Send the same email to delivered@resend.dev. This should go through.
3. Send it to my own email, the MY_EMAIL value in .claude/settings.local.json. This should go through too.
4. Run git check-ignore -v .claude/settings.local.json to prove my email address is not committed.

Don't try to get around a block. Give me a short table: Test | Pass or Fail | What happened.
Then ask me two quick questions, one at a time: what the difference is between the CLAUDE.md rule and this guard, and what exit code 2 means for a hook.
```

#### You'll know it worked when

- The send to Ayesha is **blocked**, with the guard's own message naming her address.
- The sends to `delivered@resend.dev` and to your email go through.

#### Exam note

Exam answer: the guide names only PostToolUse, for cleaning up tool results. It describes blocking as "tool call interception" without naming the hook.

In the product, PreToolUse is what blocks, with exit code 2 or a deny decision, and PostToolUse can't block. On the exam, match the behaviour described.

11

Real-world skill

### Practice launch

Send each group its first email, safely, and check that it was delivered.

[ ] Done

BuildPaste in Claude Code

```
Let's do a practice launch.

For each lead group, send that group's version of email 01 (from campaigns/steep-club-launch/groups/<group>/emails/) to delivered@resend.dev. Start each subject with the group name in square brackets, like [gift-buyers]. Replace {{first_name}} with "there", and leave the other placeholders as they are.

Then list the emails you sent and show me a table: group, subject, status.
```

CheckNew session, then paste

```
Check my practice launch. Don't send anything new and don't change any files.

1. Use the resend tools to list sent emails. Find the three whose subjects start with [tea-curious], [gift-buyers] and [daily-drinkers].
2. For each one, look up its delivery status. Is it delivered?
3. Confirm that every email in the list went only to an @resend.dev address or to my own email, the MY_EMAIL value in .claude/settings.local.json. List any that didn't.
4. Compare each sent subject with the subject line in that group's email 01 file. Do they match, apart from the [group] tag?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: what would change if I switched from practice mode to my real Resend account, and why the guard still matters then.
```

#### You'll know it worked when

- Three emails tagged `[tea-curious]`, `[gift-buyers]` and `[daily-drinkers]`, all delivered, all to test addresses.

**Optional: send one real email to yourself**

1. Sign up for a free account at resend.com with the same email as your `MY_EMAIL`.
2. In Resend, create an API key. Never paste it into a file or into the chat.
3. Close Claude Code. In your terminal, set the key and the real address for this window only.\
   macOS or Linux: `export RESEND_API_KEY=re_your_key` and `export RESEND_BASE_URL=https://api.resend.com`\
   Windows PowerShell: `$env:RESEND_API_KEY="re_your_key"` and `$env:RESEND_BASE_URL="https://api.resend.com"`
4. Run `claude` in that same window and ask: *"Send the tea-curious version of email 01 to my own email, the MY_EMAIL value."*
5. Check your inbox. Without your own domain, Resend only delivers to the email you signed up with, and the guard blocks everyone else anyway.

Part 3 · Steps 12–14

## Work like a team

Pick work up across days, try two ideas side by side, review automatically, and package your tools for the next client.

12

1.7

### Resume and fork

Pick up earlier work by name, and try two ideas from the same starting point.

[ ] Done

**In plain words:** a named session is a bookmark. A fork is a fork in the road: two paths from the same spot. Forks share the files on your computer, but not the conversation.

**Part A · Start a named session:** `claude -n launch-angles`

Build APaste, then /exit

```
Read campaigns/steep-club-launch/plan.md and each group's version of email 01. In five short bullets, tell me what each lead group cares about most. Don't write any files.
```

**Part B · Come back later:** `claude --resume launch-angles`

Build BPaste, then /exit

```
Remind me: what did you say the gift-buyers care about most? One sentence.
```

**Part C · First fork, with its own name:** `claude --resume launch-angles --fork-session -n angle-a`

Build CPaste, then /exit

```
Angle A: write three subject lines for email 01 that focus on a calm daily ritual. Save them to notes/angle-a.md.
```

**Part D · Second fork, from the same spot:** `claude --resume launch-angles --fork-session -n angle-b`

Build DPaste, then /exit

```
Before you start: do you know anything about an Angle A from our conversation? Answer yes or no first.

Angle B: write three subject lines for email 01 that focus on discovering new teas. Save them to notes/angle-b.md.
```

**Part E · Start fresh from a summary.** Run `claude --resume launch-angles` and ask: *"Read notes/angle-a.md and notes/angle-b.md. Then write notes/handoff.md in 10 lines or fewer: what each group cares about, both angles, and which one you'd pick and why."* Then start a brand-new session with `claude` and ask: *"Read notes/handoff.md and continue from it: write the final subject line for email 01."*

CheckNew session, then paste

```
Check my session experiment. Don't change any files.

1. Do notes/angle-a.md and notes/angle-b.md each have three subject lines of 50 characters or fewer? Count them.
2. Does either file use the other angle's idea? They were written in separate forks, so they shouldn't.
3. Is notes/handoff.md 10 lines or fewer, and does everything it says match the files it describes?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: when I should resume a session and when I should start fresh with a summary, and what --fork-session gave me that resuming didn't.
```

#### You'll know it worked when

- The resumed session remembers what it said about gift-buyers.
- Fork B answers "no" about Angle A's conversation. It may notice the `angle-a.md` file, because forks share files.

#### If something goes wrong

**"matches 2 sessions":** you forked without `-n`, so the fork kept the original name. Use one of the session ids the error prints, and name forks from now on.

#### Exam note

To continue a specific earlier investigation, use `--resume <session-name>`. To compare two approaches from one shared starting point, use `fork_session`; on the command line that's `--fork-session`. If the old tool results are stale, start fresh with a structured summary. If files changed since then, name the changed files so Claude re-checks only those.

13

3.6

### Automatic review

Run Claude without chatting, and get results a program can read.

[ ] Done

**In plain words:** instead of chatting, you hand Claude a job sheet and it hands back a filled-in form. The form's shape, called a schema, never changes, so a program can read it.

Build 1 of 2Paste in Claude Code

```
Make a review that runs without anyone typing, so it can later run on every pull request.

1. Create review/findings.schema.json: a JSON Schema for an object with a "findings" array. Each finding has file, line (a number), severity ("high", "medium" or "low"), problem and fix. All five are required.
2. Create scripts/review.mjs, a small Node script that takes a campaign folder and runs Claude Code headless, like this:
   claude -p "Review every email in <folder> against brand/voice.md and .claude/rules/emails.md. Report only real problems." --output-format json --json-schema "<the schema file's text>" --allowedTools "Read,Glob,Grep"
   The output may be one JSON object, or a list whose last item is the result, so handle both. Take structured_output, save it to review/findings.json, print a one-line summary, and exit with code 1 if any finding is high severity.
3. To prove it catches problems, write a deliberately bad email at campaigns/test-bad/emails/01-bad.md. It should break our rules with a detox claim, a "last chance" line and two links. Then run: node scripts/review.mjs campaigns/test-bad
4. Run it on campaigns/steep-club-launch too, then commit everything.

Tell me what each run found and what exit code it gave.
```

Build 2 of 2Same session

```
Improve scripts/review.mjs so a second review doesn't repeat itself.

If review/findings.json already exists for the same folder, include those earlier findings in the prompt and add: "These are findings from the last review. Report only problems that are new or still not fixed. Don't repeat ones that have been fixed." To make that work, save the folder name inside review/findings.json too.

Then test it:
1. Run node scripts/review.mjs campaigns/test-bad and note the findings.
2. Fix only the detox claim in campaigns/test-bad/emails/01-bad.md (change it to something allowed).
3. Run the review again on campaigns/test-bad.
Tell me: did the detox finding disappear, and did anything get reported twice? Commit when done.
```

CheckNew session, then paste

```
Test my automatic review. The script rewrites review/findings.json; don't change any other file.

1. Run node scripts/review.mjs campaigns/test-bad. Did it exit with code 1? Does every finding in review/findings.json have all five fields from review/findings.schema.json, with severity high, medium or low?
2. Did it catch the second link? Quote that finding.
3. Run node scripts/review.mjs campaigns/steep-club-launch. Did it exit with code 0?
4. Read scripts/review.mjs. Does it handle both output shapes (one object, or a list), and what does it do if claude fails?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why a separate headless run does the review instead of the session that wrote the emails, and why we ask for JSON that matches a schema instead of plain text.
```

#### You'll know it worked when

- The bad email gives **exit code 1** with findings like the detox claim and the second link. Your real campaign gives **exit code 0**.
- After you fix one problem, the next review drops it and repeats nothing.
- Reviews vary a little from run to run. That's why the script only fails on high severity.

**Optional: every pull request**

If your studio is on GitHub, ask Claude to add a GitHub Actions workflow that runs `node scripts/review.mjs` on pull requests. It needs your `ANTHROPIC_API_KEY` saved as a repository secret.

#### Exam note

`-p` runs Claude without waiting for input, which fixes a CI job that hangs. `--output-format json` with `--json-schema` gives results a program can read. CLAUDE.md holds the review rules for CI runs. On a re-review, include the earlier findings and ask for only new or still-unfixed problems.

Not real: `CLAUDE_HEADLESS=true` and `--batch`. In the product, `--json-schema` takes the schema's text, not a file name.

14

3.4Real-world skill

### Package your studio kit

Plan first, turn the reusable parts into a plugin, and use it for a second client.

[ ] Done

**In plain words:** a plugin is a toolbox you carry from client to client. Each client's brand book stays in that client's own office.

**Before you start**

Press `Shift+Tab` until the bottom of the screen says **plan mode**. Claude will read and plan, but write nothing until you accept.

Build 1 of 3Paste in plan mode

```
Plan this first. Don't build anything yet.

I want to package the reusable parts of this studio as a plugin, so I can use them for my next client. Plan a new folder next to this one, called studio-kit, with:
- .claude-plugin/plugin.json (name studio-kit, version 0.1.0, a one-line description) and .claude-plugin/marketplace.json listing the plugin with source "./"
- skills/personalize/SKILL.md, copied from our skill, with anything Kettlebird-specific made general
- hooks/hooks.json, registering our send guard as a PreToolUse hook on mcp__resend__.*, using ${CLAUDE_PLUGIN_ROOT} instead of $CLAUDE_PROJECT_DIR, plus hooks/send-guard.mjs
- agents/email-reviewer.md: a subagent that reviews email files against the project's brand voice and email rules, using only Read, Glob and Grep
- review/findings.schema.json and scripts/review.mjs
- README.md: what's inside and how to install it

Brand voice, leads and campaigns stay in each client's own repo. The README should say why.

Tell me which files you'll create, what you'll change from the originals, and anything that won't work outside this studio.
```

**Then**

Read the plan. Find one thing it says won't travel to a new client. Then accept the plan, or paste:

Build 2 of 3After you read the plan

```
The plan looks good. Build it. When it's built, run claude plugin validate on studio-kit and fix anything it reports.
```

Build 3 of 3Same session

```
Set up a second, made-up client so I can test studio-kit somewhere new. Create a folder next to this one called client-two, for a small bakery called Rise & Crumb, with:
- brand/voice.md: a short voice guide (warm and cheerful, no health claims, sign off with "Fresh from the oven,")
- CLAUDE.md: one paragraph about the studio, plus the line @brand/voice.md
- leads/leads.csv: 6 made-up people in two groups, weekend-bakers and coffee-lovers, all at @example.com, with the same columns as our leads file
- leads/CLAUDE.md: our leads folder rules, plus a "Groups" section with one line describing each group
- .claude/rules/emails.md and .mcp.json, copied from this studio, but change the email rule's footer and link to Rise & Crumb's (use https://riseandcrumb.example/spring)
- campaigns/spring-bake/emails/01-hello.md: one short email that follows the email rules
Then run git init in client-two and commit everything there. Don't install studio-kit; I'll load it myself.
```

**Then**

1. `/exit`, then `cd ../client-two`
2. Start Claude Code with your kit loaded: `claude --plugin-dir ../studio-kit`
3. Approve the resend server when asked. Keep the practice server running.

CheckInside client-two, then paste

```
Test the studio-kit plugin in this client. Only the personalize skill may write files.

1. Is the studio-kit plugin loaded? List the studio-kit skills and agents you can see.
2. Use the studio-kit personalize skill on campaigns/spring-bake. Check that it wrote one version of the email for each group in leads/leads.csv.
3. Use the resend send-email tool to send campaigns/spring-bake/emails/01-hello.md to the first person in leads/leads.csv. The kit's guard should block it. Quote the block message word for word, and don't try to get around it.
4. Search the ../studio-kit folder for the word Kettlebird. There should be no matches.

Give me a short table: Test | Pass or Fail | What happened.
Then ask me two quick questions, one at a time: what belongs in the plugin versus in each client's own repo, and why the guard is a PreToolUse hook instead of a PostToolUse one.
```

#### You'll know it worked when

- `claude plugin validate` says **Validation passed**. A missing-icon warning is fine.
- In client-two you see `studio-kit:personalize` and `studio-kit:email-reviewer`. Personalize uses the bakery's own groups.
- The kit's guard blocks a send to a bakery lead.

#### If something goes wrong

**"Kettlebird" shows up in client-two:** a rule was copied without being adapted. Rules belong to each client, so ask Claude to update the footer and link for Rise & Crumb.

#### Exam note

Use plan mode when a task is large, has several valid approaches, involves design decisions or touches many files. If the question already says the task is complex, plan from the start; "start direct and switch if it gets complex" is the trap answer. Plugins themselves aren't on the exam, and CLAUDE.md and rules always stay in the repo.

Stretch · Step 15

## For fast finishers

A bigger pile of text, and the habits that keep Claude accurate when its memory gets full.

15

5.4

### What customers love

Keep track of findings across many files, even after Claude's memory is squeezed.

[ ] Done

**In plain words:** when Claude's memory gets squeezed, a notebook still has everything. So write in the notebook as you go, not at the end.

Build 1 of 3Paste in Claude Code (in the Kettlebird studio)

```
Create practice data: notes/reviews/ with 120 short made-up customer reviews of Kettlebird's earlier tea sampler box, in 6 files of 20 reviews each (reviews-1.md to reviews-6.md). Make them varied and realistic: name specific teas, mix praise with complaints (packaging, slow shipping, too little of a favourite tea, confusing brewing instructions), and give each review a star rating. Don't summarise them.
```

**Then**

Start a named session: `claude -n review-dig`

Build 2 of 3Paste in the named session

```
Find the top 5 things customers love and the top 3 complaints across all the reviews in notes/reviews/.

Use a subagent to read the review files, so the raw reviews don't fill up this conversation. Tell the subagent to keep a scratchpad at notes/scratchpad.md and to add to it after each file, one line per finding: the file, the finding, how many reviews mention it, and one short quote. At the end, give me the top 5 and top 3 with how often each came up.
```

**Then**

Type `/compact`. This squeezes the conversation into a short summary.

Build 3 of 3Same session, after /compact

```
Which review file had the most complaints about damaged or wet packaging? Quote one. Answer from memory first. Then check notes/scratchpad.md and the files, and tell me whether your memory was right.
```

CheckNew session, then paste

```
Check my scratchpad. Don't change any files.

1. Does notes/scratchpad.md have lines for every file in notes/reviews/?
2. Pick three lines and check each one against the review file it names: is the quote real, and is the count right?

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time: why we write to a scratchpad as we go, and what /compact does to Claude's memory.
```

#### You'll know it worked when

- Your main session only sends work to a subagent. The raw reviews never fill your chat.
- After `/compact`, memory gets details wrong or can't answer, and the scratchpad can.
- When we tried this with a thin scratchpad (one line per file), it couldn't answer either. Write one line per finding.

#### Exam note

The warning sign is answers that stop matching earlier findings, or that talk about "typical patterns" instead of the specific things found. The fixes are scratchpad files, subagents, summaries between phases, saved state files, and `/compact`. A bigger context window is never the answer.

## Exam map

Where each CCAR-F Claude Code objective is practised in this course.

| Objective | What it covers | Steps |
| --- | --- | --- |
| 3.1 | CLAUDE.md levels, @import, folder CLAUDE.md, /memory | 2, 3, 5 |
| 3.2 | Commands and skills: argument-hint, context: fork, allowed-tools | 4, 8 |
| 3.3 | Rules with paths: patterns | 6 |
| 3.4 | Plan mode, sending work to subagents | 14, 15 |
| 3.5 | Interview first, input/output examples, fixes in one message | 3, 5, 7 |
| 3.6 | Fresh-session review, -p, JSON schema, re-review | 7, 13 |
| 1.7 | Resume by name, fork, fresh start with a summary | 12 |
| 2.4 | .mcp.json, ${VAR} credentials, use what exists first | 1, 9 |
| 2.5 | Glob and Grep | 7 |
| 1.5 | Hooks: the exam names PostToolUse; PreToolUse is what blocks | 10, 14 |
| 5.4 | Big context: scratchpad, subagents, /compact | 15 |

Not practised here: MCP resources (catalogs of data), Edit's fallback when its anchor text isn't unique (Read, then Write), and tracing code through a wrapper module.

## Words you'll see

**Session**One conversation with Claude Code. `/exit` ends it; running `claude` starts a new one.

**Commit**A saved snapshot of your files in git. You can always go back to it.

**Plugin**A package of skills, commands, hooks and connections that you install in one go.

**Skill**Saved instructions Claude follows when you call it with `/name`, or when the task fits.

**MCP server**A connection that gives Claude tools from another service, like Resend.

**Hook**A small script Claude Code runs at a set moment, like just before a tool runs. It can block the action.

**Practice mode**Resend's tools connected to a pretend email server on your own computer.

**Fresh session**A new conversation that doesn't remember the old one, which makes it a fair checker.