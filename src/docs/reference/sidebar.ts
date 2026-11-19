import type { ComponentReference } from './types';

export const sidebarReferences: ComponentReference[] = [{
  name: 'Sidebar', slug: 'sidebar',
  summary: 'An aside with persistent header and footer slots and an independently scrolling body.',
  importCode: "import type { ReactNode } from 'react';\nimport { Button, Flex, Navbar, NavbarItem, Sidebar, TextField, WorkspaceContent, WorkspaceLayout } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `type RunHistoryProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onLoadMore: () => void;
  children: ReactNode;
};

export function FloatingRunHistory({ query, onQueryChange, onLoadMore, children }: RunHistoryProps) {
  return (
    <div style={{ blockSize: 620 }}>
      <Sidebar variant="floating" width={280} maxWidth={320}
        aria-label="Run history" contentLabel="Recorded runs"
        header={<TextField label="Search loaded runs" type="search" value={query}
          onChange={event => onQueryChange(event.currentTarget.value)} />}
        footer={<Button size="sm" variant="ghost" onClick={onLoadMore}>Load more</Button>}>
        {children}
      </Sidebar>
    </div>
  );
}

// A full-width navbar spans the flush sidebar and its adjacent content.
export function WorkspaceExample({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar size="lg" width="full" variant="dark-green" aria-label="Application pages">
        <Flex align="center" wrap gap={2}>
          <NavbarItem href="/workspace" aria-current="page">Workspace</NavbarItem>
          <NavbarItem href="/agents">Agent monitor</NavbarItem>
        </Flex>
      </Navbar>
      <WorkspaceLayout>
        <Sidebar variant="flush" aria-label="Workspace tools" contentLabel="Workspace links"
          header={<strong>Workspace tools</strong>} style={{ blockSize: 620 }}>
          <nav aria-label="Workspace pages">
            <Flex direction="column" gap={1}>
              <NavbarItem href="/tasks">All tasks</NavbarItem>
              <NavbarItem href="/projects">Projects</NavbarItem>
            </Flex>
          </nav>
        </Sidebar>
        <WorkspaceContent aria-label="Workspace content">{children}</WorkspaceContent>
      </WorkspaceLayout>
    </div>
  );
}`,
  nativeElement: 'aside with header, scrollable body, and footer',
  nativeProps: 'Inherits native aside attributes, events, className, style, and ref. Native props/ref target the aside. Navigation links and selection semantics are supplied by the consumer.',
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Content placed in the independently scrolling body.' },
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
    'Use NavbarItem inside a nav for routes. Use Button with aria-pressed when selecting an item for an adjacent inspector.',
    'A ghost Button in the body uses an evergreen highlight when aria-pressed is true.',
    'Place Sidebar and WorkspaceContent inside WorkspaceLayout, with Navbar above them for application-wide links.',
    'Label multiple sidebars with aria-label or aria-labelledby, and use contentLabel to identify each scrolling region.',
    'Floating and flush variants share the same slots and content behavior. The host supplies the slot content and application state.',
    'Sidebar does not fix itself to the viewport, collapse automatically, or open modally. Use Drawer when the panel needs controlled visibility or modal behavior.',
  ],
}];
