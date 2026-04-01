# Dokploy MCP Server

![npm version](https://img.shields.io/npm/v/@jarciahdz111/dokploy-mcp)
![license](https://img.shields.io/npm/l/@jarciahdz111/dokploy-mcp)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)

MCP server that provides **100% coverage** of the Dokploy API — 463 tools auto-generated from the Dokploy OpenAPI specification. Manage projects, applications, databases, Docker Compose stacks, and more directly from Claude.

## Requirements

- **Node.js 18+** (check with `node -v`)
- A Dokploy account with API access
- API key from **Settings → API Keys** in your Dokploy dashboard

## Quick Start

### 1. Install

```bash
npm install -g @jarciahdz111/dokploy-mcp
```

Or run without installing:

```bash
npx @jarciahdz111/dokploy-mcp
```

### 2. Configure Claude Desktop

Create or edit your Claude Desktop config file:

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "dokploy": {
      "command": "dokploy-mcp",
      "env": {
        "DOKPLOY_URL": "https://your-dokploy.com/api",
        "DOKPLOY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 3. Configure Claude Code CLI (optional)

If you use the Claude Code CLI, add this to `~/.claude.json`:

```json
{
  "mcpServers": {
    "dokploy": {
      "command": "dokploy-mcp",
      "env": {
        "DOKPLOY_URL": "https://your-dokploy.com/api",
        "DOKPLOY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 4. Restart Claude

Restart Claude Desktop or your terminal. The 463 Dokploy tools will be available.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DOKPLOY_URL` | Your Dokploy API URL (e.g., `https://cloud.dokploy.com/api`) | Yes | — |
| `DOKPLOY_API_KEY` | API key from Dokploy Settings → API Keys | Yes | — |
| `REQUEST_TIMEOUT_MS` | HTTP request timeout in milliseconds | No | `30000` |
| `DEBUG` | Set to `1` to enable debug logging (JSON to stderr) | No | — |

## Available Tools

463 tools across 42 categories. Tool names follow the pattern `dokploy_{category}_{action}`.

| Category | Tools | Description |
|----------|-------|-------------|
| `admin` | 1 | Admin operations |
| `ai` | 9 | AI-powered features |
| `application` | 29 | Application deployment and management |
| `auditLog` | 1 | Audit log access |
| `backup` | 11 | Backup configuration and execution |
| `bitbucket` | 7 | Bitbucket integration |
| `certificate` | 4 | SSL certificate management |
| `cluster` | 4 | Cluster management |
| `compose` | 28 | Docker Compose stack operations |
| `customRole` | 6 | Custom role permissions |
| `deployment` | 8 | Deployment operations |
| `destination` | 6 | Deployment destinations |
| `docker` | 7 | Container and image management |
| `domain` | 9 | Domain management |
| `environment` | 7 | Environment variables |
| `gitea` | 8 | Gitea integration |
| `gitProvider` | 2 | Generic Git provider |
| `github` | 6 | GitHub integration |
| `gitlab` | 7 | GitLab integration |
| `licenseKey` | 6 | License management |
| `mariadb` | 14 | MariaDB database management |
| ` mongo` | 14 | MongoDB database management |
| `mounts` | 6 | Volume mounts |
| `mysql` | 14 | MySQL database management |
| `notification` | 38 | Slack, email, Discord notifications |
| `organization` | 11 | Organization management |
| `patch` | 12 | Patch management |
| `port` | 4 | Port configuration |
| `postgres` | 14 | PostgreSQL database management |
| `previewDeployment` | 4 | Preview deployments |
| `project` | 8 | Project and environment management |
| `redis` | 14 | Redis cache management |
| `redirects` | 4 | Redirect rules |
| `registry` | 7 | Docker registry management |
| `rollback` | 2 | Deployment rollback |
| `schedule` | 6 | Scheduled tasks |
| `security` | 4 | Security settings |
| `server` | 16 | Server provisioning and management |
| `settings` | 49 | Server and application settings |
| `sso` | 10 | SSO/OIDC/SAML configuration |
| `sshKey` | 6 | SSH key management |
| `stripe` | 7 | Stripe billing |
| `swarm` | 3 | Docker Swarm mode |
| `user` | 20 | User and session management |
| `volumeBackups` | 6 | Volume backup management |
| `whitelabeling` | 4 | Whitelabel configuration |

## Usage Examples

### List all projects

```
dokploy_project_all
```

### Get Docker containers

```
dokploy_docker_getContainers
```

### Get application details

```
dokploy_application_one
// arguments: { applicationId: "your-application-id" }
```

### Deploy an application

```
dokploy_application_deploy
// arguments: { applicationId: "your-application-id", to: "production" }
```

### List PostgreSQL databases

```
dokploy_postgres_all
```

### Get server status

```
dokploy_settings_getDokployVersion
```

### Restart a Docker container

```
dokploy_docker_restartContainer
// arguments: { containerId: "your-container-id" }
```

## Local Development

```bash
# Clone the repository
git clone https://github.com/jarciahdz111/dokploy-mcp.git
cd dokploy-mcp

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev

# Test
node test-mcp.js
```

## Troubleshooting

### "Unauthorized" Error

Your `DOKPLOY_API_KEY` is invalid or expired.

1. Go to **Settings → API Keys** in your Dokploy dashboard
2. Generate a new API key
3. Update the `DOKPLOY_API_KEY` in your Claude Desktop config
4. Restart Claude

### "Connection Refused" Error

The server cannot reach your Dokploy instance.

1. Verify `DOKPLOY_URL` is correct (must include `/api` at the end)
2. Check your Dokploy server is running and accessible
3. If behind a corporate firewall, set proxy environment variables:

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

### Request Timeout Error

The request took too long and was aborted.

Increase the timeout by setting `REQUEST_TIMEOUT_MS`:

```json
{
  "mcpServers": {
    "dokploy": {
      "env": {
        "DOKPLOY_URL": "https://your-dokploy.com/api",
        "DOKPLOY_API_KEY": "your-api-key",
        "REQUEST_TIMEOUT_MS": "60000"
      }
    }
  }
}
```

### Enable Debug Logging

To see detailed request/response logs:

```json
{
  "mcpServers": {
    "dokploy": {
      "env": {
        "DOKPLOY_URL": "https://your-dokploy.com/api",
        "DOKPLOY_API_KEY": "your-api-key",
        "DEBUG": "1"
      }
    }
  }
}
```

Debug output is written to stderr as JSON.

## How It Works

This MCP server is auto-generated from the Dokploy OpenAPI specification. When Dokploy releases an API update, a new version of this package can be published with updated tool coverage — no manual tool writing required.

The server:

1. Loads the embedded OpenAPI spec (1.4 MB, 463 endpoints)
2. Converts each endpoint to an MCP tool with Zod-validated input schema
3. Routes GET requests as tRPC queries and POST requests as tRPC mutations
4. Handles tRPC response wrapping and error parsing automatically

## API Coverage

- **100%** of Dokploy API v0.28.8 endpoints
- **463** MCP tools
- **42** functional categories
- Auto-generated and auto-synced with API spec

## Contributing

Want to modify or extend this MCP server? See [CLAUDE.md](CLAUDE.md) for the development workflow, architecture overview, and contribution guidelines.

## License

MIT
