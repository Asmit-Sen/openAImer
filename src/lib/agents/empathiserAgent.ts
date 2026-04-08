import { stepCountIs, tool, ToolLoopAgent } from "ai";
import { CONVERSATION_SKILLS } from "@/constants/CONVERSATION-SKILLS";
import { google } from "@ai-sdk/google";
import z from "zod";

export const empathiserAgent = new ToolLoopAgent({
    model: google("gemini-2.5-flash"),
    instructions: CONVERSATION_SKILLS,
    stopWhen: stepCountIs(5), // allows the LLM to call tools in a loop before finishing
  });

// wrap the conversational subagent in a tool that can be called by the orchestrator
export const empathiserTool = tool({
    description: "Use this tool if you feel the output is not enough to satisfy the user's emotional needs",
    inputSchema: z.object({
        messages: z.array(z.any()),
    }),
    execute: async ({ messages }) => {
        return await empathiserAgent.generate({
            messages,
        });
    },
});