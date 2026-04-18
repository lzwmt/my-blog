import Link from "next/link";
import { loadPublishedPosts } from "@/src/lib/runtime-content";

export async function TrendingPanel() {
  const posts = await loadPublishedPosts();
  const entries = posts.slice(0, 3).map((post, index) => ({
    id: post.id,
    href: `/posts/${post.slug}`,
    title: post.title,
    note: post.tags[0] ?? `专题 ${index + 1}`
  }));

  return (
    <aside className="trending-panel">
      <section className="trending-panel__section">
        <h2 className="trending-panel__title">阅读提示</h2>
        <div className="trending-panel__list">
          {entries.map((entry) => (
            <Link key={entry.id} href={entry.href} className="trending-panel__item">
              <span className="trending-panel__item-title">{entry.title}</span>
              <span className="trending-panel__item-note">{entry.note}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="trending-panel__note">
        <p className="trending-panel__note-eyebrow">站点说明</p>
        <p className="trending-panel__note-copy">
          这个前台界面迁移自既有视觉原型，并裁剪成更聚焦的个人博客最小可用版本。
        </p>
      </section>
    </aside>
  );
}
