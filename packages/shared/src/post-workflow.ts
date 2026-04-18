import { PostStatus } from "../generated/prisma/client";
import type { CreatePostInput, UpdatePostInput } from "./content";

export function normalizePublishedAtForCreate(
  input: Pick<CreatePostInput, "publishedAt" | "status">,
  now: Date = new Date()
) {
  if (input.status === "published") {
    return input.publishedAt ? new Date(input.publishedAt) : now;
  }

  if (input.status === "archived" && input.publishedAt) {
    return new Date(input.publishedAt);
  }

  return null;
}

export function normalizePublishedAtForUpdate(
  existingPublishedAt: Date | null,
  input: Pick<UpdatePostInput, "publishedAt" | "status">,
  now: Date = new Date()
) {
  if (input.status === "published") {
    return input.publishedAt
      ? new Date(input.publishedAt)
      : existingPublishedAt ?? now;
  }

  if (input.status === "archived") {
    return input.publishedAt
      ? new Date(input.publishedAt)
      : existingPublishedAt;
  }

  return null;
}

export function mapPostStatus(status: CreatePostInput["status"]) {
  switch (status) {
    case "draft":
      return PostStatus.DRAFT;
    case "published":
      return PostStatus.PUBLISHED;
    case "archived":
      return PostStatus.ARCHIVED;
  }
}
