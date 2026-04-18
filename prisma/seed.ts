import { PrismaClient, PostStatus } from "../packages/shared/generated/prisma/client";

const prisma = new PrismaClient();

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
      { name: "architecture", slug: "architecture" },
      { name: "frontend", slug: "frontend" },
      { name: "workflow", slug: "workflow" }
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
      siteName: "Personal Blog",
      siteDescription: "An independent technical publication with a calm editorial tone.",
      heroTitle: "A technical publication with a sharper editorial rhythm.",
      heroDescription:
        "Write, edit, and publish essays on systems, frontend architecture, and product craft.",
      socialLinks: [
        { label: "GitHub", url: "https://github.com/your-handle" },
        { label: "Email", url: "mailto:hello@example.com" }
      ]
    },
    create: {
      id: "default-site-setting",
      siteName: "Personal Blog",
      siteDescription: "An independent technical publication with a calm editorial tone.",
      heroTitle: "A technical publication with a sharper editorial rhythm.",
      heroDescription:
        "Write, edit, and publish essays on systems, frontend architecture, and product craft.",
      socialLinks: [
        { label: "GitHub", url: "https://github.com/your-handle" },
        { label: "Email", url: "mailto:hello@example.com" }
      ]
    }
  });

  await prisma.post.upsert({
    where: {
      slug: "architecting-a-calm-personal-blog"
    },
    update: {
      title: "Architecting a Calm Personal Blog",
      summary:
        "A seed article that gives the public frontend and admin shell a consistent first dataset.",
      content:
        "<p>This seeded article exists so the MVP can be verified against real database data instead of mock arrays.</p>",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-18T09:00:00.000Z"),
      authorId: adminUser.id
    },
    create: {
      slug: "architecting-a-calm-personal-blog",
      title: "Architecting a Calm Personal Blog",
      summary:
        "A seed article that gives the public frontend and admin shell a consistent first dataset.",
      content:
        "<p>This seeded article exists so the MVP can be verified against real database data instead of mock arrays.</p>",
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
