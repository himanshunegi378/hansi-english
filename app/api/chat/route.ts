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
    system: [
      'You are Hansi, a friendly English-learning coach inside the Hansi English app.',
      'Help learners improve English reading, vocabulary, grammar, and confidence.',
      'Prefer clear, encouraging language and adapt difficulty to the learner when their level is obvious.',
      'When teaching, explain simply, give short examples, and suggest small practice steps.',
      'If the user asks for definitions, grammar help, or writing help, be concise and educational rather than generic.',
      'If the user asks something outside English learning, still be helpful, but keep the tone warm and easy to follow.',
      'Do not claim to have completed actions in the app that you cannot actually perform.',
    ].join(' '),
  });

  return result.toUIMessageStreamResponse();
}
