import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Bold, Italic, Link, List, ListOrdered, Code, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export const PostCreator: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write');
  const [content, setContent] = React.useState('');

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 w-full z-50 border-b border-border-base">
        <div className="flex justify-between items-center px-4 md:px-6 h-14 max-w-5xl mx-auto">
          <div className="flex items-center gap-6">
            <span className="text-xl font-black text-slate-900 tracking-tight">Create Post</span>
            <nav className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('write')}
                className={cn(
                  "font-label text-xs font-black uppercase tracking-widest transition-all py-1 px-2 rounded-md",
                  activeTab === 'write' ? "bg-brand/5 text-brand" : "text-slate-500 hover:text-brand"
                )}
              >
                Write
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "font-label text-xs font-black uppercase tracking-widest transition-all py-1 px-2 rounded-md",
                  activeTab === 'preview' ? "bg-brand/5 text-brand" : "text-slate-500 hover:text-brand"
                )}
              >
                Preview
              </button>
            </nav>
          </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-3 py-1.5 text-slate-500 font-label font-bold text-sm hover:bg-slate-100 transition-colors rounded-lg"
          >
            <X className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-10 py-8 space-y-8">
        {/* Cover Image Placeholder */}
        <div className="relative group cursor-pointer w-full h-48 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-brand transition-all">
          <div className="z-10 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-slate-400" />
            <span className="font-label text-xs font-black uppercase tracking-widest text-slate-400">Add a cover image</span>
          </div>
        </div>

        {/* Editor Section */}
        <div className="bg-white rounded-xl md:p-12 p-6 shadow-sm border border-border-base flex flex-col gap-6">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 placeholder:text-slate-200 resize-none overflow-hidden min-h-[60px]" 
            placeholder="New post title here..."
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-md border border-slate-100">
              <span className="font-label text-xs font-black text-brand">#</span>
              <input 
                className="bg-transparent border-none focus:ring-0 p-0 font-label text-sm text-slate-700 placeholder:text-slate-400 w-32" 
                placeholder="Add up to 4 tags..."
              />
            </div>
          </div>

          <div className="relative">
            {/* Minimal Toolbar */}
            <div className="sticky top-16 z-20 mb-4 flex items-center gap-1 p-1 bg-slate-900 rounded-lg shadow-xl w-max">
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><Bold className="w-4 h-4" /></button>
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><Italic className="w-4 h-4" /></button>
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><Link className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><List className="w-4 h-4" /></button>
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><Code className="w-4 h-4" /></button>
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
            </div>

            {activeTab === 'write' ? (
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-lg leading-relaxed font-sans text-slate-700 placeholder:text-slate-300 resize-none min-h-[500px]" 
                placeholder="Write your post content here using Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div className="prose prose-slate max-w-none min-h-[500px] text-slate-400 italic">
                {content || "Nothing to preview yet..."}
              </div>
            )}
          </div>
        </div>

        {/* Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          <div className="p-6 rounded-xl bg-brand/5 border border-brand/10">
            <h4 className="font-label text-xs font-black uppercase tracking-widest text-brand mb-3">Architect Tip</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Articles with distinct architectural diagrams receive <span className="font-bold text-brand">55% more engagement</span> from senior leads.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-100 border border-slate-200">
            <h4 className="font-label text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Markdown Support</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Use <code className="bg-white px-1 rounded">### Headline</code> and <code className="bg-white px-1 rounded">\`code\`</code> for rich formatting.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md z-40 border-t border-border-base">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-brand hover:bg-brand-hover text-white rounded-md font-bold text-sm shadow-md transition-all active:scale-95">
              Publish
            </button>
            <button className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-bold text-sm transition-colors">
              Save Draft
            </button>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-600" />
            <div className="w-px h-5 bg-border-base" />
            <span className="font-label text-[10px] font-bold uppercase tracking-widest">Auto-saved at 15:04</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
