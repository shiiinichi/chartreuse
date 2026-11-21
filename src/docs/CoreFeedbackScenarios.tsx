import { useState } from 'react';
import { Activity, BookOpen, FolderOpen, LayoutDashboard, Search, Settings } from 'lucide-react';
import { Breadcrumbs, Button, Card, EmptyState, Progress, Select, Skeleton, Spinner, Switch, Tabs, TextField } from '../system/components';
import type { EmptyStateProps } from '../system/components';
import { SegmentedControl } from '../system/SegmentedControl';
import { BreadcrumbsDemo } from './BreadcrumbsDemo';
import { ProgressDemo } from './ProgressDemo';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';

const snippet = (...lines: string[]) => lines.join('\n');

export function ProgressScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Native progress semantics" description="value and max map to a native progress element. label supplies its accessible name." code={snippet(
      'import { Progress } from "@chartreuse/ui";',
      '',
      '<Progress value={3} max={5} label="3 of 5 tasks complete"',
      '  style={{ maxWidth: 520 }} />',
    )}><div className="core-example-field"><Progress value={3} max={5} label="3 of 5 tasks complete" /></div></Showcase>
    <Showcase title="Formatted progress text" description="Use valueText for formatted output and description for supporting text. aria-valuetext can supply a separate spoken value." code={snippet(
      'import { Progress } from "@chartreuse/ui";',
      '',
      '<Progress value={5} max={8} label="Files reviewed" showLabel',
      '  valueText="5 / 8 files" aria-valuetext="5 of 8 files reviewed"',
      '  description="Three files remain for review." />',
    )}><div className="core-example-field"><Progress value={5} max={8} label="Files reviewed" showLabel valueText="5 / 8 files" aria-valuetext="5 of 8 files reviewed" description="Three files remain for review." /></div></Showcase>
    <ProgressDemo />
  </ExampleGallery>;
}

