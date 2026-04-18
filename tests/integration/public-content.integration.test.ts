import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import {
  ApiErrorSchema,
  PostResponseSchema,
  PostsResponseSchema
} from "@blog/shared";
import {
  createAdminPost,
  createAdminTag,
  deleteAdminPost,
  deleteAdminTag,
  prisma,
  updateAdminPost
} from "@blog/shared/db";
import { GET as getPublicPostRoute } from "@/src/app/api/public/posts/[slug]/route";
import { GET as getPublicPostsRoute } from "@/src/app/api/public/posts/route";

const cleanupTasks: Array<() => Promise<void>> = [];

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("public content integration", () => {
  afterAll(async () => {
    for (const cleanup of cleanupTasks.reverse()) {
      await cleanup();
    }

    await prisma.$disconnect();
  });

  it("keeps drafts private, exposes published posts, and hides archived posts again", async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for integration tests.");
    }

    const author = await prisma.adminUser.findFirst({
      select: {
        id: true
      }
    });

    if (!author) {
      throw new Error("No admin user found for integration test setup.");
    }

    const token = randomUUID().replace(/-/g, "").slice(0, 10);
    const tag = await createAdminTag({
      name: `Integration ${token}`,
      slug: `integration-${token}`
    });

    cleanupTasks.push(async () => {
      await deleteAdminTag(tag.id);
    });

    const post = await createAdminPost(
      {
        title: `Integration Visibility ${token}`,
        slug: `integration-visibility-${token}`,
        summary: "Integration test for public visibility.",
        content: "<h2>Integration body</h2><p>Visibility changes should be reflected publicly.</p>",
        coverImage: null,
        status: "draft",
        publishedAt: null,
        tagIds: [tag.id]
      },
      author.id
    );

    cleanupTasks.push(async () => {
      await deleteAdminPost(post.id);
    });

    const draftListResponse = await getPublicPostsRoute();
    const draftListBody = PostsResponseSchema.parse(await readJson(draftListResponse));

    expect(draftListResponse.status).toBe(200);
    expect(draftListBody.data.some((item) => item.slug === post.slug)).toBe(false);

    const draftDetailResponse = await getPublicPostRoute(new Request("http://localhost/api/public/posts"), {
      params: Promise.resolve({
        slug: post.slug
      })
    });
    const draftDetailBody = ApiErrorSchema.parse(await readJson(draftDetailResponse));

    expect(draftDetailResponse.status).toBe(404);
    expect(draftDetailBody.error.code).toBe("POST_NOT_FOUND");

    await updateAdminPost(post.id, {
      title: post.title,
      slug: post.slug,
      summary: post.summary ?? null,
      content: post.content,
      coverImage: post.coverImage ?? null,
      status: "published",
      publishedAt: null,
      tagIds: [tag.id]
    });

    const publishedListResponse = await getPublicPostsRoute();
    const publishedListBody = PostsResponseSchema.parse(await readJson(publishedListResponse));

    expect(publishedListResponse.status).toBe(200);
    expect(publishedListBody.data.some((item) => item.slug === post.slug)).toBe(true);

    const publishedDetailResponse = await getPublicPostRoute(
      new Request(`http://localhost/api/public/posts/${post.slug}`),
      {
        params: Promise.resolve({
          slug: post.slug
        })
      }
    );
    const publishedDetailBody = PostResponseSchema.parse(
      await readJson(publishedDetailResponse)
    );

    expect(publishedDetailResponse.status).toBe(200);
    expect(publishedDetailBody.data.slug).toBe(post.slug);
    expect(publishedDetailBody.data.status).toBe("published");

    await updateAdminPost(post.id, {
      title: post.title,
      slug: post.slug,
      summary: post.summary ?? null,
      content: post.content,
      coverImage: post.coverImage ?? null,
      status: "archived",
      publishedAt: null,
      tagIds: [tag.id]
    });

    const archivedListResponse = await getPublicPostsRoute();
    const archivedListBody = PostsResponseSchema.parse(await readJson(archivedListResponse));

    expect(archivedListResponse.status).toBe(200);
    expect(archivedListBody.data.some((item) => item.slug === post.slug)).toBe(false);

    const archivedDetailResponse = await getPublicPostRoute(
      new Request(`http://localhost/api/public/posts/${post.slug}`),
      {
        params: Promise.resolve({
          slug: post.slug
        })
      }
    );
    const archivedDetailBody = ApiErrorSchema.parse(await readJson(archivedDetailResponse));

    expect(archivedDetailResponse.status).toBe(404);
    expect(archivedDetailBody.error.code).toBe("POST_NOT_FOUND");
  });
});
