/**
 * Shared constants for the Dokploy MCP server.
 */
/** Maximum response size in characters before truncation */
export declare const CHARACTER_LIMIT = 25000;
/**
 * HTTP request timeout in milliseconds.
 * Configurable via REQUEST_TIMEOUT_MS env var (default: 30000).
 */
export declare const REQUEST_TIMEOUT_MS: number;
/** @deprecated Use REQUEST_TIMEOUT_MS instead — kept for internal compatibility */
export declare const DEFAULT_TIMEOUT: number;
/** Dokploy API base URL (e.g., "https://cloud.example.com/api") */
export declare const DOKPLOY_URL: string | undefined;
/** Dokploy API key for authentication */
export declare const DOKPLOY_API_KEY: string | undefined;
//# sourceMappingURL=constants.d.ts.map