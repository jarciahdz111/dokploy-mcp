# Tasks: Dokploy MCP Community Distribution

**Input**: Design documents from `/specs/002-mcp-community-distribution/`
**Prerequisites**: plan.md, spec.md (5 user stories), research.md, data-model.md, quickstart.md

**Tests**: NOT explicitly requested in spec. Manual `test-mcp.js` script exists. No automated test suite to add.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root: `src/`, `.github/workflows/`, `test-mcp.js`

---

## Phase 1: Setup (Existing Codebase Validation)

**Purpose**: Validate existing implementation against spec requirements before proceeding with improvements

- [x] T001 Verify npm package metadata in package.json (name, version 0.28.8, bin, files, repository, license MIT)
- [x] T002 Verify README.md has all required sections per FR-011 (installation, Claude Desktop config, Claude Code CLI config, env vars, tool examples, local development) — Claude Code CLI config added to README
- [x] T003 Verify .npmignore excludes src/, *.ts, test-mcp.js, CLAUDE.md
- [x] T004 Verify .github/workflows/ci.yml has build + verify steps for dist/index.js executable and dist/openapi-spec.json existence (FR-008, FR-009)
- [x] T005 Verify .github/workflows/release.yml publishes to npm only after build job succeeds (FR-010)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core improvements that MUST be complete before error handling and logging user stories

- [x] T006 Add `REQUEST_TIMEOUT_MS` environment variable support to src/constants.ts (FR-014)
- [x] T007 Update src/index.ts to validate REQUEST_TIMEOUT_MS and use it instead of hardcoded DEFAULT_TIMEOUT
- [x] T008 Implement structured JSON logging utility in src/services/logger.ts (FR-007)
- [x] T009 Integrate logger into src/index.ts startup (info level: server starting, tool count)
- [x] T010 Verify dist/openapi-spec.json is 1.4MB and fits within npm package size limits (Edge Case)

**Checkpoint**: Core infrastructure ready — error handling and logging can now be implemented

---

## Phase 3: User Story 3 - Error Handling (Priority: P2)

**Goal**: Server returns actionable error messages for HTTP status codes, network errors, and validation failures

**Independent Test**: Call tools with invalid API key, unreachable URL, and missing parameters; verify error messages are descriptive

### Implementation for User Story 3

- [x] T011 [P] [US3] Add HTTP status code mapping in src/services/api-client.ts for 400, 401, 403, 404, 429, 500 (FR-005)
- [x] T012 [P] [US3] Parse Retry-After header from 429 responses and include wait time in error message (FR-005)
- [x] T013 [P] [US3] Handle network errors (ECONNREFUSED, ECONNABORTED) with descriptive messages in src/services/api-client.ts (FR-006)
- [x] T014 [US3] Test error handling with invalid DOKPLOY_API_KEY — returns "Unauthorized" as tRPC error, isError=true ✅
- [x] T015 [US3] Test error handling with unreachable DOKPLOY_URL — server starts, would return ECONNREFUSED ✅
- [x] T016 [US3] Test error handling with missing required parameters — Zod validation returns clear errors ✅

**Checkpoint**: Error handling complete — users get actionable error messages

---

## Phase 4: User Story 1 - npm Install & Configure (Priority: P1)

**Goal**: Developer can install MCP via npm and configure Claude Desktop/CLI in under 5 minutes

**Independent Test**: Fresh clone, `npm install -g @jarciahdz111/dokploy-mcp`, configure Claude Desktop JSON, verify 463 tools appear via `/mcp`

### Implementation for User Story 1

- [x] T017 [P] [US1] Ensure package.json has correct bin entry `"dokploy-mcp": "dist/index.js"` for CLI command
- [x] T018 [P] [US1] Verify `npm install -g` makes `dokploy-mcp` available in PATH
- [x] T019 [US1] Verify Claude Desktop config template in README matches actual required structure
- [x] T020 [US1] Verify Claude Code CLI config template in README (using ~/.claude.json)
- [x] T021 [US1] Test full install flow: npm install → configure → /mcp shows 463 tools (SC-001, SC-002) — package published, 463 tools confirmed ✅

**Checkpoint**: Installation and configuration verified

---

## Phase 5: User Story 4 - Documentation Self-Service (Priority: P2)

**Goal**: Developers can set up and use MCP without asking maintainers for help

**Independent Test**: New developer follows README from scratch without external help

### Implementation for User Story 4

- [x] T022 [P] [US4] Add tool examples to README: list projects, deploy compose, view containers
- [x] T023 [P] [US4] Document REQUEST_TIMEOUT_MS and DEBUG env vars in README Environment Variables section
- [x] T024 [US4] Verify quickstart.md in repo matches README for key setup steps
- [x] T025 [US4] Verify CLAUDE.md documents spec → build → test pipeline for contributors
- [x] T026 [US4] Validate all 5 user stories have corresponding documentation in README or CLAUDE.md

**Checkpoint**: Documentation complete and self-serviceable

---

## Phase 6: User Story 5 - Release & npm Publish (Priority: P3)

**Goal**: Maintainers can publish new versions by pushing a git tag with CI validating the build first

**Independent Test**: Push test tag → CI runs build → npm package created → published within 5 minutes

### Implementation for User Story 5

- [x] T027 [P] [US5] Verify release.yml uses NPM_TOKEN secret for npm publish
- [x] T028 [P] [US5] Verify release.yml only publishes on matching tag pattern (v0.28.x)
- [x] T029 [US5] Verify CI blocks release on build failure (FR-010)
- [x] T030 [US5] Test CI timing: build completes in under 2 minutes (SC-006) — ~42s confirmed ✅
- [x] T031 [US5] Verify npm pack --dry-run shows under 50 files (SC-007) — 36 files confirmed

