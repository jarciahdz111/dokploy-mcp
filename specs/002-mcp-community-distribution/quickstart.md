# Contributor Quick-Start: Dokploy MCP Server

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Setup

```bash
# Clone the repository
git clone https://github.com/jarciahdz111/dokploy-mcp.git
cd dokploy-mcp

# Install dependencies
npm install

# Build
npm run build
```

## Environment Variables

Create a `.env` file (not committed to git) or export variables:

```bash
export DOKPLOY_URL="https://your-dokploy.com/api"
export DOKPLOY_API_KEY="your-api-key"
export REQUEST_TIMEOUT_MS="30000"   # optional, default 30000
export DEBUG="1"                     # optional, enables debug logging
```

## Test the Server

```bash
# Quick smoke test (validates env vars and 463 tools register)
node test-mcp.js

# Or run directly
DOKPLOY_URL="$DOKPLOY_URL" DOKPLOY_API_KEY="$DOKPLOY_API_KEY" node dist/index.js
```

## Codebase Tour

| Path | Purpose |
|------|---------|
| `src/index.ts` | Entry point — validates env vars, loads spec, registers tools |
| `src/openapi-spec.json` | 1.4MB OpenAPI spec — update this to regenerate tools |
| `src/generator/tool-generator.ts` | Main loop: iterates spec → registers MCP tools |
| `src/generator/schema-converter.ts` | JSON Schema → Zod schema conversion |
| `src/generator/name-mapper.ts` | Path → tool name mapping |
| `src/services/api-client.ts` | tRPC HTTP client (GET/POST, response unwrapping) |
| `src/services/formatters.ts` | JSON formatting + truncation |
| `src/services/logger.ts` | Structured JSON logging to stderr (error/warn/info/debug levels) |
| `src/constants.ts` | Environment variable defaults |

## Adding a New Tool

The codebase is auto-generated. To add a new tool:

1. Update `src/openapi-spec.json` with the new endpoint (or replace with a newer Dokploy spec)
2. Run `npm run build`
3. New tools are automatically registered

## Running Tests

```bash
# Manual test script
node test-mcp.js

# CI validates build + structure (no unit tests yet)
npm run build
```

## Debug Mode

```bash
DEBUG=1 DOKPLOY_URL="$DOKPLOY_URL" DOKPLOY_API_KEY="$DOKPLOY_API_KEY" node dist/index.js
```

Debug output is JSON to stderr with: endpoint called, duration, response status.

## Common Tasks

```bash
# Clean and rebuild
npm run clean && npm run build

# Test with different timeout
REQUEST_TIMEOUT_MS=10000 node test-mcp.js

# Package (dry run)
npm pack --dry-run
```
