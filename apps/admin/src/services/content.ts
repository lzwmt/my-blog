import {
  ApiErrorSchema,
  AdminLoginRequestSchema,
  AdminSessionResponseSchema,
  DashboardStatsResponseSchema,
  type CreatePostInput,
  type DashboardStats,
  type Post,
  PostResponseSchema,
  PostsResponseSchema,
  SiteSettingResponseSchema,
  type SiteSetting,
  type Tag,
  type TagInput,
  TagResponseSchema,
  TagsResponseSchema,
  type UpdatePostInput,
  type AdminCredential,
  type AdminUser,
  type UpdateSiteSettingRequest
} from "@blog/shared/admin";
import type { ZodType } from "zod";

export const ADMIN_API_BASE_URL = (
  process.env.UMI_APP_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

interface RequestOptions {
  body?: unknown;
  method?: "DELETE" | "GET" | "PATCH" | "POST";
}

async function requestData<T>(
  path: string,
  schema: ZodType<{ data: T }>,
  options?: RequestOptions
) {
  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    credentials: "include",
    headers: options?.body ? { "Content-Type": "application/json" } : undefined,
    body: options?.body ? JSON.stringify(options.body) : undefined
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = ApiErrorSchema.safeParse(payload);
    const fallbackMessage = `请求失败，状态码：${response.status}。`;

    throw new Error(
      parsedError.success ? parsedError.data.error.message : fallbackMessage
    );
  }

  return schema.parse(payload).data;
}

async function requestWithoutResponse(path: string, method: "DELETE" | "POST") {
  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    method,
    credentials: "include"
  });

  if (response.status === 204) {
    return;
  }

  const payload: unknown = await response.json().catch(() => null);
  const parsedError = ApiErrorSchema.safeParse(payload);

  throw new Error(
    parsedError.success
      ? parsedError.data.error.message
      : `请求失败，状态码：${response.status}。`
  );
}

export interface AdminContentService {
  getSession: () => Promise<AdminUser>;
  login: (credential: AdminCredential) => Promise<AdminUser>;
  logout: () => Promise<void>;
  getDashboardStats: () => Promise<DashboardStats>;
  getPost: (id: string) => Promise<Post>;
  listPosts: () => Promise<Post[]>;
  listTags: () => Promise<Tag[]>;
  createPost: (input: CreatePostInput) => Promise<Post>;
  updatePost: (id: string, input: UpdatePostInput) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  createTag: (input: TagInput) => Promise<Tag>;
  updateTag: (id: string, input: TagInput) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  updateSiteSetting: (input: UpdateSiteSettingRequest) => Promise<SiteSetting | null>;
  getSiteSetting: () => Promise<SiteSetting | null>;
}

export const adminContentService: AdminContentService = {
  getSession() {
    return requestData("/auth/session", AdminSessionResponseSchema);
  },
  login(credential) {
    const parsedCredential = AdminLoginRequestSchema.parse(credential);

    return requestData("/auth/login", AdminSessionResponseSchema, {
      method: "POST",
      body: parsedCredential
    });
  },
  logout() {
    return requestWithoutResponse("/auth/logout", "POST");
  },
  getDashboardStats() {
    return requestData("/admin/dashboard", DashboardStatsResponseSchema);
  },
  getPost(id) {
    return requestData(`/admin/posts/${id}`, PostResponseSchema);
  },
  listPosts() {
    return requestData("/admin/posts", PostsResponseSchema);
  },
  listTags() {
    return requestData("/admin/tags", TagsResponseSchema);
  },
  createPost(input) {
    return requestData("/admin/posts", PostResponseSchema, {
      method: "POST",
      body: input
    });
  },
  updatePost(id, input) {
    return requestData(`/admin/posts/${id}`, PostResponseSchema, {
      method: "PATCH",
      body: input
    });
  },
  deletePost(id) {
    return requestWithoutResponse(`/admin/posts/${id}`, "DELETE");
  },
  createTag(input) {
    return requestData("/admin/tags", TagResponseSchema, {
      method: "POST",
      body: input
    });
  },
  updateTag(id, input) {
    return requestData(`/admin/tags/${id}`, TagResponseSchema, {
      method: "PATCH",
      body: input
    });
  },
  deleteTag(id) {
    return requestWithoutResponse(`/admin/tags/${id}`, "DELETE");
  },
  updateSiteSetting(input) {
    return requestData("/admin/site-settings", SiteSettingResponseSchema, {
      method: "PATCH",
      body: input
    });
  },
  getSiteSetting() {
    return requestData("/admin/site-settings", SiteSettingResponseSchema);
  }
};
