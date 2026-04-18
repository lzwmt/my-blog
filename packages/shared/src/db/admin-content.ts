import type {
  CreatePostInput,
  SiteSetting,
  TagInput,
  UpdatePostInput
} from "../content";
import {
  mapPostStatus,
  normalizePublishedAtForCreate,
  normalizePublishedAtForUpdate
} from "../post-workflow";
import { sanitizeRichTextHtml } from "../sanitize";
import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "./client";
import { mapPostRecord, mapSiteSettingRecord, mapTagRecord } from "./mappers";

const adminPostInclude = {
  tags: {
    include: {
      tag: true
    }
  }
} satisfies Prisma.PostInclude;

export async function listAdminPosts() {
  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    include: adminPostInclude
  });

  return posts.map(mapPostRecord);
}

export async function findAdminPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id
    },
    include: adminPostInclude
  });

  return post ? mapPostRecord(post) : null;
}

export async function createAdminPost(input: CreatePostInput, authorId: string) {
  const post = await prisma.post.create({
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary ?? null,
      content: sanitizeRichTextHtml(input.content),
      coverImage: input.coverImage ?? null,
      status: mapPostStatus(input.status),
      publishedAt: normalizePublishedAtForCreate(input),
      authorId,
      tags: {
        create: input.tagIds.map((tagId) => ({
          tagId
        }))
      }
    },
    include: adminPostInclude
  });

  return mapPostRecord(post);
}

export async function updateAdminPost(id: string, input: UpdatePostInput) {
  const existingPost = await prisma.post.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      publishedAt: true
    }
  });

  if (!existingPost) {
    return null;
  }

  const post = await prisma.post.update({
    where: {
      id
    },
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary ?? null,
      content: sanitizeRichTextHtml(input.content),
      coverImage: input.coverImage ?? null,
      status: mapPostStatus(input.status),
      publishedAt: normalizePublishedAtForUpdate(existingPost.publishedAt, input),
      tags: {
        deleteMany: {},
        create: input.tagIds.map((tagId) => ({
          tagId
        }))
      }
    },
    include: adminPostInclude
  });

  return mapPostRecord(post);
}

export async function deleteAdminPost(id: string) {
  const deletedPost = await prisma.post.deleteMany({
    where: {
      id
    }
  });

  return deletedPost.count > 0;
}

export async function getAdminDashboardStats() {
  const [total, published, drafts, archived] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.count({ where: { status: "ARCHIVED" } })
  ]);

  return {
    total,
    published,
    drafts,
    archived
  };
}

export async function listAdminTags() {
  const tags = await prisma.tag.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  });

  return tags.map(mapTagRecord);
}

export async function createAdminTag(input: TagInput) {
  const tag = await prisma.tag.create({
    data: {
      name: input.name,
      slug: input.slug
    }
  });

  return mapTagRecord(tag);
}

export async function updateAdminTag(id: string, input: TagInput) {
  try {
    const tag = await prisma.tag.update({
      where: {
        id
      },
      data: {
        name: input.name,
        slug: input.slug
      }
    });

    return mapTagRecord(tag);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return null;
    }

    throw error;
  }
}

export async function deleteAdminTag(id: string) {
  const deletedTag = await prisma.tag.deleteMany({
    where: {
      id
    }
  });

  return deletedTag.count > 0;
}

export async function getAdminSiteSetting() {
  const siteSetting = await prisma.siteSetting.findFirst({
    orderBy: {
      createdAt: "asc"
    }
  });

  return mapSiteSettingRecord(siteSetting);
}

export async function updateAdminSiteSetting(input: SiteSetting) {
  const existingSiteSetting = await prisma.siteSetting.findFirst({
    orderBy: {
      createdAt: "asc"
    },
    select: {
      id: true
    }
  });

  const siteSetting = existingSiteSetting
    ? await prisma.siteSetting.update({
        where: {
          id: existingSiteSetting.id
        },
        data: {
          siteName: input.siteName,
          siteDescription: input.siteDescription ?? null,
          heroTitle: input.heroTitle ?? null,
          heroDescription: input.heroDescription ?? null,
          socialLinks: input.socialLinks
        }
      })
    : await prisma.siteSetting.create({
        data: {
          siteName: input.siteName,
          siteDescription: input.siteDescription ?? null,
          heroTitle: input.heroTitle ?? null,
          heroDescription: input.heroDescription ?? null,
          socialLinks: input.socialLinks
        }
      });

  return mapSiteSettingRecord(siteSetting);
}
