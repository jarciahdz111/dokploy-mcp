# Implementation Plan: Dokploy MCP Community Distribution

**Branch**: `002-mcp-community-distribution` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-mcp-community-distribution/spec.md`

## Summary

Prepare the Dokploy MCP Server for open source community distribution. The server is already functional (463 tools, npm packaging, GitHub Actions CI). This plan addresses validation, code quality improvements (structured logging, error handling enhancements, timeout configurability), and documentation completeness.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022, Node16 moduleResolution)
**Primary Dependencies**: @modelcontextprotocol/sdk ^1.6.1, axios ^1.7.9, zod ^3.23.8
**Storage**: N/A (stateless MCP server — no persistent storage)
**Testing**: Manual via `test-mcp.js` script. No formal test suite exists yet.
**Target Platform**: Node.js 18+ on macOS/Linux. Windows not officially tested.
**Project Type**: MCP Server (Node.js stdio transport, distributed as npm package)
**Performance Goals**: 3s API response target, 30s configurable timeout, 2min CI build
**Constraints**: 1.4MB OpenAPI spec embedded in dist, must pass `npm pack --dry-run` with <50 files
**Scale/Scope**: 463 MCP tools auto-generated from OpenAPI spec (Dokploy API v0.28.8)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution**: Empty template (`.specify/memory/constitution.md` is un-filled). No gates apply — proceed with planning.

## Project Structure

### Documentation (this feature)

```text
specs/002-mcp-community-distribution/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (this command)
├── data-model.md        # Phase 1 output (entities: MCP Server, Tool, API Client, Log Entry)
├── quickstart.md        # Phase 1 output (contributor quick-start guide)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md            # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root — existing structure, no changes needed)

```text
src/
├── index.ts              # Entry point: env validation, spec loading, server start
├── constants.ts          # DOKPLOY_URL, DOKPLOY_API_KEY, REQUEST_TIMEOUT_MS, CHARACTER_LIMIT
├── openapi-spec.json    # 1.4MB embedded OpenAPI spec (v0.28.8)
├── generator/
│   ├── tool-generator.ts  # Iterates spec paths → registers MCP tools
│   ├── schema-converter.ts # JSON Schema → Zod schemas (runtime)
│   └── name-mapper.ts   # Path → tool name mapping + annotations
└── services/
    ├── api-client.ts     # tRPC-aware HTTP client (GET/POST, unwrapping, errors)
    └── formatters.ts      # JSON formatting + truncation

.github/workflows/
├── ci.yml                # Build + verify on push/PR
└── release.yml           # npm publish on tag push

test-mcp.js               # Manual MCP test script (stdio via Node child_process)
```

**Structure Decision**: Single-project TypeScript library. Existing structure is appropriate. Improvements are additive (new env vars, logging, error handling).

## Complexity Tracking

> No constitution violations. Existing structure is appropriate.

| Area | Decision | Rationale |
|------|----------|-----------|
| Test framework | Add Node.js built-in `assert` | No external test dependency needed for this project |
| Logging | Structured JSON to stderr | stdio transport means logs go to Claude Desktop/CLI stderr |
| Config | Environment variables only | Aligns with 12-factor app principles |
