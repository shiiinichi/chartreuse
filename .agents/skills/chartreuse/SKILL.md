---
name: chartreuse
description: Query Chartreuse for component selection and implementation guidance. Use when building with @chartreuse/ui or checking its props, examples, design tokens, and layout patterns.
---

# Chartreuse

Run the local CLI from the app or workspace that uses Chartreuse. It reads the reference bundled with that project's installed version.

```sh
npm exec --offline --no -- chartreuse search 'folder path' --format json
npm exec --offline --no -- chartreuse info PathSelector --format json
```

Use `search` with short keywords when choosing a component. If you know the component name, go directly to `info` for required props, defaults, native attributes, and implementation notes. Read the notes when comparing similar components, such as `PathSelector` for entering a path with optional host browsing and `FilePicker` for selecting files through the browser.

Keep the same command prefix and use whichever query answers the task.

- `list` shows the public components.
- `demo <Component>` prints the documented TSX snippet. Supply any application state or handlers the snippet references.
- `token [Component]` shows CSS variables and their scopes. Use `--format json` to inspect theme values and distinguish styling hooks from variables controlled by the component.
- `guide [Topic]` lists available topics or shows a guide. Use `guide layout` when choosing between Grid, Flex, and Masonry.

Read successful JSON results under `data` and use `chartreuseVersion` to identify the reference version. On failure, check stderr for the error and its hint. If the installed package lacks the CLI, consult its local TypeScript declarations and the app's existing usage.

In the Chartreuse source repository, use `npm run --silent query --` in place of `npm exec --offline --no -- chartreuse`. Run `npm run build:lib` first when the local build is missing or stale.
