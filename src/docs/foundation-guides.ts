// Dependency-free foundation guidance shared with the agent CLI. Values come from src/system/*.css,
// the components, and the documentation foundation pages. test/cli.test.mjs checks the --cr-* names,
// control heights, coarse-pointer rules, radius and shadow mapping, and the focus-outline note against
// the CSS; review the remaining notes when components change.

export interface FoundationGuide {
  id: string;
  label: string;
  description: string;
  /** Docs route, or null when the guide has no documentation page. */
  docsPath?: string | null;
  /** Words this guide answers first; indexed like its title but never printed. */
  topics?: string;
  /** Extra search words; indexed with the description but never printed. */
  keywords?: string;
  notes: string[];
  /** A short snippet printed with the guide; language defaults to tsx. */
  code?: string;
  language?: string;
}

export const colorGuide: FoundationGuide = {
  id: 'color',
  label: 'Color',
  description: 'Use semantic color tokens for surfaces, text, borders, actions, and status tones in light and dark themes.',
  docsPath: '#colors',
  topics: 'colour palette',
  keywords: 'theme theming scheme brand semantic contrast background foreground body',
  notes: [
    'Style with the semantic --cr-color-* tokens. Brand primitives such as --cr-evergreen, --cr-chartreuse, and --cr-paper are fixed values that do not follow the color scheme.',
    'Surfaces: --cr-color-canvas for the workspace background, --cr-color-surface for raised surfaces such as Card, Dialog, and inputs, and --cr-color-subtle for inset areas and hover backgrounds. Text: --cr-color-text for primary text and inherited icon color, --cr-color-muted for secondary text, hints, placeholders, and lower-emphasis icons.',
    'Borders: --cr-color-border separates surfaces such as cards, dividers, and tab lists. --cr-color-input-border is the stronger edge of form controls and secondary buttons.',
    'Draw content on --cr-color-primary with --cr-color-on-primary. Selected, pressed, and current states use --cr-color-active with --cr-color-on-active, edged by --cr-color-active-border; active stays evergreen in both themes, while primary turns chartreuse in dark.',
    'Each status tone has a foreground and a tinted surface: --cr-color-success with --cr-color-success-bg, and the same for info, warning, and danger. Components take tone="success" and similar props; use the matching pair together in custom CSS.',
    'Never signal meaning with color alone. Pair status colors with text or an icon, as Badge (a dot or icon plus a label) and Alert (a tone icon plus a title) do.',
    'Semantic tokens use light-dark() and follow the document color-scheme, which :root sets to light dark. Force one scheme with <meta name="color-scheme" content="light"> or content="dark".',
    'The library does not style body. Set body { background: var(--cr-color-canvas); color: var(--cr-color-text); font-family: var(--cr-font-sans); } so the page follows the theme.',
    'Override semantic --cr-color-* tokens on an application wrapper, in pairs and with light-dark() for both themes, for example .my-feature { --cr-color-primary: light-dark(#096864, #dbffad); --cr-color-on-primary: light-dark(#fffdf6, #024340); }.',
    'Override brand primitives only on :root; on a wrapper they change the few rules that read them directly, such as the accent Button, CalloutBanner, and the evergreen Navbar surface, but not the semantic tokens, which resolve var(--cr-evergreen) and similar at :root. Tooltip renders into the enclosing native dialog or document.body, so a wrapper override reaches a tooltip only when the wrapper contains that dialog.',
    'In forced colors mode the active highlight becomes Highlight and HighlightText, focused inputs outline in Highlight, and badges, avatars, and switch tracks gain CanvasText borders. Check custom styles there too.',
  ],
};

