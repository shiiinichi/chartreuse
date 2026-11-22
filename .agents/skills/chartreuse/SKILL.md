---
name: chartreuse
description: Set up and query Chartreuse for component selection and implementation guidance. Use when building or styling UI with @chartreuse/ui, or checking its setup, props, examples, design tokens, and layout patterns.
---

# Chartreuse

## Before you build

- Import `@chartreuse/ui/styles.css` once at the app entry; without it components render unstyled.
- React and React DOM 19 are peer dependencies.
- Wrap anything that calls `useToast` in `ToastProvider`.
- Inter is not bundled: add `@fontsource-variable/inter`, supply Inter, or override `--cr-font-sans`.
- Theme follows `color-scheme`; force it with `<meta name="color-scheme" content="light">` or `"dark"`. Library styles sit in layers `cr-base, cr-tokens, cr-components`, so unlayered app CSS wins; if the app layers its own CSS (e.g. Tailwind v4), declare `@layer cr-base, cr-tokens, cr-components;` before your own layers.
- The package has no `'use client'` and uses client-only React APIs: in RSC apps, import `@chartreuse/ui` only from `'use client'` files (`@chartreuse/ui/tokens` is server-safe).
- The stylesheet does not style `body`; set its background, color, and font from the tokens in `guide color`.
- Add the focus-visible CSS from `guide accessibility`; most controls show no focus ring otherwise.
- Icons: lucide-react, React SVG components, or inline `<svg>`; not strings.

Run `npm exec --offline --no -- chartreuse guide setup` for install steps and a starter snippet.

## Query the reference

Run the local CLI from the app or workspace that uses Chartreuse. It reads the reference bundled with that project's installed version.

```sh
npm exec --offline --no -- chartreuse search 'folder path' --format json
npm exec --offline --no -- chartreuse info PathSelector --format json
```

Use `search` with short keywords when choosing a component, guide, or CSS token. Results have a `kind` of `component`, `guide`, or `token` (more kinds may be added), and token results include `value`; pass a token name after `--`, as in `search --format json -- --cr-color-primary`. When `info`, `demo`, `token`, or `guide` reports an unknown name, try the names in `error.suggestions`. If you know the component name, go directly to `info` for required props, defaults, native attributes, implementation notes, `seeAlso` (similar components, each with a reason), and `example` (the `demo` snippet). Run `guide choosing` to decide between similar components, such as Dialog, Drawer, and Sidebar.

Keep the same command prefix and use whichever query answers the task.

- `list` shows the public components under groups such as Forms and Overlays; each JSON result has a `group`.
- `demo <Component>` prints the documented TSX snippet. Demo snippets are self-contained: paste module-shaped snippets (declarations or exported components) as is, and put JSX-shaped snippets (optional statements followed by JSX) inside a component body.
- `token [Component]` shows CSS variables and their scopes. Use `--format json` to inspect theme values and distinguish styling hooks from variables controlled by the component. Follow its `customization` notes before writing CSS: props first, then semantic tokens on a wrapper, then the listed hooks, and only then cr- classes.
- `guide [Topic]` lists available topics or shows a guide. Use `guide setup` before first use and `guide layout` when choosing between Grid, Flex, and Masonry. Foundation guides cover `color`, `spacing`, `shape`, `icons`, `accessibility`, and `writing`. Pattern guides such as `settings-editor` print notes and `hasCode: true`; add `--code` for the full component source and CSS (other guides reject `--code`). Guide `docsPath` is null when there is no docs page.

Read successful JSON results under `data` and use `chartreuseVersion` to identify the reference version. On failure, check stderr for the error and its hint; stderr may also carry `warnings`. If the installed package lacks the CLI, consult its local TypeScript declarations and the app's existing usage.

In the Chartreuse source repository, use `npm run --silent query --` in place of `npm exec --offline --no -- chartreuse`. Run `npm run build:lib` first when the local build is missing, or when stderr warns that the build is older than its sources.
