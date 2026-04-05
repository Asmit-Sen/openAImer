import { google } from "@ai-sdk/google"
import { stepCountIs, ToolLoopAgent } from "ai"
import rules from "./RULES.md"
import { get_risk_analysis, get_mental_health_analysis, get_support_strategy } from "./tools/mental-health-tools"
import { memoriTools } from "./tools/mcp-client"
import { medicalReasoningTool } from "./tools/medical-reasoning"
import { conversationalSubagentTool } from "./conversational-subagent"

const model = google("gemini-2.0-flash-lite")
export const Orchestrator = new ToolLoopAgent({
    model,
    instructions: rules,
    tools: {
      get_mental_health_analysis,
      get_support_strategy,
      get_risk_analysis,
      medicalReasoningTool,
      ...memoriTools,
      conversationalSubagentTool
    },
    stopWhen: stepCountIs(5),
  })