import { useId, useState } from 'react';
import { Bot, GitPullRequest, LayoutDashboard, Settings, Tag } from 'lucide-react';
import { Avatar, Badge, BrandMark, Button, Checkbox, Progress } from '../system/components';
import { Flex } from '../system/Flex';
import { Navbar, NavbarItem, NavbarItemGroup } from '../system/Navbar';
import type { NavbarProps } from '../system/Navbar';
import { SegmentedControl } from '../system/SegmentedControl';
import { WorkspaceContent } from '../system/WorkspaceContent';
import { navbarItemGroupExample, siteNavbarExample, workspaceNavbarExample } from './reference/navbar';
import { Showcase } from './shared';
import { Text } from '../system';
import './navbar-demo.css';

const widthOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'full', label: 'Full width' },
];
const surfaceOptions = [
  { value: 'evergreen', label: 'Evergreen' },
  { value: 'white', label: 'White' },
] as const;
const siteSurfaceOptions = [{ value: 'theme', label: 'Theme' }, ...surfaceOptions];
const sizeOptions = [
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];
function SiteNavbarDemo() {
  const [width, setWidth] = useState<NonNullable<NavbarProps['width']>>('comfortable');
  const [surface, setSurface] = useState<NavbarProps['surface']>('evergreen');
  const [size, setSize] = useState<NonNullable<NavbarProps['size']>>('lg');
  const id = useId();
  const { importCode, usageCode } = siteNavbarExample;

  return (
    <Showcase title="Size, appearance, and width" description="The preview uses a smaller width cap to show how the links align in both modes." code={`${importCode}\n\n${usageCode}`}>
      <div className="navbar-demo">
        <Flex align="end" wrap gap={4}>
          <SegmentedControl label="Size" name={`navbar-size-${id}`} size="sm" options={sizeOptions} value={size}
            onValueChange={value => setSize(value === 'lg' ? 'lg' : 'md')} />
          <SegmentedControl label="Navbar surface" name={`navbar-surface-${id}`} size="sm" options={siteSurfaceOptions} value={surface ?? 'theme'}
            onValueChange={value => setSurface(value === 'white' || value === 'evergreen' ? value : undefined)} />
          <SegmentedControl label="Preview width" name={`navbar-width-${id}`} size="sm" options={widthOptions} value={width}
            onValueChange={value => setWidth(value === 'full' ? 'full' : 'comfortable')} />
        </Flex>
        <Navbar size={size} width={width} surface={surface} className="navbar-demo-bar" aria-label="Example site"
          brand={<a href="#overview"><BrandMark /><span className="navbar-demo-brand">Chartreuse<Text size="small">Design system</Text></span></a>}
          actions={<a href="#getting-started">Get started</a>}>
          <Flex align="center" wrap gap={2}>
            <NavbarItem href="#components/navbar" aria-current="page">Navbar</NavbarItem>
            <NavbarItem href="#layout">Layout</NavbarItem>
            <NavbarItem href="#tokens">Tokens</NavbarItem>
          </Flex>
        </Navbar>
      </div>
    </Showcase>
  );
}

const releases = [
  {
    version: 'v1.8.0', title: 'Workspace navigation', status: 'In review', tone: 'warning',
    summary: 'Full-height panels give navigation and review activity a home on either side of the workspace.',
    checks: [
      { label: 'Keyboard flow', detail: 'Verify toggles, Escape, and focus return.', done: true },
      { label: 'Pane layout', detail: 'Check both sidebars at desktop and mobile widths.', done: true },
      { label: 'Usage guide', detail: 'Review the examples for custom icons and pinning.', done: false },
      { label: 'Package build', detail: 'Confirm the public types and stylesheet.', done: false },
    ],
    activity: [
      { name: 'Maya Chen', color: 'green', time: '10:42', text: 'Approved the keyboard flow.' },
      { name: 'Tomas Reyes', color: 'blue', time: '10:18', text: 'Checked the layout on a phone.' },
      { name: 'Iris Bell', color: 'peach', time: '09:54', text: 'Added the workspace usage guide.' },
      { name: 'Maya Chen', color: 'green', time: '09:21', text: 'Opened the release for review.' },
    ],
  },
  {
    version: 'v1.7.0', title: 'Activity details', status: 'Published', tone: 'success',
    summary: 'Expanded activity rows keep longer agent titles readable alongside their status and timing.',
    checks: [
      { label: 'Title wrapping', detail: 'Review multi-line and truncated titles.', done: true },
      { label: 'Package build', detail: 'Verify the published styles and types.', done: true },
    ],
    activity: [
      { name: 'Iris Bell', color: 'peach', time: '15:24', text: 'Published the package.' },
      { name: 'Maya Chen', color: 'green', time: '14:50', text: 'Approved the title examples.' },
    ],
  },
  {
    version: 'v1.6.0', title: 'Form controls', status: 'Published', tone: 'success',
    summary: 'Shared sizes and keyboard behavior make form controls easier to combine in compact layouts.',
    checks: [
      { label: 'Field sizes', detail: 'Check compact and default controls side by side.', done: true },
      { label: 'Keyboard flow', detail: 'Review focus order and form submission.', done: true },
    ],
    activity: [
      { name: 'Tomas Reyes', color: 'blue', time: '13:08', text: 'Published the package.' },
      { name: 'Iris Bell', color: 'peach', time: '12:35', text: 'Reviewed native form behavior.' },
    ],
  },
] as const;

