/**
 * Structured JSON logger for the Dokploy MCP server.
 *
 * Outputs JSON logs to stderr with levels: error, warn, info, debug.
 * Debug mode is activated via DEBUG=1 environment variable.
 *
 * MCP servers use stdio transport — stdout is for the protocol,
 * stderr is for server logs which Claude Desktop/CLI capture.
 */

export type LogLevel = "error" | "warn" | "info" | "debug";

const DEBUG_MODE = process.env.DEBUG === "1";

function isEnabled(level: LogLevel): boolean {
  if (level === "debug") return DEBUG_MODE;
  return true;
}

function formatLogEntry(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): string {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  };
  return JSON.stringify(entry);
}

function write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (!isEnabled(level)) return;
  process.stderr.write(formatLogEntry(level, message, meta) + "\n");
}

export const logger = {
  error(message: string, meta?: Record<string, unknown>): void {
    write("error", message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>): void {
    write("warn", message, meta);
  },
  info(message: string, meta?: Record<string, unknown>): void {
    write("info", message, meta);
  },
  debug(message: string, meta?: Record<string, unknown>): void {
    write("debug", message, meta);
  },
};
