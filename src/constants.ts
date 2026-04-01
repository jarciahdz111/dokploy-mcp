/**
 * Shared constants for the Dokploy MCP server.
 */

/** Maximum response size in characters before truncation */
export const CHARACTER_LIMIT = 25000;

/**
 * HTTP request timeout in milliseconds.
 * Configurable via REQUEST_TIMEOUT_MS env var (default: 30000).
 */
export const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS) || 30000;

/** @deprecated Use REQUEST_TIMEOUT_MS instead — kept for internal compatibility */
export const DEFAULT_TIMEOUT = REQUEST_TIMEOUT_MS;

/** Dokploy API base URL (e.g., "https://cloud.example.com/api") */
export const DOKPLOY_URL = process.env.DOKPLOY_URL;

/** Dokploy API key for authentication */
export const DOKPLOY_API_KEY = process.env.DOKPLOY_API_KEY;
