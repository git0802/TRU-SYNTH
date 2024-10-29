import { z } from 'zod';

const configSchema = z.object({
  apiKey: z.string().min(1, 'OpenAI API key is required'),
  model: z.string().default('gpt-4o-realtime-preview'),
  maxTokens: z.number().int().positive().default(500),
});

export type OpenAIConfig = z.infer<typeof configSchema>;

export const getOpenAIConfig = (): OpenAIConfig => {
  const config = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL,
    maxTokens: parseInt(import.meta.env.VITE_MAX_TOKENS || '500'),
  };

  try {
    return configSchema.parse(config);
  } catch (error) {
    throw new Error('Invalid OpenAI configuration. Please check your environment variables.');
  }
};