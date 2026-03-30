## Reload Tool[¶](#reload-tool)

This guide explains how to reload Python logic in Chameleon Tools.

## Automatically Reload Python Logic[¶](#automatically-reload-python-logic)

Use InitCmd to reload Python module each time the tool starts:

```json
{
    "InitPyCmd": "import importlib, your_tools_module; importlib.reload(your_tools_module); your_tool_inst = your_tools_module.Tool(%jsonPath)"
}
```

Remove the reload statement once development is complete.

## Reload Through Buttons or Menus[¶](#reload-through-buttons-or-menus)

Add a temporary button to reload:

```json
{
    "SButton": {
        "Text": "Reload",
        "HAlign": "Center",
        "VAlign": "Center",
        "OnClick": "import your_utils, importlib; importlib.reload(your_utils)"
    }
}
```

For code involving interface logic, update when reopening the interface through quickly updating Python logic.

## Hot Reload Without Restart[¶](#hot-reload-without-restart)

Use this method to reload Python without reopening the interface:

Reference: [Reload Python without relaunch Chameleon Tool](https://www.tacolor.xyz/TipsOfDay/Reload_Python_without_relaunch_Chameleon_Tool.html)

 [Previous](tab_context_menu.html) [Next](control_other_tools.html)
