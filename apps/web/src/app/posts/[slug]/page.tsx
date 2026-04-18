import Image from "next/image";
import type { Metadata } from "next";
import { sanitizeRichTextHtml } from "@blog/shared";
import { notFound } from "next/navigation";
import { PublicShell } from "@/src/components/public/PublicShell";
import { loadPublishedPostBySlug, loadPublishedPosts, siteAuthor } from "@/src/lib/runtime-content";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await loadPublishedPosts();

  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({
  params
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到"
    };
  }

  return {
    title: post.title,
    description: post.summary || undefined
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await loadPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicShell
      rightRail={
        <aside className="article-rail">
          <section className="article-rail__card">
            <div className="article-rail__author">
              <Image
                src={siteAuthor.avatar}
                alt={siteAuthor.name}
                width={56}
                height={56}
              />
              <div>
                <h2>{siteAuthor.name}</h2>
                <p>{siteAuthor.bio}</p>
              </div>
            </div>
            <dl className="article-rail__meta">
              <div>
                <dt>所在地</dt>
                <dd>{siteAuthor.location}</dd>
              </div>
              <div>
                <dt>加入时间</dt>
                <dd>{siteAuthor.joinedDate}</dd>
              </div>
            </dl>
          </section>
        </aside>
      }
    >
      <article className="article-page">
        <div className="article-page__cover">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
        <div className="article-page__body">
          <div className="article-page__meta">
            <Image
              src={siteAuthor.avatar}
              alt={siteAuthor.name}
              width={42}
              height={42}
            />
            <div>
              <strong>{siteAuthor.name}</strong>
              <span>
                {post.publishedAt} · {post.readingTime}
              </span>
            </div>
          </div>

          <h1 className="article-page__title">{post.title}</h1>

          <div className="article-page__tags">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <div
            className="article-page__content"
            dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(post.contentHtml) }}
          />
        </div>
      </article>
    </PublicShell>
  );
}
