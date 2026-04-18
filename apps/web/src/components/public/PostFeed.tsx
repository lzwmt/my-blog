import Image from "next/image";
import Link from "next/link";
import { siteAuthor, type SitePost } from "@/src/lib/content";

interface PostFeedProps {
  posts: SitePost[];
}

export function PostFeed({ posts }: PostFeedProps) {
  return (
    <section className="post-feed">
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          {post.featured ? (
            <Link href={`/posts/${post.slug}`} className="post-card__cover">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </Link>
          ) : null}

          <div className="post-card__body">
            <div className="post-card__author">
              <Image
                src={siteAuthor.avatar}
                alt={siteAuthor.name}
                width={42}
                height={42}
              />
              <div>
                <p>{siteAuthor.name}</p>
                <span>{post.publishedAt}</span>
              </div>
            </div>

            <Link href={`/posts/${post.slug}`} className="post-card__title">
              {post.title}
            </Link>

            <p className="post-card__summary">{post.summary}</p>

            <div className="post-card__footer">
              <div className="post-card__tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <span className="post-card__reading-time">{post.readingTime}</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
