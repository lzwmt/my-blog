import type { AdminUser } from "../auth";
import type { Post, PostStatus, SiteSetting, Tag } from "../content";
import {
  type AdminUser as DbAdminUser,
  PostStatus as DbPostStatus,
  type Prisma,
  type SiteSetting as DbSiteSetting,
  type Tag as DbTag
} from "../../generated/prisma/client";

export type PostRecord = Prisma.PostGetPayload<{
  include: {
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

function mapPostStatus(status: DbPostStatus): PostStatus {
  switch (status) {
    case DbPostStatus.DRAFT:
      return "draft";
    case DbPostStatus.PUBLISHED:
      return "published";
    case DbPostStatus.ARCHIVED:
      return "archived";
  }
}

export function mapTagRecord(tag: DbTag): Tag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString()
  };
}

export function mapAdminUserRecord(user: DbAdminUser): AdminUser {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

export function mapPostRecord(post: PostRecord): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary ?? null,
    content: post.content,
    coverImage: post.coverImage ?? null,
    status: mapPostStatus(post.status),
    publishedAt: post.publishedAt?.toISOString() ?? null,
    authorId: post.authorId,
    tags: post.tags.map((link) => mapTagRecord(link.tag)),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}

function parseSocialLinks(input: unknown): SiteSetting["socialLinks"] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.flatMap((item) => {
    if (
      typeof item === "object" &&
      item !== null &&
      "label" in item &&
      "url" in item &&
      typeof item.label === "string" &&
      typeof item.url === "string"
    ) {
      return [
        {
          label: item.label,
          url: item.url
        }
      ];
    }

    return [];
  });
}

export function mapSiteSettingRecord(
  siteSetting: DbSiteSetting | null
): SiteSetting | null {
  if (!siteSetting) {
    return null;
  }

  return {
    id: siteSetting.id,
    siteName: siteSetting.siteName,
    siteDescription: siteSetting.siteDescription ?? null,
    heroTitle: siteSetting.heroTitle ?? null,
    heroDescription: siteSetting.heroDescription ?? null,
    socialLinks: parseSocialLinks(siteSetting.socialLinks),
  };
}