export const spacingGuide: FoundationGuide = {
  id: 'spacing',
  label: 'Spacing',
  description: 'Use the four-pixel spacing scale through Grid and Flex gap props, shared control heights, and content gutters.',
  docsPath: '#spacing',
  topics: 'gap padding margin',
  keywords: 'space scale gutter density whitespace control height size',
  notes: [
    'The scale is --cr-space-1, --cr-space-2, --cr-space-3, --cr-space-4, --cr-space-5, --cr-space-6, --cr-space-8, --cr-space-10, --cr-space-12, and --cr-space-16: 4 to 64px at a 16px root. Values are rem, so they scale with the root font size.',
    'Space children with the gap prop on Grid and Flex, not margins. gap takes a scale step: gap={4} is --cr-space-4 (16px), not 4px. Valid steps are 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, and 16; Grid defaults to 4 and Flex to 3.',
    'Use responsive objects such as gap={{ base: 3, md: 6 }} to change spacing at the container-width tiers. rowGap and columnGap set one axis.',
    'Typical rhythm: 8px (--cr-space-2) within a component, such as an icon and its label; 16px (--cr-space-4) between related controls; 32px (--cr-space-8) between sections.',
    'In custom CSS, use var(--cr-space-*) for padding and gaps instead of literal pixel values.',
    'Controls share heights: size="sm", "md" (default), and "lg" give Button, TextField, Select, and Tabs minimum heights of 32, 40, and 46px. Keep controls in one row at the same size.',
    'On coarse pointers, md buttons, inputs, and tabs grow to 44px, as do checkbox and switch rows and IconButton widths. size="sm" buttons, IconButtons, inputs, and tabs stay at 32px because their size rule outranks the touch rule; SegmentedControl and Pagination sm controls do grow to 44px. Alert, Toast, and Drawer dismiss buttons are sm IconButtons.',
    'WorkspaceContent width="comfortable" caps content at --cr-layout-content-max (1320px, gutters included); width="full" removes the cap. Both keep --cr-layout-gutter, which ranges from 65px at 1600px and wider to 16px at 360px and narrower.',
    'Grid columns follow the container width, not the viewport: by default 4 columns below 480px, 8 from 480px, and 12 from 768px. Use GridSpacer, not margins, to leave a cell empty.',
  ],
};

export const shapeGuide: FoundationGuide = {
  id: 'shape',
  label: 'Shape and elevation',
  description: 'Apply the shared radius tokens by component role, and separate surfaces with borders before shadows.',
  docsPath: '#elevation',
  topics: 'radius shadow corner elevation',
  keywords: 'rounded border depth',
  notes: [
    '--cr-radius-sm (4px): badges, segmented control options, inline code, and small count chips.',
    '--cr-radius-md (7px): buttons, text inputs, selects, alerts, file pickers, and Markdown code blocks.',
    '--cr-radius-lg (10px): cards, toasts, fieldsets, disclosures, swimlanes, floating sidebars, and the message composer.',
    '--cr-radius-xl (14px): dialogs and page panels.',
    '--cr-radius-full (999px): pills and circles, such as switch tracks, progress bars, slider tracks, and step and timeline markers.',
    '--cr-shadow-sm: cards, floating sidebars, hovered buttons, and selected pill tabs. --cr-shadow-md: tooltips. --cr-shadow-lg: dialogs, modal drawers, toasts, and option-list popovers.',
    'Use borders before shadows. Separate in-page surfaces with a 1px --cr-color-border; Card pairs that border with only --cr-shadow-sm. Reserve --cr-shadow-md and --cr-shadow-lg for content that floats above the page.',
    'Override shape on an application wrapper, for example .my-feature { --cr-radius-md: var(--cr-radius-lg); }, rather than restyling each component. Tooltip renders into the enclosing native dialog or document.body, so set its overrides on :root unless the wrapper contains that dialog.',
  ],
};

