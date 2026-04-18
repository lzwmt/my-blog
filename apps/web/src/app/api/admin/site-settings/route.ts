import {
  SiteSettingResponseSchema,
  UpdateSiteSettingRequestSchema
} from "@blog/shared";
import { getAdminSiteSetting, updateAdminSiteSetting } from "@blog/shared/db";
import type { NextRequest } from "next/server";
import { adminErrorResponse, adminJsonResponse, adminOptionsResponse } from "@/src/app/api/_lib/admin-response";
import { requireAdminSession } from "@/src/app/api/_lib/require-admin-session";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  try {
    const siteSetting = await getAdminSiteSetting();
    return adminJsonResponse(
      request,
      SiteSettingResponseSchema.parse({ data: siteSetting })
    );
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "加载后台站点设置失败。"
    );
  }
}

export async function PATCH(request: NextRequest) {
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

  const parsedBody = UpdateSiteSettingRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return adminErrorResponse(
      request,
      422,
      "VALIDATION_ERROR",
      "站点设置数据未通过校验。"
    );
  }

  try {
    const siteSetting = await updateAdminSiteSetting(parsedBody.data);
    return adminJsonResponse(
      request,
      SiteSettingResponseSchema.parse({ data: siteSetting })
    );
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "更新后台站点设置失败。"
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
