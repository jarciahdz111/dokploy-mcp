# Dokploy MCP Server

![npm version](https://img.shields.io/npm/v/@jarciahdz111/dokploy-mcp)
![license](https://img.shields.io/npm/l/@jarciahdz111/dokploy-mcp)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)

MCP server that provides **100% coverage** of the Dokploy API — 463 tools auto-generated from the Dokploy OpenAPI specification. Manage projects, applications, databases, Docker Compose stacks, and more directly from Claude.

## Requirements

- Node.js 18+
- A Dokploy account with API access
- API key from **Settings → API Keys** in Dokploy

## Quick Start

### Install

```bash
npm install -g @jarciahdz111/dokploy-mcp
```

Or run without installing:

```bash
npx @jarciahdz111/dokploy-mcp
```

### Claude Desktop Configuration

Add this to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Then restart Claude Desktop.

### Claude Code CLI Configuration

If you use the Claude Code CLI (`claude` command), add this to `~/.claude.json`:

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

Then restart your terminal or run `claude` to load the configuration.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DOKPLOY_URL` | Your Dokploy API URL (e.g., `https://cloud.dokploy.com/api`) | Yes | — |
| `DOKPLOY_API_KEY` | API key from Dokploy Settings → API Keys | Yes | — |
| `REQUEST_TIMEOUT_MS` | HTTP request timeout in milliseconds | No | `30000` |
| `DEBUG` | Set to `1` to enable debug logging (JSON to stderr) | No | — |

## Available Tools

463 tools across 42 categories. Tool names follow the pattern `dokploy_{tag}_{action}`.

| Category | Tools | Description |
|----------|-------|-------------|
| `project` | 8 | Project and environment management |
| `application` | 29 | Application deployment and management |
| `compose` | 28 | Docker Compose stack operations |
| `docker` | 7 | Container and image management |
| `mysql` | 14 | MySQL database management |
| `postgres` | 14 | PostgreSQL database management |
| `redis` | 14 | Redis cache management |
| `mongo` | 14 | MongoDB database management |
| `mariadb` | 14 | MariaDB database management |
| `settings` | 49 | Server and application settings |
| `notification` | 38 | Slack, email, Discord notifications |
| `server` | 16 | Server provisioning and management |
| `user` | 20 | User and session management |
| `domain` | 9 | Domain management |
| `backup` | 11 | Backup configuration and execution |
| `deployment` | 8 | Deployment operations |
| `ai` | 9 | AI-powered features |
| `github` | 6 | GitHub integration |
| `gitlab` | 7 | GitLab integration |
| `gitea` | 8 | Gitea integration |
| `bitbucket` | 7 | Bitbucket integration |
| `gitProvider` | 2 | Generic Git provider |
| `certificate` | 4 | SSL certificate management |
| `registry` | 7 | Docker registry management |
| `cluster` | 4 | Cluster management |
| `mounts` | 6 | Volume mounts |
| `security` | 4 | Security settings |
| `redirects` | 4 | Redirect rules |
| `port` | 4 | Port configuration |
| `destination` | 6 | Deployment destinations |
| `previewDeployment` | 4 | Preview deployments |
| `sshKey` | 6 | SSH key management |
| `stripe` | 7 | Stripe billing |
| `swarm` | 3 | Docker Swarm mode |
| `organization` | 11 | Organization management |
| `licenseKey` | 6 | License management |
| `sso` | 10 | SSO/OIDC/SAML configuration |
| `whitelabeling` | 4 | Whitelabel configuration |
| `customRole` | 6 | Custom role permissions |
| `auditLog` | 1 | Audit log access |
| `schedule` | 6 | Scheduled tasks |
| `rollback` | 2 | Deployment rollback |
| `volumeBackups` | 6 | Volume backup management |
| `environment` | 7 | Environment variables |
| `patch` | 12 | Patch management |
| `admin` | 1 | Admin operations |

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

## License

MIT
