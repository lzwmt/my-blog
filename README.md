# Personal Blog MVP

个人博客 MVP，包含两个应用：

- `apps/web`: Next.js 15 前台与 API
- `apps/admin`: Ant Design Pro 后台

数据层使用 Prisma + PostgreSQL，前后台共享类型和 schema 在 `packages/shared`。

## Quick Start

1. 安装依赖

```bash
pnpm install
```

2. 配置环境变量

```bash
cp .env.example .env
cp apps/admin/.env.example apps/admin/.env.local
cp apps/web/.env.example apps/web/.env.local
```

3. 准备数据库

```bash
pnpm prisma:generate
pnpm prisma:migrate:deploy
pnpm prisma:seed
```

4. 启动前台和后台

```bash
pnpm --filter web dev
pnpm --filter admin dev
```

前台默认地址：`http://localhost:3000`

后台默认地址：`http://localhost:8000`

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | 启动前台开发服务 |
| `pnpm --filter web dev` | 仅启动前台 |
| `pnpm --filter admin dev` | 仅启动后台 |
| `pnpm build` | 构建全部应用 |
| `pnpm lint` | 运行 ESLint |
| `pnpm test` | 运行共享单测和集成测试 |
| `pnpm test:e2e` | 运行 Playwright 冒烟测试 |
| `pnpm prisma:migrate:deploy` | 执行生产迁移 |
| `pnpm prisma:seed` | 写入初始管理员和站点数据 |

## Environment

根目录 `.env` / 生产环境变量：

- `DATABASE_URL`: Prisma 主连接串
- `DIRECT_URL`: Prisma 直连连接串
- `ADMIN_SESSION_SECRET`: 管理员 session 签名密钥
- `ADMIN_BOOTSTRAP_PASSWORD`: 首次登录引导密码
- `ADMIN_CORS_ORIGINS`: 允许访问后台 API 的后台站点 origin，多个值用逗号分隔

后台构建时环境变量：

- `UMI_APP_API_BASE_URL`: 后台请求 Next API 的基地址

可参考：

- [root env example](./.env.example)
- [root production env example](./.env.production.example)
- [admin env example](./apps/admin/.env.example)
- [admin production env example](./apps/admin/.env.production.example)
- [web env example](./apps/web/.env.example)

## Architecture

- 前台和 API 由 `apps/web` 提供，适合部署到 Next.js 兼容平台或常驻 Node 运行时
- 后台是独立静态管理台，构建产物来自 `apps/admin/dist`
- 管理员登录依赖 `blog_admin_session` cookie，因此后台域名和前台 API 域名应保持同站点部署，例如 `admin.example.com` 与 `www.example.com`

部署细节见：

- [First Launch Guide](./docs/deployment/first-launch.md)
- [ADR-001 Launch Topology](./docs/decisions/ADR-001-launch-topology.md)

准备正式上线时，优先按 `docs/deployment/first-launch.md` 中的“上线前准备清单”“推荐发布顺序”“上线后十分钟核验”执行。

## Verification

上线前至少执行：

```bash
pnpm lint
pnpm typecheck
pnpm test
PLAYWRIGHT_HEADLESS=false pnpm test:e2e
pnpm --filter web build
pnpm --filter admin build
```

说明：

- `apps/admin` 的 `pnpm typecheck` 已切到独立的类型检查配置，可直接执行，无需额外追加 `NODE_OPTIONS`
