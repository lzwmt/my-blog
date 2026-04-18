import type { NextRequest } from "next/server";
import { adminNoContentResponse, adminOptionsResponse } from "@/src/app/api/_lib/admin-response";
import { clearAdminSessionCookie } from "@/src/lib/auth/session";

export function POST(request: NextRequest) {
  const response = adminNoContentResponse(request);

  clearAdminSessionCookie(response);

  return response;
}

export function OPTIONS(request: NextRequest) {
  return adminOptionsResponse(request);
}
