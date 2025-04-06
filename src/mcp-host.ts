import path from 'node:path';
import { readMCPTransport } from './mcp-transport.js';
import { experimental_createMCPClient } from 'ai';

export type MCPHostOptions = {
  mcpServerConfig: string;
};

export type MCPClient = Awaited<
  ReturnType<typeof experimental_createMCPClient>
>;

export class MCPHost {
  #tools: Record<string, any>;

  constructor() {
    this.#tools = {};
  }

  async start(options: MCPHostOptions) {
    console.log('[MCPHost] Host get started');

    const configPath = path.resolve(process.cwd(), options.mcpServerConfig);
    const transports = await readMCPTransport(configPath);

    const clients = await Promise.all(
      Object.keys(transports).map((name) =>
        experimental_createMCPClient({ transport: transports[name] })
      )
    );

    for (const client of clients) {
      const tools = await client.tools();

      for (const [name, tool] of Object.entries(tools)) {
        this.#tools = {
          ...this.#tools,
          [name]: tool,
        };
      }
    }

    console.log('[MCPHost] Host started with', await this.toolList());
  }

  async tools() {
    return this.#tools;
  }

  async toolList(): Promise<any> {
    return Object.keys(await this.tools());
  }
}
