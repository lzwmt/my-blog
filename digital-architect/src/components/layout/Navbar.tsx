import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-border-base">
      <div className="flex justify-between items-center px-4 md:px-6 h-[56px] max-w-[1024px] lg:max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="bg-[#171717] text-white px-2 py-1.5 rounded-md font-black text-lg tracking-tighter whitespace-nowrap">
            DIGITAL
          </Link>
          
          <div className="hidden md:flex flex-1 max-w-[400px] ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input 
                className="w-full bg-bg-base border border-border-base h-9 pl-10 pr-4 rounded-md focus:bg-white focus:ring-1 focus:ring-brand focus:outline-none text-sm transition-all" 
                placeholder="Search..." 
                type="text"
              />
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 mx-8 whitespace-nowrap">
          <Link to="/" className="text-text-main font-bold">Explore</Link>
          <Link to="/reading-list" className="text-text-muted hover:text-brand transition-colors font-medium">Reading List</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => navigate('/new')}
            className="hidden sm:block btn bg-brand border-2 border-brand hover:bg-brand-hover hover:border-brand-hover text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm"
          >
            Create Post
          </button>
          
          <button className="p-2 text-text-muted hover:bg-bg-base rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <Link to="/dashboard" className="h-[32px] w-[32px] rounded-full overflow-hidden border border-border-base cursor-pointer">
            <img 
              alt="Profile" 
              src="https://picsum.photos/seed/author/100/100" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </Link>
          
          <button className="md:hidden p-2 text-text-muted">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
