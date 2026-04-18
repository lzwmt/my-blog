import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "./client";
import { mapPostRecord, mapSiteSettingRecord, mapTagRecord } from "./mappers";

const publicPostInclude = {
  tags: {
    include: {
      tag: true
    }
  }
} satisfies Prisma.PostInclude;

export async function listPublishedPosts() {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED"
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: publicPostInclude
  });

  return posts.map(mapPostRecord);
}

export async function findPublishedPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED"
    },
    include: publicPostInclude
  });

  return post ? mapPostRecord(post) : null;
}

export async function listTags() {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return tags.map(mapTagRecord);
}

export async function getSiteSetting() {
  const siteSetting = await prisma.siteSetting.findFirst({
    orderBy: {
      createdAt: "asc"
    }
  });

  return mapSiteSettingRecord(siteSetting);
}
