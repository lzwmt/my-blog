import { AdminSessionResponseSchema } from "@blog/shared";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSessionFromRequest } from "@/src/lib/auth/session";

const ADMIN_DEFAULT_DEV_ORIGINS = ["http://localhost:8000", "http://127.0.0.1:8000"];

function resolveAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  const configuredOrigins = process.env.ADMIN_CORS_ORIGINS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const allowedOrigins =
    configuredOrigins && configuredOrigins.length > 0
      ? configuredOrigins
      : ADMIN_DEFAULT_DEV_ORIGINS;

  if (allowedOrigins.includes(origin)) {
    return origin;
  }

  try {
    const url = new URL(origin);

    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return origin;
    }
  } catch {
    return null;
  }

  return null;
}

function applyCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = resolveAllowedOrigin(request);

  if (!origin) {
    return response;
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Vary", "Origin");

  return response;
}

function sessionJsonResponse(
  request: NextRequest,
  body: unknown,
  init?: ResponseInit
) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");

  return applyCorsHeaders(response, request);
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(request);

    if (!admin) {
      return sessionJsonResponse(
        request,
        {
          error: {
            code: "UNAUTHORIZED",
            message: "需要管理员登录后才能访问。"
          }
        },
        { status: 401 }
      );
    }

    return sessionJsonResponse(
      request,
      AdminSessionResponseSchema.parse({ data: admin })
    );
  } catch {
    return sessionJsonResponse(
      request,
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "读取管理员会话失败。"
        }
      },
      { status: 500 }
    );
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = resolveAllowedOrigin(request);

  if (!origin) {
    return new NextResponse(null, {
      status: 403
    });
  }

  const response = new NextResponse(null, {
    status: 204
  });

  return applyCorsHeaders(response, request);
}
