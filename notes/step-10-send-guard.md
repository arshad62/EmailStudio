# Step 10 — the send guard

## What it does

`.opencode/plugins/send-guard.ts` runs before any Resend tool call. It allows two
situations and blocks everything else.

Allowed:

- `resend_send-email` or `resend_send-batch-emails` where **every** recipient
  (`to`, `cc`, `bcc`) ends in `@resend.dev` or matches `MY_EMAIL` from
  `.opencode/settings.local.json`.

Blocked for any address:

- any other recipient, including the made-up leads in `leads/`
- a call with no recipient at all

Blocked outright, because these cannot be aimed at one safe address:

- `resend_send-broadcast`, `resend_create-automation`, `resend_update-automation`,
  `resend_duplicate-automation`, `resend_send-event`
- `resend_send-inbox-draft`, `resend_send-new-inbox-email`,
  `resend_reply-to-inbox-thread-email`, `resend_forward-inbox-thread-email`

The error message quotes the rule, so the model can correct itself without guessing.

`MY_EMAIL` is empty right now. That means only `@resend.dev` test addresses work.
To allow your own address later, put it in `.opencode/settings.local.json`
(gitignored). The shape is in `.opencode/settings.example.json`.

## How it was tested

Two layers, because a plugin test alone can lie.

1. `node --experimental-strip-types scripts/test-send-guard.mjs` runs twelve
   cases against the plugin's own hook: leads, a lead hidden in `cc`, the
   `Name <address>` form, a missing recipient, broadcast, automation, inbox
   send, an allowed test address, a batch of two test addresses, a batch with
   one bad address, and an unrelated tool. All twelve pass.
2. Live calls through the real Resend connection. A send to
   `ayesha.khan@example.com` and to `ravi.menon@example.com` was refused, a
   broadcast was refused, and a send to `delivered@resend.dev` was delivered.

## The trap: new plugins are not picked up straight away

The first live test **sent the email**. The plugin was on disk and correct, but
OpenCode had scanned `.opencode/plugins/` earlier in the session and kept that
list. Only `email-format-guard.ts` was in it.

The log made this clear:

```text
msg="loading plugin" id=.../email-format-guard.ts
```

No line for `send-guard.ts`. Adding a new file to the plugin folder is not enough
on its own.

The fix was to save `opencode.json` (a watched config file) with the guard listed
under `plugins`. That triggers a full rescan, and the log then showed both guards
loading. Once the rescan happened, auto-discovery kept working, so the explicit
entry was removed again.

Lesson for later steps, and for the guide: after adding a new plugin file, save
`opencode.json` or run `/reload`, then confirm the guard actually fired before
trusting it. A guard you have not seen block something is not a guard.

## What the guard does not cover

- It only sees the Resend tools. A different mail provider would need its own guard.
- It reads `settings.local.json` on every call, so editing `MY_EMAIL` takes effect
  without a reload.
- It cannot stop a person adding a real address to `leads/`. That is still rule 5
  in `AGENTS.md` and rule 1 in `leads/AGENTS.md`.
