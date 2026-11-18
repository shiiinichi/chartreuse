import type { ComponentReference } from './types';

export const timelineReferences: ComponentReference[] = [{
  name: 'Timeline',
  slug: 'timeline',
  summary: 'An ordered chronological list with date labels, React content, and connected markers.',
  importCode: "import { Timeline, type TimelineItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `const events: TimelineItem[] = [
  { id: 'plan', title: 'Workspace plan approved', date: 'Nov 17 · 09:00',
    dateTime: '2026-11-17T09:00:00+08:00', tone: 'success',
    content: 'The workspace plan is ready for implementation.' },
  { id: 'build', title: 'Task board implemented', date: 'Nov 17 · 11:30',
    dateTime: '2026-11-17T11:30:00+08:00', tone: 'info',
    content: 'The task board uses the shared components.' },
];

<Timeline aria-label="Project milestones" items={events}
  datePlacement="column" markerVariant="outline"
  pending="Waiting for the next update…"
/>`,
  props: [
    { name: 'items', type: 'readonly TimelineItem[]', required: true, description: 'Events in their provided chronological order.' },
    { name: 'items[].id', type: 'string', required: true, description: 'Unique stable identity used as the event’s React key.' },
    { name: 'items[].title', type: 'ReactNode', required: true, description: 'Event title or caller-owned title content.' },
    { name: 'items[].content', type: 'ReactNode', description: 'Event content, including paragraphs, code, links, or actions.' },
    { name: 'items[].date', type: 'ReactNode', description: 'Caller-formatted date or time label.' },
    { name: 'items[].dateTime', type: 'string', description: 'Machine-readable datetime used by a time element when a visible date is provided.' },
    { name: 'items[].icon', type: 'IconSource', description: 'Optional decorative marker icon: Lucide, React SVG component, or SVG JSX.' },
    { name: 'items[].tone', type: "'neutral' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: "'neutral'", description: 'Marker color drawn from the shared semantic palette.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Vertical events or a horizontal list that scrolls locally when needed.' },
    { name: 'markerVariant', type: "'outline' | 'solid'", defaultValue: "'outline'", description: 'Outlined or filled markers.' },
    { name: 'align', type: "'start' | 'end' | 'alternate'", defaultValue: "'start'", description: 'Vertical content alignment. Horizontal lists use centered content.' },
    { name: 'datePlacement', type: "'inline' | 'column'", defaultValue: "'inline'", description: 'Date caption below the title, or a separate date column for vertical start/end layouts.' },
    { name: 'reverse', type: 'boolean', defaultValue: 'false', description: 'Reverses actual event DOM order; a pending entry then appears first.' },
    { name: 'pending', type: 'ReactNode', description: 'Optional pending entry, last normally or first when reverse is enabled.' },
    { name: 'aria-label', type: 'string', defaultValue: "'Timeline'", description: 'Accessible name for the ordered event list.' },
    { name: 'tabIndex', type: 'number', defaultValue: '0 for horizontal; native default for vertical', description: 'Horizontal lists are focusable for keyboard scrolling unless overridden.' },
    { name: 'className', type: 'string', description: 'Additional classes on the ordered list.' },
    { name: 'ref', type: 'Ref<HTMLOListElement>', description: 'Native ordered-list ref.' },
  ],
  nativeElement: 'ol with li events and optional time labels',
  nativeProps: 'Inherits ordered-list attributes, events, style, and ref except children, start, type, reversed, and role. Items own list content; reverse owns DOM order; role remains list to preserve semantics with custom markers.',
  notes: [
    'Use Timeline for events over time and Steps for a process or guide.',
    'The caller owns ordering and date formatting. reverse reverses the provided event array without sorting or mutating it.',
    'Pending follows the same reversed ordering: it is last normally and first when reverse is true.',
    'Event bodies accept React content, and markers accept IconSource.',
    'Date columns and alternating layouts collapse to a start-aligned flow in narrow containers. Date columns apply only to vertical start/end layouts.',
    'Horizontal lists keep their order and scroll inside their own boundary; keyboard focus can enter the scrollable list.',
    'Pending animation respects reduced motion. This display component does not load events or run background work.',
    'Marker size, item gap, column gap, line color, and date-column width use the documented sequence CSS variables.',
  ],
}];
