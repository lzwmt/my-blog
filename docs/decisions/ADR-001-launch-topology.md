# ADR-001: Use Split Deployment for First Launch

## Status

Accepted

## Date

2026-04-18

## Context

当前仓库是一个 monorepo，但运行形态不是单一应用：

- `apps/web` 是 Next.js 前台，同时承载公开 API 和管理员认证 API
- `apps/admin` 是 Umi / Ant Design Pro 后台，构建后是静态资源
- 管理员认证依赖 `apps/web` 设置的 cookie，后台只是 API 消费者

MVP 的目标是优先快速上线，而不是把前后台重新封装成单一进程或网关。

## Decision

首发部署采用拆分拓扑：

- `apps/web` 部署到支持 Next.js 运行时的平台
- `apps/admin` 部署到静态站点平台
- 两者共享同一个 PostgreSQL 数据库
- 后台调用前台 API，`UMI_APP_API_BASE_URL` 指向 `apps/web` 的 `/api`

域名约束：

- 后台与前台 API 保持同站点，例如 `admin.example.com` 和 `www.example.com`

## Alternatives Considered

### 将后台并入 Next.js

- Pros: 单站点单部署，认证与路由集中
- Cons: 需要重做 Umi / Ant Design Pro 结构，超出 MVP 收敛范围

Rejected，因为会显著拖慢上线时间。

### 后台和前台分别部署到完全不同主域名

- Pros: 拆分彻底，部署独立性更强
- Cons: 当前 `SameSite=Lax` session cookie 下，跨站点 API 调用会带来登录态问题

Rejected，因为会让管理员登录链路在浏览器中不稳定。

### 单独再做一个后台 API 服务

- Pros: 前后台后端职责清晰
- Cons: 增加第三个可部署单元，与 MVP 的快速上线目标相冲突

Rejected，因为运维与代码复杂度都上升。

## Consequences

- 前台上线与后台上线可以独立回滚
- 后台必须显式配置 `UMI_APP_API_BASE_URL`
- 生产环境必须正确设置 `ADMIN_CORS_ORIGINS`
- 域名规划需要满足同站点 cookie 约束
