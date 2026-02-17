import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "validation.required"),
  email: z.string().min(1, "validation.required").email("validation.invalidEmail"),
  password: z.string().min(1, "validation.required"),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
