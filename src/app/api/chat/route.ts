import { extractSignals } from '@/lib/agents/signal-extractor';
import { memoryClient } from '@/lib/mcp/client';
import { Orchestrator } from '@/lib/agents/orchestrator';

export const maxDuration = 60; // Allow sufficient time for multiple LLM hops

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUserMessage = messages[messages.length - 1];
  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    return new Response('Invalid request', { status: 400 });
  }

  // Phase A: Signal Extraction (DeepSeek-R1)
  const signals = await extractSignals(lastUserMessage.content);
  console.log('[Phase A] Extracted Signals:', signals);

  // Phase B: Memory Retrieval (memoriMCP)
  const userId = 'user-123'; // Mock user session
  const memory = await memoryClient.getContext(userId);
  console.log('[Phase B] Memory Retrieved for user');

  // Crisis Escalation
  let safetyInjection = '';
  if (signals.urgency_score > 8) {
    safetyInjection = `\n\n**CRISIS ALERT**: Urgency score is ${signals.urgency_score}. You MUST include a localized crisis resource link (e.g., https://findahelpline.com/) and prioritize safety de-escalation immediately.`;
    // In a real system, flag the DB here
    console.warn(`[!] Immediate Escalation Flagged for User ${userId}`);
  }

  let finalMessages = [...messages, signals, safetyInjection];
  
  // Phase C & D: Tool Orchestration & Guardrails
  const result = await Orchestrator.stream({
    messages: finalMessages,
  });

  return result.toUIMessageStreamResponse();
}
