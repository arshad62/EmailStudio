#!/usr/bin/env node
// Review every email in a campaign folder, headless, and write machine-readable
// findings to review/findings.json.
//
// Usage: node scripts/review.mjs campaigns/test-bad
//
// Exit codes:
//   0  review ran, no high-severity findings
//   1  review ran, at least one high-severity finding
//   2  the review could not run, or its answer did not match the schema
//
// Two OpenCode differences shape this script:
//   1. There is no --json-schema flag. The schema travels inside the prompt and
//      the answer is checked here, in Node, before anything is saved.
//   2. A headless run that starts calling tools uses several model requests, and
//      the free models allow very few. So the files are read here and handed to
//      the model in one request, with line numbers for citing findings.

import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"

const ROOT = resolve(import.meta.dirname, "..")
const SCHEMA_PATH = join(ROOT, "review", "findings.schema.json")
const FINDINGS_PATH = join(ROOT, "review", "findings.json")
const SEVERITIES = new Set(["high", "medium", "low"])

const folderArg = process.argv[2]
if (!folderArg) {
  console.error("Usage: node scripts/review.mjs <campaign-folder>")
  process.exit(2)
}

const folder = relative(ROOT, resolve(ROOT, folderArg)).replace(/\\/g, "/")
if (!existsSync(join(ROOT, folder))) {
  console.error(`No such folder: ${folder}`)
  process.exit(2)
}

const schema = readFileSync(SCHEMA_PATH, "utf8")

function readIfPresent(path) {
  const full = join(ROOT, path)
  return existsSync(full) ? readFileSync(full, "utf8") : null
}

function emailFiles() {
  const found = []
  const walk = (directory) => {
    for (const entry of readdirSync(join(ROOT, directory), { withFileTypes: true })) {
      const child = `${directory}/${entry.name}`
      if (entry.isDirectory()) walk(child)
      else if (entry.name.endsWith(".md")) found.push(child)
    }
  }
  walk(folder)
  return found.sort()
}

function numbered(text) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line, index) => `${index + 1}: ${line}`)
    .join("\n")
}

const files = emailFiles()
if (!files.length) {
  console.error(`No .md email files found under ${folder}`)
  process.exit(2)
}

const lineCounts = new Map()
for (const file of files) {
  lineCounts.set(file, readFileSync(join(ROOT, file), "utf8").replace(/\r\n/g, "\n").split("\n").length)
}

function previousFindings() {
  if (!existsSync(FINDINGS_PATH)) return []
  try {
    const saved = JSON.parse(readFileSync(FINDINGS_PATH, "utf8"))
    if (saved?.folder !== folder) return []
    return Array.isArray(saved.findings) ? saved.findings : []
  } catch {
    return []
  }
}

const earlier = previousFindings()

const voice = readIfPresent("brand/voice.md")
const rules = readIfPresent(".opencode/rules/emails.md")
const plan = readIfPresent(`${folder}/plan.md`)

const prompt = `You are reviewing marketing emails for the Kettlebird Tea studio. Report only real problems. Do not invent problems to look thorough.

Every file you need is included below. Do not call any tools.

=== BRAND VOICE (brand/voice.md) ===
${voice ?? "(missing)"}

=== EMAIL RULES (.opencode/rules/emails.md) ===
${rules ?? "(missing)"}
${plan ? `\n=== CAMPAIGN PLAN (${folder}/plan.md) ===\n${plan}` : ""}

=== EMAIL FILES, WITH LINE NUMBERS ===
${files.map((file) => `--- ${file} ---\n${numbered(readFileSync(join(ROOT, file), "utf8"))}`).join("\n\n")}

Check at least: subject 50 characters or fewer, preview 90 characters or fewer, a {{first_name}} greeting in the first sentence, exactly one link, the exact sign-off, the exact two-line footer as plain text, and every word or claim the brand avoids. A softened health claim is still a health claim.

Answer with ONE JSON object and nothing else: no prose, no headings, no code fence. It must match this JSON Schema:

${schema}

Use the file paths exactly as written above, and cite the line numbers shown above. If there are no problems, answer {"findings":[]}.
${
  earlier.length
    ? `
