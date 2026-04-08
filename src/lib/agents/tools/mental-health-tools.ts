import { tool } from 'ai';
import { z } from 'zod';
import { InferenceClient } from "@huggingface/inference";

export const get_clinical_analysis = tool({
  description: 'Analyze symptoms to identify complex sentiment and clinical correlations.',
  inputSchema: z.object({
    text: z.string().describe('The user text to analyze'),
  }),
  execute: async ({text}) => {
    console.log("inside mental health tool");
    try {
        const client = new InferenceClient(process.env.HF_TOKEN);
        const chatCompletion = await client.chatCompletion({
            model:"m42-health/Llama3-Med42-8B:featherless-ai",
            messages: [
                {
                    role: "system",
                    content:"You are a professional mental health assistant. Analyze the user's symptoms and provide a clinical analysis. Provide your analysis in the following format:\n\n1. **Title** - Content\n2. **Title** - Content\n3. **Title** - Content.... Do not provide any additional information. Keep the response under 100 words.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
        });
        const response = chatCompletion.choices[0].message;
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        return {
            content: "I'm having trouble connecting to my tools right now. Can you rephrase your question?",
        };
    }
  },
});

// export const get_support_strategy = tool({
//   description: 'Search local library of support techniques (CBT/DBT) via Vector RAG.',
//   inputSchema: z.object({
//     issue: z.string().describe('The core issue to find techniques for, e.g., "exam anxiety"'),
//   }),
//   execute: async ({ issue }) => {
//     // In reality, this would be a fetch() call to the mentalBERT endpoint
//     console.log(`Searching support strategy for: ${issue}`);
//     return {
//       strategy: 'Cognitive Restructuring',
//       steps: [
//         'Identify the irrational thought.',
//         'Challenge the thought with evidence.',
//         'Replace with a balanced thought.'
//       ]
//     };
//   },
// });

// export const get_risk_analysis = tool({
//   description: 'Query mentalBERT on an edge server for clinical-style nuanced reasoning and assess risk of suicides, harm etc.',
//   inputSchema: z.object({
//     symptoms: z.array(z.string()).describe('List of observed symptoms or traits'),
//   }),
//   execute: async ({ symptoms }) => {
//     // In reality, this would be a fetch() call to the mentalBERT endpoint
//     console.log(`Querying mentalBERT for symptoms: ${symptoms.join(', ')}`);
//     return {
//       nuance: 'Given history of exam anxiety, the current lack of focus may be an avoidance behavior rather than an attention deficit.',
//       recommended_approach: 'Gentle exploration of underlying fears relating to failure.',
//     };
//   },
// });
