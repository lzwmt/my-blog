import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
} as const;

export function jsonResponse<T>(body: T, init?: ResponseInit) {
  const response = NextResponse.json(body, init);

  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export function errorResponse(status: number, code: string, message: string) {
  return jsonResponse(
    {
      error: {
        code,
        message
      }
    },
    { status }
  );
}

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}