function WorkspaceNavbarDemo() {
  const headingId = useId();
  const [surface, setSurface] = useState<NonNullable<NavbarProps['surface']>>('evergreen');
  const [size, setSize] = useState<NonNullable<NavbarProps['size']>>('md');
  const [selectedRelease, setSelectedRelease] = useState(0);
  const [checkOverrides, setCheckOverrides] = useState<Record<string, Record<string, boolean>>>({});
  const release = releases[selectedRelease];
  const checked = release.checks.map(check => checkOverrides[release.version]?.[check.label] ?? check.done);
  const complete = checked.filter(Boolean).length;
  const { importCode, usageCode } = workspaceNavbarExample;

  return (
    <Showcase title="Release review workspace"
      description="Toggle either full-height panel from the Navbar. The release list remembers whether it was open. At either size, each sidebar toggle is a square icon button inset as far from the side edge as from the top and bottom."
      code={`${importCode}\n\n${usageCode}`} className="navbar-workspace-showcase">
      <Flex className="navbar-workspace-surface" align="end" wrap gap={4}>
        <SegmentedControl label="Size" name={`${headingId}-size`} size="sm" options={sizeOptions} value={size}
          onValueChange={value => setSize(value === 'lg' ? 'lg' : 'md')} />
        <SegmentedControl label="Navbar surface" name={`${headingId}-surface`} size="sm"
          options={surfaceOptions} value={surface} onValueChange={value => setSurface(value === 'white' ? 'white' : 'evergreen')} />
      </Flex>
      <Navbar variant="workspace" size={size} surface={surface} aria-label="Release workspace"
        brand={<span className="navbar-workspace-demo-brand"><BrandMark /><Text bold>Chartreuse</Text></span>}
        workspaceProps={{ className: 'navbar-workspace-demo' }}
        leftSidebar={{
          label: 'Releases',
          contentLabel: 'Release list',
          width: 206,
          defaultOpen: true,
          storageKey: 'chartreuse-docs:navbar-demo:releases',
          children: <ul className="navbar-release-list" role="list">
            {releases.map((item, index) => (
              <li key={item.version}>
                <Button className="navbar-release-link" variant="ghost" icon={index === 0 ? GitPullRequest : Tag}
                  aria-label={`${item.title}, ${item.version}`} title={item.title}
                  aria-current={selectedRelease === index ? 'true' : undefined} onClick={() => setSelectedRelease(index)}>
                  <span><Text bold>{item.title}</Text><Text size="small">{item.version}</Text></span>
                </Button>
              </li>
            ))}
          </ul>,
        }}
        rightSidebar={{
          label: 'Activity',
          contentLabel: 'Release activity',
          width: 224,
          defaultOpen: true,
          children: <ol className="navbar-release-activity" role="list">
            {release.activity.map(event => (
              <li key={event.time}>
                <Avatar name={event.name} color={event.color} size="sm" aria-hidden="true" />
                <div>
                  <Text bold>{event.name}</Text>
                  <Text size="body">{event.text}</Text>
                  <time dateTime={event.time}>{event.time}</time>
                </div>
              </li>
            ))}
          </ol>,
        }}
        workspaceContent={
          <WorkspaceContent as="section" aria-labelledby={headingId} className="navbar-workspace-demo-content">
            <div className="navbar-release-heading">
              <div><span className="navbar-release-version">{release.version}</span>
                <Text size="heading-3" className="navbar-release-title" id={headingId}>{release.title}</Text></div>
              <Badge tone={release.tone} dot>{release.status}</Badge>
            </div>
            <Text size="body" className="navbar-release-summary">{release.summary}</Text>
            <section className="navbar-release-checks" aria-labelledby={`${headingId}-checks`}>
              <header>
                <div>
                  <Text bold role="heading" aria-level={4} id={`${headingId}-checks`}>Release checks</Text>
                  <span>{complete} of {checked.length} done</span>
                </div>
                <Progress label="Release checks completed" value={complete} max={checked.length} />
              </header>
              <ul role="list">
                {release.checks.map((check, index) => (
                  <li key={check.label}>
                    <Checkbox label={check.label} hint={check.detail} checked={checked[index]} onChange={event => {
                      const done = event.currentTarget.checked;
                      setCheckOverrides(current => ({ ...current, [release.version]: { ...current[release.version], [check.label]: done } }));
                    }} />
                  </li>
                ))}
              </ul>
            </section>
          </WorkspaceContent>
        }
      />
    </Showcase>
  );
}

