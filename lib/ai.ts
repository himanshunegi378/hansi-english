import { groq } from '@ai-sdk/groq';

/**
 * Default Groq model for the application.
 * Using llama-3.3-70b-versatile as recommended for high-quality reasoning.
 */
export const defaultModel = groq('openai/gpt-oss-20b');

/**
 * Fast Groq model for low-latency tasks.
 */
export const fastModel = groq('llama-3.1-8b-instant');
