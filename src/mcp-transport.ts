import fs from 'node:fs/promises';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export type MCPClientTransport = StdioClientTransport | SSEClientTransport;

export async function readMCPTransport(
  mcpServerConfig: string
): Promise<Record<string, MCPClientTransport>> {
  try {
    const config = JSON.parse(await fs.readFile(mcpServerConfig, 'utf-8'));
    if (!config.mcpServers) {
      throw new Error(
        'Invalid MCP server config, missing mcpServers property.'
      );
    }

    const transports = Object.entries<any>(config.mcpServers).reduce(
      (acc, [name, option]) => {
        if (option.command) {
          acc[name] = new StdioClientTransport({
            command: option.command,
            args: option.args,
            env: option.env,
            stderr: option.stderr,
            cwd: option.cwd,
          });
        } else if (option.url) {
          // @FIXME check /sse perfix
          acc[name] = new SSEClientTransport(new URL(option.url));
        } else {
          throw new Error('MCP server config has no command or url property.');
        }

        return acc;
      },
      {} as Record<string, MCPClientTransport>
    );

    return transports;
  } catch (err) {
    console.error('Error reading MCP server config:', err);
  }

  return {};
}
