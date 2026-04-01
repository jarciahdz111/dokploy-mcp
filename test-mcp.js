#!/usr/bin/env node
/**
 * MCP test: list all projects
 */
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, "dist/index.js");

const env = {
  DOKPLOY_URL: "https://cloud.hyperquantum.com.co/api",
  DOKPLOY_API_KEY: "claudeIocnUryRoyRSnClgfULExMokWpmBxuIKsKdhqtqlFeODYYsXLrfNDibmOOuubGwo",
};

let idCounter = 1;

async function main() {
  const proc = spawn("node", [serverPath], {
    env: { ...process.env, ...env },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  proc.stdout.on("data", (d) => (stdout += d.toString()));
  proc.stderr.on("data", (d) => process.stderr.write(d));

  await new Promise((r) => setTimeout(r, 2000));

  // Initialize
  proc.stdin.write(JSON.stringify({
    jsonrpc: "2.0", id: idCounter++, method: "initialize",
    params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1.0.0" } },
  }) + "\n");
  await new Promise((r) => setTimeout(r, 500));

  proc.stdin.write(JSON.stringify({
    jsonrpc: "2.0", method: "notifications/initialized", params: {},
  }) + "\n");
  await new Promise((r) => setTimeout(r, 500));

  // Call dokploy_project_all
  proc.stdin.write(JSON.stringify({
    jsonrpc: "2.0", id: idCounter++, method: "tools/call",
    params: { name: "dokploy_project_all", arguments: {} },
  }) + "\n");

  await new Promise((r) => setTimeout(r, 3000));
  proc.kill();

  const messages = stdout.split("\n").filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);

  for (const msg of messages) {
    if (msg.result?.content) {
      const text = msg.result.content[0]?.text || "";
      try {
        const data = JSON.parse(text);
        console.log("\n=== PROJECTS ===");
        console.log(JSON.stringify(data, null, 2));
      } catch {
        console.log(text);
      }
    }
    if (msg.error) {
      console.error("ERROR:", JSON.stringify(msg.error, null, 2));
    }
  }
}

main().catch(console.error);
