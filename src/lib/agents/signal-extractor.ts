import { generateText, Output, tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

const signalExtractorSchema = z.object({
  implicit_emotion: z.string().describe('The hidden or underlying emotion, e.g., "hidden guilt"'),
  urgency_score: z.number().min(1).max(10).describe('Score from 1-10 indicating crisis level'),
  hidden_need: z.string().describe('The psychological need not explicitly stated, e.g., "needs validation"'),
  is_sarcastic: z.boolean().describe('Whether the user is using sarcasm'),
});

export type ExtractedSignal = z.infer<typeof signalExtractorSchema>;

export const extractSignals = tool({
  description: "Use this tool to extract implicit emotional signals from the user's message",
  inputSchema: z.object({
    userMessage: z.string(),
  }),
  execute : async ({userMessage}) =>{
      try {
      const response  = await generateText({
        model: google("gemini-2.5-flash-lite"),
        prompt: `Analyze the following user message to extract implicit emotional signals.
        Message: "${userMessage}"
        Look past the surface text. Identify the implied emotion, the urgency (1-10), the hidden need, and whether sarcasm is present.`,
        output: Output.object({
          schema: signalExtractorSchema,
        })
      });
      return response.output;

    } catch (error) {
      console.error('Error during signal extraction:', error);
      // Fallback in case of failure
      return {
        implicit_emotion: "unknown",
        urgency_score: 5,
        hidden_need: "support and connection",
        is_sarcastic: false,
      };
    }
  }
});
