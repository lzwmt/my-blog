# First Launch Guide

## 目标部署形态

首发建议采用最小拆分：

- `apps/web`: 部署到 Next.js 兼容平台，负责前台页面和 `/api/*`
- `apps/admin`: 构建为静态资源，部署到静态站点平台
- PostgreSQL: 托管数据库，当前项目已按 Supabase/Postgres 方案实现

推荐域名形态：

- 前台：`https://www.example.com`
- 后台：`https://admin.example.com`

这样后台请求前台 API 时仍属于同站点上下文，管理员 cookie 不会因为 `SameSite=Lax` 被浏览器拦掉。

## 环境变量

### Web 运行时

在 `apps/web` 所在服务上配置：

| Variable | Required | 用途 |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Prisma 主连接 |
| `DIRECT_URL` | Yes | Prisma migration / direct 连接 |
| `ADMIN_SESSION_SECRET` | Yes | 管理员 session 签名 |
| `ADMIN_BOOTSTRAP_PASSWORD` | Yes | 首次管理员登录引导密码 |
| `ADMIN_CORS_ORIGINS` | Yes | 允许后台调用 API 的 origin 列表 |

示例：

```env
DATABASE_URL="postgresql://user:password@prod-host:5432/personal_blog_prod?schema=public"
DIRECT_URL="postgresql://user:password@prod-host:5432/personal_blog_prod?schema=public"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
ADMIN_BOOTSTRAP_PASSWORD="replace-with-initial-admin-password"
ADMIN_CORS_ORIGINS="https://admin.example.com"
```

准备建议：

- `DATABASE_URL` 和 `DIRECT_URL` 优先使用同一套生产库连接串，先确认数据库实例、白名单和 SSL 要求已配置完成
- `ADMIN_SESSION_SECRET` 使用长度至少 32 字节的随机值，例如执行 `openssl rand -base64 32`
- `ADMIN_BOOTSTRAP_PASSWORD` 仅用于首发管理员引导登录，首发后应立即进入后台修改为正式密码
- `ADMIN_CORS_ORIGINS` 必须只填写真实后台域名，不要使用 `*`

### Admin 构建时

在后台静态站点构建环境配置：

| Variable | Required | 用途 |
| --- | --- | --- |
| `UMI_APP_API_BASE_URL` | Yes | 指向前台 Next API 基地址 |

示例：

```env
UMI_APP_API_BASE_URL="https://www.example.com/api"
```

## 上线前准备清单

发布前先确认这些前置条件已经就绪：

- 前台域名和后台域名已经规划为同站点，例如 `www.example.com` 与 `admin.example.com`
- 前台域名已完成 DNS、SSL 和回源配置
- 后台静态站点域名已完成 DNS、SSL 和构建环境变量配置
- 生产数据库已创建，且 Prisma 所需账号具备迁移权限
- 生产环境变量已填入真实值，没有占位符
- 已保留上一个可回滚版本的构建产物或平台发布记录
- 已准备基础监控入口，至少能看到部署日志、运行日志和接口报错

## 首次上线步骤

1. 安装依赖

```bash
pnpm install
```

2. 生成 Prisma Client

```bash
pnpm prisma:generate
```

3. 执行数据库迁移

```bash
pnpm prisma:migrate:deploy
```

4. 初始化数据

```bash
pnpm prisma:seed
```

5. 构建前台

```bash
pnpm --filter web build
```

6. 构建后台

```bash
pnpm --filter admin build
```

7. 部署 `apps/web`

- 需要支持 Next.js 运行时
- 对外暴露前台页面和 `/api/*`

8. 部署 `apps/admin/dist`

- 部署为静态站点
- 配置构建变量 `UMI_APP_API_BASE_URL`

## 推荐发布顺序

为了降低首发风险，按这个顺序执行：

1. 在生产平台写入 `apps/web` 运行时环境变量
2. 执行 `pnpm prisma:generate`
3. 执行 `pnpm prisma:migrate:deploy`
4. 执行 `pnpm prisma:seed`
5. 部署 `apps/web`
6. 先验证 `https://www.example.com/api/health`
7. 再部署 `apps/admin/dist`
8. 使用管理员账号完成一次真实登录
9. 在后台检查文章列表、标签列表、站点设置是否正常加载
10. 最后验证前台首页、文章列表和文章详情

## 上线前检查

本地或预发环境执行：

```bash
pnpm lint
pnpm test
PLAYWRIGHT_HEADLESS=false pnpm test:e2e
pnpm --filter web build
pnpm --filter admin build
```

手动检查：

- `GET https://www.example.com/api/health` 返回 `200`
- `GET https://www.example.com/api/public/posts` 返回 `200`
- `GET https://www.example.com/api/auth/session` 在无 cookie 时返回 `401`
- 后台可登录并进入 `/dashboard`
- 后台新建并发布文章后，前台可访问文章详情

## 上线后十分钟核验

发布完成后，前 10 分钟至少做这组冒烟检查：

- 打开前台首页，确认首屏正常渲染且无明显样式错乱
- 打开文章列表页和一篇已发布文章详情页，确认内容可读
- 打开后台登录页，使用管理员账号登录并进入仪表盘
- 在后台打开文章列表、标签管理、站点设置，确认接口均返回成功
- 访问 `https://www.example.com/api/health`，确认 `ok` 为 `true`
- 检查部署平台日志，确认没有持续性 `5xx`、Prisma 连接错误或鉴权异常

## 首小时监控

重点观察：

- 前台首页和文章详情是否正常返回
- 管理员登录是否稳定
- `POST /api/auth/login`、`GET /api/auth/session`、`POST /api/admin/posts` 是否出现 4xx/5xx 异常上升
- 数据库连接错误和 Prisma 运行时错误

## 回滚策略

如果上线后出现问题，按这个顺序回退：

1. 先回退 `apps/admin` 静态站点到上一个稳定版本
2. 再回退 `apps/web` 到上一个稳定版本
3. 如果问题来自迁移，停止写入流量，评估数据回滚，不要直接盲目回退数据库

建议立即回滚的触发条件：

- `https://www.example.com/api/health` 连续异常或长时间不返回 `200`
- 管理员无法稳定登录后台
- 前台首页或文章详情持续报错
- 出现持续性的 Prisma 连接错误、数据库鉴权错误或大量 `5xx`
- 发布后数据写入异常，例如新建文章后前后台读取不一致

## 已知事项

- `apps/admin` 的独立 `pnpm typecheck` 使用专门的类型检查配置，可直接执行：

```bash
pnpm typecheck
```

- 管理员 session cookie 当前为 `SameSite=Lax`，因此后台和前台 API 需要同站点部署，不适合完全不同主域名直接互调
