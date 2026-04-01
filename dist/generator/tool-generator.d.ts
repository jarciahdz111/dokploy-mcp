/**
 * Auto-generates MCP tool registrations from an OpenAPI specification.
 *
 * Iterates over every path in the spec, converts each endpoint into
 * a properly typed MCP tool with Zod input validation, and registers
 * it on the McpServer instance.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type OpenAPIOperation } from "./schema-converter.js";
/** Minimal OpenAPI spec shape we need */
export interface OpenAPISpec {
    paths: Record<string, Record<string, OpenAPIOperation>>;
}
/**
 * Register all tools from the OpenAPI spec onto the MCP server.
 *
 * @returns The number of tools registered
 */
export declare function registerAllTools(server: McpServer, spec: OpenAPISpec): number;
//# sourceMappingURL=tool-generator.d.ts.map