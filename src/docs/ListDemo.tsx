import { useId, useState } from 'react';
import { BookOpen, Braces, CheckCircle2, CircleAlert, CircleX, FileText, GitBranch, Grid2X2, History, Palette, Ruler, Type, Users } from 'lucide-react';
import { Avatar, Badge, Button, Switch } from '../system/components';
import { List } from '../system/List';
import type { ListItem } from '../system/List';
import { SegmentedControl } from '../system/SegmentedControl';
import { ExampleGallery, Showcase } from './shared';
import { Flex, Text } from '../system';
import './list-demo.css';

const steps: ListItem[] = [
  { id: 'scope', title: 'Confirm the release scope' },
  { id: 'notes', title: 'Draft the release notes' },
  { id: 'build', title: 'Build and test the package' },
  { id: 'publish', title: 'Publish the release' },
];
const stepsSource = `const steps: ListItem[] = [
  { id: 'scope', title: 'Confirm the release scope' },
  { id: 'notes', title: 'Draft the release notes' },
  { id: 'build', title: 'Build and test the package' },
  { id: 'publish', title: 'Publish the release' },
];`;

const checks: ListItem[] = [
  { id: 'types', title: 'Type check', description: 'No errors in 214 files.', icon: CheckCircle2, tone: 'success', trailing: <Badge tone="success">Passed</Badge> },
  { id: 'tests', title: 'Unit tests', description: 'Two tests need updated snapshots.', icon: CircleAlert, tone: 'warning', trailing: <Badge tone="warning">2 failing</Badge> },
  { id: 'audit', title: 'Dependency audit', description: 'One package has a known advisory.', icon: CircleX, tone: 'danger', trailing: <Badge tone="danger">Blocked</Badge> },
];

const records: ListItem[] = [
  { id: 'spec', title: <a href="#components/list">API contract.md</a>, description: 'Updated by Sam Lee · 2 hours ago', icon: FileText, trailing: <Button size="sm" variant="ghost">Open</Button> },
  { id: 'branch', title: <a href="#components/list">feat/workspace-list</a>, description: '3 commits ahead of main', icon: GitBranch, trailing: <Button size="sm" variant="ghost">Open</Button> },
  { id: 'team', title: <a href="#components/list">Design review</a>, description: '4 reviewers', icon: Users, trailing: <Button size="sm" variant="ghost">Open</Button> },
];

