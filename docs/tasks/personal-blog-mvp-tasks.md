# Tasks: Personal Blog Website MVP

- [x] Task: 初始化 monorepo 和根目录工程配置
  - Acceptance: 仓库包含 `apps/web`、`apps/admin`、`packages/shared` 的 workspace 结构，并配置根目录 `package.json`、`pnpm-workspace.yaml`、TypeScript、Lint、Format 基础脚本
  - Verify: 运行 `pnpm install`、`pnpm lint`、`pnpm typecheck`
  - Files: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.*`, `prettier.config.*`
  - Status note: 当前根命令 `pnpm typecheck`、`pnpm test`、`pnpm lint` 已通过

- [x] Task: 创建 Next.js 前台应用骨架
  - Acceptance: `apps/web` 可独立启动，包含 App Router、基础首页和全局样式入口
  - Verify: 运行 `pnpm --filter web dev`，确认首页可访问；运行 `pnpm --filter web build`
  - Files: `apps/web/package.json`, `apps/web/src/app/*`, `apps/web/next.config.*`

- [x] Task: 迁移 `digital-architect` 的前台视觉基础层
  - Acceptance: 将 `digital-architect` 中可复用的前台设计 token、排版基调、导航和文章卡片骨架迁移到 `apps/web`，并去除不属于 MVP 的社区化功能入口
  - Verify: 手动对照 `digital-architect` 原型，确认首页和文章详情页的主要视觉层级已建立；运行 `pnpm --filter web build`
  - Files: `apps/web/src/app/*`, `apps/web/src/components/*`, `apps/web/src/styles/*`, `digital-architect/src/*`

- [x] Task: 创建 Ant Design Pro 后台应用骨架
  - Acceptance: `apps/admin` 可独立启动，包含登录页占位、布局和基础路由
  - Verify: 运行 `pnpm --filter admin dev`，确认后台首页可访问；运行 `pnpm --filter admin build`
  - Files: `apps/admin/package.json`, `apps/admin/src/pages/*`, `apps/admin/config/*`

- [x] Task: 建立共享类型和校验包
  - Acceptance: `packages/shared` 提供文章、标签、站点设置、管理员认证相关的共享类型和 Zod schema
  - Verify: 运行 `pnpm typecheck`，前后台都能引用共享类型
  - Files: `packages/shared/src/*`, `packages/shared/package.json`
  - Status note: 已补 admin 轻量共享入口与独立 typecheck 配置，当前前后台和 shared 可共同通过根 `pnpm typecheck`

- [x] Task: 配置云开发库和生产库环境变量约定
  - Acceptance: 工程内明确区分开发和生产数据库连接变量，文档说明不允许共用同一数据库环境
  - Verify: 检查环境变量模板和文档；运行应用时可读取开发环境变量
  - Files: `.env.example`, `apps/web/.env.example`, `apps/admin/.env.example`, `docs/specs/personal-blog-mvp.md`

- [x] Task: 定义 Prisma 数据模型
  - Acceptance: Prisma schema 包含 `Post`、`Tag`、`SiteSetting`、`AdminUser`，并包含文章发布状态、slug、时间字段和标签关联
  - Verify: 运行 `pnpm prisma validate`
  - Files: `prisma/schema.prisma`

- [x] Task: 建立 Prisma client 和最小数据库访问层
  - Acceptance: 前后台可通过共享的数据访问模块连接 Supabase Postgres，并避免重复创建 client
  - Verify: 运行本地读写测试或最小脚本，确认能连接云开发数据库
  - Files: `packages/shared/src/db/*`, `apps/web/src/lib/db/*`, `apps/admin/src/services/*`

- [x] Task: 创建数据库 migration 和 seed
  - Acceptance: 可初始化开发数据库结构，并写入最小站点设置和管理员种子数据
  - Verify: 运行 migration 命令和 seed 命令后，可在数据库中看到表结构和初始数据
  - Files: `prisma/migrations/*`, `prisma/seed.*`

- [x] Task: 实现管理员认证
  - Acceptance: 管理员可使用单账号密码登录，后台受保护页面在未登录时会被拦截
  - Verify: 手动验证登录成功和未登录跳转；运行认证相关单元测试
  - Files: `apps/web/src/app/api/auth/*` or shared API layer, `apps/admin/src/pages/Login/*`, `packages/shared/src/auth/*`
  - Status note: 已完成单管理员登录、session cookie、后台受保护读取和登出；认证相关自动化测试仍未补齐

- [x] Task: 实现文章管理 API
  - Acceptance: 支持文章创建、编辑、保存草稿、发布、下线、删除；输入经过 schema 校验
  - Verify: 运行接口测试或手动调用接口验证状态变更
  - Files: `apps/web/src/app/api/posts/*`, `packages/shared/src/post/*`

- [x] Task: 实现标签管理 API
  - Acceptance: 支持标签的创建、编辑、删除和查询
  - Verify: 手动调用接口或运行集成测试验证增删改查
  - Files: `apps/web/src/app/api/tags/*`, `packages/shared/src/tag/*`

- [x] Task: 实现站点设置 API
  - Acceptance: 支持读取和更新站点名称、描述、Hero 文案和社交链接
  - Verify: 手动调用接口后，数据库和前台读取结果一致
  - Files: `apps/web/src/app/api/site-settings/*`, `packages/shared/src/site-setting/*`

- [x] Task: 实现前台公开内容查询 API
  - Acceptance: 前台只可查询已发布文章、标签聚合数据和站点设置，草稿和下线内容不可见
  - Verify: 运行集成测试，确认未发布内容不会被公开返回
  - Files: `apps/web/src/app/api/public/*`, `packages/shared/src/public-content/*`

- [x] Task: 完成后台登录页和基础布局
  - Acceptance: 后台包含登录页、受保护布局、导航菜单和登出能力
  - Verify: 手动完成登录和登出流程
  - Files: `apps/admin/src/pages/Login/*`, `apps/admin/src/layouts/*`

- [x] Task: 完成后台仪表盘
  - Acceptance: 仪表盘展示文章总数、已发布数、草稿数
  - Verify: 手动查看仪表盘数据与数据库一致
  - Files: `apps/admin/src/pages/Dashboard/*`

- [x] Task: 完成后台文章列表页
  - Acceptance: 可查看文章列表，支持按状态查看文章，并进入创建或编辑页面
  - Verify: 手动执行列表查询和跳转
  - Files: `apps/admin/src/pages/PostList/*`

- [x] Task: 完成后台文章编辑页和富文本集成
  - Acceptance: 可编辑标题、摘要、slug、封面、标签、正文和发布状态，并通过富文本编辑器录入内容
  - Verify: 新建文章、保存草稿、发布、下线各流程可手动跑通
  - Files: `apps/admin/src/pages/PostEditor/*`, `apps/admin/src/components/Editor/*`
  - Status note: 当前为 MVP 自研富文本输入器，支持可视编辑和 HTML 源码模式切换；尚未接入第三方富文本编辑器

- [x] Task: 完成后台标签管理页
  - Acceptance: 可在后台维护标签列表和标签表单
  - Verify: 手动创建、编辑、删除标签并验证结果
  - Files: `apps/admin/src/pages/TagManagement/*`

- [x] Task: 完成后台站点设置页
  - Acceptance: 可修改站点名称、简介、Hero 文案和社交链接
  - Verify: 保存后前台首页内容同步变化
  - Files: `apps/admin/src/pages/SiteSettings/*`

- [x] Task: 完成前台首页
  - Acceptance: 首页展示站点标题、简介、Hero 和最新文章列表
  - Verify: 运行 `pnpm --filter web dev`，手动检查页面展示
  - Files: `apps/web/src/app/page.tsx`, `apps/web/src/components/*`
  - Status note: 已将右侧 `Trending` 从原型静态数据切换为真实已发布文章，修复生产态首页预取不存在文章时的 `404`，并通过 Chrome 回归确认首页 Console 干净

- [x] Task: 完成前台文章列表页
  - Acceptance: 分页展示已发布文章，列表项包含标题、摘要、发布时间和标签信息
  - Verify: 手动查看分页和列表内容
  - Files: `apps/web/src/app/posts/page.tsx`, `apps/web/src/features/posts/*`

- [x] Task: 完成前台文章详情页
  - Acceptance: 展示文章正文、封面、发布时间、标签和 SEO 元信息
  - Verify: 手动访问已发布文章详情页，并检查 metadata 输出
  - Files: `apps/web/src/app/posts/[slug]/page.tsx`, `apps/web/src/features/post-detail/*`

- [x] Task: 完成前台标签聚合页和关于页
  - Acceptance: 标签页可按标签筛选文章，关于页展示作者信息和联系入口
  - Verify: 手动访问标签页和关于页
  - Files: `apps/web/src/app/tags/*`, `apps/web/src/app/about/page.tsx`

- [x] Task: 增加内容安全和富文本渲染约束
  - Acceptance: 富文本保存前经过清洗，前台渲染时限制危险标签或脚本注入
  - Verify: 编写测试或手动输入危险内容，确认不会执行脚本
  - Files: `packages/shared/src/sanitize/*`, `apps/web/src/features/rich-content/*`
  - Status note: 已实现保存前和渲染前双重清洗；本轮补充基础单测，后续如需增强安全性建议替换为成熟 sanitizer

- [x] Task: 补充单元测试
  - Acceptance: slug 生成、输入校验、文章状态流转、内容清洗具备自动化测试
  - Verify: 运行 `pnpm test`
  - Files: `packages/shared/src/**/*.test.ts`, `apps/web/src/**/*.test.ts`
  - Status note: 已补 slug 生成、基础 schema 校验、文章发布状态与 `publishedAt` 归一化、内容清洗测试；当前共享测试共覆盖 18 个用例

- [x] Task: 补充集成测试
  - Acceptance: 覆盖“后台发布文章 -> 前台公开可读”和“未发布文章不可见”两条核心链路
  - Verify: 运行 `pnpm test`
  - Files: `tests/integration/*`
  - Status note: 已新增公开内容集成测试，覆盖草稿不可见、发布后公开可见、归档后再次不可见，并接入根命令 `pnpm test`

- [x] Task: 补充 E2E 冒烟测试
  - Acceptance: 覆盖管理员登录、新建文章、发布文章、前台访问文章详情
  - Verify: 运行 `pnpm test:e2e`
  - Files: `e2e/smoke/*`
  - Status note: 已接入 Playwright，覆盖管理员登录、创建文章、发布文章、前台公开访问和测试后清理；本轮修正 dev 首次编译导致的等待超时后，已通过可见 Chrome 真实回归

- [x] Task: 配置首次上线所需部署参数
  - Acceptance: Web、Admin 和数据库环境变量文档完整，应用可以在目标平台完成首次部署
  - Verify: 运行 `pnpm build`，并完成一次测试环境部署
  - Files: `README.md`, deployment config files, platform env settings docs
  - Status note: 已补根 README、首发部署手册、生产环境模板和部署拓扑 ADR；新增 `/api/health` 作为上线后健康检查入口，并补充发布顺序、十分钟核验与回滚触发条件
