import { PublicShell } from "@/src/components/public/PublicShell";
import { loadSiteProfile, siteAuthor } from "@/src/lib/runtime-content";

export default async function AboutPage() {
  const profile = await loadSiteProfile();

  return (
    <PublicShell>
      <section className="content-page">
        <p className="content-page__eyebrow">关于</p>
        <h1 className="content-page__title">{profile.siteName}</h1>
        <p className="content-page__copy">{siteAuthor.bio}</p>
        <div className="content-page__meta">
          <span>{siteAuthor.location}</span>
          <span>加入时间 {siteAuthor.joinedDate}</span>
        </div>
      </section>
    </PublicShell>
  );
}
