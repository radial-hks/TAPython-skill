---
name: tapython-doc-exporter
description: "Use when: export TAPython tool documentation, share TAPython tool, generate tool MD, 导出工具文档, 分享TAPython工具, 生成工具MD。将已完成的 TAPython 工具导出为单一 Markdown 分享文档，包含架构简述、MenuConfig、View JSON、Controller Python 和辅助文件清单。"
version: 1.0.0
author: WeiXuLu
triggers:
  - "导出工具文档"
  - "分享TAPython工具"
  - "生成工具MD"
  - "export tool doc"
  - "share TAPython tool"
  - "tool documentation"
  - "TAPython documentation export"
  - "TAPython tool handoff"
  - "整合为md"
  - "整合为文档"
---

# TAPython Tool Documentation Exporter

## 🎯 Role

> 将已完成的 TAPython 工具整合为一份结构化 Markdown 文档，方便团队分享和部署。

你是一个 TAPython 工具文档导出助手。你的任务是读取工具的三件套文件（MenuConfig 入口、UI JSON、Controller Python），并生成一份标准化的 Markdown 分享文档。

**输入**：用户指定一个已存在的 TAPython 工具名称或路径
**输出**：一份包含完整部署信息的 `.md` 文档

**作者**：WeiXuLu

---

## 📋 Workflow

### Step 1: 定位工具文件

根据用户提供的工具名称，按以下路径约定定位文件：

| 文件 | 路径 |
|------|------|
| UI JSON (View) | `<Project>/TA/TAPython/Python/<ToolName>/<ToolName>.json` |
| Controller (Logic) | `<Project>/TA/TAPython/Python/<ToolName>/<ToolName>.py` |
| MenuConfig | `<Project>/TA/TAPython/UI/MenuConfig.json`（全局，从中提取对应条目） |
| 辅助文件 | `<Project>/TA/TAPython/Python/<ToolName>/` 目录下其他 .py / .json 文件 |

**操作**：
1. 使用 `file_search` 或 `list_dir` 确认工具目录存在
2. 如果用户提供的是工具目录，向上查找并推断 `<Project>/TA/TAPython/` 根目录；如果无法推断，先询问项目根或输出目录
3. 使用结构化方式读取 View JSON 和 MenuConfig JSON，确保 JSON 可解析
4. 使用 `read_file` 读取 Controller Python 与可安全嵌入的辅助文件
5. 从 `MenuConfig.json` 中提取该工具的菜单注册条目
6. 如果工具目录下有额外辅助文件（如 `__init__.py`、`Utils.py`、配置 JSON、Images/ 等），一并记录

### Step 2: 分析工具结构

从读取到的文件中提取以下信息：

- **工具名称**：从 JSON 的 `TabLabel` 或文件夹名获取
- **挂载点**：从 MenuConfig 中确定（`OnToolBarChameleon`、`OnMainMenu` 等）
- **UI 组件清单**：解析 JSON 中所有带 `Aka` 的控件，记录控件类型、默认文本、HintText、所在布局层级
- **功能方法清单**：扫描 Python 中所有公开方法、`on_xxx_clicked` 方法、`get_button_click("xxx")` 轮询、`get_text("xxx")` / `set_text("xxx")` 等 ChameleonData 调用
- **依赖 API 清单**：提取 Python 中使用的 `unreal.xxx` 调用
- **UI 布局概要**：识别根容器类型和主要功能区块

优先使用结构化解析：
- View JSON / MenuConfig：使用 JSON 结构递归遍历，而不是只做字符串匹配
- Controller Python：优先使用 Python AST 或符号级扫描；如果工具环境不支持 AST，再使用正则辅助扫描
- 文本扫描必须排除注释和文档字符串中的误匹配，避免把说明文字当作真实调用

### Step 3: 生成 Markdown 文档

按照下方模板生成文档，输出到 `<Project>/TA/TAPython/工具导入教程/<ToolName>.md`。

输出目录规则：
1. 首选 `<Project>/TA/TAPython/工具导入教程/<ToolName>.md`
2. 如果 `工具导入教程/` 不存在，创建该目录
3. 如果无法确定 `<Project>/TA/TAPython/`，将文档输出到工具目录同级的 `工具导入教程/<ToolName>.md`，并在结果中说明推断依据
4. 如果同名文档已存在，先读取现有文件；除非用户要求覆盖，否则生成 `<ToolName>_export.md`

---

## 📄 Document Template

生成的 Markdown 文档必须严格遵循以下结构：

````markdown
# <ToolDisplayName>

> <一句话描述工具用途>

---

## 快速开始

### 安装步骤
1. 将 `<ToolName>/` 文件夹复制到 `<你的项目>/TA/TAPython/Python/` 目录下。
2. 将下方"菜单配置"中的 JSON 片段合并到 `<你的项目>/TA/TAPython/UI/MenuConfig.json` 中对应的挂载点。
3. 重启 UE 编辑器或通过 TAPython 菜单 Reload 即可在菜单中看到工具入口。

