import { z } from "zod";

const UserValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum(["admin", "user"]).optional(),
    gender: z.enum(["male", "female", "other"]),
    children: z.array(z.string()).optional(),
  }),
});

export const ZodValidation = { UserValidationSchema };
