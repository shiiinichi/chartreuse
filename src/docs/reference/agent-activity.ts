import type { ComponentReference } from './types';

export const agentActivityReferences: ComponentReference[] = [{
  name: 'AgentActivity',
  slug: 'agent-activity',
  summary: 'A chronological event log with group status counts and expandable command, input, and output details.',
  importCode: "import { AgentActivity } from '@chartreuse/ui';\nimport type { AgentActivityEvent } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `const events: AgentActivityEvent[] = [
  { id: 'review', kind: 'agent', title: 'Reviewer checked the inputs',
    status: 'completed', durationMs: 17900 },
  { id: 'checks', kind: 'command', title: 'Checking the summary',
    status: 'running', command: 'npm test -- --run summary',
    output: 'Running summary tests…' },
];

<AgentActivity events={events} initialVisibleCount={6} defaultOpen />`,
  props: [
    { name: 'events', type: 'readonly AgentActivityEvent[]', required: true, description: 'Chronological events, oldest first. Each event needs a stable id and a brief human-readable title.' },
    { name: 'label', type: 'string', description: 'Optional visible group label. Otherwise the label is Working, Waiting, Worked, or Activity based on the recorded states.' },
    { name: 'headerHighlight', type: "'none' | 'hover'", defaultValue: "'none'", description: 'Use "hover" to show a subtle background when the pointer is over the activity group header.' },
    { name: 'initialVisibleCount', type: 'number', defaultValue: '6', description: 'Recent rows shown directly on mount; existing older rows go in an earlier-activities disclosure. New events stay in place. Finite values are floored and clamped to at least one.' },
    { name: 'open', type: 'boolean', description: 'Controlled group visibility; requires onOpenChange and excludes defaultOpen.' },
    { name: 'defaultOpen', type: 'boolean', defaultValue: 'true', description: 'Initial group visibility when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Receives requested group expansion state; required in controlled mode.' },
    { name: 'announce', type: 'boolean', defaultValue: 'false', description: 'Announces concise group counts/status changes through one polite status region. Enable only for an active log whose host does not already announce progress.' },
    { name: 'emptyMessage', type: 'string', defaultValue: '"No activity recorded."', description: 'Content displayed inside an empty group.' },
    { name: 'className', type: 'string', description: 'Additional classes on the outer details element.' },
    { name: 'ref', type: 'Ref<HTMLDetailsElement>', description: 'Native React 19 ref to the group details element.' },
  ],
  nativeElement: 'details containing chronological ordered lists and optional event disclosures',
  nativeProps: 'Inherits native details props/ref except children, title, open, onToggle, and name. The component owns the summary, group state, and event list; native attributes and className target the outer details element.',
  notes: [
    'AgentActivityEvent uses id/title with optional kind (agent, command, tool, file, search, message), status (queued, running, completed, failed, interrupted, info), description, command, input, output, outputTruncated, durationMs, exitCode, icon, and defaultOpen.',
    'Give each event a brief title describing the recorded action, such as “Read project guidance”; put the exact command and recorded output in its details. All command/input/output strings render as plain text and ANSI escape sequences are removed.',
    'When an event has no description or visible output, its expanded details show the event title.',
    'Keep the same event ID when output or status changes. Key each AgentActivity by its run ID so expansion and initial-history boundaries reset for a different run. Newly appended events do not move existing rows into a closed history group.',
    'Status defaults to info; completion is never inferred from missing data. A nonzero exitCode is shown as failure. Use interrupted when completion was not recorded. Empty output means no output; omitted output means unrecorded.',
    'Native summary controls retain Enter, Space, and find-in-page behavior. Earlier activities remain in the DOM and searchable. Output is bounded and keyboard-scrollable; expanding details never forces a scroll or steals focus.',
    'Event icon slots accept Lucide, custom React SVG components, or SVG JSX. Keep event titles meaningful because icons are decorative.',
  ],
}];
