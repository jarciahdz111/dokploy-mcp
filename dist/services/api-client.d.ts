/**
 * tRPC-aware HTTP client for the Dokploy API.
 *
 * Dokploy exposes a tRPC OpenAPI layer where:
 * - GET  requests encode input as a query param: ?input={encodeURIComponent(JSON.stringify(params))}
 * - POST requests send input as JSON body
 * - Responses are wrapped: { result: { data: { json: <actual_data> } } }
 * - Errors are wrapped:   { error: { json: { message, code, data } } }
 */
/**
 * Execute a tRPC query (GET request).
 *
 * @param endpoint - The tRPC procedure path, e.g. "project.all"
 * @param input - Optional input parameters
 */
export declare function trpcQuery<T = unknown>(endpoint: string, input?: Record<string, unknown>): Promise<T>;
/**
 * Execute a tRPC mutation (POST request).
 *
 * @param endpoint - The tRPC procedure path, e.g. "application.deploy"
 * @param input - Optional input parameters
 */
export declare function trpcMutation<T = unknown>(endpoint: string, input?: Record<string, unknown>): Promise<T>;
/**
 * Format an API error into an actionable message.
 */
export declare function handleApiError(error: unknown): string;
//# sourceMappingURL=api-client.d.ts.map