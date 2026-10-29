# Step 15 — big context, scratchpad and compaction

The lab step is about a pile of text bigger than one conversation should hold, and
the habits that keep the answers accurate when the memory gets squeezed.

## Build 1 — 120 practice reviews

`notes/reviews/reviews-1.md` to `reviews-6.md`, 20 reviews each, 120 in total.

Every review is a `## <stars>/5 — <name>` heading and one paragraph. They name real
teas (Assam Breakfast, Darjeeling First Flush, Genmaicha, Silver Needle, Lapsang
Souchong, Hojicha, Rose Black, Vanilla Rooibos...), and they mix praise with four
complaint types from the lab: packaging, slow shipping, too little of a favourite,
and confusing brewing instructions.

```sh
for f in notes/reviews/reviews-*.md; do printf '%s %s\n' "$f" "$(grep -c '^## [0-9]/5' "$f")"; done
```

`20 20 20 20 20 20` — 120 reviews, committed as `c5d8f79`.

## Build 2 — named session, subagent, scratchpad

In Claude Code the step is `claude -n review-dig`, then the `Task` tool, then
`/compact`. In OpenCode the three pieces are:

| Course | OpenCode | What happened here |
| --- | --- | --- |
| `claude -n review-dig` | `opencode run --title review-dig --session ses_reviewdig` | The session exists with the title `review-dig`. |
| `Task` subagent | `task` tool, or the `subagent` tool | Used. The raw reviews never entered the main conversation. |
| `/compact` | `opencode api post /api/session/<id>/compact` | See below. |

The working prompt, with the OpenCode wording:

```text
Find the top 5 things customers love and the top 3 complaints across all the
reviews in notes/reviews/.

Use a subagent to read the review files, so the raw reviews don't fill up this
conversation. Use the task tool with subagent_type "general" and ask it to keep a
scratchpad at notes/scratchpad.md, appending after each file, one line per finding:
the file, the finding, how many reviews mention it, and one short quote.

At the end, give me the top 5 and top 3 with how often each came up.
```

### One honest snag: the free tier refused the headless session

`ses_reviewdig` was created with the right title, but every message sent to it came
back before the model ran:

```text
Error: Free usage limit reached. Connect a provider or subscribe to OpenCode Go to
keep going, or switch models.
```

All six free models on this machine answered the same way, including a one-word
probe. New top-level runs are capped; subagents inside a running session are not.
So the reading was delegated with a real subagent (a separate context, the same
isolation the lab is teaching) and the named session stayed empty. The command above
is the one to run when the cap resets.

### The scratchpad

`notes/scratchpad.md` — a heading per file, then one line per finding:

```text
reviews-4.md | complaint: damaged or wet packaging | 11 | "The delivery box was wet and had clearly been left outside"
reviews-6.md | praise: named tea loved | 13 | "The Assam Gold is a proper malty breakfast tea"
```

37 lines over six sections. Fixed finding labels, so the lines add up across files
instead of drifting into near-duplicates.

The totals the subagent reported: named tea loved **67**, damaged or wet packaging
**28**, good variety or discovery **15**.

**Why one line per finding, not one line per file:** the lab's warning is explicit.
A thin scratchpad — one line per file — cannot answer a later question, because it
never recorded which finding was where. The line is only useful if it names the file,
the finding, the count and a quote you can check.

## Build 3 — the memory test

The lab's question in the compacted session:

```text
Which review file had the most complaints about damaged or wet packaging? Quote one.
Answer from memory first. Then check notes/scratchpad.md and the files, and tell me
whether your memory was right.
```

<!--COMPACTION-RESULT-->

## The fresh-session check

A new session with no memory of the work was asked to audit the scratchpad. It
returned this:

| Test | Pass or Fail | What you found |
| --- | --- | --- |
| A section for every file in `notes/reviews/` | Pass | All six covered, 7/6/7/5/7/5 lines, no line naming a missing file |
| `reviews-1.md` too little of a favourite, count 2 | Pass | Quote from Elena G. verbatim; count right (Elena G. and Leila H.) |
| `reviews-5.md` slow shipping, count 3 | Pass | Quote from Peter A. verbatim; count right (Peter A., Ahmed R., Rory D.) |
| `reviews-6.md` named tea loved, count 13 | Pass | Quote from Priya S. verbatim; exactly 13 of 20 name a tea with praise |

It also checked all 35 quotes, not just three, and found one soft boundary:
"good variety or discovery" is a judgement call — `reviews-1.md` is 4 clearly, or 5 if
you count "Nice selection, slow dispatch." That is a label problem, not a quote or
count error, and it is the kind of thing a fixed label list is supposed to prevent.

## The two questions, and my answers

**Why write to a scratchpad as we go, instead of at the end?** Because the memory can
be squeezed mid-task. A summary written at the end has to be written from a memory
that has already lost the detail — and the end may never arrive in the same context
you started in.

**What does `/compact` do to the memory?** It replaces the conversation with a short
summary written by the model. The detail is gone from the context; only what the
summary kept survives. It is not a wipe (the summary is there) and it is not an
archive the model can read back at will.

## What this step is really testing

The failure sign is an answer that stops matching earlier findings, or one that talks
about "typical patterns" instead of specific things found. The fixes are a scratchpad,
subagents, summaries between phases, saved state files and compaction — never a
bigger context window.

## Commands worth keeping

```sh
# the named session (title shows in the session list)
opencode run --title review-dig --session ses_reviewdig "<prompt>"

# what the session recorded
opencode api get "/api/session?directory=$PWD&limit=8"

# squeeze a session's memory
opencode api post /api/session/<session-id>/compact
```
