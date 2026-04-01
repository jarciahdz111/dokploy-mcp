/**
 * tRPC-aware HTTP client for the Dokploy API.
 *
 * Dokploy exposes a tRPC OpenAPI layer where:
 * - GET  requests encode input as a query param: ?input={encodeURIComponent(JSON.stringify(params))}
 * - POST requests send input as JSON body
 * - Responses are wrapped: { result: { data: { json: <actual_data> } } }
 * - Errors are wrapped:   { error: { json: { message, code, data } } }
 */
import axios from "axios";
import { DOKPLOY_URL, DOKPLOY_API_KEY, REQUEST_TIMEOUT_MS } from "../constants.js";
import { logger } from "./logger.js";
function getBaseUrl() {
    if (!DOKPLOY_URL) {
        throw new Error("DOKPLOY_URL environment variable is not set");
    }
    return DOKPLOY_URL;
}
function getApiKey() {
    if (!DOKPLOY_API_KEY) {
        throw new Error("DOKPLOY_API_KEY environment variable is not set");
    }
    return DOKPLOY_API_KEY;
}
function buildHeaders() {
    return {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
        Accept: "application/json",
    };
}
/**
 * Unwrap a tRPC response envelope.
 * Standard shape: { result: { data: { json: T } } }
 */
function unwrapResponse(data) {
    if (data && typeof data === "object") {
        const obj = data;
        // Standard tRPC response
        if (obj.result && typeof obj.result === "object") {
            const result = obj.result;
            if (result.data && typeof result.data === "object") {
                const resultData = result.data;
                if ("json" in resultData) {
                    return resultData.json;
                }
            }
            return result;
        }
    }
    return data;
}
/**
 * Parse a tRPC error response into a human-readable message.
 */
function parseTrpcError(data) {
    if (data && typeof data === "object") {
        const obj = data;
        if (obj.error && typeof obj.error === "object") {
            const error = obj.error;
            if (error.json && typeof error.json === "object") {
                const json = error.json;
                return String(json.message ?? "Unknown tRPC error");
            }
            return String(error.message ?? JSON.stringify(error));
        }
    }
    return null;
}
/**
 * Execute a tRPC query (GET request).
 *
 * @param endpoint - The tRPC procedure path, e.g. "project.all"
 * @param input - Optional input parameters
 */
export async function trpcQuery(endpoint, input) {
    const baseUrl = getBaseUrl();
    let url = `${baseUrl}/trpc/${endpoint}`;
    if (input && Object.keys(input).length > 0) {
        const encodedInput = encodeURIComponent(JSON.stringify(input));
        url += `?input=${encodedInput}`;
    }
    const startTime = Date.now();
    logger.debug(`[GET] ${endpoint}`, { url });
    try {
        const response = await axios.get(url, {
            headers: buildHeaders(),
            timeout: REQUEST_TIMEOUT_MS,
        });
        const durationMs = Date.now() - startTime;
        logger.debug(`${endpoint} succeeded`, { durationMs, status: response.status });
        return unwrapResponse(response.data);
    }
    catch (error) {
        const durationMs = Date.now() - startTime;
        logger.debug(`${endpoint} failed`, { durationMs });
        throw new Error(handleApiError(error));
    }
}
/**
 * Execute a tRPC mutation (POST request).
 *
 * @param endpoint - The tRPC procedure path, e.g. "application.deploy"
 * @param input - Optional input parameters
 */
export async function trpcMutation(endpoint, input) {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/trpc/${endpoint}`;
    const startTime = Date.now();
    logger.debug(`[POST] ${endpoint}`, { url });
    try {
        const response = await axios.post(url, input ?? {}, {
            headers: buildHeaders(),
            timeout: REQUEST_TIMEOUT_MS,
        });
        const durationMs = Date.now() - startTime;
        logger.debug(`${endpoint} succeeded`, { durationMs, status: response.status });
        return unwrapResponse(response.data);
    }
    catch (error) {
        const durationMs = Date.now() - startTime;
        logger.debug(`${endpoint} failed`, { durationMs });
        throw new Error(handleApiError(error));
    }
}
/**
 * Format an API error into an actionable message.
 */
export function handleApiError(error) {
    if (axios.isAxiosError(error)) {
        const axiosErr = error;
        if (axiosErr.response) {
            // Try to extract tRPC error message
            const trpcMsg = parseTrpcError(axiosErr.response.data);
            if (trpcMsg) {
                return `Dokploy API error: ${trpcMsg}`;
            }
            switch (axiosErr.response.status) {
                case 400:
                    return "Error: Bad request. Check the parameters and try again.";
                case 401:
                    return "Error: Unauthorized. Check your DOKPLOY_API_KEY is correct.";
                case 403:
                    return "Error: Forbidden. You don't have permission for this operation.";
                case 404:
                    return "Error: Resource not found. Check the ID is correct.";
                case 429: {
                    const retryAfter = axiosErr.response.headers["retry-after"];
                    if (retryAfter) {
                        const waitSeconds = Number(retryAfter) || parseInt(String(retryAfter), 10);
                        if (!isNaN(waitSeconds)) {
                            return `Error: Rate limit exceeded. Retry after ${waitSeconds} seconds.`;
                        }
                    }
                    return "Error: Rate limit exceeded. Please wait before making more requests.";
                }
                case 500:
                    return "Error: Internal server error on Dokploy. Try again later.";
                default:
                    return `Error: API request failed with status ${axiosErr.response.status}`;
            }
        }
        else if (axiosErr.code === "ECONNABORTED") {
            return "Error: Request timed out. The server might be busy. Try again.";
        }
        else if (axiosErr.code === "ECONNREFUSED") {
            return "Error: Connection refused. Check DOKPLOY_URL is correct and the server is running.";
        }
    }
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
//# sourceMappingURL=api-client.js.map