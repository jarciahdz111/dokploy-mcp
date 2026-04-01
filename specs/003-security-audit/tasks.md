# Tasks: Security Audit - Dokploy MCP npm Package

**Input**: Security audit specification from `spec.md`
**Prerequisites**: spec.md (5 user stories), plan.md
**Tests**: Manual verification via `npm audit`, code review

**Organization**: Tasks are grouped by implementation area

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root: `src/`, `.github/workflows/`, `.npmrc`

---

## Phase 1: Supply Chain Hardening (Priority: P1)

**Goal**: Add .npmrc for audit enforcement

**Independent Test**: Run `npm install` and verify audit runs, or check .npmrc content

### Implementation

- [x] T001 [P] [US4] Create `.npmrc` with `audit=true` and `engine-strict=true`

---

## Phase 2: Input Validation Hardening (Priority: P1)

**Goal**: Add endpoint validation whitelist and request size limits

**Independent Test**: Call with invalid endpoint format and verify rejection

### Implementation

- [x] T002 [P] [US3] Add endpoint format whitelist regex in src/services/api-client.ts
- [x] T003 [P] [US3] Add MAX_REQUEST_SIZE constant and validateRequestSize() function
- [x] T004 [US3] Call validateEndpoint() in trpcQuery() and trpcMutation()
- [x] T005 [US3] Call validateRequestSize() before sending request body

---

## Phase 3: Debug Logging Sanitization (Priority: P2)

**Goal**: Remove query params from debug URL logging

**Independent Test**: Run with DEBUG=1 and verify no URL query params in logs

### Implementation

- [x] T006 [P] [US5] Update debug log in trpcQuery() to log endpoint name + truncated input only, not full URL
- [x] T007 [P] [US5] Update debug log in trpcMutation() similarly

---

## Phase 4: Documentation (Priority: P2)

**Goal**: Document security considerations in CLAUDE.md

**Independent Test**: Read CLAUDE.md and verify security section exists

### Implementation

- [x] T008 [P] [US1] Add Security Considerations section to CLAUDE.md

---

## Phase 5: Verification (Priority: P1)

**Goal**: Verify all security fixes work and no regressions

**Independent Test**: Run full verification suite

### Implementation

- [x] T009 [US1] Run `npm audit --audit-level=high` — expect 0 vulnerabilities
- [x] T010 [US1] Run `npm run build` — expect success
- [x] T011 [US3] Test invalid endpoint rejection
- [x] T012 [US3] Test oversized request rejection
- [x] T013 [US5] Run `DEBUG=1` and verify logs don't contain sensitive data

---

## Dependencies & Execution Order

- T001 (npmrc) → independent
- T002-T005 (input validation) → can run after T001
- T006-T007 (logging) → independent of T002-T005
- T008 (docs) → independent
- T009-T013 (verification) → run after all implementation

### Parallel Opportunities

- T002 and T006 can run in parallel (different functions in api-client.ts)
- T006 and T007 are independent of each other
