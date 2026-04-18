import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { MOCK_POSTS, MOCK_TRENDING } from '../constants';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('relevant');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] gap-4 p-4">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Feed */}
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-4 mb-2">
            {['relevant', 'latest', 'top'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-2 text-base font-medium capitalize transition-all rounded-md",
                  activeTab === tab ? "bg-white text-text-main font-bold" : "text-text-muted hover:text-text-main"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-4">
            {MOCK_POSTS.map((post, idx) => (
              <motion.article 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={post.id} 
                className={cn(
                  "bg-white rounded-lg overflow-hidden border border-border-base group cursor-pointer transition-all hover:shadow-sm"
                )}
              >
                {idx === 0 && (
                  <Link to={`/post/${post.slug}`} className="block aspect-[21/9] overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}

                <div className="p-5 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <img className="w-6 h-6 rounded-full border border-border-base" src={post.author.avatar} alt={post.author.name} />
                    <div className="flex flex-col">
                      <h4 className="text-sm font-semibold leading-none text-text-main">{post.author.name}</h4>
                      <span className="text-xs text-text-muted">{post.publishedAt}</span>
                    </div>
                  </div>

                  <Link to={`/post/${post.slug}`} className="block group ml-8">
                    <h2 className={cn(
                      "font-extrabold mb-2 leading-tight group-hover:text-brand transition-colors",
                      idx === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                    )}>
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap gap-2 mb-4 ml-8 text-text-muted text-sm">
                    {post.tags.map(tag => (
                      <span key={tag} className="hover:text-text-main transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center ml-8">
                    <div className="flex items-center gap-4 text-text-muted">
                      <button className="flex items-center gap-1.5 hover:bg-bg-base px-2 py-1 rounded-md transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.reactions} <span className="hidden sm:inline">reactions</span></span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:bg-bg-base px-2 py-1 rounded-md transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">{post.commentsCount} <span className="hidden sm:inline">comments</span></span>
                      </button>
                    </div>
                    <span className="text-xs text-text-muted">{post.readingTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Trending */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-[72px] h-fit">
          <div className="bg-white rounded-lg shadow-sm border border-border-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border-base">
              <h3 className="font-bold text-lg text-text-main">Trending Posts</h3>
            </div>
            <div className="divide-y divide-border-base">
              {MOCK_TRENDING.map((trend) => (
                <Link 
                  key={trend.id} 
                  to={`/post/${trend.id}`}
                  className="block p-4 hover:bg-slate-50 transition-colors group"
                >
                  <p className="text-[15px] font-medium text-text-main group-hover:text-brand transition-colors mb-1 leading-snug">
                    {trend.title}
                  </p>
                  <span className="text-xs text-text-muted">{trend.commentsCount} comments</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-brand text-white rounded-lg p-5 border-none">
            <h3 className="font-bold text-lg mb-4 pb-3 border-b border-white/20">Join the Community</h3>
            <p className="text-sm leading-relaxed mb-4">
              Share your knowledge and grow your developer career with us.
            </p>
            <button className="w-full bg-white text-brand py-2 rounded-md font-bold text-sm hover:bg-white/90 transition-all">
              Create Account
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
