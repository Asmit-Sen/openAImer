import { InferenceClient } from "@huggingface/inference";
export const POST = async() => {
    const client = new InferenceClient(process.env.HF_TOKEN);

    const res = await client.chatCompletion({
    model:"m42-health/Llama3-Med42-8B:featherless-ai",
    messages: [{ role: "user", content: "Hello!" }],
    });

    return Response.json(res);
}