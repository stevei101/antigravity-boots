import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const server = new Server(
  { name: "antigravity-boots-local", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_test_suite",
        description: "Executes the project test suite using Bun. Use this when the user asks to verify code changes.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "generate_migration",
        description: "Creates a new D1 database migration file via Wrangler.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Migration name (snake_case)" }
          },
          required: ["name"]
        },
      },
      {
        name: "list_deployments",
        description: "Fetches the recent Cloudflare Worker deployments.",
        inputSchema: { type: "object", properties: {} },
      }
    ]
  };
});

// Handle Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "run_test_suite") {
      // Running bun test
      const { stdout, stderr } = await execAsync("bun test");
      return {
        content: [{ type: "text", text: stdout || stderr }]
      };
    }

    if (request.params.name === "generate_migration") {
      const name = String(request.params.arguments?.name);
      // Validate name to prevent injection/invalid chars
      if (!/^[a-z0-9_]+$/.test(name)) {
        throw new Error("Invalid migration name. Use snake_case only.");
      }
      const { stdout, stderr } = await execAsync(`bunx wrangler d1 migrations create antigravity-db ${name}`);
      return { content: [{ type: "text", text: stdout || stderr }] };
    }

    if (request.params.name === "list_deployments") {
      const { stdout, stderr } = await execAsync("bunx wrangler deployments list");
      return { content: [{ type: "text", text: stdout || stderr }] };
    }

    throw new Error("Tool not found");
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
