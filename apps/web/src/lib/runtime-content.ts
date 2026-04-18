import {
  type Post as SharedPost,
  type SiteSetting as SharedSiteSetting,
  type Tag as SharedTag,
  extractPlainText,
  sanitizeRichTextHtml
} from "@blog/shared";
import {
  findPublishedPostBySlug,
  getSiteSetting,
  listPublishedPosts,
  listTags
} from "./db";
import {
  getPostBySlug,
  siteAuthor,
  sitePosts,
  siteProfile,
  type SitePost,
  type SiteProfile
} from "./content";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

function estimateReadingTime(content: string) {
  const wordCount = extractPlainText(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} 分钟阅读`;
}

function mapSharedPostToSitePost(post: SharedPost, index: number): SitePost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary ?? "",
    contentHtml: sanitizeRichTextHtml(post.content),
    coverImage: post.coverImage ?? "https://picsum.photos/seed/blog-fallback/1400/800",
    publishedAt: post.publishedAt ?? post.createdAt ?? "",
    readingTime: estimateReadingTime(post.content),
    tags: post.tags.map((tag) => tag.name),
    featured: index === 0
  };
}

function mapSharedSiteSettingToProfile(
  setting: SharedSiteSetting | null
): SiteProfile {
  if (!setting) {
    return siteProfile;
  }

  return {
    siteName: setting.siteName,
    siteDescription: setting.siteDescription ?? siteProfile.siteDescription,
    heroTitle: setting.heroTitle ?? siteProfile.heroTitle,
    heroDescription: setting.heroDescription ?? siteProfile.heroDescription
  };
}

function mapSharedTagToSlug(tag: SharedTag) {
  return tag.name;
}

export async function loadPublishedPosts() {
  if (!hasDatabaseUrl) {
    return sitePosts;
  }

  try {
    const posts = await listPublishedPosts();
    return posts.map(mapSharedPostToSitePost);
  } catch {
    return sitePosts;
  }
}

export async function loadPublishedPostBySlug(slug: string) {
  if (!hasDatabaseUrl) {
    return getPostBySlug(slug) ?? null;
  }

  try {
    const post = await findPublishedPostBySlug(slug);
    return post ? mapSharedPostToSitePost(post, 0) : null;
  } catch {
    return getPostBySlug(slug) ?? null;
  }
}

export async function loadTagSlugs() {
  if (!hasDatabaseUrl) {
    return Array.from(new Set(sitePosts.flatMap((post) => post.tags)));
  }

  try {
    const tags = await listTags();
    return tags.map(mapSharedTagToSlug);
  } catch {
    return Array.from(new Set(sitePosts.flatMap((post) => post.tags)));
  }
}

export async function loadSiteProfile() {
  if (!hasDatabaseUrl) {
    return siteProfile;
  }

  try {
    const setting = await getSiteSetting();
    return mapSharedSiteSettingToProfile(setting);
  } catch {
    return siteProfile;
  }
}

export { siteAuthor };