export function SkeletonScenarios() {
  const [loading, setLoading] = useState(true);
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Text placeholders" description="Skeleton is decorative. Set aria-busy on the containing content region." code={snippet(
      'import { Card, Skeleton } from "@chartreuse/ui";',
      '',
      '<Card aria-label="Loading task summary" aria-busy="true" style={{ padding: 24, maxWidth: 380 }}>',
      '  <div style={{ display: "grid", gap: 12 }}>',
      '    <Skeleton /><Skeleton style={{ width: "80%" }} /><Skeleton style={{ width: "60%" }} />',
      '  </div>',
      '</Card>',
    )}><Card className="core-example-card" aria-label="Loading task summary" aria-busy="true"><div className="core-example-placeholder-lines"><Skeleton /><Skeleton style={{ width: '80%' }} /><Skeleton style={{ width: '60%' }} /></div></Card></Showcase>
    <Showcase title="Avatar and text placeholders" description="Use style to set placeholder dimensions and border radius." code={snippet(
      'import { Skeleton } from "@chartreuse/ui";',
      '',
      '<div aria-busy="true" style={{ display: "flex", gap: 16, maxWidth: 520 }}>',
      '  <Skeleton style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />',
      '  <div style={{ display: "grid", gap: 12, flex: 1, minWidth: 0 }}>',
      '    <Skeleton style={{ width: "65%" }} /><Skeleton />',
      '  </div>',
      '</div>',
    )}><div className="core-example-placeholder core-example-field" aria-busy="true"><Skeleton style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} /><div className="core-example-placeholder-lines"><Skeleton style={{ width: '65%' }} /><Skeleton /></div></div></Showcase>
    <Showcase title="Controlled loading content" description="The parent switches between placeholders and loaded content while updating aria-busy." code={snippet(
      'import { useState } from "react";',
      'import { Card, Skeleton, Switch, Text } from "@chartreuse/ui";',
      '',
      'function LoadingContent() {',
      '  const [loading, setLoading] = useState(true);',
      '  return <>',
      '    <Switch label="Show placeholder content" checked={loading}',
      '      onChange={event => setLoading(event.target.checked)} />',
      '    <Card aria-busy={loading} style={{ padding: 24, maxWidth: 380 }}>',
      '      {loading ? <><Skeleton /><Skeleton style={{ width: "70%", marginTop: 12 }} /></>',
      '        : <><Text size="heading-3">Workspace notes</Text><Text size="body">Review the changed files before merging.</Text></>}',
      '    </Card>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><Switch label="Show placeholder content" checked={loading} onChange={event => setLoading(event.target.checked)} /><Card className="core-example-card" aria-busy={loading}>{loading ? <><Skeleton /><Skeleton style={{ width: '70%', marginTop: 12 }} /></> : <><Text size="heading-3">Workspace notes</Text><Text size="body" style={{ margin: 0 }}>Review the changed files before merging.</Text></>}</Card></div></Showcase>
  </ExampleGallery>;
}

export function SpinnerScenarios() {
  const [loading, setLoading] = useState(true);
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Accessible loading status" description="label supplies visually hidden status text for the loading operation." code={snippet(
      'import { Spinner } from "@chartreuse/ui";',
      '',
      '<Spinner label="Loading the workspace" />',
    )}><Spinner label="Loading the workspace" /></Showcase>
    <Showcase title="Custom spinner size" description="size sets the icon dimensions; label supplies the status text." code={snippet(
      'import { Spinner } from "@chartreuse/ui";',
      '',
      '<Spinner size={28} label="Loading the task details" />',
    )}><Spinner size={28} label="Loading the task details" /></Showcase>
    <Showcase title="Spinner with controlled content" description="The parent controls loading, updates aria-busy, and replaces the spinner with the result." code={snippet(
      'import { useState } from "react";',
      'import { Button, Card, Spinner, Text } from "@chartreuse/ui";',
      '',
      'function PendingSummary() {',
      '  const [loading, setLoading] = useState(true);',
      '  return <>',
      '    <Card aria-busy={loading} style={{ padding: 24, maxWidth: 380 }}>',
      '      <Text size="heading-3">Review summary</Text>',
      '      {loading ? <Spinner label="Loading review summary" />',
      '        : <Text size="body">All required reviews are complete.</Text>}',
      '    </Card>',
      '    <Button variant="secondary" onClick={() => setLoading(value => !value)}>',
      '      {loading ? "Show result" : "Show loading state"}',
      '    </Button>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><Card className="core-example-card" aria-busy={loading}><Text size="heading-3">Review summary</Text>{loading ? <Spinner label="Loading review summary" /> : <Text size="body" style={{ margin: 0 }}>All required reviews are complete.</Text>}</Card><Button variant="secondary" onClick={() => setLoading(value => !value)}>{loading ? 'Show result' : 'Show loading state'}</Button></div></Showcase>
  </ExampleGallery>;
}

const searchableItems = ['Review branch settings', 'Update deployment configuration', 'Resolve validation errors'];

export function EmptyStateScenarios() {
  const [align, setAlign] = useState<NonNullable<EmptyStateProps['align']>>('start');
  const [query, setQuery] = useState('missing');
  const [created, setCreated] = useState(false);
  const matches = searchableItems.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Dashed empty state" span="full" code={snippet(
      'import { BookOpen } from "lucide-react";',
      'import { EmptyState } from "@chartreuse/ui";',
      '',
      `<EmptyState variant="dashed" align="${align}" icon={BookOpen}`,
      '  title="No code guidance yet"',
      '  description="Start with a convention you repeatedly explain in reviews, and link its canonical examples." />',
    )}>
      <div className="core-example-stack">
        <SegmentedControl label="Content alignment" name="empty-state-alignment" size="sm" value={align}
          options={[{ value: 'start', label: 'Start' }, { value: 'center', label: 'Center' }, { value: 'end', label: 'End' }]}
          onValueChange={value => setAlign(value as typeof align)} />
        <EmptyState variant="dashed" align={align} icon={BookOpen} title="No code guidance yet"
          description="Start with a convention you repeatedly explain in reviews, and link its canonical examples." />
      </div>
    </Showcase>
    <Showcase title="Empty collection" description="Use title and description to explain why a collection has no items." align="center" code={snippet(
      'import { EmptyState } from "@chartreuse/ui";',
      '',
      '<EmptyState title="No activity"',
      '  description="No activity entries are available for this workspace." />',
    )}><div className="core-example-field"><EmptyState title="No activity" description="No activity entries are available for this workspace." /></div></Showcase>
    <Showcase title="Empty search results" description="Use a custom icon and an action to clear the query when no items match." align="center" code={snippet(
      'import { useState } from "react";',
      'import { Search } from "lucide-react";',
      'import { Button, EmptyState, TextField } from "@chartreuse/ui";',
      '',
      'const items = ["Review branch settings", "Update deployment configuration", "Resolve validation errors"];',
      'function EmptySearch() {',
      '  const [query, setQuery] = useState("missing");',
      '  const matches = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));',
      '  return <>',
      '    <TextField type="search" label="Search tasks" value={query}',
      '      onChange={event => setQuery(event.target.value)} />',
      '    {matches.length ? <ul>{matches.map(item => <li key={item}>{item}</li>)}</ul>',
      '      : <EmptyState icon={Search} title="No matching tasks"',
      '          description="Change the query or clear the search to view all tasks."',
      '          action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>} />}',
      '  </>;',
      '}',
    )}><div className="core-example-stack core-example-field core-empty-state-stack"><TextField type="search" label="Search tasks" value={query} onChange={event => setQuery(event.target.value)} />{matches.length ? <ul className="core-example-note">{matches.map(item => <li key={item}>{item}</li>)}</ul> : <EmptyState icon={Search} title="No matching tasks" description="Change the query or clear the search to view all tasks." action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>} />}</div></Showcase>
    <Showcase title="Empty collection with a create action" description="The create action replaces the empty state with a local item; the reset action restores it." align="center" code={snippet(
      'import { useState } from "react";',
      'import { FolderOpen } from "lucide-react";',
      'import { Button, Card, EmptyState, Text } from "@chartreuse/ui";',
      '',
      'function FirstItem() {',
      '  const [created, setCreated] = useState(false);',
      '  return created ? <>',
      '    <Card style={{ padding: 24, maxWidth: 380 }}>',
      '      <Text size="heading-3">Review branch settings</Text><Text size="body">Confirm the target branch before merging.</Text>',
      '    </Card>',
      '    <Button variant="secondary" onClick={() => setCreated(false)}>Reset example</Button>',
      '  </> : <EmptyState icon={FolderOpen} title="No tasks yet"',
      '    description="Create a task to start tracking work in this workspace."',
      '    action={<Button onClick={() => setCreated(true)}>Create task</Button>} />;',
      '}',
    )}><div className="core-example-stack core-example-field core-empty-state-stack">{created ? <><Card className="core-example-card"><Text size="heading-3">Review branch settings</Text><Text size="body" style={{ margin: 0 }}>Confirm the target branch before merging.</Text></Card><Button variant="secondary" onClick={() => setCreated(false)}>Reset example</Button></> : <EmptyState icon={FolderOpen} title="No tasks yet" description="Create a task to start tracking work in this workspace." action={<Button onClick={() => setCreated(true)}>Create task</Button>} />}</div></Showcase>
  </ExampleGallery>;
}

