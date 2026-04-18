import { CreateTagRequestSchema, TagResponseSchema, TagsResponseSchema } from "@blog/shared";
import { createAdminTag, listAdminTags } from "@blog/shared/db";
import type { NextRequest } from "next/server";
import { adminErrorResponse, adminJsonResponse, adminOptionsResponse } from "@/src/app/api/_lib/admin-response";
import { requireAdminSession } from "@/src/app/api/_lib/require-admin-session";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  try {
    const tags = await listAdminTags();
    return adminJsonResponse(request, TagsResponseSchema.parse({ data: tags }));
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "加载后台标签列表失败。"
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

  const parsedBody = CreateTagRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return adminErrorResponse(
      request,
      422,
      "VALIDATION_ERROR",
      "标签数据未通过校验。"
    );
  }

  try {
    const tag = await createAdminTag(parsedBody.data);
    return adminJsonResponse(request, TagResponseSchema.parse({ data: tag }), {
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
        "TAG_CONFLICT",
        "已有其他标签使用了这个名称或链接别名。"
      );
    }

    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "创建标签失败。"
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
