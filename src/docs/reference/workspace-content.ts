import type { ComponentReference } from './types';

const importCode = "import type { ReactNode } from 'react';\nimport { Flex, Navbar, NavbarItem, Sidebar, WorkspaceContent, WorkspaceLayout } from '@chartreuse/ui';\nimport type { WorkspaceContentProps } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';";
const usageCode = `export function ProjectWorkspace({ children, width = 'comfortable' }: {
  children: ReactNode;
  width?: WorkspaceContentProps['width'];
}) {
  return (
    <>
      <Navbar size="lg" width="full" surface="evergreen" aria-label="Workspace pages">
        <NavbarItem href="/workspace" aria-current="page">Overview</NavbarItem>
        <NavbarItem href="/tasks">Task board</NavbarItem>
      </Navbar>
      <WorkspaceLayout>
        <Sidebar width={192} aria-label="Projects" contentLabel="Project links">
          <nav aria-label="Project pages">
            <Flex direction="column" gap={1}>
              <NavbarItem href="/records">Records</NavbarItem>
              <NavbarItem href="/metrics">Run metrics</NavbarItem>
            </Flex>
          </nav>
        </Sidebar>
        <WorkspaceContent width={width} style={{ paddingBlock: 'var(--cr-space-6)' }}>
          {children}
        </WorkspaceContent>
      </WorkspaceLayout>
    </>
  );
}`;

export const workspaceContentReferences: ComponentReference[] = [{
  name: 'WorkspaceContent', slug: 'workspace-content',
  summary: 'The main workspace region, with a choice of centered or full-width content.',
  importCode,
  usageCode,
  nativeElement: 'main or section',
  nativeProps: 'Native attributes, events, className, style, and the React 19 ref target the outer element.',
  props: [
    { name: 'width', type: "'comfortable' | 'full'", defaultValue: "'comfortable'", description: 'Comfortable centers the content within the shared cap. Full uses all the width allocated to the content area.' },
    { name: 'as', type: "'main' | 'section'", defaultValue: "'main'", description: 'Use main for the page landmark or section to embed the layout inside an existing main.' },
    { name: 'children', type: 'ReactNode', description: 'The body of the workspace.' },
  ],
  notes: [
    'Place WorkspaceContent beside Sidebar in WorkspaceLayout below Navbar.',
    'Both widths retain the shared inline gutters. The host layout can set the outer region’s vertical padding and scrolling.',
    'Use a single main landmark per page. Give an embedded section an accessible name from its heading when it serves as a distinct region.',
  ],
}, {
  name: 'WorkspaceLayout', slug: 'workspace-layout',
  summary: 'A responsive row for Sidebar and WorkspaceContent beneath the navbar.',
  importCode,
  usageCode,
  nativeElement: 'div',
  nativeProps: 'Native attributes, events, className, style, and the React 19 ref target the layout element.',
  props: [
    { name: 'children', type: 'ReactNode', description: 'Sidebar and WorkspaceContent as direct children, in that order. Use WorkspaceContent alone for a content-only layout.' },
  ],
  notes: [
    'Sidebar uses its configured width. WorkspaceContent grows into the available space and wraps below the sidebar when the remaining width is less than 24rem.',
    'Set width on WorkspaceContent to choose how its contents fit within the space assigned by WorkspaceLayout.',
    'Use the native style prop or a class to add a gap or set the height for independently scrolling panels.',
  ],
}];
