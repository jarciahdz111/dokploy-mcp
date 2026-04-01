# Data Model: Dokploy MCP Server

## Entities

### MCP Server

The root entity. A stdio-based MCP server that registers tools from an OpenAPI spec.

| Field | Type | Notes |
|-------|------|-------|
| name | string | `"dokploy-mcp-server"` |
| version | string | Matches Dokploy API version (e.g., `"0.28.8"`) |
| transport | string | Always `"stdio"` |
| toolCount | number | Always `463` |

### Tool

An individual MCP tool registered from an OpenAPI spec endpoint.

| Field | Type | Notes |
|-------|------|-------|
| name | string | Pattern: `dokploy_{tag}_{action}` e.g., `dokploy_compose_deploy` |
| inputSchema | ZodObject | Runtime-generated from JSON Schema |
| annotations | object | `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` |
| endpoint | string | tRPC endpoint path e.g., `"compose.deploy"` |
| method | `"get"` \| `"post"` | HTTP method |
| tag | string | OpenAPI tag e.g., `"compose"` |

### API Client

Handles HTTP communication with Dokploy API.

| Field | Type | Notes |
|-------|------|-------|
| baseUrl | string | From `DOKPLOY_URL` env var |
| apiKey | string | From `DOKPLOY_API_KEY` env var |
| timeout | number | From `REQUEST_TIMEOUT_MS` env var, default 30000 |
| transport | `"query"` \| `"mutation"` | GET = query, POST = mutation |

### Log Entry (structured JSON to stderr)

Emitted when `DEBUG=1` env var is set.

| Field | Type | Notes |
|-------|------|-------|
| level | `"error"` \| `"warn"` \| `"info"` \| `"debug"` | Log level |
| timestamp | ISO 8601 string | When the log was emitted |
| message | string | Human-readable message |
| endpoint | string | Optional — which tRPC endpoint was called |
| durationMs | number | Optional — request duration in milliseconds |
| error | string | Optional — error message if applicable |

### Environment Configuration

| Env Var | Type | Required | Default |
|---------|------|----------|---------|
| `DOKPLOY_URL` | string | Yes | — |
| `DOKPLOY_API_KEY` | string | Yes | — |
| `REQUEST_TIMEOUT_MS` | number | No | `30000` |
| `DEBUG` | `"1"` | No | undefined (debug off) |

## Validation Rules

- `DOKPLOY_URL` must be a valid URL starting with `https://`
- `DOKPLOY_API_KEY` must be non-empty string
- `REQUEST_TIMEOUT_MS` must be a positive number if set
- API responses unwrapped via tRPC envelope: `{ result: { data: { json: T } } }`
- Errors parsed from envelope: `{ error: { json: { message, code, data } } }`
