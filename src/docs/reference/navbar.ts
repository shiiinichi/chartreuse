import type { ComponentReference } from './types';

export const navbarReferences: ComponentReference[] = [{
  name: 'Navbar', slug: 'navbar',
  summary: 'A responsive navigation bar with two sizes, two content widths, and an optional dark green surface.',
  importCode: "import { BrandMark, Flex, Navbar, NavbarItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `export function WorkspaceNavbar() {
  // Set width="full" to use the full available width.
  return (
    <Navbar
      size="lg"
      width="comfortable"
      variant="dark-green"
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
  nativeElement: 'nav',
  nativeProps: 'Native attributes, events, className, style, and the React 19 ref target the nav element.',
  props: [
    { name: 'size', type: "'md' | 'lg'", defaultValue: "'md'", description: 'Large adds vertical padding, taller link targets, and larger text.' },
    { name: 'width', type: "'comfortable' | 'full'", defaultValue: "'comfortable'", description: 'Comfortable centers the content within the shared width cap. Full lets the content span the available parent width. Both retain responsive gutters.' },
    { name: 'variant', type: "'default' | 'dark-green'", defaultValue: "'default'", description: 'Default follows the surrounding theme. Dark green uses the evergreen surface and a dark palette for content inside the bar.' },
    { name: 'brand', type: 'ReactNode', description: 'Content at the start of the bar, typically a home link with a wordmark.' },
    { name: 'children', type: 'ReactNode', description: 'Navbar items and other content. Use Flex to group items and set their alignment, gaps, and wrapping.' },
    { name: 'actions', type: 'ReactNode', description: 'Content at the end of the bar, such as an account link or action button.' },
    { name: 'aria-label', type: 'string', defaultValue: "'Primary'", description: 'Accessible name for the navigation landmark.' },
  ],
  notes: [
    'Large can be combined with either appearance and either width.',
    'The bar surface spans the parent. The width setting applies to the inner row of links, branding, and actions.',
    'Dark green uses a lighter evergreen highlight for the current page in either width mode.',
    'NavbarItem links retain their styles inside Flex. Direct native anchors and router links also receive the navbar link styles. Mark the current route with aria-current="page".',
    'Content wraps in reading order when space is limited. Give each navigation landmark a distinct name when a page contains multiple navigations.',
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
    'The current link uses a solid highlight and stronger text weight. Keyboard focus on links uses an outer outline.',
  ],
}];