const tabItems = [
  { value: 'board', label: 'Board', content: <Text size="body" className="core-example-note">Review tasks assigned to this workspace.</Text> },
  { value: 'activity', label: 'Activity', content: <Text size="body" className="core-example-note">Review changes to workspace tasks.</Text> },
  { value: 'settings', label: 'Settings', content: <Text size="body" className="core-example-note">Configure workspace access and notifications.</Text> },
];
const tabItemsCode = snippet(
  'const items = [',
  '  { value: "board", label: "Board", content: <Text size="body">Review tasks assigned to this workspace.</Text> },',
  '  { value: "activity", label: "Activity", content: <Text size="body">Review changes to workspace tasks.</Text> },',
  '  { value: "settings", label: "Settings", content: <Text size="body">Configure workspace access and notifications.</Text> },',
  '];',
);
const tabSizes = ['sm', 'md', 'lg'] as const;

export function TabsScenarios() {
  const [size, setSize] = useState<(typeof tabSizes)[number]>('md');
  const [active, setActive] = useState('activity');
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Tab variants and sizes" description="Each variant matches Button heights." code={snippet(
      'import { useState } from "react";',
      'import { Button, Tabs, Text } from "@chartreuse/ui";',
      '',
      tabItemsCode,
      'const sizes = ["sm", "md", "lg"] as const;',
      '',
      'function TabSizes() {',
      '  const [size, setSize] = useState<(typeof sizes)[number]>("md");',
      '  return <>',
      '    <div role="group" aria-label="Tab size">',
      '      {sizes.map(option => <Button key={option} size={option} variant="secondary"',
      '        aria-pressed={size === option} onClick={() => setSize(option)}>{option}</Button>)}',
      '    </div>',
      '    <Tabs label="Line tabs" size={size} items={items} />',
      '    <Tabs label="Highlighted tabs" variant="highlight" size={size} items={items} />',
      '    <Tabs label="Pill tabs" variant="pill" size={size} items={items} />',
      '  </>;',
      '}',
    )}>
      <div className="core-example-stack">
        <div className="core-example-row" role="group" aria-label="Tab size">
          {tabSizes.map(option => <Button key={option} size={option} variant="secondary"
            aria-pressed={size === option} onClick={() => setSize(option)}>{option}</Button>)}
        </div>
        <Tabs label="Line tabs" size={size} items={tabItems} />
        <Tabs label="Highlighted tabs" variant="highlight" size={size} items={tabItems} />
        <Tabs label="Pill tabs" variant="pill" size={size} items={tabItems} />
      </div>
    </Showcase>
    <Showcase title="Uncontrolled tab selection" description="defaultValue selects the initial panel. Tabs manages subsequent selection internally." code={snippet(
      'import { Tabs, Text } from "@chartreuse/ui";',
      '',
      tabItemsCode,
      '',
      '<Tabs label="Basic workspace tabs" defaultValue="board" items={items} />',
    )}><Tabs label="Basic workspace tabs" defaultValue="board" items={tabItems} /></Showcase>
    <Showcase title="Controlled tab selection" description="Pass value and onValueChange to share selection with other controls." code={snippet(
      'import { useState } from "react";',
      'import { Select, Tabs, Text } from "@chartreuse/ui";',
      '',
      tabItemsCode,
      '',
      'function ControlledTabs() {',
      '  const [active, setActive] = useState(' + JSON.stringify(active) + ');',
      '  return <>',
      '    <Select label="Selected workspace view" value={active}',
      '      onChange={event => setActive(event.target.value)}>',
      '      <option value="board">Board</option><option value="activity">Activity</option>',
      '      <option value="settings">Settings</option>',
      '    </Select>',
      '    <Tabs label="Controlled workspace tabs" value={active}',
      '      onValueChange={setActive} items={items} />',
      '  </>;',
      '}',
    )}><div className="core-example-stack" style={{ inlineSize: '100%' }}><div className="core-example-field"><Select label="Selected workspace view" value={active} onChange={event => setActive(event.target.value)}><option value="board">Board</option><option value="activity">Activity</option><option value="settings">Settings</option></Select></div><Tabs label="Controlled workspace tabs" value={active} onValueChange={setActive} items={tabItems} /></div></Showcase>
    <Showcase title="Tab icons and counts" description="Each item can provide an icon and count. The pill variant changes the tab appearance." code={snippet(
      'import { Activity, LayoutDashboard, Settings } from "lucide-react";',
      'import { Tabs, Text } from "@chartreuse/ui";',
      '',
      '<Tabs label="Counted workspace tabs" variant="pill" items={[',
      '  { value: "board", label: "Board", icon: LayoutDashboard, count: 4,',
      '    content: <Text size="body">Four tasks in this workspace.</Text> },',
      '  { value: "activity", label: "Activity", icon: Activity, count: 2,',
      '    content: <Text size="body">Two activity entries in this workspace.</Text> },',
      '  { value: "settings", label: "Settings", icon: Settings,',
      '    content: <Text size="body">Configure workspace access and notifications.</Text> },',
      ']} />',
    )}><Tabs label="Counted workspace tabs" variant="pill" items={[{ value: 'board', label: 'Board', icon: LayoutDashboard, count: 4, content: <Text size="body" className="core-example-note">Four tasks in this workspace.</Text> }, { value: 'activity', label: 'Activity', icon: Activity, count: 2, content: <Text size="body" className="core-example-note">Two activity entries in this workspace.</Text> }, { value: 'settings', label: 'Settings', icon: Settings, content: <Text size="body" className="core-example-note">Configure workspace access and notifications.</Text> }]} /></Showcase>
  </ExampleGallery>;
}

