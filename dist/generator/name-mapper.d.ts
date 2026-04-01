/**
 * Maps OpenAPI paths to MCP tool names and generates annotations.
 */
/**
 * Convert an OpenAPI path like "/compose.deploy" to a tool name like "dokploy_compose_deploy".
 */
export declare function pathToToolName(path: string): string;
/**
 * Extract a human-readable action name from a path.
 * "/compose.deploy" → "deploy"
 */
export declare function extractAction(path: string): string;
/**
 * Extract the resource/tag name from a path.
 * "/compose.deploy" → "compose"
 */
export declare function extractResource(path: string): string;
/**
 * Build MCP tool annotations based on HTTP method and path conventions.
 */
export declare function buildAnnotations(method: string, path: string): {
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
};
//# sourceMappingURL=name-mapper.d.ts.map