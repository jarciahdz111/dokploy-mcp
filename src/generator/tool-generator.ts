/**
 * Auto-generates MCP tool registrations from an OpenAPI specification.
 *
 * Iterates over every path in the spec, converts each endpoint into
 * a properly typed MCP tool with Zod input validation, and registers
 * it on the McpServer instance.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pathToToolName, buildAnnotations } from "./name-mapper.js";
import {
  buildInputSchema,
  buildDescription,
  type OpenAPIOperation,
} from "./schema-converter.js";
import { trpcQuery, trpcMutation, handleApiError } from "../services/api-client.js";
import { formatResponse, truncateResponse } from "../services/formatters.js";

/** Minimal OpenAPI spec shape we need */
export interface OpenAPISpec {
  paths: Record<string, Record<string, OpenAPIOperation>>;
}

/**
 * Register all tools from the OpenAPI spec onto the MCP server.
 *
 * @returns The number of tools registered
 */
export function registerAllTools(
  server: McpServer,
  spec: OpenAPISpec
): number {
  let toolCount = 0;

  for (const [path, operations] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      if (method !== "get" && method !== "post") continue;

      const toolName = pathToToolName(path);
      const endpoint = path.replace(/^\//, ""); // "compose.deploy"
      const description = buildDescription(path, method, operation);
      const annotations = buildAnnotations(method, path);
      const inputSchema = buildInputSchema(method, operation);

      if (inputSchema) {
        // Tool WITH input parameters
        server.registerTool(
          toolName,
          {
            title: toolName,
            description,
            inputSchema: inputSchema.shape,
            annotations,
          },
          async (params: Record<string, unknown>) => {
            try {
              let result: unknown;
              if (method === "get") {
                result = await trpcQuery(endpoint, params);
              } else {
                result = await trpcMutation(endpoint, params);
              }
              return {
                content: [
                  {
                    type: "text" as const,
                    text: truncateResponse(formatResponse(result)),
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: handleApiError(error),
                  },
                ],
                isError: true,
              };
            }
          }
        );
      } else {
        // Tool WITHOUT input parameters (e.g., GET /project.all)
        server.registerTool(
          toolName,
          {
            title: toolName,
            description,
            inputSchema: {},
            annotations,
          },
          async () => {
            try {
              let result: unknown;
              if (method === "get") {
                result = await trpcQuery(endpoint);
              } else {
                result = await trpcMutation(endpoint);
              }
              return {
                content: [
                  {
                    type: "text" as const,
                    text: truncateResponse(formatResponse(result)),
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: handleApiError(error),
                  },
                ],
                isError: true,
              };
            }
          }
        );
      }

      toolCount++;
    }
  }

  return toolCount;
}
