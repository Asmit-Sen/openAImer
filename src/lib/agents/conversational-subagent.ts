import { stepCountIs, tool, ToolLoopAgent } from "ai";
import skills from '@/constants/CONVERSATION-SKILLS.md'
import { google } from "@ai-sdk/google";
import { get_mental_health_analysis, get_support_strategy, get_risk_analysis } from "./tools/mental-health-tools";
import { medicalReasoningTool } from "./tools/medical-reasoning";
import { memoriTools } from "./tools/mcp-client";
import z from "zod";

// Conversational Subagent (qwen-3.6-plus via openrouter)
export const ConversationalSubagent = new ToolLoopAgent({
    model: google("gemini-2.5-flash-lite"),
    instructions: skills,
    tools: {
      get_mental_health_analysis,
      get_support_strategy,
      get_risk_analysis,
      medicalReasoningTool,
      ...memoriTools
    },
    stopWhen: stepCountIs(5), // allows the LLM to call tools in a loop before finishing
  });

// wrap the conversational subagent in a tool that can be called by the orchestrator
export const conversationalSubagentTool = tool({
    description: "Conversational Subagent",
    inputSchema: z.object({
        messages: z.array(z.any()),
    }),
    execute: async ({ messages }) => {
        return await ConversationalSubagent.stream({
            messages,
        });
    },
});