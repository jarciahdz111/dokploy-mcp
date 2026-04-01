# Feature Specification: Project Files and Gitignore - Dokploy MCP

**Feature Branch**: `005-gitignore-project-files`
**Created**: 2026-04-01
**Status**: Draft
**Input**: User description: "crear spec para garantizar archivos necesarios del proyecto y gitignore robusto para el paquete npm @jarciahdz111/dokploy-mcp, incluyendo verificar que todos los archivos esenciales existan y que el gitignore sea completo"

## Clarifications

### Session 2026-04-01

- Q: Should we validate and document unnecessary directories (besides essential files)? → A: Yes, validate and explicitly document unnecessary directories (node_modules, dist, build, coverage, specs, .github/workflows, .claude)

## User Scenarios & Testing

### User Story 1 - Gitignore Protection (Priority: P1)

As a developer, I want the repository to have a proper `.gitignore` file that prevents sensitive data and build artifacts from being committed, so that the repo stays clean and secrets are not accidentally exposed.

**Why this priority**: Without `.gitignore`, sensitive files like `.env`, `node_modules`, and build outputs could be committed, exposing credentials or bloating the repo.

**Independent Test**: Run `git status` after setup and verify no unwanted files are shown as untracked or modified.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** `git status` is run, **Then** `node_modules/`, `dist/`, `.env`, and other build artifacts are not shown.
2. **Given** a developer creates a `.env` file, **When** they run `git status`, **Then** `.env` is not staged or committed.
3. **Given** the `.gitignore` file exists, **When** it is checked, **Then** it follows Node.js best practices and includes all common patterns.

---

### User Story 2 - Essential Project Files (Priority: P1)

As a contributor or maintainer, I want all essential project files to exist and be properly configured, so that the project can be cloned, built, and published without issues.

**Why this priority**: Missing essential files (like `LICENSE`, proper `package.json`, or `README.md`) can break npm publishing, licensing, or developer onboarding.

**Independent Test**: Verify all essential files exist and have correct content.

**Acceptance Scenarios**:

1. **Given** the repository root, **When** files are listed, **Then** `package.json`, `README.md`, `LICENSE`, `tsconfig.json`, and `CLAUDE.md` all exist.
2. **Given** the `package.json` file, **When** it is checked, **Then** it has valid `name`, `version`, `description`, `license`, `repository`, `bin`, and `files` fields.
3. **Given** the `LICENSE` file, **When** it is checked, **Then** it contains "MIT" license text.
4. **Given** the `.npmignore` file, **When** `npm pack --dry-run` is run, **Then** only the intended files are included (dist/, package.json, LICENSE, README.md).

---

### User Story 3 - npm Package Integrity (Priority: P2)

As a maintainer, I want the `.npmignore` file to work correctly with the `files` field in `package.json`, so that only the necessary files are published to npm and the package size stays minimal.

**Why this priority**: An incorrectly configured `.npmignore` or `files` field could publish unnecessary files (source code, tests) or miss critical files.

**Independent Test**: Run `npm pack --dry-run` and verify package contents.

**Acceptance Scenarios**:

1. **Given** the project configuration, **When** `npm pack --dry-run` is run, **Then** only `dist/`, `package.json`, `README.md`, and `LICENSE` are included.
2. **Given** the `files` field in `package.json`, **When** it is checked, **Then** it specifies only `["dist"]` to control what npm publishes.
3. **Given** the `.npmignore` file, **When** it is checked, **Then** it excludes `src/`, `*.ts`, `test-mcp.js`, `test-mcp.sh`, `CLAUDE.md`, `.git/`, `.github/`, `.claude/`, and source maps.

---

## Edge Cases

- What happens if someone creates a `.env` file with real credentials?
- What if `node_modules` is accidentally committed before `.gitignore` is added?
- What if the `files` field in `package.json` conflicts with `.npmignore`?
- What if someone needs to add a new pattern to `.gitignore` for their development workflow?
- What if `specs/` directory (documentation/SPEC.md files) is accidentally committed to npm?

## Requirements

### Functional Requirements

- **FR-001**: The repository MUST have a `.gitignore` file at the root with Node.js best practice patterns.
- **FR-002**: The `.gitignore` MUST include: `node_modules/`, `dist/build`, `*.log`, `.env*`, `.DS_Store`, `*.swp`, `.vscode/`, `.idea/`, `*.map`, and coverage reports.
- **FR-003**: The repository MUST have all essential files: `package.json`, `README.md`, `LICENSE`, `tsconfig.json`, `CLAUDE.md`, `.npmignore`, `.npmrc`.
- **FR-004**: The `package.json` `files` field MUST specify only `["dist"]` to control npm package contents.
- **FR-005**: The `.npmignore` MUST NOT exclude `README.md` or `LICENSE` since they are needed in the npm package.
- **FR-006**: The `.npmignore` MUST exclude `src/`, `*.ts`, `test-mcp.js`, `test-mcp.sh`, `CLAUDE.md`, `.git/`, `.github/`, `.claude/`.
- **FR-007**: The `LICENSE` file MUST contain MIT license text.
- **FR-008**: The `package.json` MUST have valid `name` (scoped `@jarciahdz111/dokploy-mcp`), `version`, `description`, `license` (MIT), `repository`, `bin`, and `engines` fields.
- **FR-009**: The `.gitignore` MUST exclude unnecessary directories: `node_modules/`, `dist/`, `build/`, `coverage/`, `specs/`, `.github/` (source files), `.claude/`.

### Key Entities

- **`.gitignore`**: Prevents sensitive data and build artifacts from being committed
- **`.npmignore`**: Controls what files are excluded when publishing to npm
- **`package.json`**: NPM package metadata with `files` field controlling publication
- **`LICENSE`**: MIT license file required for npm publication
- **`README.md`**: Documentation file included in npm package

### Unnecessary Directories (Must be Excluded)

These directories MUST NOT be committed to git or published to npm:

| Directory | Reason |
|----------|--------|
| `node_modules/` | Dependencies installed via npm |
| `dist/` | Build output (compiled JS - only this goes to npm via `files` field) |
| `build/` | Alternative build output directory |
| `coverage/` | Test coverage reports |
| `specs/` | SPEC.md documentation files (development artifact) |
| `.github/` | GitHub workflows and config (not needed in npm package) |
| `.claude/` | Claude Code working files and memory |

## Success Criteria

### Measurable Outcomes

- **SC-001**: `git status` shows no untracked files from `node_modules/`, `dist/`, `.env*`, or build artifacts.
- **SC-002**: All 7 essential files exist: `package.json`, `README.md`, `LICENSE`, `tsconfig.json`, `CLAUDE.md`, `.npmignore`, `.npmrc`.
- **SC-003**: `npm pack --dry-run` shows under 50 files and only intended content (dist/, package.json, README.md, LICENSE).
- **SC-004**: `.gitignore` contains at least 15 common patterns for Node.js projects.
- **SC-005**: `.npmignore` correctly excludes source files but includes README.md and LICENSE.
- **SC-006**: `package.json` `files` field is set to `["dist"]` only.
- **SC-007**: `git status` shows no untracked files from unnecessary directories (node_modules, dist, build, coverage, specs, .github, .claude).

## Assumptions

- The project is a Node.js npm package using TypeScript.
- The package is published to npmjs.com under `@jarciahdz111/dokploy-mcp`.
- The MIT license is appropriate for this open-source project.
- Developers may use macOS, Linux, or Windows with WSL.
- VSCode and JetBrains IDEs are common among Node.js developers.
