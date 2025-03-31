export interface MCPTransport {
    command: string;
    args: string[];
    requires_confirmation: string[];
    enabled: boolean
    exclude_tools: string[];
}

export interface MCPClient {
    id: string;
    isConnected: boolean;
    models: string[];
}