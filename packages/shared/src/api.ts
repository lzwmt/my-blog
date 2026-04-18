import { z } from "zod";
import { AdminCredentialSchema, AdminUserSchema } from "./auth";
import {
  CreatePostInputSchema,
  PostSchema,
  SiteSettingSchema,
  SlugSchema,
  TagSchema,
  TagInputSchema,
  UpdatePostInputSchema
} from "./content";

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1)
  })
});

export const DashboardStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  published: z.number().int().nonnegative(),
  drafts: z.number().int().nonnegative(),
  archived: z.number().int().nonnegative()
});

export const SlugParamsSchema = z.object({
  slug: SlugSchema
});

export const PostsResponseSchema = z.object({
  data: z.array(PostSchema)
});

export const PostResponseSchema = z.object({
  data: PostSchema
});

export const TagsResponseSchema = z.object({
  data: z.array(TagSchema)
});

export const TagResponseSchema = z.object({
  data: TagSchema
});

export const SiteSettingResponseSchema = z.object({
  data: SiteSettingSchema.nullable()
});

export const DashboardStatsResponseSchema = z.object({
  data: DashboardStatsSchema
});

export const AdminSessionResponseSchema = z.object({
  data: AdminUserSchema
});

export const AdminLoginRequestSchema = AdminCredentialSchema;
export const PostIdParamsSchema = z.object({
  id: z.string().min(1)
});
export const TagIdParamsSchema = z.object({
  id: z.string().min(1)
});
export const CreatePostRequestSchema = CreatePostInputSchema;
export const UpdatePostRequestSchema = UpdatePostInputSchema;
export const CreateTagRequestSchema = TagInputSchema;
export const UpdateTagRequestSchema = TagInputSchema;
export const UpdateSiteSettingRequestSchema = SiteSettingSchema;

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type PostsResponse = z.infer<typeof PostsResponseSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type TagsResponse = z.infer<typeof TagsResponseSchema>;
export type TagResponse = z.infer<typeof TagResponseSchema>;
export type SiteSettingResponse = z.infer<typeof SiteSettingResponseSchema>;
export type DashboardStatsResponse = z.infer<
  typeof DashboardStatsResponseSchema
>;
export type AdminSessionResponse = z.infer<typeof AdminSessionResponseSchema>;
export type AdminLoginRequest = z.infer<typeof AdminLoginRequestSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;
export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>;
export type UpdateTagRequest = z.infer<typeof UpdateTagRequestSchema>;
export type UpdateSiteSettingRequest = z.infer<
  typeof UpdateSiteSettingRequestSchema
>;
