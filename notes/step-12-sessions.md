# Step 12 — resume and fork

## The commands, in OpenCode

| Claude Code | OpenCode |
| --- | --- |
| `claude -n launch-angles` | `opencode run --title launch-angles "..."` |
| `claude --resume launch-angles` | `opencode run --session ses_... "..."` |
| `claude --resume launch-angles --fork-session -n angle-a` | `opencode run --session ses_... --fork --title angle-a "..."` |
| `claude -p "..."` | `opencode run "..."` |

The important difference: in OpenCode a name is a **title**, not an address.
`--session` wants an id that starts with `ses`. The title is what you read in a
list; the id is what you pass.

## Session ids used

| Session | Id |
| --- | --- |
| launch-angles | `ses_e79f11e1dffeszNbL74WtDlfmc` |
| angle-a | `ses_e79f04d35ffe0PwWpGm6af7R7N` |
| angle-b | `ses_e79efd98dffe1Dckt64Bl5qsRp` |

## What happened

1. Created launch-angles and asked what each group cares about. Five bullets, no
   files written.
2. Resumed it in a later command and asked what gift-buyers care about most. It
   answered from its own history: the facts before they commit, which is why it
   points them at the club page. So resuming carries the conversation.
3. Forked it twice. Angle A wrote `notes/angle-a.md` with ritual-led subject
   lines. Angle B was asked, before anything else, whether it knew about Angle A.
   It answered **no**, and named only its own angle. It did notice
   `notes/angle-a.md` on disk, which is expected: forks share files, not talk.
4. Resumed launch-angles and asked for `notes/handoff.md`. Ten lines: the three
   groups, both angles, and a pick with a reason.
5. Started a brand-new session that read only `notes/handoff.md`. It produced the
   final subject line, "A new tea to discover each month" (32 characters), without
   ever seeing the earlier conversation. That is the point of a handoff note: a
   summary is cheaper and more reliable than dragging a long session forward.

## Three things OpenCode does differently

**`--title` is ignored on a fork.** Both forks came back named
`launch-angles (fork #1)`, even though I passed `--title angle-a` and
`--title angle-b`. The fix is to rename afterwards:

```sh
opencode run --session <id> --fork "..."
# then rename, from inside OpenCode, with the session rename tool
```

**Two forks from one session get the same name.** With no distinguishing title
they are indistinguishable in a list, which is exactly the "matches 2 sessions"
trap the course warns about, wearing different clothes.

**`opencode session list` printed nothing here** even though sessions existed and
`opencode run --session` worked. The API did answer:

```sh
opencode api get "/api/session?directory=$PWD&limit=10"
```

That is where the ids above came from. Listings are newest first, and I got the
two forks backwards at first: I renamed the newer one `angle-a` and then asked it
about Angle A, and it said *yes, you asked me for the calm ritual angle*. That
answer proved the label was wrong, not the fork. Corrected both, then asked
again; the real angle-b said no.

## The check found a real problem

First run of the check failed test 2. Angle A's third line, "Something new for
your daily cup", is Angle B's idea: it says *new*, not *ritual*. Angle A's own
opening paragraph claims the opposite. A fork kept the conversations apart, but
nothing keeps an angle honest against its own brief.

Rewrote it as "Slow down with a monthly cup" (28 characters), updated the line in
`notes/handoff.md`, and re-ran the check. All three tests passed.

The second check also caught a loose sentence in `notes/angle-a.md`: it claimed
"ritual" was on the brand's words-we-use list. It is not; the word only appears in
an on-voice example. Corrected, because a note that flatters itself about the
brand rules is the kind of note that later gets trusted when it should not be.
