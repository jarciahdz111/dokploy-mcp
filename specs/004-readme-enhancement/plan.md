# Implementation Plan: README.md Enhancement - Dokploy MCP

**Branch**: `004-readme-enhancement` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-readme-enhancement/spec.md`

## Summary

Improve the README.md for `@jarciahdz111/dokploy-mcp` npm package to provide better structure, clear badges, practical examples, and comprehensive documentation so developers can install and configure in under 5 minutes. The README is the face of the package on npmjs.com and GitHub - it must be clear, complete, and trustworthy.

## Technical Context

**Language/Version**: N/A (documentation only, no code)
**Primary Dependencies**: N/A
**Storage**: N/A (single markdown file)
**Testing**: Manual verification by reading README and confirming all sections present
**Target Platform**: npm package ecosystem (npmjs.com + GitHub)
**Project Type**: Documentation (single README.md file)
**Performance Goals**: N/A
**Constraints**: Must fit npm package page layout, maintain readability at 300-500 lines
**Scale/Scope**: Single README.md file, 42 tool categories, 463 tools to document

**Technology Choices**:
- Markdown format following npmjs.com conventions
- Shields.io badges for version/license/compatibility
- GitHub-flavored markdown for code blocks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This is a documentation-only project with no code changes. The constitution template is empty (no gates defined), so there are no violations.

**Phase 0 Status**: N/A - no research needed. All requirements are specified in FR-001 through FR-010.

## Project Structure

### Documentation (this feature)

```text
specs/004-readme-enhancement/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # N/A - no unknowns to research
├── data-model.md        # N/A - no data models in documentation
├── quickstart.md        # N/A - README IS the quickstart
├── contracts/           # N/A - no external contracts
└── tasks.md             # Task breakdown for implementation
```

### Source Code (repository root)

```text
README.md                # Primary file to improve (single file change)
```

**Structure Decision**: Single file documentation improvement - README.md at repository root.

## Complexity Tracking

No violations. Documentation-only project with trivial scope.

---

## Phase 0: Research

**Status**: N/A

No unknowns identified. All functional requirements (FR-001 through FR-010) are fully specified and require no additional research:
- Badges: Use shields.io/npm/v, shields.io/npm/l, shields.io/node
- Structure: Standard npm README conventions
- Examples: Based on existing 463 tools in the codebase
- Categories: Already organized in openapi-spec.json

## Phase 1: Design

### README.md Structure (Target)

Based on FR-001 through FR-010, the improved README will have:

1. **Header Badges** (FR-001)
   - npm version badge
   - License badge (MIT)
   - Node.js compatibility badge

2. **Description** (from existing README)
   - One-line package summary
   - 463 tools, 100% API coverage

3. **Requirements** (new)
   - Node.js 18+
   - Dokploy account
   - API key

4. **Quick Start** (FR-002, FR-003)
   - Install command
   - Claude Desktop config template
   - Claude Code CLI config template

5. **Environment Variables** (FR-004)
   - Table: Variable, Description, Required, Default
   - DOKPLOY_URL, DOKPLOY_API_KEY, REQUEST_TIMEOUT_MS, DEBUG

6. **Available Tools** (FR-006)
   - Table with 42 categories
   - Tool count per category
   - Brief description per category

7. **Usage Examples** (FR-005)
   - 5+ practical examples
   - list projects, deploy application, view containers, databases, server status

8. **Local Development** (FR-008)
   - git clone, npm install, npm run build
   - node test-mcp.js for testing

9. **Troubleshooting** (FR-007)
   - Common errors: Unauthorized, Connection Refused, Timeout
   - Debug mode instructions

10. **Links** (FR-010)
    - GitHub Issues
    - License (MIT)
    - npm package

11. **How It Works** (from existing README)
    - Auto-generation from OpenAPI spec
    - 463 tools, tRPC conventions

### Edge Cases Addressed

- Node.js 16: Document "Node.js 18+ required" in Requirements
- npx usage: Document `npx @jarciahdz111/dokploy-mcp` as alternative to install
- Corporate firewall: Mention proxy env vars (HTTP_PROXY, HTTPS_PROXY) in Troubleshooting
- Contributing: Link to CLAUDE.md for developers who want to modify

## Files to Modify

1. `README.md` — Complete rewrite with improved structure

## Files Not Modified

- All source code files unchanged
- CLAUDE.md unchanged (security docs already there)
- package.json unchanged

## Execution Order

1. Read current README.md for reference
2. Write improved README.md following the structure above
3. Verify all 10 functional requirements are met
4. Commit and push
5. Publish new version to npm
