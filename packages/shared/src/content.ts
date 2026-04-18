import { z } from "zod";

export const SlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case");

export const PostStatusSchema = z.enum(["draft", "published", "archived"]);

export const SiteSocialLinkSchema = z.object({
  label: z.string().min(1).max(50),
  url: z.url()
});

export const TagSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  slug: SlugSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const TagInputSchema = TagSchema.pick({
  name: true,
  slug: true
});

export const PostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(160),
  slug: SlugSchema,
  summary: z.string().max(320).nullable().optional(),
  content: z.string().min(1),
  coverImage: z.url().nullable().optional(),
  status: PostStatusSchema,
  publishedAt: z.string().nullable().optional(),
  authorId: z.string().min(1),
  tags: z.array(TagSchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

const PostMutationFieldsSchema = PostSchema.pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  coverImage: true,
  status: true,
  publishedAt: true
});

export const CreatePostInputSchema = PostMutationFieldsSchema.extend({
  tagIds: z.array(z.string().min(1)).default([])
});

export const UpdatePostInputSchema = CreatePostInputSchema;

export const UpsertPostInputSchema = CreatePostInputSchema;

export const SiteSettingSchema = z.object({
  id: z.string().min(1).optional(),
  siteName: z.string().min(1).max(80),
  siteDescription: z.string().max(240).nullable().optional(),
  heroTitle: z.string().max(120).nullable().optional(),
  heroDescription: z.string().max(320).nullable().optional(),
  socialLinks: z.array(SiteSocialLinkSchema).default([])
});

export type PostStatus = z.infer<typeof PostStatusSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagInput = z.infer<typeof TagInputSchema>;
export type Post = z.infer<typeof PostSchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>;
export type UpsertPostInput = z.infer<typeof UpsertPostInputSchema>;
export type SiteSocialLink = z.infer<typeof SiteSocialLinkSchema>;
export type SiteSetting = z.infer<typeof SiteSettingSchema>;
