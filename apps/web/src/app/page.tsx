import { PostFeed } from "@/src/components/public/PostFeed";
import { PublicShell } from "@/src/components/public/PublicShell";
import { loadPublishedPosts, loadSiteProfile } from "@/src/lib/runtime-content";

export default async function HomePage() {
  const [posts, profile] = await Promise.all([
    loadPublishedPosts(),
    loadSiteProfile()
  ]);

  return (
    <PublicShell>
      <section className="home-hero">
        <p className="home-hero__eyebrow">{profile.siteName}</p>
        <h1 className="home-hero__title">{profile.heroTitle}</h1>
        <p className="home-hero__copy">{profile.heroDescription}</p>
      </section>
      <PostFeed posts={posts} />
    </PublicShell>
  );
}
