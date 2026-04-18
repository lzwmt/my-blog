import { SidebarNav } from "@/src/components/public/SidebarNav";
import { SiteHeader } from "@/src/components/public/SiteHeader";
import { TrendingPanel } from "@/src/components/public/TrendingPanel";

interface PublicShellProps {
  children: JSX.Element | JSX.Element[];
  rightRail?: JSX.Element;
}

export function PublicShell({ children, rightRail }: PublicShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="public-shell">
        <div className="public-shell__grid">
          <SidebarNav />
          <div className="public-shell__content">{children}</div>
          {rightRail ?? <TrendingPanel />}
        </div>
      </main>
    </>
  );
}
