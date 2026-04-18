import { describe, expect, it } from "vitest";
import { CreatePostInputSchema, SlugSchema } from "./content";

describe("SlugSchema", () => {
  it("accepts lowercase kebab-case slugs", () => {
    const result = SlugSchema.safeParse("calm-editorial-rhythm");

    expect(result.success).toBe(true);
  });

  it("rejects invalid slug formats", () => {
    const result = SlugSchema.safeParse("Calm Editorial Rhythm");

    expect(result.success).toBe(false);
  });
});

describe("CreatePostInputSchema", () => {
  it("defaults tagIds to an empty array", () => {
    const result = CreatePostInputSchema.parse({
      title: "A post title",
      slug: "a-post-title",
      summary: null,
      content: "<p>Hello world</p>",
      coverImage: null,
      status: "draft",
      publishedAt: null
    });

    expect(result.tagIds).toEqual([]);
  });
});
