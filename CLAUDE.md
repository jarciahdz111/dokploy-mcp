# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dokploy MCP Server — an auto-generated MCP (Model Context Protocol) server that exposes 463 tools from the Dokploy API's OpenAPI specification. It allows Claude to interact with Dokploy for managing projects, applications, databases, Docker Compose stacks, and more.

## Commands

```bash
# Build (compiles TypeScript + copies openapi-spec.json to dist/)
npm run build

# Run in development with watch mode
npm run dev

# Start production build
npm start

# Clean dist/
npm run clean
```

**Required environment variables:**
- `DOKPLOY_URL` — Dokploy API base URL (e.g., `https://your-dokploy.com/api`)
- `DOKPLOY_API_KEY` — API key from Dokploy Settings → API Keys

**Optional environment variables:**
- `REQUEST_TIMEOUT_MS` — HTTP request timeout in milliseconds (default: `30000`)
- `DEBUG` — Set to `1` to enable structured JSON debug logging to stderr

## Architecture

The server is **fully auto-generated** from `src/openapi-spec.json`. You do not hand-write API client code — regenerate tools by updating the spec and rebuilding.

### Code Generation Flow

```
openapi-spec.json
       ↓
tool-generator.ts   — iterates all paths, registers MCP tools
       ↓
schema-converter.ts — converts JSON Schema → Zod schemas at runtime
       ↓
name-mapper.ts      — maps OpenAPI paths (e.g. /compose.deploy) → tool names (dokploy_compose_deploy)
       ↓
api-client.ts       — handles tRPC-style HTTP (GET = query param, POST = JSON body, wrapped responses)
```

### tRPC API Conventions

Dokploy exposes a tRPC OpenAPI layer with non-standard conventions:
- **GET requests**: Input encoded as `?input={encodeURIComponent(JSON.stringify(params))}`
- **POST requests**: Input sent as JSON body
- **Response envelope**: `{ result: { data: { json: <actual_data> } } }`
- **Error envelope**: `{ error: { json: { message, code, data } } }`

All of this is handled in `src/services/api-client.ts`.

### Tool Naming

Tools are named `dokploy_<path_with_underscores>`:
- `/compose.deploy` → `dokploy_compose_deploy`
- `/project.all` → `dokploy_project_all`

Tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`) are derived from the action name (e.g., `delete`, `remove` → destructive).

### Response Handling

- Responses are formatted as pretty JSON and truncated at 25,000 characters (configurable via `CHARACTER_LIMIT` in `src/constants.ts`)
- All errors are caught and returned as `isError: true` tool results with human-readable messages

### Adding/Modifying Tools

Since tools are code-generated, edit `src/openapi-spec.json` (or replace it with a newer Dokploy OpenAPI spec), then run `npm run build`. The generator in `src/generator/tool-generator.ts` handles the rest.

### Key Source Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Server entry point — validates env vars, loads spec, registers tools |
| `src/openapi-spec.json` | Embedded OpenAPI spec — the source of truth for all 463 tools |
| `src/generator/tool-generator.ts` | Iterates spec paths and registers MCP tools |
| `src/generator/schema-converter.ts` | Runtime JSON Schema → Zod schema conversion |
| `src/generator/name-mapper.ts` | Path-to-tool-name mapping and annotation logic |
| `src/services/api-client.ts` | tRPC-aware HTTP client (query/mutation, unwrapping, error handling) |
| `src/services/formatters.ts` | Response formatting and truncation |
| `src/services/logger.ts` | Structured JSON logging to stderr (levels: error/warn/info/debug, DEBUG=1 enables debug) |
| `src/constants.ts` | `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `REQUEST_TIMEOUT_MS`, `CHARACTER_LIMIT` |
