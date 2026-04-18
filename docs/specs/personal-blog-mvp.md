# Spec: Personal Blog Website MVP

## Assumptions I'm Making
1. 这是一个 Web 项目，不包含原生移动端 App。
2. 这是单人维护的个人博客，MVP 阶段只有 1 个管理员，不做多作者协作。
3. 前台博客站点使用 Next.js，后台管理系统使用 Ant Design Pro，二者放在同一仓库中维护。
4. MVP 优先交付内容发布和展示闭环，不做评论、站内搜索、会员系统、支付、国际化。
5. 管理员登录只用于后台，不提供前台用户注册和登录。
6. 采用 TypeScript 和 React，优先使用 Next.js App Router。
7. 使用 `pnpm` 管理 monorepo；如果你希望用 `npm` 或 `yarn`，需要在进入实现阶段前改掉。
8. 项目目标是优先快速上线，再逐步迭代，因此基础设施优先选择托管式服务而不是自建。

## Objective
构建一个个人博客网站 MVP，包含公开访问的博客前台和供站长使用的后台管理系统。

目标用户：
- 博客访客：浏览首页、文章列表、文章详情、分类或标签内容。
- 博客作者：登录后台，创建、编辑、发布、下线文章，并维护基础站点信息。

MVP 的核心价值：
- 快速搭建可上线的个人内容发布系统。
- 让内容录入和内容展示形成最小闭环。
- 为后续扩展评论、SEO增强、统计分析、草稿协作等功能预留空间。

## Confirmed Decisions
- 文章编辑方式：富文本编辑器
- 仓库结构：同仓库双应用 `apps/web` + `apps/admin`
- 后台登录方式：MVP 阶段仅支持单管理员账号密码登录
- 交付策略：优先快速上线，再逐步迭代功能和设计
- 数据库方案：开发环境和生产环境都使用云 PostgreSQL
- 前台视觉参考：优先复用 `digital-architect/` 中的公开博客页面视觉语言
- 后台界面方案：继续使用 Ant Design Pro，不复用 `digital-architect` 的自定义后台样式

## Tech Stack
- Frontend (public web): Next.js 15.x, React 19.x, TypeScript 5.x
- Admin: Ant Design Pro latest compatible major version, React 19.x, TypeScript 5.x
- Styling: Tailwind CSS 4.x or Ant Design token system for admin, pending final implementation choice
- State and data fetching:
  - Web: Next.js Server Components + Server Actions / Route Handlers
  - Admin: Umi/Ant Design Pro default request flow or a thin typed API client
- Validation: Zod 3.x
- Database ORM: Prisma 6.x
- Database: PostgreSQL
- Database provider:
  - Selected: Supabase Postgres
  - Development: dedicated cloud database / isolated development project
  - Production: dedicated cloud database / isolated production project
- Testing:
  - Unit/Integration: Vitest
  - E2E/Smoke: Playwright
- Package manager: pnpm 9.x or newer
- Runtime: Node.js 20 LTS

## Commands
以下命令是目标仓库结构下的约定命令，进入实现阶段后需要全部可执行。

Dev:
`pnpm dev`

Dev web only:
`pnpm --filter web dev`

Dev admin only:
`pnpm --filter admin dev`

Build all:
`pnpm build`

Build web only:
`pnpm --filter web build`

Build admin only:
`pnpm --filter admin build`

Lint:
`pnpm lint`

Type check:
`pnpm typecheck`

Unit tests:
`pnpm test`

E2E smoke:
`pnpm test:e2e`

Format:
`pnpm format`

## Frontend Visual Reference
当前前台设计参考来源：
- `digital-architect/`

可直接吸收的设计元素：
- 内容导向的三栏博客首页布局
- 顶部导航、左侧导航、右侧趋势区的层级关系
- 首页文章卡片、文章详情页的版式和信息层级
- 以浅灰背景、白色内容卡、蓝色强调色为主的视觉基调
- 技术博客偏“编辑部 / 杂志感”的排版风格

迁移原则：
- 只复用前台公开站点的视觉语言和组件结构，不直接搬运其 Vite 路由结构
- `digital-architect` 是视觉原型，不是最终技术实现；最终仍需落到 Next.js App Router
- 后台管理系统继续遵循 Ant Design Pro 的布局和交互，不混用前台的自定义视觉系统

