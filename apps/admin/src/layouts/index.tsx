import { useEffect, useState, type ReactNode } from "react";
import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  TagsOutlined
} from "@ant-design/icons";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import type { AdminUser } from "@blog/shared/admin";
import { Avatar, Dropdown, Spin } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminContentService } from "@/services/content";

const menuItems = [
  {
    path: "/dashboard",
    name: "仪表盘",
    icon: <DashboardOutlined />
  },
  {
    path: "/posts",
    name: "文章管理",
    icon: <FileTextOutlined />
  },
  {
    path: "/tags",
    name: "标签管理",
    icon: <TagsOutlined />
  },
  {
    path: "/site-settings",
    name: "站点设置",
    icon: <SettingOutlined />
  }
];

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") {
    return "仪表盘";
  }

  if (pathname === "/posts") {
    return "文章管理";
  }

  if (pathname === "/posts/new") {
    return "新建文章";
  }

  if (pathname.startsWith("/posts/")) {
    return "编辑文章";
  }

  if (pathname === "/site-settings") {
    return "站点设置";
  }

  if (pathname === "/tags") {
    return "标签管理";
  }

  return "管理后台";
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginRoute = location.pathname === "/login";
  const [session, setSession] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(!isLoginRoute);

  useEffect(() => {
    if (isLoginRoute) {
      return;
    }

    let active = true;

    void adminContentService
      .getSession()
      .then((admin) => {
        if (!active) {
          return;
        }

        setSession(admin);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setSession(null);
        navigate(`/login?next=${encodeURIComponent(location.pathname)}`, {
          replace: true
        });
      })
      .finally(() => {
        if (active) {
          setAuthLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isLoginRoute, location.pathname, navigate]);

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (authLoading) {
    return (
      <div className="admin-auth-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ProLayout
      title="个人博客后台"
      logo={false}
      location={{ pathname: location.pathname }}
      route={{ routes: menuItems }}
      menuItemRender={(
        item: { path?: string },
        dom: ReactNode
      ) => <Link to={item.path || "/dashboard"}>{dom}</Link>}
      avatarProps={{
        src: "https://picsum.photos/seed/admin-avatar/80/80",
        size: "small",
        title: session?.username ?? "管理员",
        render: (_: unknown, avatarDom: ReactNode) => (
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                if (key !== "logout") {
                  return;
                }

                void adminContentService.logout().finally(() => {
                  setSession(null);
                  navigate("/login", { replace: true });
                });
              },
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "退出登录"
                }
              ]
            }}
          >
            {avatarDom}
          </Dropdown>
        )
      }}
      headerTitleRender={(_: ReactNode, title: ReactNode) => (
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            shape="square"
            style={{ background: "#1677ff", fontWeight: 700 }}
            size={32}
          >
            PB
          </Avatar>
          <span>{title}</span>
        </Link>
      )}
    >
      <PageContainer
        title={getPageTitle(location.pathname)}
        content="当前后台使用基于 Cookie 的会话鉴权，受保护页面和管理接口共享同一登录边界。"
      >
        <Outlet />
      </PageContainer>
    </ProLayout>
  );
}
