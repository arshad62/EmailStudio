import { readFileSync } from "node:fs"
import { isAbsolute, join } from "node:path"

const SIGN_OFF = "Warm cups,\nThe Kettlebird Tea team"
const FOOTER_1 = "You're getting this because you joined the Kettlebird Tea waitlist."
const FOOTER_2 = "Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}"

const AVOID = [
  "revolutionary",
  "game-changing",
  "disrupt",
  "unlock",
  "secret",
  "hack",
  "best",
  "number one",
  "world-class",
  "unbeatable",
  "cheap",
  "deal",
  "hurry",
  "last chance",
  "detox",
  "cleanse",
  "toxins",
  "superfood",
  "miracle",
  "skinny",
  "weight loss",
  "fat-burning",
  "boosts metabolism",
  "cure",
  "treat",
  "prevent",
  "doctor-recommended",
  "clinically proven",
  "guaranteed",
  "risk-free",
  "forever",
]

function words(text: string, phrase: string) {
  const escaped = phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
  return new RegExp(`\\b${escaped}\\b`, "gi").test(text)
}

function check(content: string): string[] {
  const errors: string[] = []
  const normal = content.replace(/\r\n/g, "\n")
  const lines = normal.split("\n")

  const subject = lines.find((line) => line.startsWith("Subject:"))
  if (!subject) {
    errors.push("missing a line starting with Subject:")
  } else {
    const value = subject.slice("Subject:".length).trim()
    if (value.length > 50) errors.push(`Subject is ${value.length} characters (max 50)`)
  }

  const preview = lines.find((line) => line.startsWith("Preview:"))
  if (!preview) {
    errors.push("missing a line starting with Preview:")
  } else {
    const value = preview.slice("Preview:".length).trim()
    if (value.length > 90) errors.push(`Preview is ${value.length} characters (max 90)`)
  }

  if (!normal.includes("{{first_name}}")) errors.push("no {{first_name}} greeting")

  const links = normal.match(/\]\(https?:\/\/[^)]+\)/g) ?? []
  if (links.length !== 1) errors.push(`found ${links.length} links (need exactly 1)`)

  if (normal.includes("```")) errors.push("contains a triple-backtick code block")

  if (!normal.includes(SIGN_OFF)) errors.push("missing the exact brand sign-off")

  const footer = lines.slice(-3).map((line) => line.trim())
  if (!footer.includes(FOOTER_1) || !footer.includes(FOOTER_2)) {
    errors.push("the exact two-line footer is missing from the end of the file")
  }

  const found = AVOID.filter((word) => words(normal, word))
  if (found.length) errors.push(`uses words or claims the brand avoids: ${found.join(", ")}`)

  return errors
}

export default {
  id: "email-format-guard",
  async setup(ctx: any) {
    const root = ctx.location?.directory ?? process.cwd()

    await ctx.tool.hook("execute.before", (event: any) => {
      if (event.tool !== "write" && event.tool !== "edit") return

      const input = event.input ?? {}
      const path = String(input.path ?? "")
      if (!path) return

      const normalPath = path.replace(/\\/g, "/")
      const withRoot = normalPath.startsWith("/") ? normalPath : `/${normalPath}`
      if (!/\/campaigns\/.*\/emails\/[^/]+\.md$/.test(withRoot)) return
      if (normalPath.includes("/test-bad/")) return

      let content = ""

      if (event.tool === "write") {
        content = String(input.content ?? "")
      } else {
        const absolute = isAbsolute(path) ? path : join(root, path)
        let previous = ""
        try {
          previous = readFileSync(absolute, "utf8")
        } catch {
          return
        }
        if (!previous.includes(input.oldString)) return
        content = input.replaceAll
          ? previous.split(input.oldString).join(input.newString)
          : previous.replace(input.oldString, input.newString)
      }

      const errors = check(content)
      if (errors.length) {
        throw new Error(`Email rule violation in ${normalPath}: ${errors.join("; ")}`)
      }
    })
  },
}
