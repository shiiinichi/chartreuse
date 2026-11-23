# Chartreuse

Chartreuse is a React 19 and TypeScript component library with design tokens and interactive reference documentation.

## Run

```sh
npm install
npm run dev
```

Open [the local documentation](http://127.0.0.1:5173). Use ⌘K or Ctrl+K to search. The header theme button switches between the system color scheme and its opposite. Display preferences provide explicit Light, Dark, and System choices.

Display preferences also provide Comfortable and Full available width. The header width button switches between them on desktop, and the preference persists across navigation and reloads. The [Layout foundation](http://127.0.0.1:5173/#layout) documents content widths, gutters, Grid, Masonry, and Flex.

```sh
npm run build       # Type check, build the documentation, and build the library
npm test            # Build and test the distributed package contract
npm run preview     # Preview the production documentation on port 4173
```

The documentation is emitted to `dist/site`; the ES module library, declarations, and shared CSS are emitted to `dist/lib`.

## Publish the documentation

Under **Build and deployment**, set **Source** to **GitHub Actions**. [Pages settings](https://github.com/shiiinichi/chartreuse/settings/pages)

Once Pages is enabled, pushes to `main` deploy the site. To deploy manually, run **Deploy documentation to GitHub Pages** from the Actions tab with `main` selected. [Pages workflow](.github/workflows/deploy-pages.yml)

The default site URL is [shiiinichi.github.io/chartreuse](https://shiiinichi.github.io/chartreuse/). To preview the build locally at the same path, run the following commands and open [the Pages preview](http://127.0.0.1:4173/chartreuse/).

```sh
npm run build:site -- --base /chartreuse/
npm run preview -- --base /chartreuse/
```

## Use the library

Chartreuse is distributed as [@shiiinichi/chartreuse](https://github.com/users/shiiinichi/packages/npm/package/chartreuse) on GitHub Packages.

### Local installation

GitHub Packages requires authentication for npm installs, including public packages. Create a [classic personal access token](https://github.com/settings/tokens/new?scopes=read%3Apackages) with `read:packages` and sign in once per machine. For a private package, the token owner also needs read access to the package. See [GitHub's npm registry authentication guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

```sh
npm login --scope=@shiiinichi --registry=https://npm.pkg.github.com --auth-type=legacy
```

Enter your GitHub username and use the token at the password prompt. npm saves the credentials and registry mapping in your user-level `~/.npmrc`. In each consuming project, install the package under the `@chartreuse/ui` alias.

```sh
npm install '@chartreuse/ui@npm:@shiiinichi/chartreuse@latest'
```

React and React DOM 19 are peer dependencies supplied by the consuming application. The package includes the ES module entry, CSS, declarations, and the `tokens` subpath.

```tsx
import { Button, TextField, ToastProvider, useToast } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

function TaskForm() {
  const notify = useToast();
  return (
    <form onSubmit={event => {
      event.preventDefault();
      notify('Task created');
    }}>
      <TextField label="Task name" name="title" required />
      <Button type="submit">Create task</Button>
    </form>
  );
}

export default function App() {
  return <ToastProvider><TaskForm /></ToastProvider>;
}
```

The documentation bundles Inter locally. Consumers can bundle `@fontsource-variable/inter`, supply Inter, or override `--cr-font-sans`; system font fallbacks are included. Buttons and native form controls accept React 19 ref props directly. The package has no `'use client'` directive and uses client-only React APIs, so in React Server Component applications import `@chartreuse/ui` only from client components (`'use client'` files); `@chartreuse/ui/tokens` is safe on the server.

### Compose a workspace

Place `Navbar` above `WorkspaceLayout` and put `Sidebar` and `WorkspaceContent` inside the layout. The navbar and content have independent width settings.

```tsx
import { Navbar, NavbarItem, Sidebar, Text, WorkspaceContent, WorkspaceLayout } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

export function ProjectWorkspace() {
  return (
    <>
      <Navbar size="lg" width="full" surface="evergreen" aria-label="Workspace pages">
        <NavbarItem href="/workspace" aria-current="page">Overview</NavbarItem>
        <NavbarItem href="/tasks">Task board</NavbarItem>
      </Navbar>
      <WorkspaceLayout>
        <Sidebar width={192} aria-label="Projects" contentLabel="Project links">
          <nav aria-label="Project views"><NavbarItem href="/records">Records</NavbarItem></nav>
        </Sidebar>
        <WorkspaceContent width="comfortable">
          <Text size="heading-1">Project overview</Text>
        </WorkspaceContent>
      </WorkspaceLayout>
    </>
  );
}
```

Use `Navbar variant="workspace"` with `workspaceContent` and either or both of `leftSidebar` and `rightSidebar`. The sidebars span the workspace from top to bottom, alongside the Navbar and central content. The left toggle shows a hamburger `Menu` icon by default and the right toggle a `PanelRight` sidebar icon; each sidebar accepts a custom `toggleIcon`, with an optional `openToggleIcon` for its open state. Toggles look the same open or closed (`aria-expanded` reports the state) and sit as far from their side edge as from the top and bottom of the Navbar. It stays open until its toggle closes it, and can remember its open state with `storageKey`. Use `surface="white"` or `surface="evergreen"` to choose the Navbar color. [Navbar examples](https://shiiinichi.github.io/chartreuse/#components/navbar)

### GitHub Actions installation

To install with `GITHUB_TOKEN`, grant the consuming repository **Read** under **Manage Actions access** in the [package settings](https://github.com/users/shiiinichi/packages/npm/package/chartreuse). Commit the consuming project's `package.json` and `package-lock.json` after installation. Set `contents: read` and `packages: read` on the job, then use these steps after checkout.

```yaml
- uses: actions/setup-node@v6
  with:
    node-version: '24'
    registry-url: https://npm.pkg.github.com
    scope: '@shiiinichi'
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For a consuming repository without a package grant, set `NODE_AUTH_TOKEN` from an Actions secret containing a classic token with `read:packages`. For a private package, the token owner also needs read access. See [package access for GitHub Actions](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#ensuring-workflow-access-to-your-package).

## Query Chartreuse from the terminal

The `chartreuse` command ships with the UI package starting in version 1.1.0. It reads the component reference and design guidance for that installed version and runs offline.

```sh
npm exec --offline --no -- chartreuse list --format json
npm exec --offline --no -- chartreuse search 'folder path' --format json
npm exec --offline --no -- chartreuse info PathSelector --format json
npm exec --offline --no -- chartreuse demo PathSelector
npm exec --offline --no -- chartreuse token Grid --format json
npm exec --offline --no -- chartreuse guide layout --format json
npm exec --offline --no -- chartreuse guide choosing
npm exec --offline --no -- chartreuse guide typography --format json
npm exec --offline --no -- chartreuse guide settings-editor --code --format json
```

- `search` matches whole words, plurals, and common synonyms (such as modal, dropdown, or toast) across components, guides, and global CSS tokens, and returns up to ten matches. Each result has a `kind` of `component`, `guide`, or `token`; treat other kinds as possible additions. Token results also carry `value`, their default CSS value. Pass a token name after `--`, as in `chartreuse search --format json -- --cr-color-primary`.
- `list` prints components under groups (Actions, Forms, Feedback, Content, Navigation, Overlays, Layout, and Agents). JSON results carry `group`, and `data.groups` lists each group's members.
- `info` shows props, defaults, native attributes, and implementation notes. Its JSON also has `example` (the `demo` snippet as `{ language, code }`) and `seeAlso`, similar components each with a one-line reason.
- `demo` prints the documented TSX example.
- `token` shows shared CSS variables; `token <Component>` shows that component's styling hooks and their selectors. Both end with Customizing notes (JSON `customization`): props first, then semantic tokens on an app wrapper, then the documented hooks on their selectors, and only then unlayered CSS against `cr-` classes.
- `guide` lists topics: setup, layout, typography, and `choosing`, the decision table that `seeAlso` is derived from; the foundations `color`, `spacing`, `shape`, `icons`, `accessibility`, and `writing`; and application patterns such as `settings-editor`. Pattern guides print notes and `hasCode: true` by default; `--code` adds the pattern component source, with `@chartreuse/ui` imports, and its CSS. Other guides reject `--code`; setup and accessibility always include their short snippets. A guide's `docsPath` is `null` when it has no documentation page.

JSON responses carry `schemaVersion` and `chartreuseVersion`. Successful queries write `data` to stdout. Errors write a structured `error` to stderr and exit with status 1 for unavailable references or 2 for invalid usage. An unknown or ambiguous component or guide name adds `error.suggestions`, an array of close names. A lookup that resolved through an alias, such as `info modal`, adds `data.resolvedFrom`. Warnings, if any, appear as `warnings: [{ code, message }]`: in the error document on failure, or as a one-line JSON document on stderr after success, so stderr in JSON mode is always JSON. Text mode prints warnings as plain lines on stderr.

### Working on the CLI

Run `npm run build:lib`, then `npm run --silent query -- info Button --format json`. When the CLI runs from a source checkout and `package.json` or any file under `src/cli` or `src/docs` is newer than the build, it adds a `STALE_BUILD` warning: "Warning: the CLI build is older than its sources; run npm run build:lib." The check only stats files, never changes stdout or `data`, and is skipped for an installed package or any path under `node_modules`.

### Chartreuse agent skill

The [Chartreuse skill](.agents/skills/chartreuse/SKILL.md) is available to Codex in this repository. Invoke it with a prompt such as `$chartreuse Which component should I use to enter a repository folder path?`

For a consuming project, copy the bundled skill into its repository after installing a Chartreuse release that includes it. Run these commands from the project root.

```sh
mkdir -p .agents/skills/chartreuse
cp node_modules/@chartreuse/ui/.agents/skills/chartreuse/SKILL.md .agents/skills/chartreuse/
```

The skill queries the CLI installed in the app or workspace where the agent is working.

## Publish a release

The [publishing workflow](.github/workflows/publish-package.yml) runs when a GitHub release is published. It checks out the release tag, installs from `package-lock.json`, builds the documentation and library, runs the tests, prepares the owner-scoped distribution, and validates the exact tarball before publishing it to `https://npm.pkg.github.com`. Publishing uses the workflow's `GITHUB_TOKEN` with `packages: write`.

1. Use `npm version patch`, `minor`, or `major` with `--no-git-tag-version` to update `package.json` and `package-lock.json`. Add the release to the documentation's [Changelog](src/docs/Pages.tsx).
2. Push the release commit, including the workflow, to GitHub. The workflow derives the package owner and repository link from `github.repository`.
3. Prepare a GitHub release draft with a tag matching `v<package.json version>`. Publishing the draft triggers package publication.
4. Keep the repository and package visibility in sync. The workflow checks that both are private or both are public before publishing and verifies the same visibility afterward. A private repository can publish its first package version with GitHub’s default private visibility.

The workflow can also be run manually with an existing version tag. Its `publish` input defaults to `false`, which builds, tests, validates, and uploads a downloadable package artifact. Enable that input to publish the validated artifact. Issue a new version for each release, including updates to the packaged README. Prerelease versions and GitHub prereleases use the `next` distribution tag. Stable releases use `latest`.

The source manifest retains `@chartreuse/ui` and `private: true`. Release preparation creates a separate manifest under `dist/github-package` with the repository owner's scope, the GitHub registry, and repository metadata. It omits development dependencies and scripts. The package includes the built library, offline CLI, agent skill, and README.

### Switch the repository and package to public

GitHub manages the repository and npm package visibility separately. Review what will become visible with the repository, including commit history, release assets, and Actions logs. See [GitHub's repository visibility guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility#changing-a-private-repository-to-a-public-repository).

1. Put these documentation and workflow updates on the default branch before changing visibility. Use a release tag that includes the updated workflow and release scripts for the next package publication.
2. Set the repository to **Public** in **Settings → General → Danger Zone → Change repository visibility**.
3. Set the npm package to **Public** in **Package settings → Danger Zone → Change visibility**. GitHub makes this package change permanent. See [personal package visibility settings](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#configuring-visibility-of-packages-for-your-personal-account).
4. Verify that both show **Public** and that the publishing repository retains access under **Manage Actions access**. For the next release tag, run the publishing workflow with `publish=false` to validate the distribution.

## Components

The library exports 71 components. [Latest GitHub release](https://github.com/shiiinichi/chartreuse/releases/latest) · [Release history](https://shiiinichi.github.io/chartreuse/#changelog)

ActivityItem, AgentActivity, AgentCard, Alert, Autocomplete, Avatar, AvatarGroup, Badge, Blockquote, BrandMark, Breadcrumbs, Button, ButtonSelect, CalloutBanner, Card, Checkbox, ChipGroup, Conversation, Dialog, Disclosure, Divider, Drawer, EmptyState, Fieldset, FilePicker, Flex, Form, FormLayout, Grid, GridItem, GridSpacer, IconButton, List, MarkdownRenderer, Masonry, MasonryItem, MasonrySpacer, MessageComposer, Navbar, NavbarItem, NavbarItemGroup, NumberInput, PagePanel, Pagination, PathSelector, Progress, SegmentedControl, SegmentedProgress, Select, Sidebar, Skeleton, Slider, Spinner, Stat, StatGroup, Steps, Swimlane, SwimlaneGroup, Switch, Table, Tabs, TaskCard, Text, TextArea, TextField, Timeline, ToastProvider, ToggleChip, Tooltip, Tree, WorkspaceContent, and WorkspaceLayout. `useToast` is the notification hook.

The gallery groups related components and includes workspace, task-board, and agent-monitor examples. Task and agent data is local to the documentation. The task board shares search, task creation, and status changes between the Board and paginated List views.

Component galleries use Masonry to arrange previews of different heights in responsive columns, including in full content width mode. Compact examples use narrower columns; Grid, Timeline, and other spatial examples use wider columns. Workspace examples can span all columns. DOM order and mounted state remain stable as content, Preview/Code views, and available width change. Input groups use Grid.

`Avatar` displays a name beside its initials when `showName` is set, as in `<Avatar name="Alex Morgan" showName />`. The component handles alignment and spacing and hides the decorative initials from assistive technology. Without `showName`, the avatar has an accessible image label containing the name. Set `icon` to show a decorative icon instead of initials, such as `<Avatar name="Review agent" icon={Bot} />` for an agent; the name stays the accessible label. `AvatarGroup` takes `items={[{ name, icon }]}` in place of `names` when an entry needs an icon.

`Badge` defaults to `variant="soft"` for a tinted surface. Use `variant="ghost"` for a transparent surface with the same text color and optional status dot or icon, as in `<Badge variant="ghost" tone="info" dot>Running</Badge>`.

`Card` accepts `header` and `footer` slots for padded content regions with dividers. Set `divided` to lay out the body sections side by side and wrap them onto additional rows as space narrows.

`TaskCard` presents checklist, dependency, related-card, comment, and attachment counts in a wrapping metadata row with 12px top padding. Use `completed`/`total` for checklist counts and optional `dependencies`, `relatedCount`, `commentCount`, and `attachmentCount` for other counts. Explicit zero counts are visible. Set `hideMetadataLabels` to show icons and counts, with labels available on hover and keyboard focus. With `onClick`, the metadata and status footer also activate the card.

`EmptyState` supports a compact panel with `variant="dashed"`. Use `align="start"`, `"center"`, or `"end"` to align the icon, message, and optional action in either variant.

`Progress` renders a thin native bar by default. Set `showLabel`, `valueText`, and `description` to add a visible heading, formatted value, and supporting text. Value text supplies the accessible value wording unless `aria-valuetext` overrides it, and descriptions merge with native `aria-describedby` relationships. Native props and refs target the bar. The caller defines units and meaning; context-window progress and accumulated token usage are separate measures. Set `size` to `sm` (4px, the default), `md` (6px), or `lg` (8px).

`SegmentedProgress` shows a stacked bar of categories, each with a `label`, `value`, and categorical `accent`, and an accessible name that lists every segment. It takes the same `size` scale and defaults to `lg`; add a static or interactive legend when the bar needs one. `ToggleChip` is a compact button with an optional dot and count; set `pressed` for filters or `variant="dashed"` for add actions, and group chips with `ChipGroup`.

`Tabs` supports `size="sm"`, `"md"`, and `"lg"` for the `line`, `pill`, and `highlight` styles. The default size is `"md"`, and each size matches the corresponding `Button` height. Selected tabs use an Evergreen underline. The `pill` style adds a raised surface, and the `highlight` style adds a subtle fill with rounded top corners. When tabs overflow, hold down a tab and drag sideways to scroll the row. The scrollbar is hidden and takes no space. Horizontal wheel or trackpad scrolling briefly reveals it where scrollbars overlay the content, as on macOS. Classic scrollbars, as on Windows, stay hidden so the row keeps its height.

`Button` variants are `primary` (the default), `secondary`, `accent`, `ghost`, `danger`, and `link`. A `variant="link"` button looks like link text: it uses the link color with no underline, inherits the surrounding font size and line height, and has no padding, border, or hover background, so it can sit inside a sentence, as in `Task archived. <Button variant="link" onClick={undo}>Undo</Button>`. It is still a native button, so use it for actions and a real `<a href>` for navigation. [Button examples](https://shiiinichi.github.io/chartreuse/#components/button)

`Button`, `ButtonSelect`, `TextField`, `TextArea`, `Select`, `Autocomplete`, `NumberInput`, and `Slider` accept `fullWidth`. It stretches the control to the full width of its container. In a flex row, a field is otherwise only as wide as its control, so set `fullWidth` to fill the remaining space.

`TextField`, `TextArea`, `Select`, `Slider`, and `SegmentedControl` accept `hideLabel`. It hides the label visually but keeps it as the control's accessible name. Keep nearby context, such as a heading, that shows what the field is for; a placeholder alone is not a label.

Set `collapsible` on a `TextField` with an `icon`, such as a toolbar search, to show it as a square icon control while it is empty and unfocused. It expands to the free space in a flex row, or the full width of a block container, on focus; it stays open while it has a value and collapses on blur or on Escape while empty. The label is always visually hidden. [TextField examples](https://shiiinichi.github.io/chartreuse/#components/text-field)

`Breadcrumbs` uses chevrons by default. Set `separator` to decorative text or JSX, or pass `null` to hide separators.

`Dialog` uses a 10px gutter with a centered grip when `resizableSplit` is set. Drag the divider or use the arrow keys while it has keyboard focus.

`SegmentedControl` uses named native radios for a single visible choice. Set `variant="solid"` for a filled selection. `Slider` uses a native range input with formatted values. Both support controlled or uncontrolled state, native form behavior, disabled states, and accessible hints/errors. The Iconography page uses these components for its Size and Stroke controls.

`ButtonSelect` uses the same sizes and variants as `Button`. Pass `options` to use the built-in picker, which shares Autocomplete’s popup styles and matches the trigger width by default. Use `defaultValue` for an initial choice or `value` and `onValueChange` to control selection. Supply `content` for a custom picker with its own layout and controls. The custom panel sizes to its contents by default, supports `panelClassName` and `matchTriggerWidth`, and passes `close()` to content renderers. [ButtonSelect examples](https://shiiinichi.github.io/chartreuse/#components/button-select)

`Blockquote` renders a quotation with optional source attribution outside the quoted text. The default `variant="plain"` displays a left rule; `variant="filled"` adds a padded background, with optional `tone="neutral"`, `"info"`, `"success"`, `"warning"`, or `"danger"` colors. Tone changes presentation while retaining quotation semantics. `ActivityItem` provides a left rule for task updates, with title, identifier, metadata, and footer slots.

`List` renders a semantic bulleted `ul`, or a numbered `ol` with `ordered` and an optional `start`. Each item has a `title` and optional `description`, decorative `icon` or `leading` content such as an `Avatar`, `tone`, and `trailing` content such as a Badge or a small action. Set `size="sm"` for compact lists, `dividers` for rules between items, and `marker="none"` to hide bullets and numbers. Use `Table` for multi-column records and `Tree` for expandable hierarchies.

`AgentActivity` displays a collapsible event group with details for each event. Set `variant="list"` to show all events beneath a group heading with a left connector. Lists with more than six events start open and can collapse from the heading or the footer below the last row. The footer also links back to the heading. In either variant, `titleLines="single"` truncates long titles with an ellipsis. Expand the row to read the full title. Command, input, and output text are available in the details, and failed, interrupted, running, and completed states are distinct. The caller supplies event data and handles execution.

`Tree` supports hierarchy cards or compact rows, branch connectors, expansion, selection, custom SVG icons, and keyboard navigation. Focus moves independently of selection. Place actions or an inspector beside the tree and keep node content informational.

`Navbar` provides a navigation landmark with optional `brand` and `actions` slots. It defaults to `size="md"`. Use `size="lg"` for taller link targets, more vertical padding, and larger text. Comfortable width centers the links, brand, and actions within the shared cap. Set `width="full"` to use the entire available width with the same responsive gutters. Choose `surface="white"` or `surface="evergreen"` independently of layout and width. Group items with `Flex` to control alignment, gaps, and wrapping. Give `NavbarItem` an `href` for a native link and set `aria-current="page"` for its solid highlight. The evergreen surface uses Light Evergreen for that highlight. Omit `href` to include a control, status badge, or other React content. Give `NavbarItem` an `icon` to show it before the label.

`NavbarItemGroup` groups related `NavbarItem` links. With `variant="segmented"` it draws them as a page switcher: a rounded track (`--cr-radius-md`) where the link marked `aria-current="page"` is filled and the others are muted until hovered. The items stay native links, so they open in a new tab and follow the normal Tab order; use `SegmentedControl` instead to pick a form value. Set `iconOnly` on narrow navbars to hide the labels visually while keeping them as each link's accessible name and title. On the evergreen surface the current link uses Light Evergreen with paper text; on the white surface it sits on the surface color with `--cr-shadow-sm`. Restyle it with the `--cr-navbar-segment-*` hooks that `chartreuse token NavbarItemGroup` lists.

```tsx
<Navbar surface="evergreen" aria-label="Dashboard">
  <NavbarItemGroup variant="segmented" aria-label="Pages">
    <NavbarItem href="/board" icon={LayoutDashboard} aria-current="page">Board</NavbarItem>
    <NavbarItem href="/agents" icon={Bot}>Agents</NavbarItem>
    <NavbarItem href="/settings" icon={Settings}>Settings</NavbarItem>
  </NavbarItemGroup>
</Navbar>
```

`Sidebar` provides floating and flush surfaces with header, body, and footer content. Give the sidebar a bounded height so its body scrolls independently while the header and footer stay visible. Use `NavbarItem` for navigation. For inspector selection, use `Button` with `variant="ghost"` and set `aria-pressed` to highlight the selected item in the scrolling body. The gallery includes a searchable run history and a task sidebar with project filters and editable checklists.

`WorkspaceLayout` arranges `Sidebar` and `WorkspaceContent` beneath `Navbar` and stacks them on narrow containers. `WorkspaceContent` renders the main area. Comfortable width centers the body within the shared cap. `width="full"` fills the available content area with the same responsive gutters. Use `as="section"` when embedding it inside a page that already has a main landmark.

`Conversation` presents chronological messages with sender and time headers. User prompts appear in subdued cards. Agent messages use `MarkdownRenderer` by default. User and system messages use plain text unless the message specifies Markdown. The `activity` slot can hold `AgentActivity` between the message header and body. Combine it with `MessageComposer` for input and `Drawer` for a transcript panel. Message updates preserve focus and scroll position. Set `announce` to enable concise status announcements.

`Swimlane` displays task-board columns with a count beside the status tag and a header action on the right. The count uses the same 11px type size as `Badge`. Columns share surface styles, body insets, card spacing, and empty-state layouts. The caller supplies cards, counts, and actions. Lanes can collapse to a 48px rail, take a categorical `accent` (`cat-1` … `cat-8`), use a dot header, and sit flush and compact inside `SwimlaneGroup` for a single-surface board. Titles stay on one line and truncate in narrow lanes so header actions never wrap. Set `laneWidth` on `SwimlaneGroup` (a number in pixels or any CSS length) to give every expanded lane a fixed width; the group then scrolls horizontally, which keeps titles whole on boards with many stages.

`Table` displays flat rows or named row groups. Pass `pagination` to add page controls below the table, and supply the rows for the current page. `Pagination` also works as a standalone control. Supply a one-based `page`, the `pageCount`, and `onPageChange`. The task-board example groups the same tasks by status in both views. [Table reference](https://shiiinichi.github.io/chartreuse/#components/table) · [Pagination reference](https://shiiinichi.github.io/chartreuse/#components/pagination)

`NumberInput` supports native number editing, validation, decimal steps, and form values. The stepper rail appears when focus enters the control; hovering a step button shifts the divider to increase that button's width. Disabled, read-only, and unrestricted `step="any"` inputs omit the step buttons. Values use `number | null`, allowing an optional field to remain empty.

`Stat` displays a labeled value with optional precision, locale, separators, custom formatter, prefix/suffix, icon, description, action, and loading state. `StatGroup` composes `Grid` and `GridItem`; its default responsive columns are one, two, and three. Supply explicit GridItems for custom spans.

`Timeline` displays chronological events with optional dates, content, icons, alignment, horizontal layout, pending content, and reverse ordering. `Steps` displays a numbered guide or process, with the caller providing current, completed, and error states. Both use native ordered-list semantics. Getting started uses Steps for its three installation sections.

The [Modals & dialogs gallery](http://127.0.0.1:5173/#modals) includes simple, form, destructive-confirmation, task-detail, and split-content examples. The shared `Dialog` supports `size="sm"` (420px), `size="md"` (520px, default), `size="lg"` (760px), and `size="xl"` (1600px maximum, with 24px outer margins). Long content scrolls within the body while the header and footer stay visible, with 24px footer padding on every side. Height follows the content by default. The optional `freezeHeight` prop preserves the opening height until the modal closes, so changing tabs or content keeps the footer in place. The viewport still caps its height on smaller screens. The task-detail example has a toggle to compare both behaviors.

For a split body, pass `sideContent` and its accessible `sideContentLabel`. Both panes are inside the body; the shared footer spans the full width underneath. Each pane scrolls independently on wide layouts. Below 700px of modal width, Details and Comments switch within the body. The sample supports local comment posting and sorting.

Split resizing is optional and off by default. Set `resizableSplit` to enable pointer dragging and a keyboard-operable divider: Arrow keys adjust the pane, and Home/End reach its available width limits. `sideContentMinWidth` defaults to 260px and `sideContentMaxWidth` defaults to 640px; the available modal space also limits the pane so the main content stays usable. `maxWidth` can override the modal size's maximum width while retaining viewport margins. The gallery provides controls outside the modal to compare resizable and static splits and set both maximum widths. Its demo starts with resizing enabled.

```tsx
<Dialog open={open} onOpenChange={setOpen} size="xl" maxWidth={1600}
  resizableSplit sideContentMaxWidth={640} title="Card details"
  sideContent={<CommentsPanel />} sideContentLabel="Comments"
  footer={<SharedActions />}>
  <CardDetails />
</Dialog>
```

The [Form controls gallery](http://127.0.0.1:5173/#forms) includes `Autocomplete` and `MessageComposer`. Autocomplete accepts labeled options with `value`, `label`, optional `description`, and `disabled`; use `value` / `onValueChange` for a controlled selection or `defaultValue` for an uncontrolled one. Arrow keys move through enabled matches, Enter commits a selection, and Escape restores the selected label. `name` submits the selected option ID as a hidden form value. The searchable input retains its label, hint/error relationships, disabled and required semantics. Suggestions use a native top-layer popover so gallery and form containers do not clip them.

Single-choice `Select` dropdowns use the same popup as Autocomplete and ButtonSelect. Pass native `<option>` and `<optgroup>` children and set `value` or `defaultValue`. Read `event.currentTarget.value` in `onChange` and pass `name` to include the selected value in form submission. The `multiple` prop or a numeric `size` greater than one displays an inline native listbox. [Select reference](https://shiiinichi.github.io/chartreuse/#components/select)

Built-in options use fixed-height, single-line rows. The popup starts at the trigger width and expands for longer options within the viewport. Set `matchTriggerWidth` on `Autocomplete` or `ButtonSelect` to keep the popup at the trigger width and truncate overflowing text with an ellipsis. When upgrading from 1.10.0, pass this prop explicitly on any `ButtonSelect` that should keep its fixed popup width.

`Autocomplete`, `ButtonSelect`, and single-choice `Select` hide the selection checkmark by default. Add `checkmark` for the standard icon or pass a custom icon, such as `checkmark={CircleCheck}`. The prop accepts Lucide icons, SVG components, and inline SVG elements.

`MessageComposer` combines a labeled textarea, hint, and send action. The caller implements submission in the required `onSend(message)` callback, which can be synchronous or asynchronous. Submission displays a busy state; failures retain the draft, and successful sends clear the submitted text. Edits made while submission is pending are retained. Enter adds a new line; Command/Ctrl+Enter sends. Set `sendSize` to `"sm"`, `"md"`, or `"lg"` for a 32px, 36px, or 44px send button; the default is `"md"`, and coarse pointers always get a 44px target. Pass `controls`, such as a `ButtonSelect` for a model or mode, to place them at the start of the footer, apart from the hint. The gallery simulates success, delay, and failure within the example.

The [Drawers gallery](http://127.0.0.1:5173/#drawers) demonstrates a shared `Drawer` in `mode="docked"` or `mode="modal"`, with left/right placement and configurable `width` / `maxWidth`. Docked panels leave the workspace usable; modal drawers contain focus with native dialog behavior. The footer can hold a `MessageComposer`. Every conversation in the example stays local.

The [Markdown gallery](http://127.0.0.1:5173/#markdown) provides an editable source and live `MarkdownRenderer` preview. The renderer accepts Markdown as its string children and supports CommonMark plus GitHub-flavored tables, task lists, strikethrough, and fenced code blocks with copy actions. Raw HTML is skipped, executable URL schemes are rejected, and external links use `noopener noreferrer`.

```tsx
<MarkdownRenderer>{notes}</MarkdownRenderer>
```

The [Disclosure gallery](http://127.0.0.1:5173/#disclosures) demonstrates native `details` / `summary` with a chevron beside the title, a full-width summary row, and 13px typography. Use `defaultOpen` for the initial state, and give uncontrolled items a shared `name` to form an exclusive group. Items without a shared name can remain open together.

```tsx
import { Disclosure, Text } from '@chartreuse/ui';

<Disclosure title="How do disclosure groups behave?" defaultOpen>
  <Text size="body">Uncontrolled items with the same name form an exclusive group.</Text>
  <Text size="body">Items without a shared name can remain open together.</Text>
</Disclosure>
```

For controlled visibility, use `open` and `onOpenChange`. Controlled disclosures omit native `name`; if a controlled group should be exclusive, the parent owns which item is open. Native Enter/Space activation and find-in-page behavior are retained. Chevron motion respects reduced-motion preferences.

`headerHighlight="open"` keeps the summary shaded while its content is expanded. `headerHighlight="always"` shades the summary in both open and closed states. The default `"hover"` uses hover feedback. Both variants use the shared subtle-surface color and affect only the header; the gallery includes a separate Preview/Code example for each.

The [Fieldsets gallery](http://127.0.0.1:5173/#fieldsets) provides `Fieldset` with a required native `legend`, optional `description`, `hint`, and `actions`. Related controls share a named group, and the native `disabled` attribute covers the controls and actions inside it. The first child remains a real `legend`; actions stay in the group body. The editable rules example is local.

`FilePicker` in [Form controls](http://127.0.0.1:5173/#forms) wraps a labeled native file input. It supports `mode="file"` or `mode="folder"`, `multiple`, `accept`, `required`, and `onFilesChange(files)`. A native reset clears the selection. Folder mode uses directory selection where available and provides a file-selection fallback. The demo displays browser-provided names, sizes, types, and folder-relative paths; it performs no upload or file-content read.

The [Page panels gallery](http://127.0.0.1:5173/#page-panels) demonstrates a full-height `PagePanel` with `title`, `description`, optional `leading` / `headerActions` / `navigation` slots, a scrolling body, and an action `footer` outside that scroll region. Allocate a height in the parent and the panel fills it. The footer has 24px padding on every side. When the surrounding scroll viewport is at least 480px tall, the footer docks at its bottom edge with square corners. The corners round again when the footer returns to its normal position. Set `stickyFooter={false}` to keep the footer in its normal position at any height. The settings example preserves local drafts across tabs. Save records a local snapshot, and Cancel restores it.

## Forms and field layouts

`Form` renders a native form with `layout="vertical"`, `"horizontal"`, or `"inline"`. TextField, Select, TextArea, and other field components provide their own labels. Use explicit Grid groups for inputs and the `actions` slot for submit/reset buttons outside that Grid. Horizontal labels and actions share `labelWidth` (144px by default), with start/end label alignment; narrow containers stack labels above controls. `FormLayout` provides a local layout scope for mixed sections inside one native form.

Field helper text appears below its control, both inside and outside Form. This keeps peer controls aligned when only one field has additional guidance. An error replaces the corresponding hint, and the control retains its native description relationship.

The [Form examples](http://127.0.0.1:5173/#components/form) and [FormLayout examples](http://127.0.0.1:5173/#components/form-layout) include layout switching, long labels, inline filtering, mixed groups, independent feedback, and a nested-profile result stored within the example. Native form names are mapped into that result, and the example handles validation and saved values.

The TextField and TextArea examples cover password visibility, clear/refocus, character limits and counts, local search, focus/select actions, and a limited multiline note. Each scenario has matching Preview/Code content.

## Tooltips

`Tooltip` displays supplemental text on hover or keyboard focus while retaining the trigger's native action and accessible label. It supports aligned placements, arrow and delay options, controlled visibility, and Escape dismissal. Positioning fits the viewport and updates when the trigger or surrounding layout changes. The [Tooltip examples](http://127.0.0.1:5173/#components/tooltip) include clipped scrolling content, a native dialog, and a focusable explanation for an unavailable action. Place essential instructions inline and use a dialog or disclosure for interactive content.

## Layout grid

In form examples, use `Grid` and `GridItem` to space related input controls. Use `columns={1}` for stacked inputs, responsive columns for side-by-side inputs, and a shared gap token on both axes. Put related checkboxes or switches inside a native `Fieldset`, with the Grid inside that group; labels, form values, and DOM reading order stay with their controls. Keep action buttons in a compact flex row with a shared gap and wrapping when needed.

`Grid` and `GridItem` provide one container-responsive layout contract for cards, forms, side panels, and nested components. The default columns are `{ base: 4, sm: 8, md: 12 }`, with container tiers `base: 0`, `sm: 480px`, `md: 768px`, `lg: 1024px`, and `xl: 1280px`. These measure the nearest Grid container, not the viewport; nested grids establish their own scope.

A scalar value stays constant. Responsive objects inherit the most recent supplied value upward; an omitted base starts from the property's base default. Supplying `columns` replaces the full default 4/8/12 recipe. Counts are positive integers normalized to 1–24.

Gap values are token steps: `gap={4}` is `--cr-space-4` (16px). Accepted steps are `0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16`. Omitted `rowGap` and `columnGap` follow the gap recipe at every tier. Providing either axis prop replaces that axis's complete recipe: its omitted higher tiers inherit its prior value rather than later changes in `gap`. In extremely narrow containers, column gutters cap to available space so gaps alone do not overflow the grid.

`GridItem` defaults to `span="full"`; numeric spans clamp to the active column count. `span={4}` therefore makes one, two, then three cards per row under the default preset. `rowSpan`, item alignment, and nested responsive overrides are supported. Plain direct children of Grid occupy one track. The layout retains DOM order, does not add ARIA grid behavior, and preserves each nested component's semantics.

```tsx
<Grid gap={{ base: 3, md: 6 }}>
  <GridItem span={{ base: 'full', md: 8 }}><MainContent /></GridItem>
  <GridItem span={{ base: 'full', md: 4 }}>
    <Grid columns={{ base: 1, sm: 2 }} gap={3}>
      <GridItem span={1}><TextField label="Project" /></GridItem>
      <GridItem span={1}><TextField label="Branch" /></GridItem>
    </Grid>
  </GridItem>
</Grid>
```

`GridSpacer` reserves an intentionally empty input position without adding content or a focus stop. It shares GridItem's responsive `span` and `rowSpan`; `visible={{ base: false, sm: true }}` removes the empty cell on narrow layouts. The spacer is undecorated, `aria-hidden`, and inert. Its [foundation page](http://127.0.0.1:5173/#components/grid-spacer) has two Preview/Code examples; the Grid page also includes a working sample. Each example has a switch for its illustrative outline and tint, so the real invisible spacer can be viewed while it still reserves its slot. Use Grid's gap for ordinary field spacing.

```tsx
<Grid columns={{ base: 1, sm: 2 }} gap={4}>
  <GridItem span={1}><TextField label="Project name" /></GridItem>
  <GridSpacer visible={{ base: false, sm: true }} />
  <GridItem span={1}><TextField label="Project owner" /></GridItem>
  <GridItem span={1}><TextField label="Project reviewer" /></GridItem>
</Grid>
```

The public `GridResponsive<T>`, `GridBreakpoint`, `GridGap`, `GridSpan`, alignment types, `gridBreakpoints`, and `gridDefaultColumns` exports make the same contract available to consumers. Grid's ref/native props target its outer container; GridItem's target its item wrapper. Standalone Grid and GridItem reference pages include cards, forms, nested surfaces, span clamping, and local width/gap controls.

## Masonry and Flex

Use [Masonry](http://127.0.0.1:5173/#components/masonry) for cards and examples with uneven heights. It places each item in the shortest available column and recalculates after the container or content changes. Automatic columns use `minColumnWidth` (240px by default) and `maxColumns`; optional `columns` supplies an exact responsive recipe using the same container tiers as Grid. Gaps use the shared spacing steps. DOM order and mounted children remain stable during packing; a normal CSS layout is available before measurement.

`MasonryItem` defaults to one column and supports responsive numeric spans or `span="full"`. A full-span item follows all preceding columns and starts a new shared boundary for subsequent items. `MasonrySpacer` reserves a chosen `height` (64px by default), with the same spans and responsive visibility. It is empty, invisible, inert, and hidden from assistive technology. Its examples provide a separate switch for illustration styling.

```tsx
<Masonry minColumnWidth={280} gap={4}>
  <MasonryItem><Card>Short content</Card></MasonryItem>
  <MasonrySpacer height={96} visible={{ base: false, sm: true }} />
  <MasonryItem><Card>Longer content that determines its own height</Card></MasonryItem>
  <MasonryItem span="full"><Card>A shared section boundary</Card></MasonryItem>
</Masonry>
```

Use [Flex](http://127.0.0.1:5173/#components/flex) for action rows and content stacks. `direction`, `wrap`, `align`, `justify`, `gap`, `rowGap`, and `columnGap` accept scalar or container-responsive values. Defaults are a horizontal unwrapped row, stretch alignment, start justification, and `gap={3}` (12px). Native props/ref target its outer container; the inner flex container keeps children in DOM order without an extra wrapper around each child. Use Grid for peer input groups.

```tsx
<Flex wrap align="center" gap={3}>
  <Button>Save changes</Button>
  <Button variant="secondary">Cancel</Button>
</Flex>
```

## Application patterns

The Patterns section includes Workspace, Task board, Agent monitor, Settings editor, Record search, Record details, and Metrics dashboard.

The additional examples compose existing components with in-memory data:

- Settings editor: tabbed drafts, validation focus, saved snapshots, and discard actions.
- Record search: submitted filters, result counts, empty results, and detail dialogs.
- Record details: editable review metadata, checklist validation, comments, and activity history.
- Metrics dashboard: time-window/service filters, derived metrics, USD charges, and simulated refresh with timer cleanup.

Each new pattern displays the TypeScript module used by the preview, with package imports and its stylesheet included as a comment. Grid groups input fields; Flex and Masonry arrange the remaining content. No network service is required by the examples.

## Component reference

Every public component has one alphabetical sidebar entry and one canonical page at `#components/<kebab-case-name>`, such as `#components/button`, `#components/dialog`, or `#components/path-selector`. Each page contains scenario examples, import/usage code, and its own Property / Description / Type / Default API table. Each example has its own Preview/Code controls and matching source; switching views preserves the example's local state. Previews start at the top left with 24px padding. Centering is an explicit option for examples that need it. The common DOM-props reference is shared; per-component notes state exactly which attributes and native refs are forwarded.

Documentation places Layout, `Grid`, `GridItem`, `GridSpacer`, `Masonry`, `MasonryItem`, `MasonrySpacer`, and `Flex` in Foundations · Layout, and `BrandMark` in Foundations · Brand. Color, typography, spacing, radius/elevation, iconography, and design tokens remain foundational guidance. Their existing standalone API links are preserved; concrete controls, content, feedback, and surfaces remain under Components.

Earlier links such as `#buttons`, `#cards`, `#modals`, `#drawers`, `#fieldsets`, and `#page-panels` resolve to the matching standalone component page. The old `#forms` route remains a hidden compatibility gallery. Workspace, task-board, and agent-monitor patterns keep their own pages.

`PathSelector` is a text input for paths with optional `onBrowse(mode)` integration. It supports typing and pasting; the browse action appears when a host adapter is supplied. The gallery uses a simulated adapter. `CalloutBanner` displays a title, description, caller-supplied action, and optional artwork. The Overview page uses this component.

## Foundations

Use `Text` for headings, paragraphs, and inline formatting. The `size` sets the type preset and native element. Use `display="inline"` for running text of any size and `display="block"` for a standalone block. Use the parent layout’s gap to space text blocks. See [the Text reference](https://shiiinichi.github.io/chartreuse/#components/text) and [the Typography scale](https://shiiinichi.github.io/chartreuse/#typography).

```tsx
import { Flex, Text } from '@chartreuse/ui';

<Flex direction="column" gap={3}>
  <Text size="heading-2">Release review</Text>
  <Text size="body">
    The checklist is <Text bold>ready</Text> for <Text italic>final review</Text>.
    {' '}The due date moved from <Text strikethrough>Thursday</Text> to Friday.
  </Text>
  <Text display="block" size="small">Updated today</Text>
</Flex>
```

The base palette is evergreen `#024340`, light evergreen `#096864`, chartreuse `#DBFFAD`, paper `#FFFDF6`, canvas `#F2F0E6`, muted `#52645F`, and border `#CECCC3`. Supporting colors define agent, status, and feedback styles. Semantic tokens map these primitives to component roles in light and dark themes.

Active highlights use `--cr-color-active` (Evergreen) and `--cr-color-on-active` (Paper). `--cr-color-active-border` gives filled controls a visible edge on dark surfaces. Set these variables on an application wrapper to theme pressed buttons, selected options, checked switches, and tab underlines. [Design tokens](https://shiiinichi.github.io/chartreuse/#tokens)

```css
.workspace {
  color: var(--cr-color-text);
  background: var(--cr-color-canvas);
  border: 1px solid var(--cr-color-border);
  border-radius: var(--cr-radius-md);
  padding: var(--cr-space-6);
}
```

Spacing follows a four-pixel scale. Five radii and three shadows cover controls, cards, panels, and dialogs. All library selectors are prefixed with `cr-`, and cascade layers let consumers override component styles. The library applies no global element reset. Custom properties are available as CSS and via `@chartreuse/ui/tokens`; the Color page exports JSON and CSS.

The [Design tokens foundation](http://127.0.0.1:5173/#tokens) lists all 52 global CSS variables with their defaults, theme branches, and source scopes. Component pages document styling hooks, relevant global tokens, and internal variables controlled by props or state. Fixed CSS values are identified separately from tokens. Token-table disclosures use 24px content padding on every side.

The default scheme follows the operating system. A host can choose a scheme with a `color-scheme` meta element. The documentation maps that meta element to CSS, persists overrides in local storage, handles cross-tab changes, and applies the saved scheme before first paint.

## Accessibility and compatibility

Controls use native elements, visible labels, error descriptions, and disabled states. Tabs provide automatic selection with Arrow keys, Home, and End, with RTL-aware direction. Dialog uses native `showModal()` for containment, Escape dismissal, and focus return. ToastProvider has a persistent polite status region. Motion respects `prefers-reduced-motion`, and controls have larger touch targets on coarse pointers.

The target is current evergreen browsers with support for CSS cascade layers, `:has()`, `color-mix()`, `light-dark()`, and native dialog/popover. Reduced-motion and forced-colors adjustments are provided. The source values of pale divider tokens are for surface separation; form controls use a stronger semantic border token.

## Source reference

Library components and tokens are defined in `src/system`; `src/docs` contains the interactive documentation and examples. `src/system/styles.css` defines shared styles, and `src/system/tokens.ts` exports the design tokens.
