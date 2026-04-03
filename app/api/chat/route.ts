import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { defaultModel } from '@/lib/ai';

// Mark the route as dynamic
export const dynamic = 'force-dynamic';

/**
 * Basic AI chat handler using Groq and Vercel AI SDK 6.0.
 * Handles streaming responses using the new UI message protocol.
 */
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: defaultModel,
    messages: await convertToModelMessages(messages),
    system: 'You are a helpful assistant powered by Groq and Llama 3.3.',
  });

  return result.toUIMessageStreamResponse();
}
