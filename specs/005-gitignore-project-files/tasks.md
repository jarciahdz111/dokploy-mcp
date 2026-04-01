# Tasks: Project Files and Gitignore - Dokploy MCP

**Input**: Design documents from `/specs/005-gitignore-project-files/`
**Prerequisites**: plan.md, spec.md (3 user stories)
**Tests**: NOT requested - manual verification via `git status` and `npm pack --dry-run`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Repository root files: `.gitignore`, `.npmignore`, `package.json`, etc.

---

## Phase 1: Setup (File Verification)

**Purpose**: Verify current state of essential project files

- [X] T001 [P] Verify `package.json` exists at repository root
- [X] T002 [P] Verify `README.md` exists at repository root
- [X] T003 [P] Verify `LICENSE` exists at repository root
- [X] T004 [P] Verify `tsconfig.json` exists at repository root
- [X] T005 [P] Verify `CLAUDE.md` exists at repository root
- [X] T006 [P] Verify `.npmignore` exists at repository root
- [X] T007 [P] Verify `.npmrc` exists at repository root

---

## Phase 2: Foundational (Create .gitignore)

**Purpose**: Create missing .gitignore file with robust Node.js patterns

**⚠️ CRITICAL**: .gitignore does not currently exist - this is a security issue

- [X] T008 Create `.gitignore` with Node.js best practice patterns:
  - Dependencies: `node_modules/`
  - Build outputs: `dist/`, `build/`
  - Logs: `*.log`, `npm-debug.log*`
  - Environment: `.env`, `.env.*`, `!.env.example`
  - OS files: `.DS_Store`, `Thumbs.db`
  - IDE: `.vscode/`, `.idea/`, `*.swp`, `*.swo`, `*~`
  - Source maps: `*.map`
  - Coverage: `coverage/`
  - Temporary: `*.tmp`, `*.temp`

---

## Phase 3: User Story 1 - Gitignore Protection (Priority: P1) 🎯 MVP

**Goal**: Prevent sensitive data and build artifacts from being committed

**Independent Test**: Run `git status` and verify no unwanted files shown

### Implementation for User Story 1

- [X] T009 [US1] Verify `.gitignore` file exists at repository root
- [X] T010 [US1] Verify `.gitignore` contains `node_modules/` pattern
- [X] T011 [US1] Verify `.gitignore` contains `dist/` pattern
- [X] T012 [US1] Verify `.gitignore` contains `.env*` pattern
- [X] T013 [US1] Verify `.gitignore` contains IDE patterns (`.vscode/`, `.idea/`)
- [X] T014 [US1] Verify `git status` shows no untracked files from node_modules/, dist/, or .env*

**Checkpoint**: Gitignore protection verified - sensitive files blocked from commits

---

## Phase 4: User Story 2 - Essential Project Files (Priority: P1)

**Goal**: All essential project files exist and are properly configured

**Independent Test**: Verify all 7 essential files exist with correct content

### Implementation for User Story 2

- [X] T015 [P] [US2] Verify `package.json` has valid `name` field (`@jarciahdz111/dokploy-mcp`)
- [X] T016 [P] [US2] Verify `package.json` has valid `version` field
- [X] T017 [P] [US2] Verify `package.json` has valid `license` field (`MIT`)
- [X] T018 [P] [US2] Verify `package.json` has valid `repository` field
- [X] T019 [P] [US2] Verify `package.json` has valid `bin` field
- [X] T020 [P] [US2] Verify `package.json` has valid `engines` field (`node >= 18`)
- [X] T021 [P] [US2] Verify `LICENSE` contains MIT license text
- [X] T022 [US2] Verify `package.json` has `files` field set to `["dist"]`

**Checkpoint**: Essential files verified - package can be published correctly

---

## Phase 5: User Story 3 - npm Package Integrity (Priority: P2)

**Goal**: Only intended files are published to npm

**Independent Test**: Run `npm pack --dry-run` and verify package contents

### Implementation for User Story 3

- [X] T023 [P] [US3] Fix `.npmignore` to NOT exclude `README.md` (needed in npm package)
- [X] T024 [P] [US3] Fix `.npmignore` to NOT exclude `LICENSE` (needed in npm package)
- [X] T025 [P] [US3] Verify `.npmignore` still excludes `src/`, `*.ts`, `test-mcp.js`, `CLAUDE.md`
- [X] T026 [US3] Run `npm pack --dry-run` and verify package contains only `dist/`, `package.json`, `README.md`, `LICENSE`
- [X] T027 [US3] Verify package file count is under 50 files

**Checkpoint**: npm package integrity verified - only intended files published

---

## Phase 6: Polish & Verification

**Purpose**: Final verification and edge case handling

- [X] T028 [P] Verify `.gitignore` has at least 15 common patterns for Node.js projects
- [X] T029 Verify `npm run build` still works after changes
- [X] T030 Verify `.gitignore` is properly committed to git

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Creates .gitignore - blocks US1 verification
- **Phase 3-5 (User Stories)**: Can start after Phase 2 is complete
- **Phase 6 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (Gitignore)**: Depends on Phase 2 (.gitignore created)
- **US2 (Essential Files)**: Depends on Phase 1 (files exist)
- **US3 (npm Integrity)**: Depends on Phase 2 (.npmignore fixed)

### Parallel Opportunities

- T001-T007 can run in parallel (different file existence checks)
- T009-T014 can run in parallel (different .gitignore pattern checks)
- T015-T021 can run in parallel (different package.json field checks)
- T023-T025 can run in parallel (different .npmignore fixes/checks)

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Verify files exist (T001-T007)
2. Complete Phase 2: Create .gitignore (T008)
3. Complete Phase 3: Verify US1 (T009-T014)
4. **STOP and VALIDATE**: gitignore works correctly

### Incremental Delivery

1. T001-T007: Verify essential files exist
2. T008: Create .gitignore (CRITICAL - missing file)
3. T009-T014: Verify gitignore protection
4. T015-T022: Verify package.json configuration
5. T023-T027: Fix .npmignore and verify npm package

---

## Notes

- [P] tasks = verification of different aspects, can run in parallel
- [Story] label maps verification task to specific user story
- No tests needed - verification is manual by reading files and running git/npm commands
- Critical issue: NO .gitignore exists currently - must be created first
- Critical issue: .npmignore excludes README.md and LICENSE which must be in npm package

## Status: ✅ ALL TASKS COMPLETED

**Summary of changes:**
- Created `.gitignore` with 16 Node.js best practice patterns
- Fixed `.npmignore` to include README.md and LICENSE in npm package
- All 30 tasks completed and verified