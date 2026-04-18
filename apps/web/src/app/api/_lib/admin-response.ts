import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_DEFAULT_DEV_ORIGINS = ["http://localhost:8000", "http://127.0.0.1:8000"];

function getConfiguredAdminOrigins() {
  const configuredOrigins = process.env.ADMIN_CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins && configuredOrigins.length > 0
    ? configuredOrigins
    : ADMIN_DEFAULT_DEV_ORIGINS;
}

function resolveAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  if (getConfiguredAdminOrigins().includes(origin)) {
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

function applyAdminCorsHeaders(response: NextResponse, request: NextRequest) {
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

export function adminJsonResponse<T>(
  request: NextRequest,
  body: T,
  init?: ResponseInit
) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");

  return applyAdminCorsHeaders(response, request);
}

export function adminErrorResponse(
  request: NextRequest,
  status: number,
  code: string,
  message: string
) {
  return adminJsonResponse(
    request,
    {
      error: {
        code,
        message
      }
    },
    { status }
  );
}

export function adminOptionsResponse(request: NextRequest) {
  const origin = resolveAllowedOrigin(request);

  if (!origin) {
    return new NextResponse(null, {
      status: 403
    });
  }

  const response = new NextResponse(null, {
    status: 204
  });

  return applyAdminCorsHeaders(response, request);
}

export function adminNoContentResponse(
  request: NextRequest,
  init?: ResponseInit
) {
  const response = new NextResponse(null, {
    status: 204,
    ...init
  });
  response.headers.set("Cache-Control", "no-store");

  return applyAdminCorsHeaders(response, request);
}
