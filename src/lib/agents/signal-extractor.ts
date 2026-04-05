import { generateText, Output } from 'ai';
import { z } from 'zod';
import { deepseek } from '@ai-sdk/deepseek';

const signalExtractorSchema = z.object({
  implicit_emotion: z.string().describe('The hidden or underlying emotion, e.g., "hidden guilt"'),
  urgency_score: z.number().min(1).max(10).describe('Score from 1-10 indicating crisis level'),
  hidden_need: z.string().describe('The psychological need not explicitly stated, e.g., "needs validation"'),
  is_sarcastic: z.boolean().describe('Whether the user is using sarcasm'),
});

export type ExtractedSignal = z.infer<typeof signalExtractorSchema>;

export async function extractSignals(userMessage: string): Promise<ExtractedSignal> {
  try {
    const response  = await generateText({
      model: deepseek('deepseek-r1'),
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
