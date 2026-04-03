# TAPython Skills Collection

[中文版](README_CN.md) | English

A curated collection of [Copilot Skills](https://docs.github.com/en/copilot) for **Unreal Engine Python (TAPython)** script development.

## 🎯 What Is This?

This repository hosts a set of AI-powered skills that help developers rapidly build editor tools for Unreal Engine 5.5+ using [TAPython](https://github.com/cgerber/TA-Python). Each skill encapsulates domain knowledge, best practices, and code-generation capabilities for specific aspects of UE Python tooling.

## 📦 Available Skills

| Skill | Description |
|-------|-------------|
| [tapython-generator](tapython-generator/) | Full-stack TAPython architect — generates `MenuConfig.json`, `UI.json`, and `Controller.py` from natural language requirements with strict MVC architecture |

## 🚀 Quick Start

1. **Add this repository** as a skill source in GitHub Copilot.
2. **Trigger a skill** by mentioning keywords like `TAPython`, `UE5 tool`, `Chameleon tool`, or `Slate UI` in your prompt.
3. **Describe your tool** in plain language — the skill will generate production-ready code following TAPython best practices.

## 📁 Repository Structure

```
TAPython-skill/
├── README.md              # This file
├── README_CN.md           # Chinese version
├── tapython-generator/    # TAPython full-stack code generation skill
│   ├── SKILL.md           # Skill definition & instructions
│   ├── TAPython_docs/     # Official TAPython documentation references
│   ├── templates/         # Code templates (MenuConfig, UI, Controller)
│   ├── widgets/           # Slate widget catalog
│   ├── patterns/          # Common implementation patterns
│   ├── pitfalls/          # Common pitfalls & solutions
│   ├── examples/          # Complete tool examples
│   └── guides/            # Troubleshooting, FAQ, performance tips
└── .gitignore
```

## 🤝 Contributing

Contributions are welcome! You can:

- **Add a new skill** — create a new subdirectory with a `SKILL.md` following the existing format.
- **Improve documentation** — expand the TAPython docs, add more examples, or refine templates.
- **Report issues** — open an issue if a generated tool has problems or if you'd like a new feature.

## 📄 License

This project is provided as-is for educational and development purposes.
