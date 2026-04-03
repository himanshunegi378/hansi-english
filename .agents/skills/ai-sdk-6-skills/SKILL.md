---
name: ai-sdk-6-skills
description: AI SDK 6 overview, agents, tool approval, Groq (Llama), and Vercel AI Gateway. Key patterns and stable features.
---

## Links

- AI SDK Docs: https://sdk.vercel.ai/docs
- Groq Provider: https://sdk.vercel.ai/providers/ai-sdk-providers/groq
- Vercel AI Gateway: https://sdk.vercel.ai/providers/ai-sdk-providers/ai-gateway
- AI SDK GitHub: https://github.com/vercel/ai
- Groq Console Models: https://console.groq.com/docs/models

## Installation

```sh
pnpm add ai @ai-sdk/openai @ai-sdk/react @ai-sdk/groq
```

## What's New in AI SDK 6?

### 1. **Agent Abstraction**

Unified interface for building agents with full control over execution flow, tool loops, and state management. Replaces `Experimental_Agent`.

```typescript
import { ToolLoopAgent } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get weather for a location',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => ({ temperature: 72, condition: 'sunny' }),
});

const agent = new ToolLoopAgent({
  model: 'groq/llama-3.3-70b-versatile',
  instructions: 'You are a helpful weather assistant.',
  tools: { weather: weatherTool },
});

// Use the agent
const result = await agent.generate({
  prompt: 'What is the weather in San Francisco?',
});

console.log(result.output);
```

### 2. **Tool Execution Approval**

Request user confirmation before executing sensitive tools (e.g., payments, resource deletion).

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const paymentTool = tool({
  description: 'Process a payment',
  inputSchema: z.object({
    amount: z.number(),
    recipient: z.string(),
  }),
  needsApproval: true,
  execute: async ({ amount, recipient }) => {
    return { success: true, id: 'txn-123' };
  },
});
```

Client-side approval UI:

```typescript
export function PaymentToolView({ invocation, addToolApprovalResponse }) {
  if (invocation.state === 'approval-requested') {
    return (
      <div>
        <p>Process payment of ${invocation.input.amount} to {invocation.input.recipient}?</p>
        <button
          onClick={() =>
            addToolApprovalResponse({
              id: invocation.approval.id,
              approved: true,
            })
          }
        >
          Approve
        </button>
        <button
          onClick={() =>
            addToolApprovalResponse({
              id: invocation.approval.id,
              approved: false,
            })
          }
        >
          Deny
        </button>
      </div>
    );
  }
  return null;
}
```

### 3. **Structured Output + Tool Calling**

Combine tool calling with structured output generation in a single reasoning loop.

```typescript
import { ToolLoopAgent, Output } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'groq/llama-3.3-70b-versatile',
  tools: { /* ... */ },
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      temperature: z.number(),
      recommendation: z.string(),
    }),
  }),
});

const { output } = await agent.generate({
  prompt: 'What is the weather in San Francisco and what should I wear?',
});

console.log(output);
```

### 4. **Reranking Support**

Improve search relevance by reordering documents using providers like Cohere or Jina.

```typescript
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
  query: 'talk about rain',
  topN: 2,
});

console.log(ranking);
```

## Migration from AI SDK 5

- **ToolLoopAgent**: Migrating from `Experimental_Agent` or manual loops is highly recommended.
- **Unified Provider API**: Use the new provider packages (`@ai-sdk/*`) for all integrations.
- **Step Count**: Default `stopWhen` is now `stepCountIs(20)`.

## Groq Provider

### Setup

```sh
pnpm add @ai-sdk/groq
```

Environment:

```env
GROQ_API_KEY=your_groq_api_key
```

### Models Available

Popular Groq models for AI SDK 6:

- `llama-3.3-70b-versatile` (Llama 3.3, 70B, high performance)
- `llama-3.1-8b-instant` (Llama 3.1, 8B, ultra-low latency)
- `mixtral-8x7b-32768` (Mixture of Experts)
- `gemma2-9b-it` (Google Gemma 2)
- `qwen/qwen3-32b` (Qwen 3)

### Basic Llama Example

```typescript
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const { text } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  prompt: 'Write a TypeScript function to compute Fibonacci.',
});

console.log(text);
```

### Reasoning Models (Groq)

Groq offers reasoning models like `qwen/qwen3-32b` and `deepseek-r1-distill-llama-70b`:

```typescript
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const { text } = await generateText({
  model: groq('qwen/qwen3-32b'),
  providerOptions: {
    groq: {
      reasoningFormat: 'parsed', // 'parsed', 'hidden', or 'raw'
      reasoningEffort: 'default', // low, medium, high
    },
  },
  prompt: 'How many "r"s are in the word "strawberry"?',
});
```

## Vercel AI Gateway

### What It Is

A unified interface to access models from 20+ providers through a single API.

### Setup

```env
AI_GATEWAY_API_KEY=your_gateway_api_key
```

### Basic Usage

```typescript
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Explain quantum computing.',
});
```

## Best Practices

### Groq
- Use `llama-3.3-70b-versatile` for high-quality reasoning.
- Use `llama-3.1-8b-instant` for edge cases and fast classification.
- Enable `parallelToolCalls: true` for multi-tool tasks.

### Agents
- Use `ToolLoopAgent` for all multi-step reasoning.
- Set `stopWhen` to control loop iterations based on complexity.
- Combine structured output with `Output.object` for precise data extraction.
