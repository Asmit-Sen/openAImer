import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai"
import { RULES } from "@/constants/RULES"
import { CONVERSATION_SKILLS } from "@/constants/CONVERSATION-SKILLS"
import { get_clinical_analysis } from "./tools/mental-health-tools"
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { withSupermemory } from "@supermemory/tools/ai-sdk"
import { empathiserTool } from "./empathiserAgent"
import { extractSignals } from "./signal-extractor"

import dotenv from 'dotenv';
dotenv.config();

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const agent = withSupermemory(openrouter('openai/gpt-oss-120b:free'),
  "default_user1", {
  addMemory: "always",
});

export const Orchestrator = new ToolLoopAgent({
  model: agent,
  instructions: RULES + "\n\n" + CONVERSATION_SKILLS,
  tools: {
    extractSignals,
    get_clinical_analysis,
    empathiserTool
  },
  toolChoice: {
    type: 'tool',
    toolName: 'extractSignals',
  },
  onStepFinish: async ({ stepNumber, usage, finishReason, toolCalls }) => {
    console.log(`Step ${stepNumber} completed:`, {
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      finishReason,
      toolsUsed: toolCalls?.map(tc => tc.toolName),
    });
  },
  stopWhen: stepCountIs(10),
});

export type MyAgentUIMessage = InferAgentUIMessage<typeof Orchestrator>;