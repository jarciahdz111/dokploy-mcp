# Tasks: README.md Enhancement - Dokploy MCP

**Input**: Design documents from `/specs/004-readme-enhancement/`
**Prerequisites**: plan.md, spec.md (5 user stories)
**Tests**: NOT requested - manual verification by reading README

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root: `README.md`

---

## Phase 1: Setup (Reference Review)

**Purpose**: Read current README and gather all necessary information for rewriting

- [x] T001 [P] Read current README.md to understand existing structure and content
- [x] T002 [P] Read openapi-spec.json to extract all 42 tool categories and counts for Available Tools table

---

## Phase 2: Foundational (Rewrite README.md)

**Purpose**: Rewrite README.md with all 10 functional requirements (FR-001 through FR-010)

**⚠️ CRITICAL**: This single task rewrites the entire README.md

- [x] T003 Rewrite README.md with improved structure per plan.md:
  - **Header Badges** (FR-001): npm version, MIT license, Node.js compatibility
  - **Description** (FR-001): One-line summary, 463 tools, 100% API coverage
  - **Requirements** (new): Node.js 18+, Dokploy account, API key
  - **Quick Start** (FR-002, FR-003): Install command, Claude Desktop JSON template, Claude Code CLI JSON template
  - **Environment Variables** (FR-004): Table with DOKPLOY_URL, DOKPLOY_API_KEY, REQUEST_TIMEOUT_MS, DEBUG
  - **Available Tools** (FR-006): Table with 42 categories, tool counts per category, brief descriptions
  - **Usage Examples** (FR-005): 5+ practical examples with input parameters (dokploy_project_all, dokploy_application_deploy, dokploy_docker_getContainers, dokploy_postgres_all, dokploy_settings_getDokployVersion)
  - **Local Development** (FR-008): git clone, npm install, npm run build, node test-mcp.js
  - **Troubleshooting** (FR-007): Unauthorized error, Connection Refused, Timeout errors, DEBUG mode instructions
  - **Links** (FR-010): GitHub Issues, License (MIT), npm package
  - **How It Works** (from existing): Auto-generation from OpenAPI spec, tRPC conventions

---

## Phase 3: User Story 1 - Quick Installation (Priority: P1) 🎯 MVP

**Goal**: Developer can install and configure the package in under 5 minutes

**Independent Test**: New developer reads Quick Start section and completes installation without help

### Implementation for User Story 1

- [x] T004 [US1] Verify Quick Start section has single `npm install -g @jarciahdz111/dokploy-mcp` command
- [x] T005 [US1] Verify Claude Desktop config template is complete and copy-paste ready
- [x] T006 [US1] Verify Claude Code CLI config template is complete and copy-paste ready
- [x] T007 [US1] Verify Environment Variables table shows DOKPLOY_URL and DOKPLOY_API_KEY as required

**Checkpoint**: Quick installation verified - users can install in under 5 minutes

---

## Phase 4: User Story 2 - Clear Usage Examples (Priority: P1)

**Goal**: Developers can see practical examples of common operations

**Independent Test**: Developer reads Examples section and successfully calls a tool

### Implementation for User Story 2

- [x] T008 [P] [US2] Verify at least 5 tool call examples exist in README.md
- [x] T009 [P] [US2] Verify dokploy_application_deploy example shows required parameters
- [x] T010 [P] [US2] Verify PostgreSQL and MySQL examples are present
- [x] T011 [US2] Verify each example has clear input parameters and use case description

**Checkpoint**: Examples verified - 5+ practical tool calls documented

---

## Phase 5: User Story 3 - Tool Discovery (Priority: P2)

**Goal**: Developers can find the right tool quickly among 463 tools

**Independent Test**: Developer scans Available Tools section and identifies correct category

### Implementation for User Story 3

- [x] T012 [P] [US3] Verify Available Tools table has all 42 categories from openapi-spec.json
- [x] T013 [P] [US3] Verify table includes tool count per category
- [x] T014 [US3] Verify category descriptions explain what each manages
- [x] T015 [US3] Verify tool naming follows `dokploy_{category}_{action}` pattern consistently

**Checkpoint**: Tool discovery verified - 463 tools organized in discoverable categories

---

## Phase 6: User Story 4 - Troubleshooting (Priority: P2)

**Goal**: Developers can resolve common issues without contacting maintainer

**Independent Test**: Developer encountering error finds solution in README

### Implementation for User Story 4

- [x] T016 [P] [US4] Verify Troubleshooting section covers "Unauthorized" API key error
- [x] T017 [P] [US4] Verify Troubleshooting section covers "Connection Refused" error
- [x] T018 [P] [US4] Verify Troubleshooting section covers timeout errors
- [x] T019 [US4] Verify DEBUG=1 environment variable is documented for verbose logging

**Checkpoint**: Troubleshooting verified - common errors have solutions

---

## Phase 7: User Story 5 - Trust and Credibility (Priority: P3)

**Goal**: Package appears well-maintained and trustworthy

**Independent Test**: Developer evaluates README and sees badges confirming package quality

### Implementation for User Story 5

- [x] T020 [P] [US5] Verify npm version badge is present and correct
- [x] T021 [P] [US5] Verify MIT license badge is present
- [x] T022 [P] [US5] Verify Node.js compatibility badge is present
- [x] T023 [US5] Verify GitHub Issues link is present for support

**Checkpoint**: Trust signals verified - badges and links present

---

## Phase 8: Polish & Verification

**Purpose**: Final verification and edge case handling

- [x] T024 [P] Verify README fits within 500 lines (npm page readability)
- [x] T025 [P] Verify all 10 functional requirements (FR-001 through FR-010) are met
- [x] T026 Verify edge cases addressed: Node.js version requirement, npx usage, proxy env vars, contributing link to CLAUDE.md
- [x] T027 Run `npm run build` to ensure no regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - rewrites README.md
- **Phase 3-7 (User Stories)**: Can start after Phase 2 is complete
- **Phase 8 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **All User Stories (US1-US5)**: Depend on Phase 2 (README rewrite)
- **US1, US2, US3**: Can run in parallel after Phase 2
- **US4, US5**: Can run in parallel after Phase 2

### Within Each User Story

- All tasks marked [P] can run in parallel
- Tasks verify specific aspects of the rewritten README

### Parallel Opportunities

- T004, T005, T006 can run in parallel (different sections)
- T008, T009, T010 can run in parallel (different examples)
- T012, T013, T014 can run in parallel (different table aspects)
- T016, T017, T018 can run in parallel (different error cases)
- T020, T021, T022 can run in parallel (different badges)

---

## Implementation Strategy

### MVP First (Single Rewrite + Verification)

1. Complete Phase 1: Read current README and extract categories
2. Complete Phase 2: Rewrite entire README.md
3. **STOP and VALIDATE**: Verify all 10 FR requirements in single pass
4. Complete verification phases (3-8) to confirm quality

### Single-File Project

Since this is a single-file documentation change, the implementation is:
1. Read current state (T001, T002)
2. Rewrite README.md (T003)
3. Verify each requirement (T004-T027)

---

## Notes

- [P] tasks = verification of different aspects, can run in parallel
- [Story] label maps verification task to specific user story
- No tests needed - verification is manual by reading README
- Single deliverable: improved README.md at repository root
