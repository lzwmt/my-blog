import { describe, expect, it } from "vitest";
import { PostStatus } from "../generated/prisma/client";
import {
  mapPostStatus,
  normalizePublishedAtForCreate,
  normalizePublishedAtForUpdate
} from "./post-workflow";

describe("normalizePublishedAtForCreate", () => {
  it("leaves drafts without a publishedAt value", () => {
    expect(
      normalizePublishedAtForCreate({
        status: "draft",
        publishedAt: null
      })
    ).toBeNull();
  });

  it("uses the provided timestamp for archived posts", () => {
    const result = normalizePublishedAtForCreate({
      status: "archived",
      publishedAt: "2026-04-18T10:00:00.000Z"
    });

    expect(result?.toISOString()).toBe("2026-04-18T10:00:00.000Z");
  });

  it("uses the current time when a published post has no explicit timestamp", () => {
    const now = new Date("2026-04-18T12:00:00.000Z");

    const result = normalizePublishedAtForCreate(
      {
        status: "published",
        publishedAt: null
      },
      now
    );

    expect(result?.toISOString()).toBe(now.toISOString());
  });
});

describe("normalizePublishedAtForUpdate", () => {
  it("keeps an existing publish time when republishing without a new timestamp", () => {
    const existingPublishedAt = new Date("2026-04-18T08:00:00.000Z");

    const result = normalizePublishedAtForUpdate(existingPublishedAt, {
      status: "published",
      publishedAt: null
    });

    expect(result?.toISOString()).toBe("2026-04-18T08:00:00.000Z");
  });

  it("uses the current time when publishing an unpublished post", () => {
    const now = new Date("2026-04-18T13:30:00.000Z");

    const result = normalizePublishedAtForUpdate(
      null,
      {
        status: "published",
        publishedAt: null
      },
      now
    );

    expect(result?.toISOString()).toBe(now.toISOString());
  });

  it("preserves publishedAt when archiving without a replacement timestamp", () => {
    const existingPublishedAt = new Date("2026-04-18T08:00:00.000Z");

    const result = normalizePublishedAtForUpdate(existingPublishedAt, {
      status: "archived",
      publishedAt: null
    });

    expect(result?.toISOString()).toBe("2026-04-18T08:00:00.000Z");
  });

  it("clears publishedAt when moving back to draft", () => {
    expect(
      normalizePublishedAtForUpdate(new Date("2026-04-18T08:00:00.000Z"), {
        status: "draft",
        publishedAt: null
      })
    ).toBeNull();
  });
});

describe("mapPostStatus", () => {
  it("maps every public status to the prisma enum", () => {
    expect(mapPostStatus("draft")).toBe(PostStatus.DRAFT);
    expect(mapPostStatus("published")).toBe(PostStatus.PUBLISHED);
    expect(mapPostStatus("archived")).toBe(PostStatus.ARCHIVED);
  });
});
