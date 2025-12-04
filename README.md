# Antigravity Boots 👢🚀

## Feature: Auto-Model Selection

This repository tracks the development of the "Auto-Model Selection" feature for the Antigravity IDE agent.

### Objective
To enable the IDE agent to automatically select the "best available model" for a given task without requiring user intervention or prompting.

### Proposed Logic
1.  **Task Analysis**: Analyze the complexity and domain of the user's request (e.g., simple refactor vs. complex architectural change).
2.  **Model Capabilities**: Maintain a registry of available models and their strengths (e.g., reasoning, coding speed, context window).
3.  **Selection Heuristic**:
    *   **Complex/Creative**: Use high-reasoning models (e.g., Claude 3.5 Sonnet, GPT-4o).
    *   **Routine/Fast**: Use faster/cheaper models (e.g., GPT-4o-mini, Gemini Flash).
4.  **Fallback Mechanism**: Automatically retry with a more capable model if the first attempt fails.

### Implementation Plan
- [x] Define model capability schema.
- [x] Implement task complexity classifier.
- [ ] Create configuration for user preferences (e.g., "Always use best" vs. "Optimize for cost").

## Feature: Persistent Gemini RAG

Antigravity Boots now supports persistent RAG (Retrieval-Augmented Generation) using Google's Gemini API. This allows you to index your codebase or documents and query them later.

### Setup

1.  Set your Gemini API Key:
    ```bash
    export GEMINI_API_KEY="your-api-key"
    ```

2.  Install dependencies:
    ```bash
    uv sync
    ```

### Usage

**1. Create a Knowledge Base**
Index a directory of files (supports .pdf, .md, .txt, .py, .ts, .js, etc.):
```bash
uv run python main.py rag create --name "my-codebase" --path ./src
```

**2. List Knowledge Bases**
```bash
uv run python main.py rag list
```

**3. Chat with a Knowledge Base**
```bash
uv run python main.py chat --store "my-codebase"
```

**4. Delete a Knowledge Base**
```bash
uv run python main.py rag delete --name "my-codebase"
```

### VS Code Integration (MCP)

You can expose the RAG capabilities to VS Code using the Model Context Protocol (MCP).

**Option 1: Claude Desktop (Recommended)**
The most reliable way to use this MCP server currently is via the [Claude Desktop App](https://claude.ai/download).

1.  Install Claude Desktop.
2.  Edit your `claude_desktop_config.json` (usually in `~/Library/Application Support/Claude/` on macOS):
    ```json
    {
      "mcpServers": {
        "antigravity-rag": {
          "command": "uv",
          "args": ["run", "python", "/absolute/path/to/antigravity-boots/main.py", "mcp"],
          "env": {
            "GEMINI_API_KEY": "your-api-key-here"
          }
        }
      }
    }
    ```
3.  Restart Claude Desktop. You can now ask Claude to "Query antigravity-codebase" or "List knowledge bases".

**Option 2: VS Code Extension**
There are several community extensions for MCP in VS Code.
1.  Search for "MCP Client" or "Cline" (formerly Claude Dev) in the VS Code Marketplace.
2.  Follow the extension's instructions to add a new MCP server using the command configuration above.

## Antigravity Editor: MCP Integration

This project supports the Model Context Protocol (MCP) to allow the Antigravity Editor (and other AI agents) to interact with your local development environment and external services.

### Setup

1.  **Configuration**:
    Copy the example configuration file:
    ```bash
    cp mcp_config.example.json mcp_config.json
    ```
    Edit `mcp_config.json` and add your secrets (GitHub Token, Cloudflare Token). **Do not commit this file.**

2.  **Install Dependencies**:
    This project uses Bun for the local MCP server.
    ```bash
    bun install
    ```

3.  **Local Server**:
    The local MCP server is located at `scripts/mcp-server.ts`. It provides tools for:
    *   Running tests (`run_test_suite`)
    *   Generating migrations (`generate_migration`)
    *   Listing deployments (`list_deployments`)

    You can verify it runs by executing:
    ```bash
    bun run scripts/mcp-server.ts
    ```
    (It will hang waiting for input, which is expected behavior for stdio mode).
