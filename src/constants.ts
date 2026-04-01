/**
 * Shared constants for the Dokploy MCP server.
 */

/** Maximum response size in characters before truncation */
export const CHARACTER_LIMIT = 25000;

/** Default HTTP request timeout in milliseconds */
export const DEFAULT_TIMEOUT = 30000;

/** Dokploy API base URL (e.g., "https://cloud.example.com/api") */
export const DOKPLOY_URL = process.env.DOKPLOY_URL;

/** Dokploy API key for authentication */
export const DOKPLOY_API_KEY = process.env.DOKPLOY_API_KEY;
