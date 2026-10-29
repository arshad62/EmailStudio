import { readFileSync } from "node:fs"
import { join } from "node:path"

// The send guard stands between the studio and the Resend tools.
//
// Practice mode only allows two kinds of recipient:
//   1. a Resend test address, which ends in @resend.dev
//   2. the studio owner's own address, saved as MY_EMAIL in .opencode/settings.local.json
//
// Everything that would send to a list, start an automation, or answer mail from an
// inbox is blocked outright. Those tools cannot be aimed at a single safe address,
// so there is no safe way to use them in practice mode.

const ALLOWED_DOMAIN = "@resend.dev"

const BLOCKED = new Set([
  "resend_send-broadcast",
  "resend_create-automation",
  "resend_update-automation",
  "resend_duplicate-automation",
  "resend_send-event",
  "resend_send-inbox-draft",
  "resend_send-new-inbox-email",
  "resend_reply-to-inbox-thread-email",
  "resend_forward-inbox-thread-email",
])

const NEEDS_ADDRESS_CHECK = new Set([
  "resend_send-email",
  "resend_send-batch-emails",
])

function normalize(name: string) {
  return name.replace(/[./]/g, "_")
}

function readMyEmail(root: string): string {
  try {
    const raw = readFileSync(join(root, ".opencode", "settings.local.json"), "utf8")
    const value = JSON.parse(raw)?.MY_EMAIL
    return typeof value === "string" ? value.trim().toLowerCase() : ""
  } catch {
    return ""
  }
}

// Recipients arrive as "person@example.com" or "Name <person@example.com>".
function addressOf(value: unknown): string {
  const text = String(value ?? "").trim()
  const angled = text.match(/<([^>]+)>/)
  return (angled ? angled[1] : text).trim().toLowerCase()
}

function collectAddresses(input: any): string[] {
  const found: string[] = []

  const push = (value: unknown) => {
    if (Array.isArray(value)) value.forEach(push)
    else if (typeof value === "string" && value.trim()) found.push(addressOf(value))
  }

  push(input?.to)
  push(input?.cc)
  push(input?.bcc)

  // send-batch-emails nests one email object per entry.
  if (Array.isArray(input?.emails)) {
    for (const email of input.emails) {
      push(email?.to)
      push(email?.cc)
      push(email?.bcc)
    }
  }

  return found
}

function isAllowed(address: string, myEmail: string) {
  if (!address) return false
  if (address.endsWith(ALLOWED_DOMAIN)) return true
  if (myEmail && address === myEmail) return true
  return false
}

export default {
  id: "send-guard",
  async setup(ctx: any) {
    const root = ctx.location?.directory ?? process.cwd()

    await ctx.tool.hook("execute.before", (event: any) => {
      const name = normalize(String(event.tool ?? ""))
      if (!name.startsWith("resend_")) return

      if (BLOCKED.has(name)) {
        throw new Error(
          `Send guard blocked ${name}: practice mode never sends to a list, an automation, or an inbox. ` +
            `Use resend_send-email with a single practice address instead.`,
        )
      }

      if (!NEEDS_ADDRESS_CHECK.has(name)) return

      const addresses = collectAddresses(event.input ?? {})
      if (!addresses.length) {
        throw new Error(
          `Send guard blocked ${name}: no recipient address found. ` +
            `Practice mode only sends to an address ending in @resend.dev or to MY_EMAIL.`,
        )
      }

      const myEmail = readMyEmail(root)
      const bad = addresses.filter((address) => !isAllowed(address, myEmail))
      if (bad.length) {
        throw new Error(
          `Send guard blocked ${name}: ${bad.join(", ")} is not a practice address. ` +
            `Practice mode only sends to ${ALLOWED_DOMAIN} or to MY_EMAIL from .opencode/settings.local.json. ` +
            `The leads in leads/ are made up and must never be emailed.`,
        )
      }
    })
  },
}
