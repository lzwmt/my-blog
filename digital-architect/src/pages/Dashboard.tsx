import React from 'react';
import { MOCK_POSTS } from '../constants';
import { LayoutGrid, Heart, Users, Eye, Search, MoreVertical, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-10">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-text-main tracking-tighter mb-2">Dashboard</h1>
        <p className="text-text-muted text-xs uppercase tracking-widest font-bold">Performance Overview & Content Management</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Post Views', value: '124.8k', change: '+12% from last month', icon: Eye },
          { label: 'Total Reactions', value: '8.2k', change: '+5.4% from last month', icon: Heart },
          { label: 'Total Followers', value: '1,492', change: '+230 new this week', icon: Users },
        ].map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-lg shadow-sm border border-border-base border-t-4 border-brand"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted text-[10px] uppercase tracking-widest font-black">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-brand" />
            </div>
            <div className="text-3xl font-extrabold text-text-main">{stat.value}</div>
            <p className="text-brand text-xs font-bold mt-2">{stat.change}</p>
          </motion.div>
        ))}
      </section>

      {/* Posts Table */}
      <section className="bg-white rounded-lg shadow-sm border border-border-base overflow-hidden">
        <div className="px-6 py-5 flex justify-between items-center bg-bg-base/50 border-b border-border-base">
          <h2 className="text-lg font-bold text-text-main">Recent Posts</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input 
              className="pl-10 pr-4 py-1.5 bg-white border border-border-base rounded-md text-sm focus:ring-1 focus:ring-brand w-48 md:w-64 transition-all outline-none" 
              placeholder="Filter posts..." 
              type="text"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto whitespace-nowrap">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-base/30 uppercase tracking-widest text-[10px] font-black text-text-muted">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Date Published</th>
                <th className="px-6 py-4 text-center">Stats</th>
                <th className="px-6 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {MOCK_POSTS.map((post) => (
                <tr key={post.id} className="hover:bg-bg-base/20 group transition-colors">
                  <td className="px-6 py-4 max-w-xs md:max-w-md">
                    <div className="font-bold text-text-main truncate mb-1">{post.title}</div>
                    <div className="flex gap-2">
                       {post.tags.slice(0, 2).map((tag) => (
                         <span key={tag} className="text-[10px] text-text-muted">#{tag}</span>
                       ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted font-label">{post.publishedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-text-main">{post.reactions}</span>
                        <Heart className="w-3 h-3 text-text-muted" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-text-main">{post.commentsCount}</span>
                        <MessageSquare className="w-3 h-3 text-text-muted" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-md transition-all border border-transparent hover:border-border-base">
                      <MoreVertical className="w-4 h-4 text-text-muted hover:text-brand" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-border-base flex justify-between items-center bg-bg-base/50">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Showing 3 of 24 posts</span>
          <div className="flex gap-2">
            <button className="p-1 px-3 bg-white border border-border-base rounded text-xs hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 px-3 bg-brand text-white rounded text-xs hover:bg-brand-hover transition-colors font-bold">
              Next
            </button>
          </div>
        </div>
      </section>
      
      <footer className="mt-20 py-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Digital Architect Lab © 2024</p>
        <div className="flex justify-center gap-6 mt-4">
          <button className="text-[10px] font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">Settings</button>
          <button className="text-[10px] font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">Support</button>
          <button className="text-[10px] font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">Terms</button>
        </div>
      </footer>
    </div>
  );
};
