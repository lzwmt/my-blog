import { z } from "zod";

export const AdminCredentialSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(128)
});

export const AdminUserSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(3).max(50),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type AdminCredential = z.infer<typeof AdminCredentialSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
