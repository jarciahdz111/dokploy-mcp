/**
 * Structured JSON logger for the Dokploy MCP server.
 *
 * Outputs JSON logs to stderr with levels: error, warn, info, debug.
 * Debug mode is activated via DEBUG=1 environment variable.
 *
 * MCP servers use stdio transport — stdout is for the protocol,
 * stderr is for server logs which Claude Desktop/CLI capture.
 */
const DEBUG_MODE = process.env.DEBUG === "1";
function isEnabled(level) {
    if (level === "debug")
        return DEBUG_MODE;
    return true;
}
function formatLogEntry(level, message, meta) {
    const entry = {
        level,
        timestamp: new Date().toISOString(),
        message,
        ...meta,
    };
    return JSON.stringify(entry);
}
function write(level, message, meta) {
    if (!isEnabled(level))
        return;
    process.stderr.write(formatLogEntry(level, message, meta) + "\n");
}
export const logger = {
    error(message, meta) {
        write("error", message, meta);
    },
    warn(message, meta) {
        write("warn", message, meta);
    },
    info(message, meta) {
        write("info", message, meta);
    },
    debug(message, meta) {
        write("debug", message, meta);
    },
};
//# sourceMappingURL=logger.js.map