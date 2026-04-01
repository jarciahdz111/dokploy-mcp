# Feature Specification: Dokploy MCP Community Distribution

**Feature Branch**: `002-mcp-community-distribution`
**Created**: 2026-03-31
**Status**: Draft
**Input**: User description: "Analyze and prepare Dokploy MCP server for open source community distribution: validate npm package metadata, GitHub Actions workflows, README documentation completeness, and identify code quality improvements"

## Clarifications

### Session 2026-03-31

- Q: Observability — logging y debugging cuando algo falla → A: Logging estructurado a stderr con niveles (error/warn/info/debug), activado via `DEBUG=1` env var
- Q: Security — cómo configurar credenciales de forma segura → A: Solo env vars en README. Claude Desktop config usa `command` + `env` pointing to variables set in shell/profile. No hardcoded secrets en JSON.
- Q: Scalability — rate limiting y concurrencia → A: Rate limit documentado. Server respeta headers 429 de Dokploy API. Si recibe 429, retorna mensaje claro "Rate limited, retry after X seconds".
- Q: Scope boundaries — qué está fuera de scope para v1.0 → A: Fuera de scope: Soporte Windows (solo macOS/Linux), múltiples Dokploy instances simultáneas, auto-actualización del API spec desde Dokploy, plugins/extensions al MCP server.
- Q: Timeout — debe ser configurable via env var → A: Sí — `REQUEST_TIMEOUT_MS` env var configurable. Default 30000ms. Documentado en README.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer installs MCP via npm (Priority: P1)

A developer with a Dokploy instance wants to manage their deployments from Claude Code. They install the MCP server with a single command and configure it.

**Why this priority**: Core use case — if this doesn't work, nothing else matters.

**Independent Test**: Can be fully tested by running `npm install -g @jarciahdz111/dokploy-mcp` and configuring Claude Desktop with the documented JSON.

**Acceptance Scenarios**:

1. **Given** a developer with Node.js 18+ installed, **When** they run `npm install -g @jarciahdz111/dokploy-mcp`, **Then** the package installs without errors and `dokploy-mcp` command is available in PATH
2. **Given** the package installed, **When** they configure Claude Desktop with `DOKPLOY_URL` and `DOKPLOY_API_KEY`, **Then** Claude Code lists 463 Dokploy tools via `/mcp`
3. **Given** proper configuration, **When** they ask "list my Dokploy projects", **Then** Claude returns their actual projects from the API

---

### User Story 2 - Community member contributes via GitHub (Priority: P2)

An open source developer wants to contribute improvements — fixing bugs, adding features, or updating API coverage. They clone the repo, understand the architecture, and submit a PR.

**Why this priority**: Community growth depends on contributors being able to understand and modify the codebase quickly.

**Independent Test**: Can be tested by a new developer reading README and source code, making a small change, and submitting a PR.

**Acceptance Scenarios**:

1. **Given** a developer who cloned the repo, **When** they read the README and CLAUDE.md, **Then** they understand the auto-generation architecture (spec → tool-generator → MCP)
2. **Given** understanding of architecture, **When** they update `src/openapi-spec.json` with a new Dokploy API version, **Then** running `npm run build` regenerates all tools with proper schemas
3. **Given** they fix a bug in `src/services/api-client.ts`, **When** they run `npm test` (if exists), **Then** tests pass before PR submission

---

### User Story 3 - MCP server handles errors gracefully (Priority: P2)

Users receive helpful error messages when things go wrong — bad API keys, network failures, invalid parameters.

**Why this priority**: Poor error handling leads to frustrated users and meaningless bug reports.

**Independent Test**: Can be tested by providing invalid credentials, unreachable URLs, and malformed parameters.

**Acceptance Scenarios**:

1. **Given** incorrect `DOKPLOY_API_KEY`, **When** any tool is called, **Then** error message says "Unauthorized. Check your DOKPLOY_API_KEY is correct."
2. **Given** unreachable `DOKPLOY_URL` (network down), **When** any tool is called, **Then** error message says "Connection refused. Check DOKPLOY_URL is correct and the server is running."
3. **Given** a tool is called with missing required parameters, **When** Zod validation fails, **Then** the error clearly identifies which parameter is missing

---

### User Story 4 - Documentation enables self-service (Priority: P2)

Developers can set up and use the MCP without asking maintainers for help.

**Why this priority**: Reduces maintainer burden and enables 24/7 community adoption.

**Independent Test**: A developer with no prior Dokploy MCP experience follows the README and succeeds.

**Acceptance Scenarios**:

1. **Given** a developer who never used Dokploy, **When** they read the README, **Then** they understand what Dokploy does, what the MCP provides, and how to configure it
2. **Given** a developer who wants to update API coverage, **When** they read CLAUDE.md and the source, **Then** they understand the spec → build → test pipeline without asking questions
3. **Given** a developer troubleshooting, **When** they encounter an error, **Then** the error message is actionable (not just "Error occurred")

