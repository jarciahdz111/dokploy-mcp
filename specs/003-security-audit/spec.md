# Feature Specification: Security Audit - Dokploy MCP npm Package

**Feature Branch**: `003-security-audit`
**Created**: 2026-03-31
**Status**: Draft
**Input**: User description: "vamos a usar nuevamente spec kit para implementar una auditoria de seguridad para garantizar que este paquete sea seguro sin ninguna vulnerabilidad y luego implementar los cambios"

## User Scenarios & Testing

### User Story 1 - npm Package Vulnerability Assessment (Priority: P1)

As a security auditor, I need to verify that the published npm package `@jarciahdz111/dokploy-mcp@0.28.8` contains no known vulnerabilities in its dependencies or supply chain, so that users can trust the package is safe to install.

**Why this priority**: A compromised or vulnerable package puts all users at risk. This is the first line of defense.

**Independent Test**: Run `npm audit` on the package and verify zero vulnerabilities in direct and transitive dependencies.

**Acceptance Scenarios**:

1. **Given** the published npm package, **When** `npm audit` is run, **Then** the audit reports zero critical, high, and medium vulnerabilities.
2. **Given** the package dependencies, **When** `npm audit signatures` is run, **Then** all packages pass integrity signature verification.
3. **Given** the npm pack output, **When** file count and contents are verified, **Then** only expected files are included (no extra scripts or malicious files).

---

### User Story 2 - GitHub Actions Secret and Permission Hardening (Priority: P1)

As a security auditor, I need to verify that the GitHub Actions workflows follow least-privilege principles for secrets and permissions, so that a compromised workflow cannot exfiltrate tokens or access unauthorized resources.

**Why this priority**: GitHub Actions tokens are high-value targets. Overly permissive workflows are a common supply chain attack vector.

**Independent Test**: Review CI/CD configuration files and verify token permissions are scoped to minimum required.

**Acceptance Scenarios**:

1. **Given** the `ci.yml` workflow, **When** permissions are reviewed, **Then** the workflow uses `permissions: contents: read` with no write permissions.
2. **Given** the `release.yml` workflow, **When** permissions are reviewed, **Then** only `id-token: write` is used for OIDC token minting, with `contents: read`.
3. **Given** the npm publish step, **When** the token is reviewed, **Then** it uses `NODE_AUTH_TOKEN` from secrets, not a broad PAT.
4. **Given** workflow triggers, **When** `workflow_dispatch` is reviewed, **Then** it requires explicit secrets and is not auto-triggered.

---

### User Story 3 - Environment Variable Input Validation (Priority: P2)

As a security auditor, I need to verify that all environment variables are properly validated and sanitized at runtime, so that malicious or malformed inputs cannot cause undefined behavior or injection attacks.

**Why this priority**: The MCP server runs with user's API credentials. Improper validation could expose those credentials or allow command injection.

**Independent Test**: Run the server with malformed env vars and verify graceful handling without credential leakage.

**Acceptance Scenarios**:

1. **Given** `DOKPLOY_URL` with a malformed URL, **When** the server starts, **Then** it exits with a validation error and does not attempt connection.
2. **Given** `DOKPLOY_API_KEY` with special characters or very long strings, **When** the server starts, **Then** it sanitizes or rejects the input without crashing.
3. **Given** `REQUEST_TIMEOUT_MS` with a negative or non-numeric value, **When** the server starts, **Then** it defaults to 30000 without crashing.
4. **Given** `DEBUG=1`, **When** the server runs, **Then** no sensitive data (API keys, full request bodies) is logged, only endpoint names and timing.

---

### User Story 4 - Dependency Supply Chain Integrity (Priority: P2)

As a security auditor, I need to verify the package uses a secure supply chain with locked dependencies, so that dependency hijacking cannot compromise the package.

**Why this priority**: Dependency substitution attacks (like the npm event-stream incident) are a known supply chain threat.

**Independent Test**: Verify package-lock.json is committed, CI uses `npm ci` not `npm install`, and provenance attestations are published.

**Acceptance Scenarios**:

