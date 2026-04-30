# Implementation Notes

## MVP Scope

- Static frontend application.
- Static JSON data source.
- Tool catalog and tool detail pages.
- Manifest display and basic manifest diff.
- Download links for README, ZIP, and manifest artifacts.

## Deferred Scope

- Login and permissions.
- Online upload and review workflow.
- Download statistics.
- Database-backed version snapshots.
- UE editor one-click installer.

## API Surface

The MVP should expose stable static JSON routes after build:

```text
/api/tools/index.json
/api/tools/<tool>.json
```

These routes are used by the frontend, Agent workflows, and future local installers.