---

### User Story 5 - Release process publishes to npm reliably (Priority: P3)

Maintainers can publish new versions by pushing a git tag, with CI validating the build first.

**Why this priority**: Ensures quality and reduces publish errors.

**Independent Test**: Can be tested by pushing a test tag and verifying CI runs and npm package is created.

**Acceptance Scenarios**:

1. **Given** a maintainer pushes `v0.28.9` tag, **When** GitHub Actions runs, **Then** it builds successfully, runs `npm pack --dry-run` validation, and publishes to npm with correct version
2. **Given** CI workflow runs, **When** build or tests fail, **Then** npm publish is NOT executed and maintainer is notified

---

### Edge Cases

- API key exposed in config file — README warns to NEVER hardcode keys; Claude Desktop config uses `env` referencing shell environment variables, not inline values
- OpenAPI spec is 1.4MB embedded in dist — build should verify it fits within npm package size limits
- Dokploy API rate limiting — server should handle 429 errors gracefully with retry messaging
- Network timeouts — configurable via `REQUEST_TIMEOUT_MS` env var (default 30000ms)
- API returns unexpected response shape — should not crash; should return helpful error
- User runs `dokploy-mcp` without env vars — should exit with clear error message, not hang

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MCP server MUST register exactly 463 tools matching Dokploy API v0.28.8 endpoints
- **FR-002**: Package MUST be installable via `npm install -g @jarciahdz111/dokploy-mcp`
- **FR-003**: CLI command `dokploy-mcp` MUST be available in PATH after installation
- **FR-004**: Server MUST validate `DOKPLOY_URL` and `DOKPLOY_API_KEY` environment variables on startup and exit with clear error if missing
- **FR-005**: Server MUST return actionable error messages for HTTP status codes (400, 401, 403, 404, 429, 500). For 429 specifically, MUST parse Retry-After header and include wait time in error message
- **FR-006**: Server MUST handle network errors (ECONNREFUSED, ECONNABORTED) with descriptive messages
- **FR-007**: Server MUST output structured JSON logs to stderr with levels: error, warn, info, debug. Debug mode activated via `DEBUG=1` environment variable
- **FR-008**: CI workflow MUST verify `dist/index.js` is executable after build
- **FR-009**: CI workflow MUST verify `dist/openapi-spec.json` exists after build
- **FR-010**: Release workflow MUST publish to npm only after build job succeeds
- **FR-011**: README MUST include: installation, Claude Desktop config, Claude Code CLI config, environment variables, tool examples, local development
- **FR-012**: Package version MUST match Dokploy API version (`0.28.8`) to avoid confusion
- **FR-013**: Package name `@jarciahdz111/dokploy-mcp` MUST be unique on npm
- **FR-014**: Server MUST respect `REQUEST_TIMEOUT_MS` environment variable for HTTP request timeout. Default is 30000ms if not set

### Key Entities *(include if feature involves data)*

- **MCP Server**: The Node.js stdio server that registers 463 tools from OpenAPI spec
- **OpenAPI Spec**: 1.4MB JSON embedded at build time containing all endpoint definitions
- **Tool Generator**: Code that parses spec and registers tools dynamically
- **API Client**: tRPC-aware HTTP client handling GET (query params) and POST (JSON body) requests
- **Zod Schema**: Runtime-validated input schemas derived from JSON Schema

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developer can install and configure MCP in under 5 minutes following README
- **SC-002**: All 463 tools appear in Claude Code via `/mcp` command when properly configured
- **SC-003**: `dokploy_project_all` returns correct project data within 3 seconds on stable connection
- **SC-004**: Invalid API key returns "Unauthorized" error within 1 second (no hang)
- **SC-005**: README scores above 80% on readability for new developers (measured by question completion rate)
- **SC-006**: CI build completes in under 2 minutes on GitHub Actions
- **SC-007**: `npm pack --dry-run` shows under 50 files published (excluding source)
- **SC-008**: Release workflow publishes to npm within 5 minutes of git tag push
- **SC-009**: With `DEBUG=1` env var, server outputs structured JSON logs to stderr at debug level including request/response timing and endpoint called

## Assumptions

- Target users are developers familiar with Node.js, npm, and Claude Code
- Users have a Dokploy instance (self-hosted or cloud) with API access already configured
- GitHub Actions Ubuntu runner is sufficient for build and test
- No Windows-specific testing required for v1.0 (macOS/Linux focus)
- API spec will be updated manually when Dokploy releases new versions (no auto-sync)
- **Out of scope for v1.0**: Windows support, multiple simultaneous Dokploy instances, auto-sync of API spec from Dokploy, plugins/extensions to the MCP server, retry with backoff (manual retry on 429)
