# Plan: Security Audit - Dokploy MCP npm Package

## Context

The security audit identified several findings across 5 areas. Most passed, but some need code changes to address moderate concerns.

## Security Audit Findings Summary

| Category | Status | Action |
|---|---|---|
| Dependency vulnerabilities | PASS | None needed |
| GitHub Actions permissions | GOOD | None needed (already least-privilege) |
| Secret/token handling | GOOD | Minor - strip query params from debug logs |
| Information disclosure | GOOD | Minor - avoid logging URL with encoded input |
| Input validation gaps | MODERATE | Add endpoint validation |
| Supply chain integrity | GOOD | Add .npmrc with audit enforcement |

## Changes Required

### 1. Add `.npmrc` for audit enforcement (FR-006, FR-007)

**File**: `.npmrc` (new)

```rc
audit=true
engine-strict=true
```

**Why**: Ensures `npm audit` runs on every install and fails on critical/high vulnerabilities.

---

### 2. Remove query params from debug URL logging (FR-005)

**File**: `src/services/api-client.ts`

**Change**: In the debug log at line ~97, strip the query string from the URL before logging:

```typescript
// Current (concerning):
logger.debug(`[GET] ${endpoint}`, { url });

// Fixed: log endpoint only, no URL with query params
logger.debug(`[GET] ${endpoint}`, { input: truncate(JSON.stringify(input), 200) });
```

**Why**: The URL-encoded query params could contain sensitive input data. Only log the endpoint name and a truncated preview of input, not the full URL.

---

### 3. Add endpoint validation whitelist (FR-004)

**File**: `src/services/api-client.ts`

**Change**: Add validation that `endpoint` matches allowed Dokploy tRPC patterns (e.g., `project.all`, `application.deploy`, `compose.*`):

```typescript
const ALLOWED_ENDPOINTS = /^([a-z]+)\.([a-z_]+)$/;

function validateEndpoint(endpoint: string): void {
  if (!ALLOWED_ENDPOINTS.test(endpoint)) {
    throw new Error(`Invalid endpoint format: ${endpoint}`);
  }
}
```

**Why**: Prevents arbitrary endpoint injection if an attacker gains control of tool invocation.

---

### 4. Add request body size limit (new)

**File**: `src/services/api-client.ts`

**Change**: Check request body size before sending:

```typescript
const MAX_REQUEST_SIZE = 1_000_000; // 1MB

function validateRequestSize(data: unknown): void {
  const size = JSON.stringify(data).length;
  if (size > MAX_REQUEST_SIZE) {
    throw new Error(`Request body too large: ${size} bytes (max: ${MAX_REQUEST_SIZE})`);
  }
}
```

**Why**: Prevents memory exhaustion from oversized payloads.

---

### 5. Document security considerations in CLAUDE.md

**File**: `CLAUDE.md`

**Add** a Security Considerations section noting:
- API key is env-only, never logged
- Debug mode is opt-in and sanitized
- Endpoint names are validated
- No arbitrary code execution

---

## Files to Modify

1. `.npmrc` — new file for audit enforcement
2. `src/services/api-client.ts` — endpoint validation, URL logging fix, request size limit
3. `CLAUDE.md` — add security section

## Files Not Modified

- `src/index.ts` — no security changes needed
- `src/services/logger.ts` — already correct
- `src/constants.ts` — already correct
- `.github/workflows/ci.yml` — permissions are already minimal
- `.github/workflows/release.yml` — already uses NODE_AUTH_TOKEN and least-privilege

## Execution Order

1. Add `.npmrc`
2. Update `src/services/api-client.ts` (endpoint validation + logging fix + request size)
3. Update `CLAUDE.md`
4. Verify `npm run build` succeeds
5. Run `npm audit` to confirm 0 vulnerabilities
6. Commit and push
