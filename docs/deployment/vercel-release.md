# Vercel Release Guide

## 当前状态

- `apps/web` 已经通过 Vercel CLI 绑定到项目 `lzwmts-projects/my-blog-web`
- 仓库根目录 `.vercel/project.json` 当前指向 `my-blog-web`
- `apps/web` 当前可直接从仓库根目录执行预览部署和生产部署
- `apps/admin` 还没有进入可直接命令行生产发布状态

## Web 项目命令

在仓库根目录执行：

```bash
pnpm deploy:web:preview
pnpm deploy:web:prod
```

等价原始命令：

```bash
pnpm exec vercel --yes
pnpm exec vercel --prod --yes
```

## Web 生产发布前置条件

在 `my-blog-web` 的 Production 环境至少要配置这些变量：

```env
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...:5432/postgres
ADMIN_SESSION_SECRET=一个长度至少 32 字节的随机字符串
ADMIN_BOOTSTRAP_PASSWORD=首次后台登录密码
ADMIN_CORS_ORIGINS=https://admin.example.com
```

说明：

- `DATABASE_URL` 使用 Supabase 的连接池连接串
- `DIRECT_URL` 使用 Supabase 的 Prisma 迁移直连串
- `ADMIN_CORS_ORIGINS` 必须填写后台正式域名
- 如果还没有后台正式域名，不要执行 `pnpm deploy:web:prod`

## Web 正式发布顺序

1. 在 Vercel `my-blog-web` 项目写入 Production 环境变量
2. 在本地对生产库执行：

```bash
pnpm prisma:generate
pnpm prisma:migrate:deploy
```

3. 执行生产发布：

```bash
pnpm deploy:web:prod
```

4. 发布完成后校验：

```bash
pnpm exec vercel curl /api/health --deployment <生产域名或部署 URL>
```

## 当前阻塞项

正式发布还缺这两项：

- `my-blog-web` 的 Production 环境变量当前还是空的
- `apps/admin` 还没有完成正式域名与独立生产项目配置

## Admin 项目说明

当前后台仍建议按独立项目部署，但不要直接复用 `vercel.app` 域名做最终生产后台地址。

原因：

- 管理员登录依赖同站点 cookie
- 最终应采用 `www.example.com` 与 `admin.example.com` 这类同站点域名

在没有后台正式域名前，`web` 的生产发布链路只能算“前台/API 可发”，不能算“整站正式上线完成”。
