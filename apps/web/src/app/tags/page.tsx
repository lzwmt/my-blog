import Link from "next/link";
import { PublicShell } from "@/src/components/public/PublicShell";
import { loadTagSlugs } from "@/src/lib/runtime-content";

export default async function TagsPage() {
  const tags = await loadTagSlugs();

  return (
    <PublicShell>
      <section className="content-page">
        <p className="content-page__eyebrow">标签</p>
        <h1 className="content-page__title">当前发布主题</h1>
        <div className="tag-grid">
          {tags.map((tag) => (
            <Link key={tag} href={`/tags#${tag}`} className="tag-grid__item">
              #{tag}
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
