# Implementation Plan: Project Files and Gitignore - Dokploy MCP

**Branch**: `005-gitignore-project-files` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-gitignore-project-files/spec.md`

## Summary

Create a robust `.gitignore` file and verify all essential project files exist with correct configuration for the `@jarciahdz111/dokploy-mcp` npm package. Critical issue: No `.gitignore` currently exists, and `.npmignore` incorrectly excludes `README.md` and `LICENSE`.

## Technical Context

**Language/Version**: TypeScript / Node.js 18+
**Primary Dependencies**: N/A (configuration project)
**Storage**: N/A
**Testing**: Manual verification via `git status`, `npm pack --dry-run`, file existence checks
**Target Platform**: npm package ecosystem / GitHub repository
**Project Type**: npm package / Configuration
**Performance Goals**: N/A
**Constraints**: Must follow Node.js best practices, npm publishing requirements
**Scale/Scope**: Single project - repository root files only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This is a configuration-only project with no code changes. The constitution template is empty (no gates defined), so there are no violations.

**Phase 0 Status**: N/A - no unknowns. All requirements are specified in FR-001 through FR-008.

## Project Structure

### Documentation (this feature)

```text
specs/005-gitignore-project-files/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # N/A - no unknowns
├── data-model.md        # N/A - no data models
├── quickstart.md        # N/A - no integration scenarios
├── contracts/           # N/A - no external contracts
└── tasks.md             # Task breakdown for implementation
```

### Source Code (repository root)

```text
.gitignore               # NEW - robust Node.js gitignore
.npmignore               # FIX - must include README.md and LICENSE
package.json             # VERIFY - files field = ["dist"]
```

**Structure Decision**: Configuration files only at repository root.

## Complexity Tracking

No violations. Configuration-only project.

---

## Phase 0: Research

**Status**: N/A

No unknowns. All requirements are clear:
- `.gitignore` patterns: Standard Node.js.gitignore patterns
- Essential files: package.json, README.md, LICENSE, tsconfig.json, CLAUDE.md, .npmignore, .npmrc
- `.npmignore` rules: npm publishes README.md and LICENSE, excludes source code

## Phase 1: Design

### .gitignore Requirements (FR-001, FR-002)

Based on Node.js best practices and the project needs:

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*

# Environment
.env
.env.*
!.env.example

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Source maps
*.map

# Test coverage
coverage/

# Temporary files
*.tmp
*.temp
```

### .npmignore Corrections (FR-005, FR-006)

Current `.npmignore` has issues:
- `README.md` is excluded but needed in npm package
- `LICENSE` is excluded but needed in npm package

**Corrected .npmignore:**
```npmignore
src/
*.ts
tsconfig.json
test-mcp.js
test-mcp.sh
CLAUDE.md
.git/
.github/
.claude/
*.log
node_modules/
dist/*.map
```

### package.json files Field (FR-004)

Must verify: `"files": ["dist"]`

### Essential Files Verification (FR-003)

Files that MUST exist:
1. `package.json` - npm metadata
2. `README.md` - documentation
3. `LICENSE` - MIT license
4. `tsconfig.json` - TypeScript config
5. `CLAUDE.md` - developer documentation
6. `.npmignore` - npm exclude rules
7. `.npmrc` - npm configuration (audit settings)

## Files to Modify

1. `.gitignore` — CREATE new file with Node.js best practice patterns
2. `.npmignore` — FIX to include README.md and LICENSE

## Files to Verify

1. `package.json` — verify `files: ["dist"]`
2. `LICENSE` — verify MIT text
3. All 7 essential files exist

## Execution Order

1. Create `.gitignore` with robust Node.js patterns
2. Fix `.npmignore` to include README.md and LICENSE
3. Verify package.json files field
4. Verify all essential files exist
5. Test with `git status` and `npm pack --dry-run`
