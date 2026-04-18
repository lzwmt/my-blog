import type { ZodType } from "zod";
import {
  ApiErrorSchema as BaseApiErrorSchema,
  AdminLoginRequestSchema as BaseAdminLoginRequestSchema,
  AdminSessionResponseSchema as BaseAdminSessionResponseSchema,
  DashboardStatsResponseSchema as BaseDashboardStatsResponseSchema,
  PostResponseSchema as BasePostResponseSchema,
  PostsResponseSchema as BasePostsResponseSchema,
  SiteSettingResponseSchema as BaseSiteSettingResponseSchema,
  TagResponseSchema as BaseTagResponseSchema,
  TagsResponseSchema as BaseTagsResponseSchema
} from "./api";
import {
  AdminCredentialSchema as BaseAdminCredentialSchema,
  AdminUserSchema as BaseAdminUserSchema
} from "./auth";
import {
  CreatePostInputSchema as BaseCreatePostInputSchema,
  PostSchema as BasePostSchema,
  SiteSettingSchema as BaseSiteSettingSchema,
  TagInputSchema as BaseTagInputSchema,
  TagSchema as BaseTagSchema,
  UpdatePostInputSchema as BaseUpdatePostInputSchema
} from "./content";
import { slugifyText } from "./slug";

export { slugifyText };

export type PostStatus = "draft" | "published" | "archived";

export interface AdminCredential {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagInput {
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  authorId: string;
  tags: Tag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  tagIds: string[];
}

export type UpdatePostInput = CreatePostInput;

export interface SiteSocialLink {
  label: string;
  url: string;
}

export interface SiteSetting {
  id?: string;
  siteName: string;
  siteDescription?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  socialLinks: SiteSocialLink[];
}

export type UpdateSiteSettingRequest = SiteSetting;

export interface DashboardStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export const AdminCredentialSchema =
  BaseAdminCredentialSchema as ZodType<AdminCredential>;
export const AdminUserSchema = BaseAdminUserSchema as ZodType<AdminUser>;
export const TagSchema = BaseTagSchema as ZodType<Tag>;
export const TagInputSchema = BaseTagInputSchema as ZodType<TagInput>;
export const PostSchema = BasePostSchema as ZodType<Post>;
export const CreatePostInputSchema =
  BaseCreatePostInputSchema as ZodType<CreatePostInput>;
export const UpdatePostInputSchema =
  BaseUpdatePostInputSchema as ZodType<UpdatePostInput>;
export const SiteSettingSchema = BaseSiteSettingSchema as ZodType<SiteSetting>;
export const ApiErrorSchema = BaseApiErrorSchema as ZodType<ApiError>;
export const AdminLoginRequestSchema =
  BaseAdminLoginRequestSchema as ZodType<AdminCredential>;
export const AdminSessionResponseSchema =
  BaseAdminSessionResponseSchema as ZodType<{ data: AdminUser }>;
export const DashboardStatsResponseSchema =
  BaseDashboardStatsResponseSchema as ZodType<{ data: DashboardStats }>;
export const PostsResponseSchema =
  BasePostsResponseSchema as ZodType<{ data: Post[] }>;
export const PostResponseSchema =
  BasePostResponseSchema as ZodType<{ data: Post }>;
export const TagsResponseSchema =
  BaseTagsResponseSchema as ZodType<{ data: Tag[] }>;
export const TagResponseSchema =
  BaseTagResponseSchema as ZodType<{ data: Tag }>;
export const SiteSettingResponseSchema =
  BaseSiteSettingResponseSchema as ZodType<{ data: SiteSetting | null }>;
