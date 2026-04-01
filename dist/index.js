#!/usr/bin/env node
/**
 * Dokploy MCP Server
 *
 * Auto-generates 463 MCP tools from the Dokploy OpenAPI specification,
 * providing full API coverage for project management, application deployment,
 * database management, Docker operations, and more.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DOKPLOY_URL, DOKPLOY_API_KEY } from "./constants.js";
import { registerAllTools } from "./generator/tool-generator.js";
import { logger } from "./services/logger.js";
async function main() {
    // Validate required environment variables
    if (!DOKPLOY_URL) {
        console.error("ERROR: DOKPLOY_URL environment variable is required.");
        console.error("  Example: DOKPLOY_URL=https://your-dokploy.com/api");
        process.exit(1);
    }
    if (!DOKPLOY_API_KEY) {
        console.error("ERROR: DOKPLOY_API_KEY environment variable is required.");
        console.error("  Generate an API key in Dokploy: Settings → API Keys");
        process.exit(1);
    }
    // Load the embedded OpenAPI spec
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const specPath = join(currentDir, "openapi-spec.json");
    let spec;
    try {
        const specContent = readFileSync(specPath, "utf-8");
        spec = JSON.parse(specContent);
    }
    catch (error) {
        console.error(`ERROR: Failed to load OpenAPI spec from ${specPath}`);
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
    // Create the MCP server
    const server = new McpServer({
        name: "dokploy-mcp-server",
        version: "1.0.0",
    });
    // Auto-register all tools from the OpenAPI spec
    const toolCount = registerAllTools(server, spec);
    logger.info("Dokploy MCP Server started", { toolCount });
    logger.info(`API URL: ${DOKPLOY_URL}`);
    // Start the stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    logger.error("Fatal error", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
});
//# sourceMappingURL=index.js.map