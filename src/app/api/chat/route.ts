import { Orchestrator } from '@/lib/agents/orchestrator';
import { createAgentUIStreamResponse } from 'ai';


export const POST = async(req: Request) => {
  const body = await req.json();
  const { messages } = body;

  const lastUserMessage = messages[messages.length - 1];
  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    return new Response('Invalid request', { status: 400 });
  }

  return createAgentUIStreamResponse({
    agent: Orchestrator,
    uiMessages: messages,
  });
}
