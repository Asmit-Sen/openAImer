import { createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://api.memorilabs.ai/mcp',
    headers: { 
      'X-Memori-API-Key': process.env.MEMORI_API_KEY!, 
      'X-Memori-Entity-ID': process.env.MEMORI_ENTITY_ID!, 
    },
  },
});

export const memoriTools = await mcpClient.tools();