const navigationGroups: { id: string; label: string; items: ListItem[] }[] = [
  { id: 'start', label: 'Start here', items: [
    { id: 'overview', title: <a href="#components/list" aria-current="page">Overview</a>, icon: Grid2X2 },
    { id: 'getting-started', title: <a href="#components/list">Getting started</a>, icon: BookOpen },
    { id: 'common-props', title: <a href="#components/list">Common DOM props</a>, icon: Braces },
    { id: 'changelog', title: <a href="#components/list">Changelog</a>, icon: History, trailing: <Badge>1.12</Badge> },
  ] },
  { id: 'foundations', label: 'Foundations', items: [
    { id: 'color', title: <a href="#components/list">Color</a>, icon: Palette },
    { id: 'typography', title: <a href="#components/list">Typography</a>, icon: Type },
    { id: 'spacing', title: <a href="#components/list">Spacing</a>, icon: Ruler },
  ] },
];
const navigationCode = `import { BookOpen, Braces, Grid2X2, History, Palette, Ruler, Type } from 'lucide-react';
import { Badge, List, Text, type ListItem } from '@chartreuse/ui';

const groups: { id: string; label: string; items: ListItem[] }[] = [
  { id: 'start', label: 'Start here', items: [
    { id: 'overview', title: <a href="/overview" aria-current="page">Overview</a>, icon: Grid2X2 },
    { id: 'getting-started', title: <a href="/getting-started">Getting started</a>, icon: BookOpen },
    { id: 'common-props', title: <a href="/common-props">Common DOM props</a>, icon: Braces },
    { id: 'changelog', title: <a href="/changelog">Changelog</a>, icon: History,
      trailing: <Badge>1.12</Badge> },
  ] },
  { id: 'foundations', label: 'Foundations', items: [
    { id: 'color', title: <a href="/color">Color</a>, icon: Palette },
    { id: 'typography', title: <a href="/typography">Typography</a>, icon: Type },
    { id: 'spacing', title: <a href="/spacing">Spacing</a>, icon: Ruler },
  ] },
];

<nav aria-label="Documentation" className="docs-nav-list">
  {groups.map(group => <section key={group.id}>
    <Text size="label" display="block" id={\`nav-\${group.id}\`}>{group.label}</Text>
    <List aria-labelledby={\`nav-\${group.id}\`} items={group.items} marker="none" />
  </section>)}
</nav>

/* Example styles: sidebar rows with hover and current-page highlights.
.docs-nav-list { display: flex; flex-direction: column; gap: var(--cr-space-5); max-inline-size: 240px; }
.docs-nav-list .cr-text[data-size='label'] { margin-block-end: var(--cr-space-2); padding-inline: 10px; color: var(--cr-color-muted); text-transform: uppercase; }
.docs-nav-list .cr-list-item { position: relative; align-items: center; padding: 6px 10px; border: 1px solid transparent; border-radius: var(--cr-radius-md); color: var(--cr-color-muted); }
.docs-nav-list .cr-list-item + .cr-list-item { margin-block-start: 2px; }
.docs-nav-list .cr-list-item > .cr-list-marker { color: inherit; }
.docs-nav-list .cr-list-item:hover { background: var(--cr-color-subtle); color: var(--cr-color-text); }
.docs-nav-list .cr-list-item:has(a[aria-current='page']) { border-color: var(--cr-color-active-border); background: var(--cr-color-active); color: var(--cr-color-on-active); font-weight: 550; }
.docs-nav-list .cr-list-item:has(a:focus-visible) { outline: 2px solid var(--cr-color-focus); outline-offset: 2px; }
.docs-nav-list a { color: inherit; text-decoration: none; outline: none; }
Stretch each link over its row so the whole highlighted row is clickable.
.docs-nav-list a::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
*/`;

