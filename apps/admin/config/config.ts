import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  esbuildMinifyIIFE: true,
  model: {},
  initialState: {},
  routes: [
    {
      path: "/login",
      component: "@/pages/Login"
    },
    {
      path: "/",
      redirect: "/dashboard"
    },
    {
      path: "/dashboard",
      component: "@/pages/Dashboard"
    },
    {
      path: "/posts",
      component: "@/pages/Posts"
    },
    {
      path: "/posts/new",
      component: "@/pages/PostEditor"
    },
    {
      path: "/posts/:id",
      component: "@/pages/PostEditor"
    },
    {
      path: "/tags",
      component: "@/pages/Tags"
    },
    {
      path: "/site-settings",
      component: "@/pages/SiteSettings"
    }
  ]
});