### 文件清单
| 文件 | 用途 | 存放路径 |
|------|------|----------|
| `<ToolName>.json` | UI 界面定义 | `Python/<ToolName>/` |
| `<ToolName>.py` | 业务逻辑 | `Python/<ToolName>/` |
| `__init__.py` | 模块初始化 | `Python/<ToolName>/` |
| *(其他辅助文件)* | *(用途)* | `Python/<ToolName>/` |

---

## 1. 架构简述 (Brief)
* **工具名称**：`<ToolName>` (<中文描述>)
* **挂载点**：`<AnchorPoint>` (<挂载点说明>)
* **UI 布局**：
    * <根容器描述>
    * <功能区块 1 描述>
    * <功能区块 2 描述>
    * <反馈系统描述>（如果有）
* **核心 API**：
    * `<API 调用 1>` <用途说明>
    * `<API 调用 2>` <用途说明>

---

## 2. Router: MenuConfig.json
**存放位置**：`<Project>/TA/TAPython/UI/MenuConfig.json`

> 将以下内容合并到你项目的 MenuConfig.json 对应挂载点中。

```json
<从 MenuConfig.json 中提取的该工具菜单条目>
```

---

## 3. View: <ToolName>.json
**存放位置**：`<Project>/TA/TAPython/Python/<ToolName>/<ToolName>.json`

```json
<完整的 UI JSON 内容>
```

### 控件映射表
| Aka | 控件类型 | 用途 |
|-----|----------|------|
| `<aka_1>` | `<WidgetType>` | <描述> |
| `<aka_2>` | `<WidgetType>` | <描述> |

---

## 4. Controller: <ToolName>.py
**存放位置**：`<Project>/TA/TAPython/Python/<ToolName>/<ToolName>.py`

```python
<完整的 Python 控制器代码>
```

### 方法说明
| 方法名 | 触发方式 | 功能 |
|--------|----------|------|
| `on_<aka>_clicked()` | 按钮点击 | <描述> |
| `<helper_method>()` | 内部调用 | <描述> |

---

## 5. 辅助文件（如有）

*(列出工具目录下的其他文件，附上代码或说明)*

---

## 使用说明
1. <操作步骤 1>
2. <操作步骤 2>
3. <操作步骤 3>

### 注意事项
- <注意事项 1>
- <注意事项 2>
````

---

## 🔍 Analysis Rules

### 提取 Aka 控件映射

解析 View JSON，找到所有带 `"Aka"` 字段的控件，生成映射表：

```
递归遍历 JSON → 找到 "Aka": "xxx" → 记录所在控件类型（SButton / SEditableText / SCheckBox 等） → 在 Python 中查找该 Aka 的读写/点击调用 → 生成描述
```

映射关系识别优先级：
1. `on_<aka>_clicked()` / `on_<aka>_changed()` 等显式方法
2. `self.data.get_button_click("<aka>")` 表示按钮点击轮询
3. `self.data.get_text("<aka>")`、`get_checkbox_state("<aka>")`、`get_combo_box_selection("<aka>")` 等表示输入读取
4. `self.data.set_text("<aka>")`、`set_list_items("<aka>")`、`set_text_color("<aka>")` 等表示输出反馈
5. 如果 Python 中没有引用该 Aka，仍需在映射表中列出，并标注“未在 Controller 中发现直接引用”

### 提取 API 依赖

扫描 Controller Python，找到所有 `unreal.` 开头的调用：

```python
# 匹配模式
unreal.EditorLevelLibrary.xxx()
unreal.EditorAssetLibrary.xxx()
unreal.PythonBPLib.xxx()
unreal.log() / unreal.log_error() / unreal.log_warning()
```

记录规则：
- 去重并保留完整调用名，例如 `unreal.EditorAssetLibrary.rename_asset`
- 区分 TAPython 框架 API（如 `unreal.PythonBPLib`、`ChameleonData`）和 UE 原生 API
- 如果 Controller 中存在 `hasattr(unreal.X, "method")`，在注意事项中记录这是版本兼容逻辑

### 提取菜单入口

从 MenuConfig.json 中，定位到引用了 `<ToolName>/<ToolName>.json` 的条目，向上追溯提取完整的菜单路径层级。

递归提取算法：
1. 遍历 MenuConfig 顶层所有挂载点（如 `OnToolBarChameleon`、`OnMainMenu`、`OnContentBrowserContextMenu`）
2. 对每个挂载点的 `items` 递归遍历
3. 匹配 `ChameleonTools` 值等于或规范化后指向 `<ToolName>/<ToolName>.json` 的菜单项
4. 记录匹配项本身、父级 `name` 路径、挂载点名称和完整 JSON 片段
5. 如果有多个匹配项，全部列出；如果没有匹配项，文档中保留空片段并给出手动合并示例

