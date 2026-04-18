export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  location?: string;
  joinedDate: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  readingTime: string;
  reactions: number;
  commentsCount: number;
}

export interface TrendingPost {
  id: string;
  title: string;
  commentsCount: number;
}
