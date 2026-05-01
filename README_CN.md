# TAPython 技能集合

中文版 | [English](README.md)

一组用于 **Unreal Engine Python (TAPython)** 脚本开发的 [Copilot Skills](https://docs.github.com/en/copilot) 技能集合。

说明：Tool Hub 站点已经拆分到独立仓库中持续开发。本仓库仅保留一份归档副本，位置在 `archive/tool-hub-site/`；当前活跃站点项目位于同级独立仓库 `tapython-tool-hub`。

## 项目简介

本仓库收录了一系列 AI 驱动的技能，帮助开发者使用 [TAPython](https://github.com/cgerchenhp/TAPython) 快速构建 Unreal Engine 5.5+ 编辑器工具。每个技能封装了特定领域的知识、最佳实践和代码生成能力。

## 可用技能

| 技能 | 定位 | 触发关键词 |
|------|------|-----------|
| [tapython-generator](tapython-generator/) | TAPython 全栈架构师 — 根据自然语言需求生成 `MenuConfig.json`、`UI.json` 和 `Controller.py`，严格遵循 MVC 解耦架构 | `TAPython`、`Chameleon tool`、`Slate UI`、`UE5 tool` |
| [ue-api-navigator](ue-api-navigator/) | UE Python API 导航器 — 将 37MB PythonStub 拆分为 15 个领域模块（7,629 类、44,235 方法），按需加载消除 API 幻觉 | `unreal API`、`UE native API`、`unreal.xxx`、`PythonStub` |
| [tapython-doc-exporter](tapython-doc-exporter/) | TAPython 工具文档导出器 — 将已完成工具目录整合为包含 MenuConfig、View JSON、Controller Python、辅助文件和部署说明的 Markdown 交付文档 | `导出工具文档`、`分享TAPython工具`、`生成工具MD`、`tool documentation` |

### 三技能协作流程

```
用户："做一个批量资产重命名工具"

  tapython-generator                 ue-api-navigator                  tapython-doc-exporter
  ─────────────────                  ────────────────────              ──────────────────────
  1. MenuConfig.json（菜单入口）      3. 加载 modules/asset_management.md
  2. UI.json（Chameleon 界面布局）     4. 提供 unreal.EditorAssetLibrary 精确签名
  5. Controller.py（使用第 4 步验证过的签名编写逻辑）
                                                                       6. 导出可分享的 Markdown 文档
```

- **tapython-generator** 负责 MVC 脚手架（菜单 + 界面 + 控制器）
- **ue-api-navigator** 提供控制器逻辑中 `unreal.xxx` 的精确 API 签名
- **tapython-doc-exporter** 将已完成的 TAPython 工具打包为可部署、可分享的 Markdown 文档
- **tapython-generator** 和 **ue-api-navigator** 不猜测 API 参数 — 签名直接从项目的真实 PythonStub 中提取

## 快速开始

### 1. 将本仓库添加为 GitHub Copilot 的技能源

### 2. 触发技能

- **构建 TAPython 工具** — 提及 `TAPython`、`Chameleon tool`、`Slate UI` 或 `UE5 tool`
- **查询 UE 原生 API** — 提及 `unreal API`、`unreal.xxx` 或 `PythonStub`
- **导出工具分享文档** — 提及 `导出工具文档`、`分享TAPython工具`、`生成工具MD` 或 `tool documentation`

### 3.（可选）为你的 UE 版本重新生成 API 模块

仓库内附带的 `modules/` 基于 UE 5.5 生成。如需适配其他版本：

```bash
python ue-api-navigator/tools/generate_api_skills.py \
  "/path/to/YourProject/Intermediate/PythonStub/unreal.py"
```

脚本会重新扫描存根文件，将更新后的领域模块输出到 `ue-api-navigator/modules/`。

## 仓库结构

```
TAPython-skill/
├── README.md                  # 英文说明
├── README_CN.md               # 本文件
│
├── tapython-generator/        # 技能 1：TAPython 全栈代码生成
│   ├── SKILL.md               # 技能定义与 MVC 指令
│   ├── TAPython_docs/         # TAPython 官方文档参考
│   ├── templates/             # 代码模板（菜单配置、界面、控制器）
│   ├── widgets/               # Slate 控件目录与用法示例
│   ├── patterns/              # 常用实现模式
│   ├── pitfalls/              # 常见陷阱与解决方案
│   ├── examples/              # 完整工具示例
│   └── guides/                # 故障排除、常见问题、性能优化
│
├── ue-api-navigator/          # 技能 2：UE Python API 导航
│   ├── SKILL.md               # 路由表与"先查后写"协议
│   ├── README.md              # 详细英文文档
│   ├── README_CN.md           # 详细中文文档
│   ├── modules/               # 15 个按领域划分的 API 签名文件
│   │   ├── asset_management.md      92 类    789 方法
│   │   ├── actor_level.md          607 类  3,624 方法
│   │   ├── rendering.md            510 类  3,680 方法
│   │   ├── animation.md            532 类  2,631 方法
│   │   ├── blueprint.md            293 类  1,912 方法
│   │   ├── ui_chameleon.md         136 类  1,125 方法
│   │   ├── geometry_procedural.md  557 类  3,636 方法
│   │   ├── input_camera.md         318 类  2,734 方法
│   │   ├── editor_tools.md         244 类  1,909 方法
│   │   ├── audio.md                178 类  1,304 方法
│   │   ├── sequencer_movie.md      155 类  1,043 方法
│   │   ├── physics_collision.md    165 类    727 方法
│   │   ├── ai_navigation.md         79 类    249 方法
│   │   ├── data_table.md            16 类    111 方法
│   │   └── core_misc.md          3,747 类 18,761 方法
│   └── tools/
│       └── generate_api_skills.py   # 存根 → 模块拆分脚本
│
├── tapython-doc-exporter/     # 技能 3：TAPython 工具文档导出
│   └── SKILL.md               # 导出协议、文档模板与安全规则
│
├── archive/
│   └── tool-hub-site/         # 原仓库内 Tool Hub 站点归档副本
│
└── .gitignore
```

## 参与贡献

欢迎贡献！你可以：

- **添加新技能** — 创建新的子目录，按照现有格式编写 `SKILL.md`。
- **完善文档** — 扩展 TAPython 文档、添加更多示例或优化模板。
- **改进路由规则** — 编辑 `generate_api_skills.py` 中的 `ROUTING_RULES`，重新生成模块以获得更好的领域覆盖。
- **报告问题** — 如果生成的工具有问题或希望新增功能，请提交 Issue。

## 许可

本项目仅供教育和开发用途。
