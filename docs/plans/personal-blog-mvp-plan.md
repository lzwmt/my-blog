# Plan: Personal Blog Website MVP

## Plan Objective
基于已确认的 MVP 规格，给出可执行的技术实施顺序，优先完成“后台发布内容 -> 前台可访问”的最短上线链路。

## Recommended Defaults
- Database type: PostgreSQL
- Database provider: Supabase
- Development database: Supabase isolated dev database
- Production database: Supabase isolated prod database
- Deployment target:
  - Web: Vercel
  - Admin: Vercel
  - Database: Supabase hosted Postgres
- Content editor: controlled rich text editor with HTML output

## Major Components
### 1. Workspace and shared foundation
- monorepo 基础结构
- `apps/web`
- `apps/admin`
- `packages/shared`
- 根目录脚本、lint、typecheck、test 配置

依赖关系：
- 所有后续模块都依赖这一层

### 2. Data layer
- Prisma schema
- `Post` / `Tag` / `SiteSetting` / `AdminUser` 数据模型
- migration 策略
- seed 数据

依赖关系：
- API、后台、前台查询都依赖这一层

### 3. Shared contracts
- Zod schema
- DTO 和表单类型
- 发布状态枚举
- 富文本内容字段约束

依赖关系：
- API 输入输出和前后台表单共享这一层

### 4. Backend capability
- Next.js Route Handlers 或 server-side API layer
- 管理员认证
- 文章 CRUD
- 标签 CRUD
- 站点设置读写
- 前台公开查询接口

依赖关系：
- 依赖 data layer 和 shared contracts

### 5. Admin app
- 登录页
- 仪表盘
- 文章管理页
- 标签管理页
- 站点设置页

依赖关系：
- 依赖 backend capability

### 6. Public web app
- 首页
- 文章列表页
- 文章详情页
- 标签聚合页
- 关于页
- SEO 元信息

依赖关系：
- 依赖 backend capability 和 site settings

### 7. Verification and shipping
- 单元测试
- 集成测试
- E2E 冒烟测试
- 部署配置

依赖关系：
- 依赖核心功能完成后接入

## Implementation Order
### Phase A: Foundation
1. 初始化 monorepo、Node/PNPM、基础工程脚本
2. 创建 `web`、`admin`、`shared` 三个工作区
3. 建立统一 TypeScript、ESLint、Prettier、环境变量约定
4. 预留开发库和生产库的环境变量隔离方案

为什么先做：
- 这是所有代码落地的基础，后续可以避免双应用配置分裂

### Phase B: Data and contracts
1. 定义 Prisma schema
2. 定义共享类型和 Zod schema
3. 建立 seed 数据和最小数据库访问封装

为什么第二步做：
- 内容模型不稳定，后续 UI 和 API 都会反复返工

### Phase C: Authentication and core API
1. 实现单管理员登录
2. 实现后台鉴权
3. 实现文章 CRUD 和发布状态流转
4. 实现标签和站点设置 API
5. 实现前台公开读取 API

为什么第三步做：
- 这是 MVP 最核心的业务闭环

### Phase D: Admin MVP
1. 登录页
2. 仪表盘
3. 文章列表和编辑页
4. 标签管理页
5. 站点设置页

为什么在前台前完成：
- 先保证“内容能被管理”，再做展示，效率更高

### Phase E: Web MVP
1. 首页
2. 文章列表页
3. 文章详情页
4. 标签聚合页
5. 关于页
6. SEO 配置

### Phase F: Quality and deployment
1. 单元测试覆盖 slug、校验、状态机
2. 集成测试覆盖发布逻辑
3. E2E 覆盖后台发文到前台可访问
4. 配置部署环境并完成首次上线

## Risks and Mitigations
### Risk 1: Ant Design Pro and Next.js API integration complexity
- 风险：后台是独立应用，和前台共用 API 契约时容易分叉
- 缓解：共享 schema 和 DTO，后台只消费统一 API client

### Risk 2: Rich text content safety
- 风险：富文本内容可能引入 XSS、样式污染、渲染不一致
- 缓解：限制编辑器能力范围，保存前清洗内容，前台渲染白名单化

### Risk 3: Overbuilding the MVP
- 风险：在编辑器、SEO、设计系统上投入过多，拖慢上线
- 缓解：先用基础富文本和基础 SEO，只做最小上线闭环

### Risk 4: Auth implementation sprawl
- 风险：如果过早做复杂权限系统，会偏离 MVP
- 缓解：仅做单管理员登录和受保护后台路由

## Parallel vs Sequential Work
### Must be sequential
- monorepo 初始化 -> 数据模型 -> 认证/API -> 后台/前台接入

### Can be parallel after API contracts stabilize
- 后台页面开发
- 前台页面开发
- 单元测试补齐

## Verification Checkpoints
### Checkpoint 1: Foundation ready
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- 两个应用都能本地启动

### Checkpoint 2: Data layer ready
- migration 可执行
- seed 可执行
- Prisma client 可正常读写
- 开发环境成功连接云开发数据库

### Checkpoint 3: Core API ready
- 管理员可以登录
- 文章可以创建、保存草稿、发布、下线
- 未发布文章无法被公开查询

### Checkpoint 4: Admin ready
- 后台可完成完整发文流程

### Checkpoint 5: Web ready
- 前台可读取并展示已发布内容

### Checkpoint 6: Release ready
- `pnpm build` 成功
- 至少 1 条端到端冒烟测试通过
- 测试环境部署成功

## Decision Needed Before Implementation
- 前台设计风格
- 富文本编辑器具体选型