export function NavbarDemo() {
  return <div className="reference-demo-stack">
    <WorkspaceNavbarDemo />
    <SiteNavbarDemo />
  </div>;
}

export function NavbarItemDemo() {
  return (
    <Navbar size="lg" width="full" className="navbar-demo-bar" aria-label="Example pages">
      <Flex align="center" wrap gap={2}>
        <NavbarItem href="#components/navbar">Navbar</NavbarItem>
        <NavbarItem href="#components/navbar-item" aria-current="page">Navbar item</NavbarItem>
        <NavbarItem href="#layout">Layout</NavbarItem>
        <NavbarItem><Badge tone="info">Read only</Badge></NavbarItem>
      </Flex>
    </Navbar>
  );
}

const groupPages = [
  { id: 'board', label: 'Board', icon: LayoutDashboard, href: '#task-board' },
  { id: 'agents', label: 'Agents', icon: Bot, href: '#agent-monitor' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '#workspace' },
] as const;
const labelOptions = [{ value: 'labels', label: 'Icons and labels' }, { value: 'icons', label: 'Icons only' }];

export function NavbarItemGroupDemo() {
  const id = useId();
  const [page, setPage] = useState('board');
  const [size, setSize] = useState<NonNullable<NavbarProps['size']>>('md');
  const [iconOnly, setIconOnly] = useState(false);
  const { importCode, usageCode } = navbarItemGroupExample;
  const group = (surface: string) => <NavbarItemGroup variant="segmented" iconOnly={iconOnly} aria-label={`Pages, ${surface} example`}>
    {groupPages.map(item => <NavbarItem key={item.id} href={item.href} icon={item.icon}
      aria-current={page === item.id ? 'page' : undefined}
      onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) { event.preventDefault(); setPage(item.id); } }}>{item.label}</NavbarItem>)}
  </NavbarItemGroup>;

  return (
    <Showcase title="Segmented page switcher" description="Select a page in either Navbar. Each item is a link, so it opens in a new tab and follows the normal Tab order." code={`${importCode}\n\n${usageCode}`}>
      <div className="navbar-demo">
        <Flex align="end" wrap gap={4}>
          <SegmentedControl label="Size" name={`navbar-group-size-${id}`} size="sm" options={sizeOptions} value={size}
            onValueChange={value => setSize(value === 'lg' ? 'lg' : 'md')} />
          <SegmentedControl label="Labels" name={`navbar-group-labels-${id}`} size="sm" options={labelOptions} value={iconOnly ? 'icons' : 'labels'}
            onValueChange={value => setIconOnly(value === 'icons')} />
        </Flex>
        <Navbar size={size} width="full" surface="evergreen" className="navbar-demo-bar" aria-label="Evergreen example"
          brand={<span className="navbar-workspace-demo-brand"><BrandMark /><Text bold>Orchestrator</Text></span>}>
          {group('evergreen')}
        </Navbar>
        <Navbar size={size} width="full" surface="white" className="navbar-demo-bar" aria-label="White example"
          brand={<span className="navbar-workspace-demo-brand"><BrandMark /><Text bold>Orchestrator</Text></span>}>
          {group('white')}
        </Navbar>
      </div>
    </Showcase>
  );
}