### 辅助文件处理

工具目录下的辅助文件需要分类处理：

| 类型 | 处理方式 |
|------|----------|
| `.py` / `.json` / `.md` / `.txt` / `.ini` | 可以完整嵌入代码块 |
| 图片、图标、字体等二进制资源 | 只列出相对路径、用途和复制位置，不嵌入原始内容 |
| `__pycache__/`、`.pyc`、`.pyo`、临时文件 | 忽略 |
| `.env`、密钥、令牌、凭据、个人路径配置 | 不嵌入内容，只提示存在敏感文件并建议人工处理 |
| 超大文件 | 不直接嵌入，记录路径、大小和用途摘要 |

---

## ⚠️ Important Rules

1. **完整性**：文档中的代码块必须包含文件的完整内容，不可省略或用 `...` 代替
2. **路径一致性**：所有路径使用 `<Project>/TA/TAPython/` 作为相对根
3. **即用性**：读者拿到文档后，按"快速开始"步骤即可完成部署，无需额外询问
4. **中文为主**：文档说明部分使用中文，代码和技术术语保留英文
5. **不修改源文件**：此 Skill 仅读取和生成文档，绝不修改工具的源代码文件
6. **辅助文件完整性**：如果工具目录下有 `__init__.py`、`Utils.py`、`Images/` 等辅助文件，必须在文档中列出并说明
7. **安全性**：不得把密钥、令牌、`.env`、个人绝对路径、机器特定配置直接写入分享文档
8. **可解析性**：View JSON 和 MenuConfig JSON 必须在导出前确认语法有效；若无效，先报告错误位置并停止生成
9. **可追溯性**：生成文档末尾应注明导出来源路径、导出时间和作者信息（作者：WeiXuLu）

---

## 📌 Example: SceneBatchTool

以 `SceneBatchTool` 为例，生成的文档结构如下：

```
# Scene Batch Tool

> 场景批量处理工具 — 支持选中 Actor 的批量重命名和标签管理。

---

## 快速开始
### 安装步骤
1. 复制 `SceneBatchTool/` 到 `Python/`
2. 合并菜单配置到 MenuConfig.json
3. 重启编辑器

### 文件清单
| 文件 | 用途 | 路径 |
|------|------|------|
| SceneBatchTool.json | UI | Python/SceneBatchTool/ |
| SceneBatchTool.py | 逻辑 | Python/SceneBatchTool/ |
| __init__.py | 初始化 | Python/SceneBatchTool/ |

---

## 1. 架构简述
* 工具名称：SceneBatchTool
* 挂载点：OnToolBarChameleon
* UI 布局：SScrollBox → 重命名模块 + Tag 模块 + 状态栏
* 核心 API：get_selected_level_actors(), set_actor_label(), actor.tags

## 2. Router: MenuConfig.json  →  完整 JSON 片段
## 3. View: SceneBatchTool.json  →  完整 JSON
## 4. Controller: SceneBatchTool.py  →  完整 Python

### 控件映射表
| Aka | 类型 | 用途 |
|-----|------|------|
| input_search | SEditableText | 查找字符串 |
| input_replace | SEditableText | 替换字符串 |
| btn_rename | SButton | 执行重命名 |
| btn_add_tag | SButton | 添加标签 |
| status_label | STextBlock | 状态反馈 |

### 方法说明
| 方法 | 触发 | 功能 |
|------|------|------|
| on_btn_rename_clicked | 按钮 | 批量重命名 |
| on_btn_add_tag_clicked | 按钮 | 标签同步 |
| log_status | 内部 | 状态更新 |

## 使用说明
1. 菜单 TA Python → Scene Tools → Scene Batch Tool
2. 选中场景 Actor
3. 输入查找/替换字符，点击重命名；或点击添加标签
```

---

## 🚀 Quick Start Checklist

导出工具文档时的检查清单：

1. ✅ 确认工具目录存在且包含 `.json` 和 `.py` 文件
2. ✅ 从 MenuConfig.json 提取了正确的菜单条目
3. ✅ 代码块包含完整文件内容（无省略）
4. ✅ 控件映射表覆盖所有 Aka 字段
5. ✅ 方法说明表覆盖所有公开方法
6. ✅ 安装步骤清晰可执行
7. ✅ 辅助文件已列出
8. ✅ 文档输出路径正确：`<Project>/TA/TAPython/工具导入教程/<ToolName>.md`
9. ✅ 敏感文件和二进制资源未被错误嵌入
10. ✅ 文档末尾包含来源路径、导出时间和作者 WeiXuLu

---

*此 Skill 专注于文档导出，与 `tapython-generator` Skill（工具生成）互补使用。*
