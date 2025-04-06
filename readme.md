# MCP Simple Host

> A simple host application for MCP that show how easy integration with generateText, experimental_createMCPClient of @ai-sdk. Currently, only tested for Anthropic LLM.

## Environment

Before running the application, you need to set up the following environment variables.:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Build & Start the application:
```bash
npm build && npm start
```

For development mode:
```bash
npm run dev
```

## Configuration

The MCP server list can be configured through the `mcp-server.json` file. Example for simple MCP servers are listed at 'fixtures/servers'.