export const iconsGuide: FoundationGuide = {
  id: 'icons',
  label: 'Iconography',
  description: 'Use Lucide or custom SVG components in icon slots, sized by context and hidden from assistive technology when decorative.',
  docsPath: '#icons',
  topics: 'svg lucide',
  keywords: 'glyph symbol',
  notes: [
    "Import icons from lucide-react, for example import { Search } from 'lucide-react';. @chartreuse/ui depends on it; add it to your own dependencies when you import it directly.",
    'Icon slots such as icon and iconRight (type IconSource) accept a Lucide component, a React SVG component that accepts IconProps, or an inline <svg> element. Strings, other HTML elements, and fragments render nothing.',
    'Slots size icons for you: 16px in Button and TextField, 17px in IconButton, and 12px in Badge. For standalone icons, use 16px in controls, 20px for navigation, and 24px for larger emphasis.',
    'Icons inherit currentColor, so they follow the surrounding text color. Do not hardcode fills; custom SVGs should use currentColor for strokes or fills with a 24 by 24 viewBox.',
    'Slot icons are decorative: the library sets aria-hidden and focusable="false". Add aria-hidden="true" to icons you render yourself, and put the meaning in adjacent text.',
    'Icon-only actions use IconButton with a required label, which sets aria-label and the default title. Name the action, such as "Close dialog" or "Dismiss notification", not the icon.',
    'Custom SVG components should accept IconProps and forward SVG props so the control can set size and accessibility attributes. Do not set fixed CSS dimensions, scripts, or event handlers. Convert SVG strings to JSX first.',
    'Type slot props with IconSource and SVG component props with IconProps; both are exported from @chartreuse/ui.',
  ],
};

export const accessibilityGuide: FoundationGuide = {
  id: 'accessibility',
  label: 'Accessibility',
  description: 'What Chartreuse handles for labels, focus, live regions, motion, forced colors, and touch targets, and what the application must add.',
  docsPath: null,
  topics: 'a11y focus aria keyboard',
  keywords: 'screen reader assistive technology live region announce reduced motion forced colors high contrast touch target wcag',
  notes: [
    'Form controls such as TextField, TextArea, Select, Checkbox, and Switch require label and render a native <label> tied to the control; hint and error are linked through aria-describedby, and error sets aria-invalid. MessageComposer label is optional, so supply one. Placeholders are not labels.',
    'To hide a visible label, use hideLabel on TextField, TextArea, Select, Slider, or SegmentedControl; it keeps the accessible name. Other controls have no hideLabel.',
    'IconButton requires label, and Tabs requires label for its tab list. Give every icon-only action and grouped widget a specific name.',
    'Live regions: ToastProvider keeps a role="status" region mounted, and Spinner is role="status" with a visually hidden label (default "Loading"). Alert has no role by default; add role="status" for a dynamic notice or role="alert" for an urgent error. Skeleton is aria-hidden, so announce loading with Spinner or aria-busy on the container.',
    'Dialog uses the native <dialog> with showModal(), so the rest of the page is inert and Escape closes it; an autoFocus control receives focus on opening. Modal Drawer focuses its autofocus target or heading. Docked Drawer moves focus to its heading on opening and, on closing, returns focus to the invoker only if focus is still inside the drawer.',
    'Tabs move with ArrowLeft and ArrowRight (reversed in right-to-left layouts), Home, and End, and selection follows focus. A standalone Avatar is role="img" named by the person; with showName the visible name identifies the person instead. An icon set with Avatar icon is decorative and does not change the name.',
    'Focus visibility is a library gap. A :focus { outline: none } rule covers every element with a cr- class plus listed descendants, and the library has no :focus-visible rule. Only .cr-input controls (TextField, TextArea, Select, Autocomplete, NumberInput) and MessageComposer draw a focus ring. Buttons, IconButtons, tabs, tab panels, checkboxes, switches, SegmentedControl, Slider, PathSelector and FilePicker inputs, NumberInput steppers, Disclosure summaries, Tree items, Pagination, Navbar, Sidebar, and Breadcrumbs links, and focusable scroll regions show no focus. Add the CSS in this guide to your unlayered application CSS.',
    'Reduced motion: with prefers-reduced-motion: reduce, button, switch, and several component transitions stop, and Spinner and Skeleton stop animating. Drawer entry and the Timeline pending icon animate only when motion is allowed. Apply the same query to custom motion.',
    'Forced colors: active states use Highlight and HighlightText, and badges, avatars, switch tracks, and status dots use CanvasText. Use system colors in custom components there.',
    'Touch targets: on coarse pointers, md buttons, inputs, tabs, checkbox and switch rows, and IconButton widths reach 44px, and text inputs use a 1rem font size. size="sm" buttons, IconButtons, inputs, and tabs stay at 32px, including the sm dismiss buttons in Alert, Toast, and Drawer; SegmentedControl and Pagination sm controls grow to 44px.',
  ],
  language: 'css',
  code: `/* Chartreuse removes :focus outlines without a :focus-visible replacement.
   Add these rules to unlayered application CSS. */
:where([class^='cr-'], [class*=' cr-'], .cr-checkbox input, .cr-tab-list button, .cr-tabs > [role='tabpanel'],
  .cr-dialog-pane-switcher button, .cr-dialog a, .cr-breadcrumbs a, .cr-navbar a, .cr-autocomplete-actions button,
  .cr-markdown :is(a, pre), .cr-agent-activity :is(summary, pre), .cr-agent-activity-list-footer a,
  :is(.cr-blockquote, .cr-activity-item) a):not(.cr-input, .cr-message-composer-input):focus-visible {
  outline: 2px solid var(--cr-color-focus);
  outline-offset: 2px;
}
/* The tab list scrolls and clips larger offsets; scroll regions sit flush in their container. */
.cr-tab-list > button:focus-visible { outline-offset: 0; }
:is(.cr-tabs > [role='tabpanel'], [role='region'][tabindex='0']):focus-visible { outline-offset: -2px; }
/* A tree item wraps its children, so ring its row. */
.cr-tree-item:focus-visible { outline: none; }
.cr-tree-item:focus-visible > .cr-tree-row { outline: 2px solid var(--cr-color-focus); outline-offset: -2px; }
/* Switch and SegmentedControl inputs are visually hidden; ring the visible part. */
.cr-switch:has(input:focus-visible) .cr-switch-track,
.cr-segmented-input:focus-visible + .cr-segmented-label { outline: 2px solid var(--cr-color-focus); outline-offset: 2px; }`,
};

