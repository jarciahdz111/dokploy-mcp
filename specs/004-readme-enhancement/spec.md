# Feature Specification: README.md Enhancement - Dokploy MCP

**Feature Branch**: `004-readme-enhancement`
**Created**: 2026-04-01
**Status**: Draft
**Input**: User description: "mejorar el README.md del paquete npm @jarciahdz111/dokploy-mcp con mejor estructura, badges, ejemplos más claros, y mejor documentación para que los desarrolladores puedan instalarlo y configurarlo en menos de 5 minutos"

## User Scenarios & Testing

### User Story 1 - Quick Installation (Priority: P1)

As a developer, I want to install and configure the Dokploy MCP package in under 5 minutes by following clear step-by-step instructions, so that I can start using it immediately without external help.

**Why this priority**: If installation is confusing, developers will abandon the package and look for alternatives.

**Independent Test**: A new developer with no prior knowledge follows the README from scratch on a fresh machine and completes installation without asking for help.

**Acceptance Scenarios**:

1. **Given** a developer with Node.js 18+ installed, **When** they read the Quick Start section, **Then** they can install with a single `npm install -g @jarciahdz111/dokploy-mcp` command.
2. **Given** a developer who just installed the package, **When** they configure Claude Desktop, **Then** they have a complete, copy-paste-ready JSON configuration template.
3. **Given** the README has an Environment Variables section, **When** a developer sets up the package, **Then** they know exactly which variables are required vs optional.

---

### User Story 2 - Clear Usage Examples (Priority: P1)

As a developer, I want to see practical examples of the most common operations (list projects, deploy application, view containers), so that I understand how to use the tools effectively.

**Why this priority**: Examples are the fastest way to understand how a tool works in practice.

**Independent Test**: A developer reads the Examples section and successfully calls a tool (e.g., `dokploy_project_all`) and gets results.

**Acceptance Scenarios**:

1. **Given** a developer who has the package configured, **When** they look at the Examples section, **Then** they see at least 5 real tool calls with expected inputs and outputs.
2. **Given** a developer who wants to deploy an application, **When** they read the README, **Then** they find a `dokploy_application_deploy` example with required parameters.
3. **Given** a developer who wants to manage databases, **When** they check the examples, **Then** they see PostgreSQL and MySQL operations covered.

---

### User Story 3 - Tool Discovery (Priority: P2)

As a developer, I want to understand what tools are available and how they are organized, so that I can find the right tool for my needs without reading the entire API specification.

**Why this priority**: With 463 tools, discoverability is critical. Without organization, users feel overwhelmed.

**Independent Test**: A developer scans the Available Tools section and can quickly identify which category contains the tool they need.

**Acceptance Scenarios**:

1. **Given** a developer who opens the README, **When** they see the Available Tools section, **Then** tools are organized in a table with categories and tool counts (e.g., "project: 8 tools, application: 29 tools").
2. **Given** a developer who wants to find a specific tool, **When** they search the README, **Then** tool names follow a consistent naming pattern (`dokploy_{category}_{action}`).
3. **Given** a developer who wants to understand tool capabilities, **When** they read the category descriptions, **Then** each category has a brief description of what it manages.

---

### User Story 4 - Troubleshooting and Support (Priority: P2)

As a developer, when something goes wrong during installation or usage, I want to find solutions in the README without contacting the maintainer, so that I can resolve issues quickly.

**Why this priority**: Self-service support reduces maintainer burden and improves user satisfaction.

**Independent Test**: A developer encountering a common error (e.g., missing API key, timeout) finds troubleshooting steps in the README.

**Acceptance Scenarios**:

1. **Given** a developer who gets an "Unauthorized" error, **When** they check the README, **Then** they find troubleshooting steps explaining how to fix the API key.
2. **Given** a developer who wants to enable debug logging, **When** they read the Environment Variables section, **Then** they see the `DEBUG=1` option explained.
3. **Given** a developer who needs help, **When** they scroll to the bottom of the README, **Then** they find links to GitHub issues and documentation.

---

### User Story 5 - Trust and Credibility (Priority: P3)

As a developer evaluating whether to use this package, I want to see that it is well-maintained, secure, and trusted by others, so that I feel confident relying on it for production use.

**Why this priority**: Developers need social proof before committing to a new tool, especially for infrastructure-related packages.

**Independent Test**: A developer evaluates the README and sees npm version badge, license, and activity signals that indicate the package is active.

**Acceptance Scenarios**:

1. **Given** a developer evaluating the package, **When** they view the README, **Then** they see npm version, license, and Node.js compatibility badges at the top.
2. **Given** a developer who wants to verify package popularity, **When** they look at the README, **Then** they see download counts or GitHub stars if available.
3. **Given** a developer concerned about security, **When** they read the README, **Then** they find a Security section or link to security policy.

---

## Edge Cases

- What happens if a developer tries to install on Node.js 16 (unsupported version)?
- How does the README handle users who want to use the package without Claude Desktop (e.g., direct npx)?
- What if the developer is behind a corporate firewall and needs proxy configuration?
- How does the README handle users who want to contribute or modify the package?

## Requirements

### Functional Requirements

- **FR-001**: The README MUST have npm badges (version, license, Node.js compatibility) at the top of the file.
- **FR-002**: The README MUST have a Quick Start section that allows installation in under 5 minutes with copy-paste ready commands.
- **FR-003**: The README MUST have a Configuration section with JSON templates for both Claude Desktop and Claude Code CLI.
- **FR-004**: The README MUST have an Environment Variables table with all variables (required/optional), defaults, and descriptions.
- **FR-005**: The README MUST have an Examples section with at least 5 practical tool call examples showing input parameters and use cases.
- **FR-006**: The README MUST have an Available Tools section with a category table showing tool counts and descriptions.
- **FR-007**: The README MUST have a Troubleshooting section covering common issues (API key errors, timeouts, connection refused).
- **FR-008**: The README MUST have a Local Development section with setup, build, and test commands.
- **FR-009**: The README MUST follow consistent tool naming convention: `dokploy_{category}_{action}`.
- **FR-010**: The README MUST have links to GitHub issues, license, and relevant documentation.

### Key Entities

- **README.md**: The main documentation file published on npmjs.com and GitHub
- **npm Package**: `@jarciahdz111/dokploy-mcp` on npm registry
- **MCP Tools**: 463 auto-generated tools organized in 42 categories

## Success Criteria

### Measurable Outcomes

- **SC-001**: A new developer can install and configure the package in under 5 minutes following the README.
- **SC-002**: The README includes at least 5 practical tool examples with clear inputs and use cases.
- **SC-003**: All 463 tools are accounted for in the Available Tools section (verified by category tool counts).
- **SC-004**: The README has npm badges for version, license, and Node.js compatibility.
- **SC-005**: The Environment Variables section documents all 4 variables: DOKPLOY_URL, DOKPLOY_API_KEY, REQUEST_TIMEOUT_MS, DEBUG.
- **SC-006**: A developer can find troubleshooting help for the 3 most common errors: Unauthorized, Connection Refused, Timeout.

## Assumptions

- The target audience is developers familiar with Node.js and command-line tools.
- Developers are using macOS, Linux, or Windows with WSL.
- Claude Desktop is the primary integration, but Claude Code CLI is also supported.
- The Dokploy API version is v0.28.8 and this version number should be visible in the README.
- Security considerations are already documented in CLAUDE.md, not duplicated in README.
