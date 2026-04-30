# TAPython Tool Hub

[English README](README.md)

TAPython Tool Hub 是一个独立的编辑器工具分享站点，用于沉淀、检索、分发和对比 TAPython/Chameleon 编辑器工具。它分享的是可安装工具包，而不是 Skill 本身。

一期实现采用静态站点方案：工具数据维护在本地 JSON 中，构建时生成静态 API 与下载清单，部署时可以直接放到公司局域网 nginx 或其他静态服务器上。

## 当前功能

- 工具库首页：展示工具数量、审核状态、版本快照和部署模式。
- 搜索与筛选：支持按工具名称、标签、作者、Unreal API、控件 Aka、分类、风险等级和审核状态过滤。
- 工具详情：展示功能摘要、兼容版本、安装路径、挂载点、依赖、风险说明和安装步骤。
- Manifest 查看：提供结构化 manifest 表格和 JSON 视图，便于后续接入 Agent 安装流程。
- 版本对比：支持 manifest 字段差异与文件清单/hash 差异对比。
- 投稿说明：说明工具包需要包含的文档、Chameleon UI JSON、Python 控制器、MenuConfig 片段、manifest 与版本信息。
- 静态 API：构建时生成 `/api/tools/index.json` 和 `/api/tools/<tool>.json`。

## 技术栈

- 前端：Vite + React + TypeScript
- UI：Ant Design
- 数据源：`data/tools/*.json`
- 静态生成：Node.js 脚本
- 部署方式：静态文件托管，优先支持公司局域网 nginx

## 快速开始

```bash
npm install
npm run dev -- --host 127.0.0.1
```

默认开发地址：

```text
http://127.0.0.1:5174/
```

生产构建：

```bash
npm run build
```

构建会先执行 `npm run generate:data`，生成静态 API 和下载清单，然后输出 `dist/`。

## 目录结构

```text
tool-hub-site/
├── data/
│   └── tools/                  # 工具源数据，每个工具一个 JSON
├── docs/                       # 实施说明、接口约定和后续记录
├── public/
│   ├── api/tools/              # 构建脚本生成的静态工具 API
│   └── downloads/              # 构建脚本生成的 manifest 和下载说明
├── scripts/
│   └── generate-data.mjs       # 从 data/tools 生成 public/api 与 downloads
├── src/
│   ├── App.tsx                 # 页面主体、详情、对比和投稿视图
│   ├── data/registry.ts        # 前端本地工具注册表
│   ├── main.tsx                # React 入口和 Ant Design 配置
│   ├── styles.css              # 站点样式
│   └── types.ts                # 工具、版本、manifest、diff 类型定义
├── tapython-tool-hub-site.md   # 完整执行方案
└── vite.config.ts              # Vite 配置
```

## 数据流程

1. 在 `data/tools/` 中维护工具元数据和版本信息。
2. 运行 `npm run generate:data`。
3. 脚本生成：
   - `public/api/tools/index.json`
   - `public/api/tools/<tool-slug>.json`
   - `public/downloads/<tool-slug>/<version>/manifest.json`
   - `public/downloads/<tool-slug>/<version>/README.md`
4. 前端页面读取本地注册表展示工具库，并链接到生成后的 manifest。

## 工具数据要求

每个工具至少需要描述：

- 基础信息：`slug`、名称、描述、作者、分类、标签、风险等级、审核状态。
- 兼容信息：Unreal Engine 版本、TAPython 版本、依赖插件。
- 安装信息：安装路径、Chameleon 挂载点、MenuConfig 片段。
- 版本信息：版本号、发布日期、变更说明、manifest、文件清单和 hash。
- 风险信息：会修改的对象、前置检查、后置检查、回滚建议。

当前示例工具是 `Actor Rename Tool`，数据位于 `data/tools/actor-rename-tool.json`。

## 部署说明

一期站点可以作为纯静态资源部署：

```bash
npm run build
```

将 `dist/` 发布到 nginx、内网文件服务器或云静态站点即可。由于 API 和下载 manifest 都在 `public/` 下构建进静态目录，部署时不需要后端服务。

后续如果需要真实上传、审核流、权限、版本归档和下载统计，可以在当前 manifest-first 数据模型上扩展 FastAPI + PostgreSQL + 对象存储。

## 相关文档

- [tapython-tool-hub-site.md](tapython-tool-hub-site.md)：完整站点方案与阶段计划。
- [docs/implementation-notes.md](docs/implementation-notes.md)：一期实现记录和接口说明。