These are findings from the last review. Report only problems that are new or still not fixed. Don't repeat ones that have been fixed.
${JSON.stringify({ findings: earlier }, null, 2)}`
    : ""
}`

const args = ["run", "--format", "json", "--auto"]
args.push("--model", process.env.REVIEW_MODEL ?? "opencode/glm-5.3-flash-free")
args.push(prompt)

const run = spawnSync("opencode", args, {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  timeout: Number(process.env.REVIEW_TIMEOUT_MS ?? 600_000),
  env: { ...process.env, NO_COLOR: "1" },
})

if (run.error) {
  console.error(`Could not start opencode: ${run.error.message}`)
  process.exit(2)
}
if (run.status !== 0) {
  console.error(`opencode exited with code ${run.status}`)
  const detail = [run.stderr, run.stdout].filter(Boolean).join("\n").trim()
  if (detail) console.error(detail.split("\n").slice(-12).join("\n"))
  process.exit(2)
}

// --format json prints one JSON event per line. Collect the text parts.
function textFromEvents(stdout) {
  const parts = []
  for (const line of stdout.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed.startsWith("{")) continue
    let event
    try {
      event = JSON.parse(trimmed)
    } catch {
      continue
    }
    if (event.type === "text" && event.part?.text) parts.push(event.part.text)
  }
  return parts.join("\n")
}

// Accept three shapes: one object, a list whose last useful item is the result,
// or prose with the object embedded in it (or in a code fence).
function parsePayload(text) {
  const candidates = [text.trim()]

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) candidates.push(fenced[1].trim())

  const first = text.indexOf("{")
  const last = text.lastIndexOf("}")
  if (first !== -1 && last > first) candidates.push(text.slice(first, last + 1))

  for (const candidate of candidates) {
    let value
    try {
      value = JSON.parse(candidate)
    } catch {
      continue
    }
    if (Array.isArray(value)) {
      const withFindings = value.filter((item) => item && Array.isArray(item.findings))
      if (withFindings.length) return withFindings.at(-1)
      continue
    }
    if (value && Array.isArray(value.findings)) return value
  }
  return null
}

function validate(payload) {
  const problems = []
  if (!payload || !Array.isArray(payload.findings)) {
    return ["the answer has no findings array"]
  }
  payload.findings.forEach((finding, index) => {
    const where = `findings[${index}]`
    if (!finding || typeof finding !== "object") {
      problems.push(`${where} is not an object`)
      return
    }
    if (typeof finding.file !== "string" || !finding.file) problems.push(`${where}.file is missing`)
    else if (!lineCounts.has(finding.file)) problems.push(`${where}.file is not one of the reviewed files`)

    if (!Number.isInteger(finding.line) || finding.line < 1) problems.push(`${where}.line is not a whole number`)
    else {
      const limit = lineCounts.get(finding.file)
      if (limit && finding.line > limit) problems.push(`${where}.line is past the end of ${finding.file}`)
    }

    if (!SEVERITIES.has(finding.severity)) problems.push(`${where}.severity is not high, medium or low`)
    if (typeof finding.problem !== "string" || !finding.problem) problems.push(`${where}.problem is missing`)
    if (typeof finding.fix !== "string" || !finding.fix) problems.push(`${where}.fix is missing`)
  })
  return problems
}

const payload = parsePayload(textFromEvents(run.stdout))

if (!payload) {
  console.error("The review did not return JSON. Nothing was saved.")
  process.exit(2)
}

const problems = validate(payload)
if (problems.length) {
  console.error("The review did not match review/findings.schema.json:")
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(2)
}

const findings = payload.findings.map((finding) => ({
  file: finding.file,
  line: finding.line,
  severity: finding.severity,
  problem: finding.problem,
  fix: finding.fix,
}))

mkdirSync(join(ROOT, "review"), { recursive: true })
writeFileSync(
  FINDINGS_PATH,
  `${JSON.stringify({ folder, reviewedAt: new Date().toISOString(), findings }, null, 2)}\n`,
)

const count = (severity) => findings.filter((finding) => finding.severity === severity).length
console.log(
  `review ${folder}: ${findings.length} finding(s) — ${count("high")} high, ${count("medium")} medium, ${count("low")} low`,
)

process.exit(count("high") > 0 ? 1 : 0)
