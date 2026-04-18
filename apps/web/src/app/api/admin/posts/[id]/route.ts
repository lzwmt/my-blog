import {
  PostIdParamsSchema,
  PostResponseSchema,
  UpdatePostRequestSchema
} from "@blog/shared";
import {
  deleteAdminPost,
  findAdminPostById,
  updateAdminPost
} from "@blog/shared/db";
import type { NextRequest } from "next/server";
import {
  adminErrorResponse,
  adminJsonResponse,
  adminNoContentResponse,
  adminOptionsResponse
} from "@/src/app/api/_lib/admin-response";
import { requireAdminSession } from "@/src/app/api/_lib/require-admin-session";

interface PostRouteProps {
  params: Promise<{
    id: string;
  }>;
}

async function parsePostId(params: PostRouteProps["params"]) {
  const parsedParams = PostIdParamsSchema.safeParse(await params);

  return parsedParams.success ? parsedParams.data.id : null;
}

export async function GET(request: NextRequest, { params }: PostRouteProps) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  const postId = await parsePostId(params);

  if (!postId) {
    return adminErrorResponse(request, 400, "INVALID_ID", "文章 ID 无效。");
  }

  try {
    const post = await findAdminPostById(postId);

    if (!post) {
      return adminErrorResponse(request, 404, "POST_NOT_FOUND", "未找到对应文章。");
    }

    return adminJsonResponse(request, PostResponseSchema.parse({ data: post }));
  } catch {
    return adminErrorResponse(request, 500, "INTERNAL_SERVER_ERROR", "加载文章失败。");
  }
}

export async function PATCH(request: NextRequest, { params }: PostRouteProps) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  const postId = await parsePostId(params);

  if (!postId) {
    return adminErrorResponse(request, 400, "INVALID_ID", "文章 ID 无效。");
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return adminErrorResponse(request, 400, "INVALID_JSON", "请求体必须是合法 JSON。");
  }

  const parsedBody = UpdatePostRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return adminErrorResponse(
      request,
      422,
      "VALIDATION_ERROR",
      "文章数据未通过校验。"
    );
  }

  try {
    const post = await updateAdminPost(postId, parsedBody.data);

    if (!post) {
      return adminErrorResponse(request, 404, "POST_NOT_FOUND", "未找到对应文章。");
    }

    return adminJsonResponse(request, PostResponseSchema.parse({ data: post }));
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
      "更新文章失败。"
    );
  }
}

export async function DELETE(request: NextRequest, { params }: PostRouteProps) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  const postId = await parsePostId(params);

  if (!postId) {
    return adminErrorResponse(request, 400, "INVALID_ID", "文章 ID 无效。");
  }

  try {
    const deleted = await deleteAdminPost(postId);

    if (!deleted) {
      return adminErrorResponse(request, 404, "POST_NOT_FOUND", "未找到对应文章。");
    }

    return adminNoContentResponse(request);
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "删除文章失败。"
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
