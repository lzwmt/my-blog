import { CreatePostRequestSchema, PostResponseSchema, PostsResponseSchema } from "@blog/shared";
import { createAdminPost, listAdminPosts } from "@blog/shared/db";
import type { NextRequest } from "next/server";
import { adminErrorResponse, adminJsonResponse, adminOptionsResponse } from "@/src/app/api/_lib/admin-response";
import { requireAdminSession } from "@/src/app/api/_lib/require-admin-session";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  try {
    const posts = await listAdminPosts();
    return adminJsonResponse(request, PostsResponseSchema.parse({ data: posts }));
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "加载后台文章列表失败。"
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return adminErrorResponse(request, 400, "INVALID_JSON", "请求体必须是合法 JSON。");
  }

  const parsedBody = CreatePostRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return adminErrorResponse(
      request,
      422,
      "VALIDATION_ERROR",
      "文章数据未通过校验。"
    );
  }

  try {
    const post = await createAdminPost(parsedBody.data, session.admin.id);
    return adminJsonResponse(request, PostResponseSchema.parse({ data: post }), {
      status: 201
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return adminErrorResponse(
        request,
        409,
        "SLUG_CONFLICT",
        "已有其他文章使用了这个链接别名。"
      );
    }

    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "创建文章失败。"
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
