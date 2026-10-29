import { z } from "zod";

// Used for logging in (no role needed)
export const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Used for signing up (role is REQUIRED)
export const signUpSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['customer', 'provider']), 
});