/**
 * Maps OpenAPI paths to MCP tool names and generates annotations.
 */
/**
 * Convert an OpenAPI path like "/compose.deploy" to a tool name like "dokploy_compose_deploy".
 */
export function pathToToolName(path) {
    // Remove leading slash, replace dots with underscores
    const cleaned = path.replace(/^\//, "").replace(/\./g, "_");
    return `dokploy_${cleaned}`;
}
/**
 * Extract a human-readable action name from a path.
 * "/compose.deploy" → "deploy"
 */
export function extractAction(path) {
    const parts = path.replace(/^\//, "").split(".");
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}
/**
 * Extract the resource/tag name from a path.
 * "/compose.deploy" → "compose"
 */
export function extractResource(path) {
    const parts = path.replace(/^\//, "").split(".");
    return parts[0];
}
/** Words in action names that indicate destructive operations */
const DESTRUCTIVE_ACTIONS = [
    "delete",
    "remove",
    "kill",
    "clean",
    "drop",
    "purge",
    "prune",
];
/** Words in action names that indicate read operations (beyond GET method) */
const READ_ACTIONS = [
    "get",
    "list",
    "all",
    "one",
    "read",
    "search",
    "load",
    "check",
    "validate",
    "count",
    "have",
    "is",
    "can",
    "show",
];
/**
 * Build MCP tool annotations based on HTTP method and path conventions.
 */
export function buildAnnotations(method, path) {
    const action = extractAction(path).toLowerCase();
    const isGet = method === "get";
    const isDestructive = DESTRUCTIVE_ACTIONS.some((d) => action.includes(d));
    const isReadAction = READ_ACTIONS.some((r) => action.startsWith(r));
    return {
        readOnlyHint: isGet || isReadAction,
        destructiveHint: isDestructive,
        idempotentHint: isGet || action.includes("update") || action.includes("set"),
        openWorldHint: true,
    };
}
//# sourceMappingURL=name-mapper.js.map