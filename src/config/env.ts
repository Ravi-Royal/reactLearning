import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().default('React Learning'),
  VITE_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  MODE: z.enum(['development', 'production', 'test']),
});

// Validate and parse environment variables
function validateEnv() {
  try {
    const env = envSchema.parse({
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
      MODE: import.meta.env.MODE,
    });
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:', error.flatten().fieldErrors);
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
}

export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
