# TAPython 技能集合

中文版 | [English](README.md)

一组用于 **Unreal Engine Python (TAPython)** 脚本开发的 [Copilot Skills](https://docs.github.com/en/copilot) 技能集合。

## 🎯 项目简介

本仓库收录了一系列 AI 驱动的技能，帮助开发者使用 [TAPython](https://github.com/cgerber/TA-Python) 快速构建 Unreal Engine 5.5+ 编辑器工具。每个技能封装了特定领域的知识、最佳实践和代码生成能力。

## 📦 可用技能

| 技能 | 描述 |
|------|------|
| [tapython-generator](tapython-generator/) | TAPython 全栈架构师 — 根据自然语言需求生成 `MenuConfig.json`、`UI.json` 和 `Controller.py`，严格遵循 MVC 解耦架构 |

## 🚀 快速开始

1. **添加本仓库**作为 GitHub Copilot 的技能源。
2. **触发技能** — 在提示词中提及 `TAPython`、`UE5 tool`、`Chameleon tool` 或 `Slate UI` 等关键词。
3. **描述你的工具** — 用自然语言描述需求，技能将自动生成符合 TAPython 最佳实践的生产级代码。

## 📁 仓库结构

```
TAPython-skill/
├── README.md              # 英文说明
├── README_CN.md           # 本文件
├── tapython-generator/    # TAPython 全栈代码生成技能
│   ├── SKILL.md           # 技能定义与指令
│   ├── TAPython_docs/     # TAPython 官方文档参考
│   ├── templates/         # 代码模板（菜单配置、界面、控制器）
│   ├── widgets/           # Slate 控件目录
│   ├── patterns/          # 常用实现模式
│   ├── pitfalls/          # 常见陷阱与解决方案
│   ├── examples/          # 完整工具示例
│   └── guides/            # 故障排除、常见问题、性能优化
└── .gitignore
```

## 🤝 参与贡献

欢迎贡献！你可以：

- **添加新技能** — 创建新的子目录，按照现有格式编写 `SKILL.md`。
- **完善文档** — 扩展 TAPython 文档、添加更多示例或优化模板。
- **报告问题** — 如果生成的工具有问题或希望新增功能，请提交 Issue。

## 📄 许可

本项目仅供教育和开发用途。
