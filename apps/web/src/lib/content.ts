export interface SiteAuthor {
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
}

export interface SitePost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  contentHtml: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
}

export interface SiteProfile {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroDescription: string;
}

export const siteAuthor: SiteAuthor = {
  name: "数字架构师",
  avatar: "https://picsum.photos/seed/digital-architect/120/120",
  bio: "独立工程师，持续记录系统设计、前端架构与克制而稳定的产品构建过程。",
  location: "上海",
  joinedDate: "2026 年 4 月"
};

export const siteProfile: SiteProfile = {
  siteName: "个人博客",
  siteDescription: "一份保持克制语气与出版感的独立技术写作站点。",
  heroTitle: "一份更有节奏感的技术写作出版物。",
  heroDescription:
    "这个前台保留了原始视觉方案中最强的出版感骨架，并去掉社区化机制，让阅读体验重新回到中心。"
};

export const sitePosts: SitePost[] = [
  {
    id: "post-1",
    slug: "architecting-a-calm-personal-blog",
    title: "如何搭建一套安静但有编辑张力的个人博客",
    summary:
      "博客首页应该像一份出版物，而不是模板页面。这篇文章讨论间距、节奏和信息层级如何塑造技术博客的气质。",
    contentHtml: `
      <p>优秀的技术博客会让人感到“被认真编辑过”。它会明确告诉读者什么最重要，什么只是元信息，什么地方应该让阅读慢下来。</p>
      <p>这个最小可用版本的设计目标不是功能堆满，而是建立信任感。访客应该在几秒内读懂站点的语气，再自然进入阅读流程。</p>
      <h2>先把编辑性布局做好</h2>
      <p>首页采用更接近在线杂志的层级结构，而不是数据后台式的信息堆叠。侧边栏的职责是辅助阅读，而不是争抢注意力。</p>
      <blockquote>层级不是装饰，它是无需说明书的导航。</blockquote>
      <p>所以这个切片只保留真正增强博客体验的部分：顶部导航、上下文导航、文章卡片和克制的详情页布局。</p>
    `,
    coverImage: "https://picsum.photos/seed/editorial-blog/1400/800",
    publishedAt: "2026-04-17",
    readingTime: "8 分钟阅读",
    tags: ["设计", "博客", "前端"],
    featured: true
  },
  {
    id: "post-2",
    slug: "why-monorepos-fit-small-content-platforms",
    title: "为什么 Monorepo 比想象中更适合小型内容平台",
    summary:
      "当站点前台、后台、数据模型和共享契约放在同一个仓库里，小团队往往能更快迭代。",
    contentHtml: `
      <p>对于内容型产品来说，前台和后台之间的漂移通常是最大的浪费来源。Monorepo 可以更早地压缩这种漂移。</p>
      <h2>共享契约可以减少摩擦</h2>
      <p>当文章 schema、校验规则和状态枚举都集中在一处时，发布流程会更稳，也更容易继续演进。</p>
      <p>这不代表 Monorepo 一定更简单，而是意味着边界更容易被看见，也更容易被塑形。</p>
    `,
    coverImage: "https://picsum.photos/seed/monorepo/1400/800",
    publishedAt: "2026-04-14",
    readingTime: "6 分钟阅读",
    tags: ["架构", "monorepo", "工作流"]
  },
  {
    id: "post-3",
    slug: "rich-text-without-editorial-chaos",
    title: "如何在不失控的前提下接入富文本",
    summary:
      "如果编辑器和渲染器没有共享边界，富文本会很快破坏原本干净的阅读体验。",
    contentHtml: `
      <p>每个编辑器都会带来一种诱惑：支持更多块级元素、更多嵌入能力、更多布局例外。当前阶段应该克制住这种冲动。</p>
      <p>只支持一个受控的富文本子集，会更容易清洗、更容易渲染，也更容易在后续改版里维持一致性。</p>
    `,
    coverImage: "https://picsum.photos/seed/richtext/1400/800",
    publishedAt: "2026-04-10",
    readingTime: "5 分钟阅读",
    tags: ["编辑器", "内容", "产品"]
  }
];

export function getPostBySlug(slug: string) {
  return sitePosts.find((post) => post.slug === slug);
}
