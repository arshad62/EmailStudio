// Checks the send guard without going through OpenCode.
// Usage: node --experimental-strip-types scripts/test-send-guard.mjs

const plugin = (await import("../.opencode/plugins/send-guard.ts")).default

let hook = null
const ctx = {
  location: { directory: process.cwd() },
  tool: {
    hook: async (_name, fn) => {
      hook = fn
    },
  },
}

await plugin.setup(ctx)
if (!hook) throw new Error("plugin did not register a hook")

const cases = [
  {
    name: "lead address is blocked",
    event: { tool: "resend_send-email", input: { to: ["ayesha.khan@example.com"] } },
    want: "block",
  },
  {
    name: "dotted tool name is blocked too",
    event: { tool: "resend.send-email", input: { to: ["ayesha.khan@example.com"] } },
    want: "block",
  },
  {
    name: "a lead hidden in cc is blocked",
    event: { tool: "resend_send-email", input: { to: ["delivered@resend.dev"], cc: ["tom.becker@example.com"] } },
    want: "block",
  },
  {
    name: "display-name form is blocked",
    event: { tool: "resend_send-email", input: { to: ["Ayesha <ayesha.khan@example.com>"] } },
    want: "block",
  },
  {
    name: "no recipient is blocked",
    event: { tool: "resend_send-email", input: { subject: "hi" } },
    want: "block",
  },
  {
    name: "broadcast is blocked",
    event: { tool: "resend_send-broadcast", input: { broadcastId: "abc" } },
    want: "block",
  },
  {
    name: "automation is blocked",
    event: { tool: "resend_create-automation", input: {} },
    want: "block",
  },
  {
    name: "inbox send is blocked",
    event: { tool: "resend_send-new-inbox-email", input: { to: "delivered@resend.dev" } },
    want: "block",
  },
  {
    name: "resend test address is allowed",
    event: { tool: "resend_send-email", input: { to: ["delivered@resend.dev"] } },
    want: "allow",
  },
  {
    name: "batch to test addresses is allowed",
    event: {
      tool: "resend_send-batch-emails",
      input: { emails: [{ to: ["delivered@resend.dev"] }, { to: ["bounced@resend.dev"] }] },
    },
    want: "allow",
  },
  {
    name: "batch with one bad address is blocked",
    event: {
      tool: "resend_send-batch-emails",
      input: { emails: [{ to: ["delivered@resend.dev"] }, { to: ["ravi.menon@example.com"] }] },
    },
    want: "block",
  },
  {
    name: "unrelated tool is ignored",
    event: { tool: "write", input: { path: "notes/x.md", content: "hello" } },
    want: "allow",
  },
]

let failures = 0
for (const testCase of cases) {
  let outcome = "allow"
  let detail = ""
  try {
    await hook(testCase.event)
  } catch (error) {
    outcome = "block"
    detail = error.message
  }
  const ok = outcome === testCase.want
  if (!ok) failures += 1
  console.log(`${ok ? "PASS" : "FAIL"}  ${testCase.name}${ok ? "" : ` (wanted ${testCase.want}, got ${outcome})`}`)
  if (detail && ok) console.log(`      ${detail}`)
}

console.log(`\n${cases.length - failures}/${cases.length} checks passed`)
process.exit(failures ? 1 : 0)
