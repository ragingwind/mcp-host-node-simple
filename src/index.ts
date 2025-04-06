import { LLMClient, LLMToolResults } from "./llm-client.js";
import { AnthropicProvider } from "./llm-provider.js";
import { MCPHost } from "./mcp-host.js";

async function main() {
  const host = new MCPHost();
  await host.start({
    mcpServerConfig: "./mcp-servers.json",
  });

  const llm = new LLMClient({ provider: new AnthropicProvider() });

  llm.append("user", "Use add tool to calculate numbers 100 + 1000?");

  const { toolResults, text: toolResponse } = await llm.generate({
    tools: await host.tools(),
  });

  console.log("[Assistant]", toolResponse);

  for (const toolResult of toolResults as LLMToolResults) {
    llm.append("user", toolResult.result.content[0].text);
  }

  const { text: assistantResponse } = await llm.generate();

  console.log("[Assistant]", assistantResponse);

  process.exit(0);
}

main();