1. **Given** the repository, **When** `package-lock.json` presence is checked, **Then** it exists and is committed to ensure reproducible builds.
2. **Given** the CI workflows, **When** dependency installation is reviewed, **Then** `npm ci` is used (not `npm install`) to enforce lockfile.
3. **Given** the release workflow, **When** publishing is reviewed, **Then** `--provenance` flag is used to publish SLSA provenance attestation.
4. **Given** the npm package, **When** `npm pack --dry-run` is checked, **Then** no unexpected files are included (no postinstall scripts from unexpected sources).

---

### User Story 5 - Error Message Information Disclosure (Priority: P3)

As a security auditor, I need to verify that error messages do not leak sensitive information (API keys, internal URLs, stack traces) to unauthenticated clients, so that attackers cannot use errors for reconnaissance.

**Why this priority**: Verbose error messages are a common information disclosure vector that aids attackers.

**Independent Test**: Trigger various error conditions and verify error messages are user-friendly but sanitized.

**Acceptance Scenarios**:

1. **Given** an invalid `DOKPLOY_API_KEY`, **When** a tool is called, **Then** the error message says "Unauthorized" without exposing the actual key or internal details.
2. **Given** a network timeout or connection error, **When** the error is returned, **Then** no internal IP addresses, hostnames, or stack traces are exposed.
3. **Given** a malformed request to an API endpoint, **When** the error is returned, **Then** the error message is descriptive but does not reveal internal path structures or implementation details.

---

## Edge Cases

- What happens when DOKPLOY_URL points to an internal network address (SSRF)?
- How does the system handle very large API responses (memory exhaustion)?
- What happens when the API returns a valid response but with an unexpected structure?
- How does the system behave when DEBUG=1 and the API key is logged accidentally?

## Requirements

### Functional Requirements

- **FR-001**: The npm package MUST pass `npm audit` with zero critical, high, or medium vulnerabilities.
- **FR-002**: The GitHub Actions workflows MUST use least-privilege permissions (contents: read, id-token: write only where needed).
- **FR-003**: The release.yml workflow MUST use `NODE_AUTH_TOKEN` from GitHub secrets, not a personal access token in plain text.
- **FR-004**: Environment variables MUST be validated before use, with graceful fallback for invalid values.
- **FR-005**: The server MUST NOT log sensitive data (API keys, full request bodies) even when DEBUG=1.
- **FR-006**: The package MUST include package-lock.json to ensure reproducible, locked dependencies.
- **FR-007**: CI workflows MUST use `npm ci` (not `npm install`) to respect lockfile exactly.
- **FR-008**: Error messages MUST be user-friendly but MUST NOT expose internal implementation details, credentials, or stack traces.
- **FR-009**: The release workflow MUST publish with `--provenance` for SLSA supply chain attestation.
- **FR-010**: The published package MUST have no extra files beyond dist/, package.json, and LICENSE.

### Key Entities

- **npm Package**: The published artifact `@jarciahdz111/dokploy-mcp` on npmjs.com
- **GitHub Actions Workflows**: ci.yml and release.yml in .github/workflows/
- **Environment Variables**: DOKPLOY_URL, DOKPLOY_API_KEY, REQUEST_TIMEOUT_MS, DEBUG
- **API Client**: src/services/api-client.ts handling HTTP requests to Dokploy API

## Success Criteria

### Measurable Outcomes

- **SC-001**: `npm audit --audit-level=high` reports 0 vulnerabilities (must pass).
- **SC-002**: CI workflow permissions are scoped to minimum required per workflow.
- **SC-003**: Error responses contain no API key fragments or internal hostnames.
- **SC-004**: `npm pack --dry-run` shows under 50 files and only expected content.
- **SC-005**: The package size is under 2MB to fit within npm distribution limits.
- **SC-006**: DEBUG=1 logs contain only: endpoint name, HTTP method, response status code, duration in ms. No keys, tokens, or sensitive payload content.

## Assumptions

- The Dokploy API itself is trusted (we are auditing the MCP wrapper, not the upstream API).
- Node.js 18+ is the runtime target and known-secure versions are used.
- The npm registry (registry.npmjs.org) is trusted as the package source.
- GitHub's OIDC token service is trusted for provenance attestation.
- The MCP protocol stdio transport is trusted (we don't audit Claude's side of the connection).
