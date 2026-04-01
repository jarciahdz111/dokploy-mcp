# Research: Dokploy MCP Community Distribution

## Research: Structured Logging in Node.js MCP Servers

**Decision**: Use JSON logs to stderr with log levels
**Rationale**: MCP servers via stdio have stdout for protocol, stderr for server logs. Claude Desktop/CLI capture stderr. JSON format enables log aggregation tools. Log levels (error/warn/info/debug) provide granularity. `DEBUG=1` env var toggles debug mode.
**Alternatives considered**:
- File-based logging: rejected — adds filesystem dependencies, harder to configure in Claude Desktop
- Plain text logging: rejected — harder to parse/aggregate, less structured

---

## Research: 429 Rate Limit Handling

**Decision**: Parse `Retry-After` header from 429 responses, return message with wait time
**Rationale**: HTTP 429 with Retry-After is standard. Parsing it and returning "Rate limited, retry after Xs" gives users actionable feedback. No automatic retry (out of scope per spec).
**Alternatives considered**:
- Automatic retry with backoff: out of scope (Clarification 3)
- Simple "Rate limited" without wait time: rejected — less actionable

---

## Research: `REQUEST_TIMEOUT_MS` Configuration

**Decision**: Use `REQUEST_TIMEOUT_MS` env var, default 30000ms
**Rationale**: Standard env var naming (all-caps with underscores). 30s default covers most Dokploy API operations. In `constants.ts`, parse env var with fallback to default.
**Implementation**: `const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS) || 30000;`
**Alternatives considered**:
- `DEFAULT_TIMEOUT` rename: rejected — keep existing `DEFAULT_TIMEOUT` constant for internal use, add `REQUEST_TIMEOUT_MS` as the documented env var