export const writingGuide: FoundationGuide = {
  id: 'writing',
  label: 'Writing',
  description: 'Write interface copy in sentence case, with direct verbs, factual status messages, and literal identifiers.',
  docsPath: null,
  topics: 'copy microcopy capitalization',
  keywords: 'tone voice wording sentence case label content',
  notes: [
    'Use sentence case for titles, labels, buttons, tabs, and options: "Save changes", "Live updates", "Workspace settings". Capitalize only the first word and proper nouns.',
    'Use uppercase only for short eyebrow labels set in Text size="label", as in the preset sample "COMPONENTS AND DESIGN TOKENS". The preset does not change case, so write the capitals.',
    'Start actions with an imperative verb and its object: "Create task", "Save changes", "Open workspace", "Delete task". Use one primary action in each decision context.',
    'Address the user as "you": "Your workspace is up to date."',
    'Status copy states the fact, then the next step: "Connection interrupted" followed by "Retry the request when the connection is available." Errors say how to fix the input: "Use letters, numbers, or hyphens."',
    'Empty states name what is missing and how to fill it: "No tasks" followed by "Create a task to populate this workspace."',
    'Keep labels short and consistent; use the same status names everywhere, such as "To do", "In progress", "In review", and "Done". End in-progress labels with an ellipsis character: "Saving…".',
    'Placeholders show an example or a short prompt, never the label: "Enter a task title", "Choose a workspace". Search and open-ended prompts may end with an ellipsis: "Search projects…", "Describe the change and its constraints…".',
    'Show identifiers literally in a monospace face: task IDs, branch names, paths, and tokens, in <code> or with var(--cr-font-mono). Do not reformat or translate them.',
    'Render dates in <time dateTime="2026-11-17T08:50:05+08:00">Nov 17, 2026, 8:50 AM</time>, with a readable label and a machine-readable value. Timeline items and Conversation messages take a dateTime prop.',
    'Do not use emoji in interface copy. Use Lucide icons for symbols, and keep the meaning in text.',
  ],
};

export const foundationGuides: FoundationGuide[] = [colorGuide, spacingGuide, shapeGuide, iconsGuide, accessibilityGuide, writingGuide];