const chatThreads: ListItem[] = [
  { id: 'release', title: <a href="#components/list">Release planning</a>, description: 'Agent: The release notes draft is ready for review.',
    leading: <Avatar name="Release Agent" color="blue" />,
    trailing: <><time dateTime="2026-11-23T09:42:00+08:00">09:42</time><Badge tone="info" aria-label="2 unread messages">2</Badge></> },
  { id: 'sam', title: <a href="#components/list">Sam Lee</a>, description: 'Can you check the failing snapshot tests before the release?',
    leading: <Avatar name="Sam Lee" color="peach" />,
    trailing: <><time dateTime="2026-11-23T09:10:00+08:00">09:10</time><Badge tone="info" aria-label="1 unread message">1</Badge></> },
  { id: 'design', title: <a href="#components/list" aria-current="page">Design review</a>, description: 'Alex: Updated the sidebar spacing and the list sizes.',
    leading: <Avatar name="Design Review" />,
    trailing: <time dateTime="2026-11-22T17:30:00+08:00">Yesterday</time> },
  { id: 'incident', title: <a href="#components/list">Incident follow-up</a>, description: 'Leo: The timeline and follow-up actions are attached.',
    leading: <Avatar name="Leo Tan" color="purple" />,
    trailing: <time dateTime="2026-11-16T11:05:00+08:00">Mon</time> },
];
const chatThreadsCode = `import { Avatar, Badge, List, type ListItem } from '@chartreuse/ui';

const threads: ListItem[] = [
  { id: 'release', title: <a href="/threads/release">Release planning</a>,
    description: 'Agent: The release notes draft is ready for review.',
    leading: <Avatar name="Release Agent" color="blue" />,
    trailing: <><time dateTime="2026-11-23T09:42:00+08:00">09:42</time>
      <Badge tone="info" aria-label="2 unread messages">2</Badge></> },
  { id: 'sam', title: <a href="/threads/sam">Sam Lee</a>,
    description: 'Can you check the failing snapshot tests before the release?',
    leading: <Avatar name="Sam Lee" color="peach" />,
    trailing: <><time dateTime="2026-11-23T09:10:00+08:00">09:10</time>
      <Badge tone="info" aria-label="1 unread message">1</Badge></> },
  { id: 'design', title: <a href="/threads/design" aria-current="page">Design review</a>,
    description: 'Alex: Updated the sidebar spacing and the list sizes.',
    leading: <Avatar name="Design Review" />,
    trailing: <time dateTime="2026-11-22T17:30:00+08:00">Yesterday</time> },
  { id: 'incident', title: <a href="/threads/incident">Incident follow-up</a>,
    description: 'Leo: The timeline and follow-up actions are attached.',
    leading: <Avatar name="Leo Tan" color="purple" />,
    trailing: <time dateTime="2026-11-16T11:05:00+08:00">Mon</time> },
];

<nav aria-label="Chat threads">
  <List className="chat-thread-list" items={threads} />
</nav>

/* Example styles: one-line previews, unread titles, and hover and current-thread highlights.
.chat-thread-list { max-inline-size: 360px; }
.chat-thread-list .cr-list-item { position: relative; align-items: center; padding: 8px 10px; border: 1px solid transparent; border-radius: var(--cr-radius-md); }
.chat-thread-list .cr-list-item + .cr-list-item { margin-block-start: 2px; }
.chat-thread-list .cr-list-item:hover { background: var(--cr-color-subtle); }
.chat-thread-list .cr-list-item:has(a[aria-current='page']) { border-color: var(--cr-color-active-border); background: var(--cr-color-active); color: var(--cr-color-on-active); }
.chat-thread-list .cr-list-item:has(a[aria-current='page']) :is(.cr-list-description, .cr-list-trailing) { color: inherit; opacity: .8; }
.chat-thread-list .cr-list-item:has(a:focus-visible) { outline: 2px solid var(--cr-color-focus); outline-offset: 2px; }
.chat-thread-list .cr-list-item:has(.cr-badge) .cr-list-title { font-weight: 600; }
.chat-thread-list .cr-list-description { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-thread-list .cr-list-trailing { flex-direction: column; align-items: flex-end; gap: 2px; font-size: .75rem; }
.chat-thread-list a { color: inherit; text-decoration: none; outline: none; }
.chat-thread-list a::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
*/`;

const runs = [
  { id: 'run-12', title: 'Refactor the board columns', status: 'Running', tone: 'info' as const, summary: 'Moving the lane header actions into a shared component and updating the snapshots.', files: '6 files', time: '2:14 PM' },
  { id: 'run-11', title: 'Fix the reply composer height', status: 'Done', tone: 'success' as const, summary: 'Re-measures the inline field when its width changes.', files: '3 files', time: '1:02 PM' },
  { id: 'run-10', title: 'Clickable tree chevrons', status: 'Failed', tone: 'danger' as const, summary: 'Two browser tests timed out waiting for the preview server.', files: '4 files', time: '11:40 AM' },
];
const runRowsCode = (variant: string, flush: boolean) => `import { Badge, Flex, List, Text } from '@chartreuse/ui';

const [selectedId, setSelectedId] = useState<string | null>('run-12');

<List aria-label="Run history" variant="${variant}"${flush ? ' flush' : ''} selectedId={selectedId}
  onSelectionChange={setSelectedId}
  items={runs.map(run => ({
    id: run.id,
    content: <Flex direction="column" gap={2}>
      <Flex direction="row" justify="space-between" align="start" gap={3}>
        <Text bold>{run.title}</Text>
        <Badge tone={run.tone}>{run.status}</Badge>
      </Flex>
      <Text size="body">{run.summary}</Text>
      <Flex direction="row" justify="space-between" gap={3}>
        <span>{run.files}</span><time>{run.time}</time>
      </Flex>
    </Flex>,
  }))} />`;

