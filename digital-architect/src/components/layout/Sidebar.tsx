import React from 'react';
import { Home, Tag, Info, Bookmark, Settings, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, children, active }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-[15px] font-normal",
      active 
        ? "bg-brand/10 text-brand font-semibold" 
        : "text-text-muted hover:bg-brand/5 hover:text-brand"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-brand" : "text-text-muted group-hover:text-brand")} />
    <span>{children}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col gap-8 h-[calc(100vh-3.5rem)] sticky top-[56px] py-4">
      <nav className="flex flex-col gap-1">
        <SidebarLink to="/" icon={Home} active={location.pathname === '/'}>Home</SidebarLink>
        <SidebarLink to="/tags" icon={Tag} active={location.pathname === '/tags'}>Tags</SidebarLink>
        <SidebarLink to="/podcasts" icon={Info} active={location.pathname === '/podcasts'}>Podcasts</SidebarLink>
        <SidebarLink to="/videos" icon={Bookmark} active={location.pathname === '/videos'}>Videos</SidebarLink>
        <SidebarLink to="/about" icon={Info} active={location.pathname === '/about'}>About</SidebarLink>
        <SidebarLink to="/dashboard" icon={Settings} active={location.pathname === '/dashboard'}>Dashboard</SidebarLink>
      </nav>

      <div className="p-4 bg-brand/5 rounded-xl border border-brand/10 group cursor-pointer hover:bg-brand/10 transition-colors">
        <div className="flex items-center gap-2 text-brand font-bold text-sm mb-1 uppercase tracking-tight">
          <ArrowUpCircle className="w-4 h-4" />
          <span>Go Pro</span>
        </div>
        <p className="text-xs text-slate-600 leading-tight">
          Get advanced architecture insights & premium templates.
        </p>
        <button className="mt-3 w-full bg-brand text-white py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
          Upgrade
        </button>
      </div>

      <nav className="mt-auto space-y-1">
        <SidebarLink to="/settings" icon={Settings} active={location.pathname === '/settings'}>Settings</SidebarLink>
      </nav>
    </aside>
  );
};
