import type { NextRequest } from "next/server";
import { getAdminSessionFromRequest } from "@/src/lib/auth/session";
import { adminErrorResponse } from "./admin-response";

export async function requireAdminSession(request: NextRequest) {
  const admin = await getAdminSessionFromRequest(request);

  if (!admin) {
    return {
      admin: null,
      response: adminErrorResponse(
        request,
        401,
        "UNAUTHORIZED",
        "需要管理员登录后才能访问。"
      )
    } as const;
  }

  return {
    admin,
    response: null
  } as const;
}
