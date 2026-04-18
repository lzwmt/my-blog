import Link from "next/link";
import { PostFeed } from "@/src/components/public/PostFeed";
import { PublicShell } from "@/src/components/public/PublicShell";
import { loadPublishedPosts } from "@/src/lib/runtime-content";

const POSTS_PER_PAGE = 6;

function parsePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "1", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function getPageHref(page: number) {
  return page <= 1 ? "/posts" : `/posts?page=${page}`;
}

interface PostsPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const posts = await loadPublishedPosts();
  const resolvedSearchParams: { page?: string } = searchParams
    ? await searchParams
    : {};
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(parsePage(resolvedSearchParams.page), totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <PublicShell>
      <section className="content-page posts-page__intro">
        <p className="content-page__eyebrow">归档</p>
        <h1 className="content-page__title">全部已发布文章</h1>
        <p className="content-page__copy">
          这里按时间顺序展示所有已发布文章，MVP 阶段保持轻量结构，并使用简单的
          查询参数完成分页。
        </p>
        <div className="content-page__meta">
          <span>共 {posts.length} 篇文章</span>
          <span>
            第 {currentPage} / {totalPages} 页
          </span>
        </div>
      </section>

      {paginatedPosts.length > 0 ? (
        <>
          <PostFeed posts={paginatedPosts} />

          {totalPages > 1 ? (
            <nav className="posts-pagination" aria-label="文章分页">
              <Link
                href={getPageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={`posts-pagination__link ${
                  currentPage === 1 ? "posts-pagination__link--disabled" : ""
                }`}
              >
                上一页
              </Link>
              <span className="posts-pagination__status">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <Link
                href={getPageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={`posts-pagination__link ${
                  currentPage === totalPages
                    ? "posts-pagination__link--disabled"
                    : ""
                }`}
              >
                下一页
              </Link>
            </nav>
          ) : null}
        </>
      ) : (
        <section className="content-page">
          <p className="content-page__eyebrow">归档</p>
          <h2 className="content-page__title">暂时还没有已发布文章</h2>
          <p className="content-page__copy">
            请先在后台发布第一篇文章，发布后它会出现在这里。
          </p>
        </section>
      )}
    </PublicShell>
  );
}
