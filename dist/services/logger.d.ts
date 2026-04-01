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
export declare const logger: {
    error(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    debug(message: string, meta?: Record<string, unknown>): void;
};
//# sourceMappingURL=logger.d.ts.map