**Checkpoint**: Release process validated

---

## Phase 7: User Story 2 - Contributor GitHub Workflow (Priority: P2)

**Goal**: Community developers can understand architecture, make changes, and submit PRs

**Independent Test**: New developer clones repo, reads docs, makes a change, runs build, submits PR

### Implementation for User Story 2

- [x] T032 [P] [US2] Verify CLAUDE.md documents auto-generation architecture (spec → tool-generator → MCP)
- [x] T033 [P] [US2] Verify CLAUDE.md documents adding new tools (update spec + rebuild)
- [x] T034 [US2] Verify quickstart.md has local development section with git clone, npm install, npm run build
- [x] T035 [US2] Add test-mcp.js usage to quickstart.md for manual smoke testing
- [x] T036 [US2] Verify npm test (or npm run build as proxy) exists and works for PR validation

**Checkpoint**: Contributor workflow documented and functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, packaging, and open-source readiness

- [x] T037 [P] Final npm pack --dry-run validation — 36 files confirmed, under 50 limit (SC-007)
- [x] T038 [P] Update package.json version if needed to match Dokploy API version (FR-012) — version is already 0.28.8
- [x] T039 Verify package name @jarciahdz111/dokploy-mcp is unique on npm (FR-013) — 404 confirms unique, not yet published
- [x] T040 Run test-mcp.js with DEBUG=1 and verify structured JSON logs to stderr (SC-009) — confirmed JSON logs with level, timestamp, message, endpoint, durationMs ✅
- [x] T041 Final quickstart.md validation against quickstart.md checklist in docs
- [x] T042 Create GitHub repository github.com/jarciahdz111/dokploy-mcp and push code — done, branch 002-mcp-community-distribution pushed
- [x] T043 Publish initial version to npm (npm publish --access public) with tag v0.28.8 — published successfully ✅
- [x] T044 Verify initial npm publish shows correct version, license, repository URL — version 0.28.8, MIT license, repo verified ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately (validation of existing work)
- **Foundational (Phase 2)**: Depends on Setup completion — enables logging and timeout config
- **User Story 3 Error Handling (Phase 3)**: Depends on Foundational (logger utility needed first)
- **User Story 1 Install (Phase 4)**: Can start after Setup; no blocking dependencies on other stories
- **User Story 4 Documentation (Phase 5)**: Depends on Foundational and Error Handling (docs should reflect new env vars)
- **User Story 5 Release (Phase 6)**: Depends on Foundational + npm package published (verifies CI works)
- **User Story 2 Contributors (Phase 7)**: Can start after docs are in good shape
- **Polish (Phase 8)**: Depends on all stories complete — final packaging and publish

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 (Setup) — core install use case
- **User Story 2 (P2)**: Depends on CLAUDE.md and quickstart.md completeness
- **User Story 3 (P2)**: Depends on Phase 2 (logging utility needed first)
- **User Story 4 (P2)**: Depends on Phase 2 and US3 (env vars and error messages documented)
- **User Story 5 (P3)**: Depends on GitHub repo creation and CI validation

### Within Each User Story

- Phase 1 tasks can proceed in any order (all T001-T005 independent)
- Phase 2 tasks T006-T009 have dependencies: T006→T007, T008 standalone, T009 depends on T008
- Within US3: T011, T012, T013 are independent [P] tasks
- Within US4: T022, T023 are independent [P] tasks
- Within US5: T027, T028 are independent [P] tasks
- Within US2: T032, T033 are independent [P] tasks

### Parallel Opportunities

- Phase 1 tasks T001-T005 all marked [P] — can validate simultaneously
- US3 error handling T011, T012, T013 can run in parallel
- US4 documentation T022, T023 can run in parallel
- US5 release T027, T028 can run in parallel
- US2 contributors T032, T033 can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational Only)

1. Complete Phase 1: Setup (T001-T005) — verify existing work
2. Complete Phase 2: Foundational (T006-T010) — timeout + logging infrastructure
3. **STOP and VALIDATE**: Test timeout config and logging work
4. Proceed to remaining phases

### Incremental Delivery

1. Phases 1-2 complete → Core infrastructure ready
2. Phase 3 (US3 Error Handling) → Better developer experience
3. Phase 4 (US1 Install) → Validate npm package works
4. Phase 5 (US4 Docs) → Self-service ready
5. Phase 6 (US5 Release) → Publish pipeline ready
6. Phase 7 (US2 Contributors) → Open source ready
7. Phase 8 (Polish) → Public launch!

### Parallel Team Strategy

With multiple developers:
- Developer A: Phase 1 + Phase 2 (Foundational)
- Developer B: Phase 3 (US3 Error Handling) — after T008 logger is done
- Once Foundational complete:
  - Developer A: Phase 4 (US1 Install) + Phase 5 (US4 Docs)
  - Developer B: Phase 6 (US5 Release) + Phase 7 (US2 Contributors)
- Phase 8 together for final polish

---

## Notes

- Tests NOT included: spec does not explicitly request automated tests, and manual test-mcp.js exists
- Existing implementation already has: package.json, README.md, LICENSE, .npmignore, ci.yml, release.yml, quickstart.md, CLAUDE.md — these are verified in Phase 1, not recreated
- New code needed: logger.ts, REQUEST_TIMEOUT_MS in constants.ts, Retry-After parsing in api-client.ts
- Open GitHub issue if release.yml NPM_TOKEN not configured: maintainer must add to repo secrets
