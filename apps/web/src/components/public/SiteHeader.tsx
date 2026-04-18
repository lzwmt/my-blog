import Link from "next/link";

const primaryLinks = [
  { href: "/", label: "首页" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <Link href="/" className="site-logo">
            博客
          </Link>
          <div className="site-search">
            <span className="site-search__icon" aria-hidden="true">
              /
            </span>
            <input
              id="site-search-placeholder"
              aria-label="搜索占位输入框"
              className="site-search__input"
              name="site-search-placeholder"
              placeholder="搜索功能将在后续版本接入"
              readOnly
            />
          </div>
        </div>

        <nav className="site-header__nav" aria-label="主导航">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-header__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
