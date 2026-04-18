import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_POSTS } from '../constants';
import { Heart, Bookmark, MessageSquare, Share2, MoreHorizontal, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // In a real app, find by slug. For now, we'll use the first one or default.
  const post = MOCK_POSTS.find(p => p.slug === slug) || MOCK_POSTS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 lg:py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sticky Toolbar */}
        <aside className="hidden md:block w-16">
          <div className="sticky top-24 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                <Heart className="w-6 h-6" />
              </div>
              <span className="font-label text-xs font-bold text-slate-500">{post.reactions}</span>
            </div>

            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-brand/5 text-slate-500 hover:text-brand transition-all border border-transparent hover:border-brand/10">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-label text-xs font-bold text-slate-500">82</span>
            </div>

            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                <Bookmark className="w-6 h-6" />
              </div>
              <span className="font-label text-xs font-bold text-slate-500">112</span>
            </div>

            <div className="w-8 h-px bg-border-base" />

            <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-all cursor-pointer">
              <MoreHorizontal className="w-6 h-6" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          <article className="bg-white rounded-lg shadow-sm border border-border-base overflow-hidden">
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="px-5 md:px-16 py-8 md:py-12">
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-10 h-10 rounded-full border border-border-base"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-text-main leading-tight">{post.author.name}</span>
                  <span className="text-xs text-text-muted">Posted on {post.publishedAt} • {post.readingTime}</span>
                </div>
              </div>

              <h1 className="font-extrabold text-3xl md:text-5xl lg:text-[48px] text-text-main leading-[1.2] tracking-tight mb-8">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.map(tag => (
                  <span key={tag} className="text-sm px-3 py-1 bg-bg-base border border-border-base rounded-md text-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* simulated markdown spacing */}
              <div className="prose prose-slate max-w-none text-text-main leading-relaxed space-y-6">
                <p className="text-xl leading-relaxed text-text-muted italic border-l-4 border-brand pl-6 my-8">
                   "Design is not just what it looks like and feels like. Design is how it works under the hood of a complex browser engine."
                </p>
                
                <h2 className="text-2xl font-bold text-text-main mt-10">The Atmospheric Flow Principle</h2>
                <p className="text-text-main">
                  When building technical publications, we often fall into the trap of rigid containers. By leveraging subgrid, we can maintain alignment across disparate nested components—allowing our typography to breathe while keeping our structural integrity intact.
                </p>
                
                <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm overflow-x-auto my-8 border-l-4 border-brand">
                  <pre>{`.main-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.article-container {
  grid-column: 2 / 11;
  display: grid;
  grid-template-columns: subgrid;
}`}</pre>
                </div>

                <p>
                  This approach allows us to break the grid purposefully. Notice how our asymmetrical headlines pull the reader's eye through the narrative without the need for visual separators like borders. We rely on <em>whitespace as a structural element</em>.
                </p>

                <h2 className="text-2xl font-black text-slate-900 mt-10">Implementing Editorial Scales</h2>
                <p>
                  The contrast between <strong>Inter</strong> for authority and <strong>Space Grotesk</strong> for technical metadata creates a hierarchy that feels both premium and developer-centric. It tells the reader that they are in a space where technicality meets high-end craftsmanship.
                </p>
              </div>

              <section className="mt-20 pt-10 border-t border-border-base">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-2xl">Discussion ({post.commentsCount})</h3>
                  <button className="font-label text-sm font-bold text-brand hover:underline">Subscribe</button>
                </div>

                <div className="flex gap-4 mb-10">
                  <img 
                    src="https://picsum.photos/seed/user/100/100" 
                    className="w-10 h-10 rounded-full border border-border-base" 
                    alt="Current user" 
                  />
                  <div className="flex-1">
                    <textarea 
                      className="w-full bg-slate-50 border border-border-base rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-brand/20 transition-all min-h-[120px]" 
                      placeholder="Add to the discussion..."
                    />
                    <div className="mt-3 flex gap-2">
                       <button className="bg-brand text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm active:scale-95">Submit</button>
                       <button className="text-slate-500 font-bold px-4 py-2 text-sm hover:text-slate-700">Preview</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>

        {/* Right Sidebar - Author Card */}
        <aside className="hidden lg:block w-80">
          <div className="sticky top-20 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border-base border-t-4 border-brand">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={post.author.avatar} 
                  className="w-12 h-12 rounded-full border border-border-base" 
                  alt={post.author.name} 
                />
                <span className="font-black text-lg text-slate-900">{post.author.name}</span>
              </div>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                 {post.author.bio}
              </p>
              <button className="w-full bg-brand text-white py-2.5 rounded-md font-bold mb-4 hover:bg-brand-hover transition-colors shadow-sm active:scale-95">
                Follow
              </button>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-label text-[10px] uppercase tracking-widest text-slate-400 font-bold">Location</span>
                  <span className="text-xs font-bold text-slate-700">{post.author.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label text-[10px] uppercase tracking-widest text-slate-400 font-bold">Joined</span>
                  <span className="text-xs font-bold text-slate-700">{post.author.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-border-base">
              <h4 className="font-black text-lg mb-4">More from {post.author.name.split(' ')[0]}</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="#" className="group">
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-2">Micro-interactions in Developer Tools</span>
                    <span className="text-xs text-slate-400 font-label">#ux #tooling</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="group">
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-2">Why Your Code Sandbox Feels Slow</span>
                    <span className="text-xs text-slate-400 font-label">#performance</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
