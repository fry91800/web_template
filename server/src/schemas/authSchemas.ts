import { z } from 'zod';

// Define the Zod schemas
export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  pass: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  pass: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// TypeScript types inferred from Zod schemas
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
