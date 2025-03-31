import fs from "fs/promises";
import path from "path";
import { MCPClient, MCPTransport } from "./mcp";

class MCPHost {
  private clients: Map<string, MCPClient>;
  private config: Record<string, MCPTransport>;

  constructor() {
    this.clients = new Map();
    this.config = {};
  }

  async start() {
    const config = await this.loadMCPServers();
    console.log("config", config);
  }

  async stop() {}

  async loadMCPServers(): Promise<Record<string, MCPTransport>> {
    const configPath = path.join(process.cwd(), "./config.json");
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    this.config = config.mcpServers;

    return this.config;
  }
}

async function main() {
  const host = new MCPHost();
  await host.start();
}

main();