## Project Structure
```text
docs/
  specs/
    personal-blog-mvp.md      -> 产品和技术规格

apps/
  web/                        -> Next.js 前台博客站点
    src/app/                  -> App Router 页面和路由
    src/components/           -> 前台 UI 组件
    src/features/             -> 前台业务模块
    src/lib/                  -> 公共工具、配置、服务端能力

  admin/                      -> Ant Design Pro 后台
    src/pages/                -> 管理后台页面
    src/components/           -> 后台通用组件
    src/services/             -> API 请求封装
    src/models/ or src/stores/-> 页面状态管理

packages/
  shared/                     -> 前后台共享类型、schema、常量

prisma/
  schema.prisma               -> 数据模型定义

tests/
  integration/                -> 跨模块集成测试

e2e/
  smoke/                      -> 关键流程冒烟测试
```

## Functional Scope
### Public Web MVP
- 首页
  - 展示站点标题、简介、最新文章列表
- 文章列表页
  - 分页展示已发布文章
- 文章详情页
  - 展示标题、封面、发布时间、标签、正文内容
- 分类或标签聚合页
  - 至少支持一种内容聚合方式；建议优先标签
- 关于页
  - 展示作者简介和联系信息
- SEO 基础能力
  - 页面标题、描述、Open Graph 基础元信息

### Public Web UX Additions Based on Visual Reference
- 顶部导航
  - 包含站点 Logo、主导航入口和可扩展的搜索占位区
- 首页布局
  - 采用三栏响应式布局：左侧导航、中间内容流、右侧推荐区
- 文章卡片
  - 首页首条文章支持大图展示，其余文章使用紧凑型内容卡片
- 文章详情
  - 支持封面图区、作者信息区、标签区和长文排版样式

### Public Web Explicitly Deferred Even If Present in Visual Reference
- 站内搜索真实能力
- 评论交互
- 点赞、收藏、通知、关注
- Reading List
- Podcasts / Videos 等非博客内容栏目
- 社区注册和增长组件

### Admin MVP
- 管理员登录页
- 仪表盘首页
  - 显示文章总数、已发布数、草稿数
- 文章管理
  - 创建文章
  - 编辑文章
  - 保存草稿
  - 发布文章
  - 下线文章
  - 删除文章
- 标签管理
  - 创建、编辑、删除标签
- 站点设置
  - 站点名称
  - 站点简介
  - 首页 Hero 文案
  - 社交链接

### Explicitly Out of Scope for MVP
- 评论系统
- 全文搜索
- 文章点赞或收藏
- 多用户权限系统
- 文件媒体库
- RSS、Newsletter、订阅
- 多语言
- 深度数据统计

## Content Model
### Post
- `id`
- `title`
- `slug`
- `summary`
- `content`
- `coverImage`
- `status` (`draft` | `published` | `archived`)
- `publishedAt`
- `createdAt`
- `updatedAt`

### Tag
- `id`
- `name`
- `slug`

### SiteSetting
- `siteName`
- `siteDescription`
- `heroTitle`
- `heroDescription`
- `socialLinks`

### AdminUser
- `id`
- `username`
- `passwordHash`
- `lastLoginAt`

## Code Style
约定：
- 全量使用 TypeScript，避免 `any`
- React 组件使用 PascalCase
- hooks 使用 `useXxx`
- 服务端逻辑和前端展示逻辑分层
- 优先写可复用的小模块，不把请求、校验、渲染混在一个文件里
- 公共类型定义放到 `packages/shared`

示例：

```ts
type PostStatus = "draft" | "published" | "archived";

interface PostCardProps {
  title: string;
  slug: string;
  summary: string;
  publishedAt?: string;
}

export function PostCard({
  title,
  slug,
  summary,
  publishedAt,
}: PostCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{summary}</p>
      <a href={`/posts/${slug}`}>Read more</a>
      {publishedAt ? <time dateTime={publishedAt}>{publishedAt}</time> : null}
    </article>
  );
}
```

## Testing Strategy
- Unit tests:
  - 校验内容模型转换、slug 生成、输入校验、状态转换逻辑
  - 放在各模块旁边，使用 `*.test.ts`
- Integration tests:
  - 校验后台文章发布后，前台可以查询到已发布文章
  - 校验未发布文章不会出现在前台列表
  - 放在 `tests/integration`
- E2E smoke tests:
  - 管理员登录
  - 新建文章并发布
  - 前台访问文章详情
  - 放在 `e2e/smoke`

