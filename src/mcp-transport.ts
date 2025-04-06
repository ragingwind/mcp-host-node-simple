import fs from 'node:fs/promises';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
import { experimental_createMCPClient, MCPTransport } from 'ai';

export type SSEMCPTransport = Exclude<
  Parameters<typeof experimental_createMCPClient>[0]['transport'],
  MCPTransport
>;

export type MCPClientTransport =
  | Experimental_StdioMCPTransport
  | SSEMCPTransport;

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
          acc[name] = new Experimental_StdioMCPTransport({
            command: option.command,
            args: option.args,
            env: option.env,
            stderr: option.stderr,
            cwd: option.cwd,
          });
        } else if (option.url) {
          // @FIXME check /sse perfix
          acc[name] = { type: 'sse', url: option.url } as SSEMCPTransport;
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
