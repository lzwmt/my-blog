import { AdminLoginRequestSchema, AdminSessionResponseSchema } from "@blog/shared";
import type { NextRequest } from "next/server";
import { adminErrorResponse, adminJsonResponse, adminOptionsResponse } from "@/src/app/api/_lib/admin-response";
import { authenticateAdminCredentials, setAdminSessionCookie } from "@/src/lib/auth/session";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return adminErrorResponse(request, 400, "INVALID_JSON", "请求体必须是合法 JSON。");
  }

  const parsedBody = AdminLoginRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return adminErrorResponse(
      request,
      422,
      "VALIDATION_ERROR",
      "用户名或密码未通过校验。"
    );
  }

  try {
    const admin = await authenticateAdminCredentials(
      parsedBody.data.username,
      parsedBody.data.password
    );

    if (!admin) {
      return adminErrorResponse(
        request,
        401,
        "INVALID_CREDENTIALS",
        "用户名或密码错误。"
      );
    }

    const response = adminJsonResponse(
      request,
      AdminSessionResponseSchema.parse({ data: admin })
    );

    setAdminSessionCookie(response, admin);

    return response;
  } catch {
    return adminErrorResponse(request, 500, "INTERNAL_SERVER_ERROR", "登录失败。");
  }
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
