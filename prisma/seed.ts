import { PostStatus } from "../packages/shared/generated/prisma/client";
import { prisma } from "../packages/shared/src/db/client";

async function main() {
  const adminUser = await prisma.adminUser.upsert({
    where: {
      username: "owner"
    },
    update: {},
    create: {
      username: "owner",
      // Placeholder only. Real auth slice will replace this with a bcrypt hash.
      passwordHash: "seed-placeholder-password-hash"
    }
  });

  const tags = await Promise.all(
    [
      { name: "架构", slug: "architecture" },
      { name: "前端", slug: "frontend" },
      { name: "工作流", slug: "workflow" }
    ].map((tag) =>
      prisma.tag.upsert({
        where: {
          slug: tag.slug
        },
        update: {
          name: tag.name
        },
        create: tag
      })
    )
  );

  await prisma.siteSetting.upsert({
    where: {
      id: "default-site-setting"
    },
    update: {
      siteName: "个人博客",
      siteDescription: "一份保持克制语气与出版感的独立技术写作站点。",
      heroTitle: "一份更有节奏感的技术写作出版物。",
      heroDescription:
        "围绕系统设计、前端架构与产品实现，持续写作、整理与发布真实的工程实践。",
      socialLinks: [
        { label: "GitHub", url: "https://github.com/lzwmt/my-blog" },
        { label: "邮箱", url: "mailto:hello@example.com" }
      ]
    },
    create: {
      id: "default-site-setting",
      siteName: "个人博客",
      siteDescription: "一份保持克制语气与出版感的独立技术写作站点。",
      heroTitle: "一份更有节奏感的技术写作出版物。",
      heroDescription:
        "围绕系统设计、前端架构与产品实现，持续写作、整理与发布真实的工程实践。",
      socialLinks: [
        { label: "GitHub", url: "https://github.com/lzwmt/my-blog" },
        { label: "邮箱", url: "mailto:hello@example.com" }
      ]
    }
  });

  await prisma.post.upsert({
    where: {
      slug: "architecting-a-calm-personal-blog"
    },
    update: {
      title: "如何搭建一套安静但有编辑张力的个人博客",
      summary:
        "这是一篇用于初始化正式环境的示例文章，确保前台首页与后台管理在接入真实数据库后可以直接验证。",
      content:
        "<p>这篇初始化文章用于让最小可用版本在接入真实数据库后，直接以真实内容验证首页展示、文章详情和后台管理链路。</p><p>当你准备发布第一篇正式文章时，可以在后台直接编辑或删除它。</p>",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-18T09:00:00.000Z"),
      authorId: adminUser.id
    },
    create: {
      slug: "architecting-a-calm-personal-blog",
      title: "如何搭建一套安静但有编辑张力的个人博客",
      summary:
        "这是一篇用于初始化正式环境的示例文章，确保前台首页与后台管理在接入真实数据库后可以直接验证。",
      content:
        "<p>这篇初始化文章用于让最小可用版本在接入真实数据库后，直接以真实内容验证首页展示、文章详情和后台管理链路。</p><p>当你准备发布第一篇正式文章时，可以在后台直接编辑或删除它。</p>",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-18T09:00:00.000Z"),
      authorId: adminUser.id,
      tags: {
        create: tags.slice(0, 2).map((tag) => ({
          tagId: tag.id
        }))
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
