import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人博客",
  description: "个人博客 MVP 前台站点",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
