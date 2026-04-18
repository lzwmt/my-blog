import Link from "next/link";

const sidebarLinks = [
  { href: "/", label: "首页" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" }
];

export function SidebarNav() {
  return (
    <aside className="sidebar-nav">
      <nav aria-label="分区导航" className="sidebar-nav__links">
        {sidebarLinks.map((link) => (
          <Link key={link.href} href={link.href} className="sidebar-nav__link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-nav__card">
        <p className="sidebar-nav__eyebrow">当前重点</p>
        <h2 className="sidebar-nav__title">先做出安静、好用、可上线的最小可用版本。</h2>
        <p className="sidebar-nav__copy">
          保留出版感，去掉社区化噪音，优先把写作与发布流程稳定下来。
        </p>
      </div>
    </aside>
  );
}
