# Step 13 — automatic review

## What was built

- `review/findings.schema.json` — a JSON Schema for `{ findings: [...] }`, where every
  finding needs `file`, `line`, `severity` (high, medium or low), `problem` and `fix`.
- `scripts/review.mjs` — runs the review without a chat and saves `review/findings.json`.
- `campaigns/test-bad/emails/01-bad.md` — a deliberately bad email: a detox claim,
  "last chance", a superlative, no preview line, and two links.

## The commands

```sh
node scripts/review.mjs campaigns/test-bad        # exit 1, high findings
node scripts/review.mjs campaigns/steep-club-launch  # exit 0, clean
```

Exit codes: `0` ran and nothing high, `1` ran and something high, `2` could not run
or the answer did not match the schema.

## Two OpenCode differences from the course

**There is no `--json-schema`.** `opencode run` has `--format json` but no schema
flag. So the schema text travels inside the prompt, and Node checks the answer
against it before saving. If the answer has a missing field, a severity that is not
one of the three, a line that is not a whole number, or a file that was not part of
the review, the script prints the exact mismatch and exits `2`. Nothing is written.

**A tool-using headless run costs several model requests.** The obvious version of
this script lets the reviewer agent Glob and Read by itself, exactly like
`--allowedTools "Read,Glob,Grep"`. That version could not finish here: the free
models on this machine allow roughly **one model request per run**, so the second
step of any tool-using run came back as

```text
provider.free-limit  Free usage limit reached...
```

So `review.mjs` reads the brand voice, the rules, the plan and every email in Node,
numbers the lines, and hands the whole job to the model in **one** request. That is
not a workaround for its own sake: it also makes the line numbers citable, keeps the
review off the file system, and makes CI cheap. The model is told not to call tools.

The model defaults to `opencode/glm-5.3-flash-free`. Override it with
`REVIEW_MODEL=provider/model`, and the run timeout with `REVIEW_TIMEOUT_MS`.

## What the runs found

First run on `campaigns/test-bad`: **7 findings, 4 high**, exit `1`.

- `line 1` — subject uses "last chance", "unlock" and "detox" (high)
- `line 5` — "unlock a full body detox", "cleanses toxins", "boosts metabolism" (high)
- `line 5` — "the best tea in the world" (high)
- `line 5` — "your last chance to join" repeated pressure (high)
- `line 2` — no `Preview:` line (medium)
- `line 7` — bare URL instead of `[Button text](url)` (medium)
- `line 9` — a second link, `.../steep-club/science` (medium)

Every finding had all five fields. The second link was caught and named:

> There is a second link ("https://kettlebird.example/steep-club/science") but rule 4
> says exactly one main link is allowed.

Then I fixed **only** the detox claim on line 5 (the body now says "try a new tea
each month ... a good cup to look forward to"). Second run: **6 findings, 3 high**,
exit `1`.

- The detox-claims finding was gone.
- Nothing fixed was repeated.
- A subject finding remained, because the subject still says "unlock your detox".
  The script passes earlier findings back into the prompt and asks for only new or
  still-unfixed problems, and the model reported that one as "still uses" rather than
  as new. That is the behaviour we want, not a duplicate.

On `campaigns/steep-club-launch`: **0 findings**, exit `0`.

## Honest note about the check

The course's check asks a **fresh session** to verify all this. I could not run a
fresh multi-step session: every tool-using headless run is cut off by the same free
quota. I ran the four checks myself instead, in the session that built the script,
and I am saying so rather than pretending a fresh session did it.

| Test | Result | What I saw |
| --- | --- | --- |
| test-bad exits 1, all findings valid | Pass | exit 1; 6 findings, 0 invalid against the schema's five required fields |
| Second link caught | Pass | quoted above |
| steep-club-launch exits 0 | Pass | 0 findings, exit 0 |
| Handles both shapes, and failure | Pass | accepts one object, a list (takes the last item with `findings`), or an object inside prose or a fence; a non-zero opencode exit prints the last 12 lines and exits 2 |

On a machine with real quota, replace this with the fresh-session run the course
describes. The script is the part that has to be right; the check is only as good as
the model doing it.

## Why a separate headless run reviews at all

The session that wrote the emails already believes they are good. It knows what it
meant, so it reads the words it meant to write. A separate run starts from the files
and the rules, sees no chat history, and has one job. That is the same reason the
course sends you to a fresh session at every step.

## Why JSON that matches a schema

Plain text is for a person. JSON with a fixed shape is for a program: a pull request
check can read `severity` and fail the build on `high` without guessing at wording.
The schema is the contract. If the model drifts, validation stops the run instead of
quietly saving nonsense.
