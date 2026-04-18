import { Post, Author, TrendingPost } from './types';

export const MOCK_AUTHOR: Author = {
  id: '1',
  name: 'Marcus Verro',
  avatar: 'https://picsum.photos/seed/marcus/100/100',
  bio: 'Senior Systems Architect at Vercel. Obsessed with high-performance UI and the philosophy of technical writing.',
  location: 'San Francisco',
  joinedDate: 'Aug 12, 2021',
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    slug: 'architects-guide-to-distributed-system-resilience',
    title: "The Architect's Guide to Distributed System Resilience",
    excerpt: 'As digital architects, we are constantly navigating the tension between creative vision and technical constraints...',
    content: `As digital architects, we are constantly navigating the tension between creative vision and technical constraints. The evolution of CSS Grid has been a watershed moment, but the introduction of **subgrid** is where the true revolution begins for editorial-style layouts.

> "Design is not just what it looks like and feels like. Design is how it works under the hood of a complex browser engine."

## The Atmospheric Flow Principle

When building technical publications, we often fall into the trap of rigid containers. By leveraging subgrid, we can maintain alignment across disparate nested components—allowing our typography to breathe while keeping our structural integrity intact.

\`\`\`css
.main-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.article-container {
  grid-column: 2 / 11;
  display: grid;
  grid-template-columns: subgrid;
}
\`\`\`

This approach allows us to break the grid purposefully. Notice how our asymmetrical headlines pull the reader's eye through the narrative without the need for visual separators like borders. We rely on *whitespace as a structural element*.`,
    author: MOCK_AUTHOR,
    publishedAt: 'Oct 24 (2 days ago)',
    coverImage: 'https://picsum.photos/seed/code1/1200/600',
    tags: ['distributed', 'architecture', 'backend'],
    readingTime: '12 min read',
    reactions: 124,
    commentsCount: 18,
  },
  {
    id: '2',
    slug: 'rethinking-state-management-2024',
    title: 'Rethinking State Management in 2024',
    excerpt: 'Is Redux still relevant? Or has the world moved on to signals and atomic state libraries?',
    content: 'Full content here...',
    author: {
       ...MOCK_AUTHOR,
       name: 'Sarah Chen',
       avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    publishedAt: 'Oct 23',
    coverImage: 'https://picsum.photos/seed/tech2/1200/600',
    tags: ['frontend', 'react'],
    readingTime: '8 min read',
    reactions: 45,
    commentsCount: 5,
  },
  {
    id: '3',
    slug: 'switching-microservices-to-monolith',
    title: 'Why We Switched From Microservices to a Monolith',
    excerpt: 'Sometimes less is more. How we simplified our stack and improved developer velocity.',
    content: 'Full content here...',
    author: {
       ...MOCK_AUTHOR,
       name: 'Alex Rivera',
       avatar: 'https://picsum.photos/seed/alex/100/100',
    },
    publishedAt: 'Oct 22',
    coverImage: 'https://picsum.photos/seed/cloud3/1200/600',
    tags: ['devops', 'infrastructure'],
    readingTime: '15 min read',
    reactions: 210,
    commentsCount: 34,
  }
];

export const MOCK_TRENDING: TrendingPost[] = [
  { id: '1', title: 'Is Web3 actually dead or just hibernating for architects?', commentsCount: 42 },
  { id: '2', title: 'Comparing Rust vs Go for high-concurrency cloud native apps', commentsCount: 89 },
  { id: '3', title: 'The true cost of serverless at scale', commentsCount: 156 },
  { id: '4', title: 'New CSS features every architect should know', commentsCount: 31 },
];