覆盖要求：
- 关键业务逻辑覆盖率不低于 70%
- 发布流程和前台展示流程必须有至少 1 条自动化冒烟用例

## Boundaries
- Always:
  - 先更新 spec，再进入实现
  - 新增功能必须附带最小验证手段
  - API 输入和表单输入必须做校验
  - 前后台共享的数据结构必须集中定义
  - 开发和生产数据库必须物理隔离，不能共用同一个实例或 schema
- Ask first:
  - 更换数据库类型
  - 增加新的外部 SaaS 依赖
  - 引入 CMS 或第三方托管内容服务
  - 调整 monorepo 结构
- Never:
  - 提交密钥、token、生产环境配置
  - 为了赶进度删除失败测试
  - 在未确认需求的情况下扩展出 MVP 之外的大功能

## Success Criteria
- 打开前台首页时，可以看到站点标题、简介和最新文章列表。
- 访客可以访问文章列表页和文章详情页。
- 后台管理员可以登录，并完成文章的创建、编辑、保存草稿、发布、下线、删除。
- 已发布文章会显示在前台，草稿和下线文章不会显示在前台公开页面。
- 管理员可以维护至少一种内容归类能力，建议为标签。
- 管理员可以修改基础站点信息，并在前台首页生效。
- Web 和 Admin 都可以独立启动、本地开发、构建成功。
- 本地开发环境可以直接连接云开发数据库完成联调，不依赖本机数据库服务。
- 至少存在 1 条覆盖“后台发布文章 -> 前台可访问”的自动化测试链路。

## Risks and Notes
- Ant Design Pro 通常是独立后台工程，需要明确它与 Next.js 的 API 层如何集成。
- 如果选择同仓库双应用结构，需要尽早统一鉴权、API 契约和共享类型。
- 如果内容编辑器选型过重，会拖慢 MVP；建议第一期使用能力受控的基础富文本方案，而不是复杂的协同编辑器。
- 富文本会引入内容清洗、存储格式和前台渲染一致性问题，需要在实现早期固定编辑器方案。
- `digital-architect` 当前是 `Vite + React Router + mock data` 原型，迁移到 Next.js 时需要重做路由、数据获取和 SEO。
- `digital-architect` 中的 `Dashboard` 和 `PostCreator` 只能作为体验参考，不能替代 Ant Design Pro 后台实现。
- `digital-architect` 现有文案包含 Markdown 写作提示，但当前 PRD 已确认采用富文本编辑器，需要统一编辑体验和文案表述。

## Gap Analysis Against `digital-architect`
已覆盖：
- 首页视觉方向
- 文章详情页视觉方向
- 顶部导航、侧边栏、趋势区等主要信息架构

还需要在 PRD/实现中补齐：
- 文章列表页的正式分页规则和空状态
- 标签聚合页的结构定义
- 关于页的内容结构
- 加载态、错误态、无数据态
- 移动端导航折叠和响应式行为
- SEO 字段到页面 metadata 的映射规则
- 富文本内容在前台的安全渲染规范

不能直接照搬的部分：
- 路由结构：原型使用 `/post/:slug`，目标实现应统一为 `/posts/[slug]`
- 数据来源：原型依赖 `MOCK_POSTS`，目标实现应改为数据库数据
- 用户模型：原型偏多作者社区站点，当前 MVP 是单管理员博客
- 功能边界：原型带有评论、反应、社区入口等非 MVP 功能
- 技术栈：原型使用 Vite，不符合当前 Next.js 前台实现方案

## Database Recommendation
- 推荐默认值：`PostgreSQL + Supabase`
  - 理由：托管式 Postgres、可视化管理和后续扩展空间更适合个人项目快速上线
  - 当前决策：开发环境和生产环境都使用云数据库，但必须拆分为独立环境
- 备选：`PostgreSQL + Neon`
  - 理由：如果你更想要“只要数据库本身，越轻越好”，Neon 更干净
- 不推荐作为当前默认值：SQLite
  - 理由：本地验证很快，但一旦进入线上和多环境迁移，通常会比直接用 Postgres 更早遇到边界

## Open Questions
1. 部署目标最终选什么？当前建议优先考虑 `Vercel`。
2. 富文本编辑器具体选型是什么？例如 Tiptap、Editor.js、React Quill。
