#!/usr/bin/env node
// Start the Resend MCP server in practice mode by default.
// This wrapper gives OpenCode the same "use my setting if I have one, otherwise
// this safe value" behaviour that Claude Code gets from ${VAR:-default}.

import { spawn } from "node:child_process"

const env = {
  ...process.env,
  RESEND_API_KEY: process.env.RESEND_API_KEY || "re_practice",
  RESEND_BASE_URL: process.env.RESEND_BASE_URL || "http://localhost:4000",
  SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS || "onboarding@resend.dev",
}

const child = spawn("npx", ["-y", "resend-mcp@2.27.1"], {
  stdio: "inherit",
  env,
})

child.on("error", (error) => {
  console.error(`Could not start resend-mcp: ${error.message}`)
  process.exit(1)
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 0)
})
