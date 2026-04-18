import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { type AdminUser, AdminUserSchema } from "@blog/shared";
import {
  ADMIN_PASSWORD_PLACEHOLDER,
  findAdminUserAuthRecordByUsername,
  findAdminUserById,
  updateAdminUserPasswordHash
} from "@blog/shared/db";
import type { NextRequest, NextResponse } from "next/server";

const scrypt = promisify(scryptCallback);

const SESSION_COOKIE_NAME = "blog_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

interface SessionPayload {
  sub: string;
  username: string;
  exp: number;
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must be configured before using admin auth.");
  }

  return secret;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createSessionToken(payload: SessionPayload) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;

    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt$${salt}$${derivedKey.toString("base64url")}`;
}

async function verifyStoredPassword(password: string, storedHash: string) {
  const [algorithm, salt, digest] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !digest) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const providedDigest = Buffer.from(digest, "base64url");

  return (
    providedDigest.length === derivedKey.length &&
    timingSafeEqual(providedDigest, derivedKey)
  );
}

async function upgradePlaceholderPasswordIfNeeded(
  userId: string,
  storedHash: string,
  password: string
) {
  if (storedHash !== ADMIN_PASSWORD_PLACEHOLDER) {
    return false;
  }

  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!bootstrapPassword || bootstrapPassword !== password) {
    return false;
  }

  await updateAdminUserPasswordHash(userId, await hashPassword(password));
  return true;
}

export async function authenticateAdminCredentials(
  username: string,
  password: string
) {
  const user = await findAdminUserAuthRecordByUsername(username);

  if (!user) {
    return null;
  }

  const isValid =
    (await verifyStoredPassword(password, user.passwordHash)) ||
    (await upgradePlaceholderPasswordIfNeeded(user.id, user.passwordHash, password));

  if (!isValid) {
    return null;
  }

  return AdminUserSchema.parse({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  });
}

export function setAdminSessionCookie(response: NextResponse, user: AdminUser) {
  const payload: SessionPayload = {
    sub: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  };

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(payload),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = parseSessionToken(token);

  if (!payload) {
    return null;
  }

  return findAdminUserById(payload.sub);
}