export function ListDemo() {
  const [variant, setVariant] = useState<'outline' | 'plain'>('outline');
  const [flush, setFlush] = useState(false);
  const [selectedRun, setSelectedRun] = useState<string | null>('run-12');
  const [ordered, setOrdered] = useState(false);
  const [dividers, setDividers] = useState(true);
  const [size, setSize] = useState<'sm' | 'md'>('md');
  const groupId = useId();
  return <div className="list-demo">
    <Text size="body" className="list-demo-intro">Use List for a short set of related items: bullets, numbered instructions, a checklist summary, or compact records with a status. Supply items with a title and optional description, icon, tone, and trailing content.</Text>
    <ExampleGallery>
      <Showcase title="Bullets or numbers" description="The ordered prop renders an ol with numbers; otherwise the list is a ul with bullets." code={`import { List, type ListItem } from '@chartreuse/ui';\n\n${stepsSource}\n\n<List aria-label="Release steps" items={steps}${ordered ? ' ordered' : ''} />`}>
        <div className="list-demo-controls"><Switch label="Ordered" checked={ordered} onChange={event => setOrdered(event.target.checked)} /></div>
        <List aria-label="Release steps" items={steps} ordered={ordered} />
      </Showcase>
      <Showcase title="Icons, descriptions, and trailing content" description="Item icons replace the marker and take the item tone. Trailing content aligns to the end of each row." code={`import { CheckCircle2, CircleAlert, CircleX } from 'lucide-react';\nimport { Badge, List, type ListItem } from '@chartreuse/ui';\n\nconst checks: ListItem[] = [\n  { id: 'types', title: 'Type check', description: 'No errors in 214 files.',\n    icon: CheckCircle2, tone: 'success', trailing: <Badge tone="success">Passed</Badge> },\n  { id: 'tests', title: 'Unit tests', description: 'Two tests need updated snapshots.',\n    icon: CircleAlert, tone: 'warning', trailing: <Badge tone="warning">2 failing</Badge> },\n  { id: 'audit', title: 'Dependency audit', description: 'One package has a known advisory.',\n    icon: CircleX, tone: 'danger', trailing: <Badge tone="danger">Blocked</Badge> },\n];\n\n<List aria-label="Release checks" items={checks} size="${size}"${dividers ? ' dividers' : ''} />`}>
        <div className="list-demo-controls">
          <SegmentedControl label="Size" name={`list-size-${groupId}`} value={size} onValueChange={value => setSize(value === 'sm' ? 'sm' : 'md')} options={[{ value: 'md', label: 'Medium' }, { value: 'sm', label: 'Small' }]} />
          <Switch label="Dividers" checked={dividers} onChange={event => setDividers(event.target.checked)} />
        </div>
        <List aria-label="Release checks" items={checks} size={size} dividers={dividers} />
      </Showcase>
      <Showcase title="Links and actions" description="Titles and trailing slots accept links and buttons; the list itself is not interactive." code={`import { FileText, GitBranch, Users } from 'lucide-react';\nimport { Button, List } from '@chartreuse/ui';\n\n<List aria-label="Related items" dividers items={[\n  { id: 'spec', title: <a href="/docs/api">API contract.md</a>,\n    description: 'Updated by Sam Lee · 2 hours ago', icon: FileText,\n    trailing: <Button size="sm" variant="ghost">Open</Button> },\n  { id: 'branch', title: <a href="/branches/feat-workspace-list">feat/workspace-list</a>,\n    description: '3 commits ahead of main', icon: GitBranch,\n    trailing: <Button size="sm" variant="ghost">Open</Button> },\n  { id: 'team', title: <a href="/reviews/design">Design review</a>,\n    description: '4 reviewers', icon: Users,\n    trailing: <Button size="sm" variant="ghost">Open</Button> },\n]} />`}>
        <List aria-label="Related items" dividers items={records} />
      </Showcase>
      <Showcase title="Numbered from a start value" description="The start prop sets the first number on the native ol and the visible markers." code={`import { List } from '@chartreuse/ui';\n\n<List aria-label="Remaining steps" ordered start={3} items={[\n  { id: 'build', title: 'Build and test the package',\n    description: 'Run the library build and the full test suite.' },\n  { id: 'publish', title: 'Publish the release',\n    description: 'Push the tag and confirm the registry entry.' },\n]} />`}>
        <List aria-label="Remaining steps" ordered start={3} items={[
          { id: 'build', title: 'Build and test the package', description: 'Run the library build and the full test suite.' },
          { id: 'publish', title: 'Publish the release', description: 'Push the tag and confirm the registry entry.' },
        ]} />
      </Showcase>
      <Showcase title="Nested list without markers" description='A List can go in an item’s description. marker="none" hides bullets for a plain stacked list.' code={`import { List } from '@chartreuse/ui';\n\n<List aria-label="Workspace contents" items={[\n  { id: 'board', title: 'Task board', description: <List size="sm" items={[\n    { id: 'todo', title: 'To do · 4 tasks' },\n    { id: 'doing', title: 'In progress · 2 tasks' },\n  ]} /> },\n  { id: 'activity', title: 'Activity', description: <List size="sm" marker="none" items={[\n    { id: 'today', title: '12 updates today' },\n  ]} /> },\n]} />`}>
        <List aria-label="Workspace contents" items={[
          { id: 'board', title: 'Task board', description: <List size="sm" items={[{ id: 'todo', title: 'To do · 4 tasks' }, { id: 'doing', title: 'In progress · 2 tasks' }]} /> },
          { id: 'activity', title: 'Activity', description: <List size="sm" marker="none" items={[{ id: 'today', title: '12 updates today' }]} /> },
        ]} />
      </Showcase>
      <Showcase title="Selectable rows" description='variant="outline" or "plain" draws each item as a Tree-style row. With onSelectionChange, each row is a button that selects it; content can be any layout, such as a Flex with a status pinned top right.' code={runRowsCode(variant, flush)}>
        <div className="list-demo-controls">
          <SegmentedControl label="Variant" name={`list-variant-${groupId}`} value={variant} onValueChange={value => setVariant(value === 'plain' ? 'plain' : 'outline')} options={[{ value: 'outline', label: 'Outline' }, { value: 'plain', label: 'Plain' }]} />
          <Switch label="Flush rows" checked={flush} onChange={event => setFlush(event.target.checked)} />
        </div>
        <List aria-label="Run history" variant={variant} flush={flush} maxWidth={480} selectedId={selectedRun} onSelectionChange={setSelectedRun}
          items={runs.map(run => ({
            id: run.id,
            content: <Flex direction="column" gap={2}>
              <Flex direction="row" justify="space-between" align="start" gap={3}><Text bold>{run.title}</Text><Badge tone={run.tone}>{run.status}</Badge></Flex>
              <Text size="body" className="list-demo-run-summary">{run.summary}</Text>
              <Flex direction="row" justify="space-between" gap={3} className="list-demo-run-meta"><span>{run.files}</span><time>{run.time}</time></Flex>
            </Flex>,
          }))} />
      </Showcase>
      <Showcase title="Sidebar navigation" description="Grouped lists of icon links with a trailing tag inside a nav landmark. Example styles add hover and current-page row highlights like the documentation sidebar." code={navigationCode}>
        <nav aria-label="Documentation example" className="list-demo-nav">
          {navigationGroups.map(group => <section key={group.id}>
            <Text size="label" display="block" id={`${groupId}-nav-${group.id}`}>{group.label}</Text>
            <List aria-labelledby={`${groupId}-nav-${group.id}`} items={group.items} marker="none" />
          </section>)}
        </nav>
      </Showcase>
      <Showcase title="Chat threads" description="Thread rows with an Avatar in the leading slot, a one-line preview, a time, and an unread count. Example styles bold unread threads and add hover and current-thread highlights." code={chatThreadsCode}>
        <nav aria-label="Chat threads example">
          <List className="list-demo-threads" items={chatThreads} />
        </nav>
      </Showcase>
    </ExampleGallery>
  </div>;
}
