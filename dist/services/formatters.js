/**
 * Response formatting and truncation utilities.
 */
import { CHARACTER_LIMIT } from "../constants.js";
/**
 * Format any API response data as a readable JSON string.
 */
export function formatResponse(data) {
    if (data === undefined || data === null) {
        return "Operation completed successfully (no data returned).";
    }
    if (typeof data === "string") {
        return data;
    }
    try {
        return JSON.stringify(data, null, 2);
    }
    catch {
        return String(data);
    }
}
/**
 * Truncate a response string if it exceeds CHARACTER_LIMIT.
 * Appends a truncation message when truncation occurs.
 */
export function truncateResponse(text) {
    if (text.length <= CHARACTER_LIMIT) {
        return text;
    }
    const truncated = text.slice(0, CHARACTER_LIMIT);
    const truncationMessage = `\n\n--- Response truncated (${text.length} chars → ${CHARACTER_LIMIT} chars). ` +
        `Use more specific filters or pagination parameters to reduce results. ---`;
    return truncated + truncationMessage;
}
//# sourceMappingURL=formatters.js.map