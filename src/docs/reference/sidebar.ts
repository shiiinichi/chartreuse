import type { ComponentReference } from './types';

export const sidebarReferences: ComponentReference[] = [{
  name: 'Sidebar', slug: 'sidebar',
  summary: 'An aside with persistent header and footer slots and an independently scrolling body.',
  importCode: "import { Sidebar } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `<div className="sidebar-slot">\n  <Sidebar\n    variant="floating"\n    width={280}\n    maxWidth={320}\n    aria-label="Run history"\n    contentLabel="Recorded runs"\n    header={<RunHistoryHeader />}\n    footer={<LoadMoreRuns />}\n  >\n    <RunSelectionButtons />\n  </Sidebar>\n</div>\n\n// A flush surface uses the same slots.\n<Sidebar variant="flush" header={<WorkspaceFilters />}\n  footer={<WorkspaceFooter />} aria-label="Workspace">\n  <nav aria-label="Workspace pages">\n    <a href="/tasks">All tasks</a>\n    <a href="/projects">Projects</a>\n  </nav>\n</Sidebar>\n\n// The host allocates a definite height; Sidebar fills it.`,
  nativeElement: 'aside with header, scrollable body, and footer',
  nativeProps: 'Inherits native aside attributes, events, className, style, and ref. Native props/ref target the aside. Navigation links and selection semantics are supplied by the consumer.',
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Custom content placed in the independently scrolling body.' },
    { name: 'header', type: 'ReactNode', description: 'Header content outside the scroll region, such as a heading, search field, filters, or creation action.' },
    { name: 'footer', type: 'ReactNode', description: 'Footer content outside and below the scroll region.' },
    { name: 'variant', type: "'floating' | 'flush'", defaultValue: "'flush'", description: 'Floating uses a rounded border and shadow; flush uses an edge divider without radius or shadow.' },
    { name: 'width', type: 'number', defaultValue: '280', description: 'Preferred inline width in pixels. The surface also fits its parent’s available width.' },
    { name: 'maxWidth', type: 'number', description: 'Optional positive maximum width in pixels; it does not expand the preferred width.' },
    { name: 'contentLabel', type: 'string', defaultValue: "'Sidebar content'", description: 'Accessible label for the keyboard-focusable scroll region.' },
    { name: 'className', type: 'string', description: 'Additional classes on the native aside.' },
    { name: 'style', type: 'CSSProperties', description: 'Native layout/theming styles on the aside. Allocate height in the host layout rather than relying on fixed positioning.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native ref to the aside element.' },
  ],
  notes: [
    'Allocate a definite height in the parent to get an independently scrolling body. Without a bounded host, content can determine the surface height normally.',
    'Header and footer remain outside the scroll region. The body has min-block-size: 0, a stable scrollbar gutter, and keyboard focus styling.',
    'Width is capped by the preferred width, optional maxWidth, and available parent width. Invalid or nonpositive width values fall back to 280px; an invalid maxWidth is ignored.',
    'Sidebar supplies an aside layout. Use nav and native links for routes, or labeled buttons for item selection.',
    'Label multiple sidebars with aria-label or aria-labelledby, and use contentLabel to identify each scrolling region.',
    'Floating and flush variants share the same slots and content behavior. The host supplies child styling and application state.',
    'Sidebar does not fix itself to the viewport, collapse automatically, or open modally. Use Drawer when the panel needs controlled visibility or modal behavior.',
  ],
}];
