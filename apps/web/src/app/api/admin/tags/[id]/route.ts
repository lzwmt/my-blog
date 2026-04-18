import {
  TagIdParamsSchema,
  TagResponseSchema,
  UpdateTagRequestSchema
} from "@blog/shared";
import { deleteAdminTag, updateAdminTag } from "@blog/shared/db";
import type { NextRequest } from "next/server";
import {
  adminErrorResponse,
  adminJsonResponse,
  adminNoContentResponse,
  adminOptionsResponse
} from "@/src/app/api/_lib/admin-response";
import { requireAdminSession } from "@/src/app/api/_lib/require-admin-session";

interface TagRouteProps {
  params: Promise<{
    id: string;
  }>;
}

async function parseTagId(params: TagRouteProps["params"]) {
  const parsedParams = TagIdParamsSchema.safeParse(await params);

  return parsedParams.success ? parsedParams.data.id : null;
}

export async function PATCH(request: NextRequest, { params }: TagRouteProps) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  const tagId = await parseTagId(params);

  if (!tagId) {
    return adminErrorResponse(request, 400, "INVALID_ID", "标签 ID 无效。");
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return adminErrorResponse(request, 400, "INVALID_JSON", "请求体必须是合法 JSON。");
  }

  const parsedBody = UpdateTagRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return adminErrorResponse(
      request,
      422,
      "VALIDATION_ERROR",
      "标签数据未通过校验。"
    );
  }

  try {
    const tag = await updateAdminTag(tagId, parsedBody.data);

    if (!tag) {
      return adminErrorResponse(request, 404, "TAG_NOT_FOUND", "未找到对应标签。");
    }

    return adminJsonResponse(request, TagResponseSchema.parse({ data: tag }));
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
        "TAG_CONFLICT",
        "已有其他标签使用了这个名称或链接别名。"
      );
    }

    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "更新标签失败。"
    );
  }
}

export async function DELETE(request: NextRequest, { params }: TagRouteProps) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  const tagId = await parseTagId(params);

  if (!tagId) {
    return adminErrorResponse(request, 400, "INVALID_ID", "标签 ID 无效。");
  }

  try {
    const deleted = await deleteAdminTag(tagId);

    if (!deleted) {
      return adminErrorResponse(request, 404, "TAG_NOT_FOUND", "未找到对应标签。");
    }

    return adminNoContentResponse(request);
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "删除标签失败。"
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
