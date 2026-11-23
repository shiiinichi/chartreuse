import type { ComponentReference } from './types';

export const siteNavbarExample = {
  importCode: "import { BrandMark, Flex, Navbar, NavbarItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `export function SiteNavbar() {
  // Set width="full" to use the full available width.
  return (
    <Navbar
      size="lg"
      width="comfortable"
      surface="evergreen"
      aria-label="Workspace"
      brand={<a href="/"><BrandMark /><span>Workspace</span></a>}
      actions={<a href="/account">Account</a>}
    >
      <Flex align="center" wrap gap={2}>
        <NavbarItem href="/projects" aria-current="page">Projects</NavbarItem>
        <NavbarItem href="/activity">Activity</NavbarItem>
        <NavbarItem href="/settings">Settings</NavbarItem>
      </Flex>
    </Navbar>
  );
}`,
};

export const workspaceNavbarExample = {
  importCode: "import { useState } from 'react';\nimport { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';\nimport { Badge, Checkbox, Flex, Navbar, NavbarItem, Progress, Text, WorkspaceContent } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `export function ReleaseWorkspace() {
  const [verified, setVerified] = useState(false);

  return (
    <Navbar
      variant="workspace"
      surface="evergreen"
      aria-label="Release workspace"
      brand={<Text bold>Chartreuse</Text>}
      workspaceProps={{ style: { blockSize: '32rem' } }}
      leftSidebar={{
        label: 'Releases',
        width: 206,
        toggleIcon: <PanelLeftOpen strokeWidth={1.65} />,
        openToggleIcon: <PanelLeftClose strokeWidth={1.65} />,
        defaultOpen: true,
        storageKey: 'release-workspace:releases',
        children: <nav aria-label="Release versions">
          <Flex direction="column" gap={1}>
            <NavbarItem href="/releases/1.8.0" aria-current="page">Workspace navigation</NavbarItem>
            <NavbarItem href="/releases/1.7.0">Activity details</NavbarItem>
          </Flex>
        </nav>,
      }}
      rightSidebar={{
        label: 'Activity',
        width: 224,
        toggleIcon: <PanelRightOpen strokeWidth={1.65} />,
        openToggleIcon: <PanelRightClose strokeWidth={1.65} />,
        defaultOpen: true,
        children: <ul><li>Maya approved the keyboard flow.</li><li>Tomas checked the mobile layout.</li></ul>,
      }}
      workspaceContent={
        <WorkspaceContent as="section">
          <Text size="small">v1.8.0</Text>
          <Text size="heading-3">Workspace navigation</Text>
          <Badge tone="warning" dot>In review</Badge>
          <Progress label="Release checks" value={verified ? 1 : 0} max={1} showLabel />
          <Checkbox label="Keyboard flow" checked={verified} onChange={event => setVerified(event.currentTarget.checked)} />
        </WorkspaceContent>
      }
    />
  );
}`,
};

export const navbarReferences: ComponentReference[] = [{
  name: 'Navbar', slug: 'navbar',
  summary: 'A responsive navigation bar with selectable surfaces and a workspace variant with full-height collapsible sidebars.',
  importCode: "import { useState } from 'react';\nimport { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';\nimport { Badge, BrandMark, Checkbox, Flex, Navbar, NavbarItem, Progress, Text, WorkspaceContent } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `${siteNavbarExample.usageCode}\n\n${workspaceNavbarExample.usageCode}`,
  nativeElement: 'nav',
  nativeProps: 'Native attributes, events, className, style, and the React 19 ref target the nav element.',
  props: [
    { name: 'size', type: "'md' | 'lg'", defaultValue: "'md'", description: 'Large adds vertical padding, taller link targets, and larger text.' },
    { name: 'width', type: "'comfortable' | 'full'", defaultValue: "'comfortable'", description: 'Comfortable centers the content within the shared width cap. Full lets the content span the available parent width. Both retain responsive gutters.' },
    { name: 'variant', type: "'default' | 'workspace'", defaultValue: "'default'", description: 'Default renders the navigation bar. Workspace places the bar above the central content, with optional full-height sidebars on either side.' },
    { name: 'surface', type: "'white' | 'evergreen'", description: 'Select the Navbar background and its foreground palette independently of its layout. Omit to use the variant’s default palette.' },
    { name: 'brand', type: 'ReactNode', description: 'Content at the start of the bar, typically a home link with a wordmark.' },
    { name: 'children', type: 'ReactNode', description: 'Navbar items and other content. Use Flex to group items and set their alignment, gaps, and wrapping.' },
    { name: 'actions', type: 'ReactNode', description: 'Content at the end of the bar, such as an account link or action button.' },
    { name: 'leftSidebar', type: 'NavbarSidebarProps', description: 'Workspace sidebar and toggle at the start of the layout. Supply label and children. See the leftSidebar fields below.' },
    { name: 'rightSidebar', type: 'NavbarSidebarProps', description: 'Workspace sidebar and toggle at the end of the layout. Accepts the same fields as leftSidebar, listed below.' },
    { name: 'leftSidebar.label', type: 'string', required: true, description: 'Accessible name for the sidebar and its toggle, and the default header text.' },
    { name: 'leftSidebar.children', type: 'ReactNode', required: true, description: 'Sidebar body content.' },
    { name: 'leftSidebar.toggleIcon', type: 'IconSource', defaultValue: 'PanelLeft or PanelRight', description: 'Toggle icon in the Navbar. Accepts a Lucide icon, a custom React SVG component, or an inline SVG element. Shown in both states unless openToggleIcon is set.' },
    { name: 'leftSidebar.openToggleIcon', type: 'IconSource', defaultValue: 'toggleIcon', description: 'Toggle icon while the sidebar is open, such as PanelLeftClose.' },
    { name: 'leftSidebar.defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'leftSidebar.open', type: 'boolean', description: 'Controlled open state. Use with onOpenChange.' },
    { name: 'leftSidebar.onOpenChange', type: '(open: boolean) => void', description: 'Called when the toggle opens or closes the sidebar.' },
    { name: 'leftSidebar.storageKey', type: 'string', description: 'Remembers the uncontrolled open state in localStorage under this key.' },
    { name: 'leftSidebar.header', type: 'ReactNode', description: 'Header content. Defaults to label.' },
    { name: 'leftSidebar.footer', type: 'ReactNode', description: 'Footer content below the scrolling body.' },
    { name: 'leftSidebar.width', type: 'number', defaultValue: '280', description: 'Sidebar width in pixels.' },
    { name: 'leftSidebar.maxWidth', type: 'number', description: 'Maximum sidebar width in pixels.' },
    { name: 'leftSidebar.variant', type: "'flush' | 'floating'", defaultValue: "'flush'", description: 'Sidebar surface style.' },
    { name: 'leftSidebar.contentLabel', type: 'string', defaultValue: "'Sidebar content'", description: 'Accessible name for the scrolling body.' },
    { name: 'workspaceContent', type: 'ReactNode', description: 'Content below the bar in the center column. The bar and content expand into the space freed by closed sidebars.' },
    { name: 'workspaceProps', type: "Omit<ComponentPropsWithRef<'div'>, 'children' | 'dangerouslySetInnerHTML'>", description: 'Native props for the workspace shell. Set style.blockSize to use a height within an enclosing layout.' },
    { name: 'aria-label', type: 'string', defaultValue: "'Primary'", description: 'Accessible name for the navigation landmark.' },
  ],
  notes: [
    'Large can be combined with every variant. The workspace bar fills the center column.',
    'The bar surface spans the parent. The width setting applies to the inner row of links, branding, and actions.',
    'Current links use a solid evergreen highlight by default. The evergreen surface uses Light Evergreen for current links and open sidebar toggles. Use native style to supply a custom background and colorScheme.',
    'The deprecated dark-green variant is an alias for the default layout with the evergreen surface. Existing callers can migrate to surface="evergreen".',
    'NavbarItem links retain their styles inside Flex. Direct native anchors and router links also receive the navbar link styles. Mark the current route with aria-current="page".',
    'Content wraps in reading order when space is limited. Give each navigation landmark a distinct name when a page contains multiple navigations.',
    'The workspace shell fills the viewport height by default. Each open sidebar spans the shell from top to bottom alongside both the bar and content. Its body scrolls between its header and footer. Each sidebar header is at least as tall as the Navbar and grows when its content needs more space.',
    'Each sidebar starts closed. Use defaultOpen to set its initial state, or open with onOpenChange to control it. Set storageKey to remember the uncontrolled open state in localStorage across visits. Server rendering uses defaultOpen and the stored state applies after hydration.',
    'Provide a distinctive label for each sidebar. Use toggleIcon to replace the default panel icon with a Lucide icon, a custom React SVG component, or an inline SVG element. Add openToggleIcon to show a different icon while the sidebar is open.',
    'A sidebar stays open while you work in the center. Only its Navbar toggle closes and reopens it. When a sidebar closes with focus inside it, focus returns to its toggle.',
  ],
}, {
  name: 'NavbarItem', slug: 'navbar-item',
  summary: 'A navbar item for a navigation link, a control, or custom display content.',
  importCode: "import { Badge, Flex, Navbar, NavbarItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `export function WorkspaceLinks() {
  return (
    <Navbar size="lg" aria-label="Workspace">
      <Flex align="center" wrap gap={2}>
        <NavbarItem href="/projects" aria-current="page">Projects</NavbarItem>
        <NavbarItem href="/activity">Activity</NavbarItem>
        <NavbarItem><Badge tone="info">Read only</Badge></NavbarItem>
      </Flex>
    </Navbar>
  );
}`,
  nativeElement: 'a or div',
  nativeProps: 'With href, native anchor props and the ref target the link. Omit href to pass div props and a ref to a content container.',
  props: [
    { name: 'href', type: 'string', description: 'Destination URL. Set this to render a native link.' },
    { name: 'children', type: 'ReactNode', description: 'A link label, control, status badge, or other React content.' },
    { name: 'aria-current', type: "AriaAttributes['aria-current']", description: 'Mark a link to the current destination with "page".' },
  ],
  notes: [
    'Omit href to place controls or display content in the navbar. Interactive children use their own semantics and focus behavior.',
    'NavbarItem gets its minimum height from the surrounding Navbar size.',
    'The current link uses a solid highlight and stronger text weight.',
  ],
}];
