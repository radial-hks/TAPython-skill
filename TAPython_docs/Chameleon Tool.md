## Chameleon Tool[¶](#chameleon-tool)

This page provides an overview of the Chameleon Tool system.

## Overview[¶](#overview)

The Chameleon Tool is TAPython's UI system for creating editor tools using JSON and Python.

## Creating a Chameleon Tool[¶](#creating-a-chameleon-tool)

### Step 1: Create JSON File[¶](#step-1-create-json-file)

Create a JSON file defining the UI:

```json
{
    "TabLabel": "My Tool",
    "InitPyCmd": "import MyTool; tool = MyTool.MyTool(%JsonPath)",
    "Root": {
        "SVerticalBox": {
            "Slots": []
        }
    }
}
```

### Step 2: Create Python Class[¶](#step-2-create-python-class)

```python
class MyTool:
    def __init__(self, json_path):
        self.json_path = json_path
        self.data = unreal.PythonBPLib.get_chameleon_data(json_path)
```

### Step 3: Launch the Tool[¶](#step-3-launch-the-tool)

```python
unreal.ChameleonData.launch_chameleon_tool("path/to/tool.json")
```

## Key Features[¶](#key-features)

- JSON-based UI definition
- Python callbacks for interactivity
- Reusable UI components
- External JSON support

## File Structure[¶](#file-structure)

```
Tools/
└── MyTool.json
```

## Resources[¶](#resources)

- [Chameleon Gallery](https://www.tacolor.xyz/tapython/chameleon_gallery.html)
- [Variable Placeholder](https://www.tacolor.xyz/tapython/variable_placeholder.html)

 [Previous](modal_window.html) [Next](variable_placeholder.html)
