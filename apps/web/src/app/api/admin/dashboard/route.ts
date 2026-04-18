import { DashboardStatsResponseSchema } from "@blog/shared";
import { getAdminDashboardStats } from "@blog/shared/db";
import type { NextRequest } from "next/server";
import { adminErrorResponse, adminJsonResponse, adminOptionsResponse } from "@/src/app/api/_lib/admin-response";
import { requireAdminSession } from "@/src/app/api/_lib/require-admin-session";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);

  if (session.response) {
    return session.response;
  }

  try {
    const stats = await getAdminDashboardStats();
    return adminJsonResponse(request, DashboardStatsResponseSchema.parse({ data: stats }));
  } catch {
    return adminErrorResponse(
      request,
      500,
      "INTERNAL_SERVER_ERROR",
      "加载仪表盘统计数据失败。"
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
