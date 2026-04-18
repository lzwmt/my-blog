import type { ZodType } from "zod";

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

export const slugifyText: (value: string) => string;
export const ApiErrorSchema: ZodType<ApiError>;
export const AdminLoginRequestSchema: ZodType<AdminCredential>;
export const AdminSessionResponseSchema: ZodType<{ data: AdminUser }>;
export const DashboardStatsResponseSchema: ZodType<{ data: DashboardStats }>;
export const PostResponseSchema: ZodType<{ data: Post }>;
export const PostsResponseSchema: ZodType<{ data: Post[] }>;
export const SiteSettingResponseSchema: ZodType<{ data: SiteSetting | null }>;
export const TagResponseSchema: ZodType<{ data: Tag }>;
export const TagsResponseSchema: ZodType<{ data: Tag[] }>;
