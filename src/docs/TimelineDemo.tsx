import { useId, useState } from 'react';
import { CheckCircle2, Flag } from 'lucide-react';
import { Badge, Select, Switch } from '../system/components';
import { SegmentedControl } from '../system/SegmentedControl';
import { Timeline } from '../system/Timeline';
import type { TimelineItem } from '../system/Timeline';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './sequence-demo.css';

const events = [
  { id: 'direction', title: 'Workspace plan approved', date: 'Nov 17 · 09:00', dateTime: '2026-11-17T09:00:00+08:00', content: 'The workspace plan is ready for implementation.', tone: 'success' },
  { id: 'build', title: 'Task board implemented', date: 'Nov 17 · 11:30', dateTime: '2026-11-17T11:30:00+08:00', content: 'The task board uses the shared components.', tone: 'info' },
  { id: 'review', title: 'Implementation review requested', date: 'Nov 18 · 08:15', dateTime: '2026-11-18T08:15:00+08:00', content: 'The task board is ready for API and keyboard review.', tone: 'warning' },
] satisfies TimelineItem[];
const eventSource = `import { Timeline, type TimelineItem } from '@chartreuse/ui';\n\nconst events: TimelineItem[] = ${JSON.stringify(events, null, 2)};`;
const timelineCode = (attributes: string) => `${eventSource}\n\n<Timeline aria-label="Project milestones" items={events}\n  ${attributes}\n/>`;
const diamond = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><path d="m12 2 10 10-10 10L2 12 12 2Z" /><path d="m7 12 3 3 7-7" /></svg>;
const richEvents: TimelineItem[] = [
  { id: 'recorded', title: 'Plan recorded', icon: Flag, tone: 'info', content: 'Implementation notes are attached to the task.' },
  { id: 'ready', title: 'Library build completed', icon: CheckCircle2, tone: 'success', content: <><Text size="body">The shared library build completed.</Text><Badge tone="success">Ready for review</Badge></> },
  { id: 'decided', title: 'Decision recorded', icon: diamond, content: <><Text size="body">This event uses an inline SVG marker.</Text><Text size="body">The event body accepts React content, including paragraphs and badges.</Text></> },
];

export function TimelineDemo() {
  const [variant, setVariant] = useState<'outline' | 'solid'>('outline');
  const [reverse, setReverse] = useState(false);
  const [pending, setPending] = useState(true);
  const [align, setAlign] = useState<'start' | 'end' | 'alternate'>('alternate');
  const groupId = useId();
  return <div className="sequence-demo">
    <Text size="body" className="sequence-demo-intro">Use Timeline for chronological events. Supply date labels, machine-readable timestamps, and content in each item.</Text>
    <ExampleGallery className="sequence-demo-gallery">
    <Showcase title="Dates in a separate column" description="The datePlacement prop places date labels in a separate column." code={timelineCode(`datePlacement="column" markerVariant="${variant}"`)}><div className="sequence-demo-controls"><SegmentedControl label="Marker style" name={`timeline-markers-${groupId}`} value={variant} onValueChange={value => setVariant(value === 'solid' ? 'solid' : 'outline')} options={[{ value: 'outline', label: 'Outline' }, { value: 'solid', label: 'Solid' }]} /></div><Timeline aria-label="Project milestones" items={events} datePlacement="column" markerVariant={variant} /></Showcase>
    <Showcase title="Reverse order and pending state" description="The reverse prop changes the rendered list order and the pending item position." code={timelineCode(`reverse={${reverse}} pending={${pending ? '"Waiting for the next update…"' : 'undefined'}}`)}><div className="sequence-demo-controls"><Switch label="Newest first" checked={reverse} onChange={event => setReverse(event.target.checked)} /><Switch label="Show pending item" checked={pending} onChange={event => setPending(event.target.checked)} /></div><Timeline aria-label="Project milestones" items={events} reverse={reverse} pending={pending ? 'Waiting for the next update…' : undefined} /></Showcase>
    <Showcase title="Vertical alignment" description="The align prop places content at the start, end, or alternating sides." code={timelineCode(`align="${align}"`)}><div className="sequence-demo-controls"><Select label="Timeline alignment" value={align} onChange={event => setAlign(event.target.value as typeof align)}><option value="start">Start</option><option value="end">End</option><option value="alternate">Alternate</option></Select></div><Timeline aria-label="Project milestones" items={events} align={align} /></Showcase>
    <Showcase title="Horizontal timeline" description="A horizontal timeline scrolls within its container when its content exceeds the available width." code={timelineCode('orientation="horizontal" markerVariant="solid"')}><Timeline aria-label="Project milestones" items={events} orientation="horizontal" markerVariant="solid" /></Showcase>
    <Showcase title="Custom icons and React content" description="Lucide icons and custom SVG elements use the same IconSource slot." code={`import { CheckCircle2, Flag } from 'lucide-react';\nimport { Badge, Timeline, Text } from '@chartreuse/ui';\n\nconst diamond = <svg viewBox="0 0 24 24" fill="none"\n  stroke="currentColor" strokeWidth={1.7}>\n  <path d="m12 2 10 10-10 10L2 12 12 2Z" />\n  <path d="m7 12 3 3 7-7" />\n</svg>;\n\n<Timeline aria-label="Rich event examples" items={[\n  { id: 'recorded', title: 'Plan recorded', icon: Flag, tone: 'info',\n    content: 'Implementation notes are attached to the task.' },\n  { id: 'ready', title: 'Library build completed', icon: CheckCircle2, tone: 'success',\n    content: <><Text size="body">The shared library build completed.</Text>\n      <Badge tone="success">Ready for review</Badge></> },\n  { id: 'decided', title: 'Decision recorded', icon: diamond,\n    content: <><Text size="body">This event uses an inline SVG marker.</Text>\n      <Text size="body">The event body accepts React content,\n        including paragraphs and badges.</Text></> },\n]} />`}><Timeline aria-label="Rich event examples" items={richEvents} /></Showcase>
    </ExampleGallery>
  </div>;
}