export function BreadcrumbsScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Ancestor links and current page" description="Items with href render as links before the final item. The final item has aria-current set to page." code={snippet(
      'import { Breadcrumbs } from "@chartreuse/ui";',
      '',
      '<Breadcrumbs items={[',
      '  { label: "Overview", href: "#overview" },',
      '  { label: "Card", href: "#components/card" },',
      '  { label: "Task details" },',
      ']} />',
    )}><Breadcrumbs items={[{ label: 'Overview', href: '#overview' }, { label: 'Card', href: '#components/card' }, { label: 'Task details' }]} /></Showcase>
    <Showcase title="Custom separator" code={snippet(
      'import { Breadcrumbs } from "@chartreuse/ui";',
      '',
      '<Breadcrumbs separator="/" items={[',
      '  { label: "Overview", href: "#overview" },',
      '  { label: "Card", href: "#components/card" },',
      '  { label: "Task details" },',
      ']} />',
    )}><Breadcrumbs separator="/" items={[{ label: 'Overview', href: '#overview' }, { label: 'Card', href: '#components/card' }, { label: 'Task details' }]} /></Showcase>
    <Showcase title="Current page without ancestors" description="A single item identifies the current page without rendering ancestor links." code={snippet(
      'import { Breadcrumbs } from "@chartreuse/ui";',
      '',
      '<Breadcrumbs items={[{ label: "Workspace" }]} />',
    )}><Breadcrumbs items={[{ label: 'Workspace' }]} /></Showcase>
    <BreadcrumbsDemo />
  </ExampleGallery>;
}
