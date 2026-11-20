import { useState } from 'react';
import { Check, Plus, RotateCcw, TriangleAlert } from 'lucide-react';
import { Button } from '../system/components';
import { AgentActivity } from '../system/AgentActivity';
import type { AgentActivityEvent } from '../system/AgentActivity';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './agent-activity-demo.css';

const initialEvents: AgentActivityEvent[] = [
  { id: 'coordinator', kind: 'agent', title: 'Review plan created', status: 'completed', durationMs: 1400, description: 'Assigned input validation and an independent totals review.' },
  { id: 'guidance', kind: 'command', title: 'Project instructions read', status: 'completed', durationMs: 240, command: 'cat ./AGENTS.md', output: 'Keep changes scoped. Preserve existing task data.', exitCode: 0 },
  { id: 'board', kind: 'tool', title: 'Task board loaded', status: 'completed', durationMs: 520, input: '{ "task": "TASK-002" }', output: '{ "cards": 3, "active": 1 }' },
  { id: 'attachments', kind: 'tool', title: 'Supporting files listed', status: 'completed', durationMs: 180, output: 'order-summary.md\nreview-notes.md' },
  { id: 'explorer', kind: 'agent', title: 'Input inspection completed', status: 'completed', durationMs: 12400, description: 'This fixture uses sample order data. It does not contact an external service.' },
  { id: 'search', kind: 'command', title: 'Order summary checks located', status: 'completed', durationMs: 360, command: 'rg -n "order|summary|total" ./web/src ./web/test', output: 'web/src/summary.ts:18:export function orderTotal(items)\nweb/test/summary.test.ts:9:test("keeps the total consistent")', exitCode: 0 },
  { id: 'review', kind: 'agent', title: 'Reviewed order totals, compared shipping adjustments with the supporting notes, and recorded the verification result', status: 'completed', durationMs: 17900, description: 'The recorded totals and supporting notes agree.' },
  { id: 'note', kind: 'message', title: 'Review evidence recorded', status: 'info', description: 'Expand command and tool events to inspect their recorded input and output.' },
  { id: 'report', kind: 'file', title: 'Review notes updated', status: 'completed', durationMs: 480, output: 'review-notes.md updated with the expected result.' },
  { id: 'checks', kind: 'command', title: 'Order summary tests running', status: 'running', command: 'npm test -- --run order-summary', output: 'Running order-summary tests…' },
];

const listEvents = initialEvents.slice(-8);

const recordedEvents: AgentActivityEvent[] = [
  { id: 'interrupted', kind: 'command', title: 'Workspace notes requested', status: 'interrupted', command: 'cat ./notes.md', description: 'The session ended before this step reported completion.', defaultOpen: true },
  { id: 'empty-output', kind: 'tool', title: 'Preferences saved', status: 'completed', output: '' },
];

const exampleCode = `import { useState } from 'react';
import { Check, Plus, RotateCcw, TriangleAlert } from 'lucide-react';
import { AgentActivity, Button, type AgentActivityEvent, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

const initialEvents: AgentActivityEvent[] = ${JSON.stringify(initialEvents, null, 2)};

export function ActivityTrailExample() {
  const [events, setEvents] = useState<AgentActivityEvent[]>(initialEvents);
  const [revision, setRevision] = useState(0);
  const current = events.find(event => event.id === 'checks');
  const complete = () => setEvents(previous => previous.map(event =>
    event.id === 'checks' ? { ...event, title: 'Order summary tests passed',
      status: 'completed', output: '3 tests passed.\\nThe fictional order summary is consistent.',
      durationMs: 1540, exitCode: 0 } : event));
  const fail = () => setEvents(previous => previous.map(event =>
    event.id === 'checks' ? { ...event, title: 'Order summary tests failed',
      status: 'failed', output: 'Expected total: 149.00\\nReceived total: 159.00\\nReview the shipping adjustment before continuing.',
      durationMs: 1540, exitCode: 1 } : event));
  const addActivity = () => setEvents(previous => [...previous, {
    id: 'update-' + previous.length, kind: 'tool', title: 'Task update saved',
    status: 'completed', durationMs: 180,
    output: 'The local demonstration update was recorded.',
  }]);
  const reset = () => { setEvents(initialEvents); setRevision(value => value + 1); };

  return <div style={{ width: '100%', maxWidth: 760, minWidth: 0 }}>
    <AgentActivity key={revision} events={events} announce initialVisibleCount={6} />
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--cr-space-2)',
      marginTop: 'var(--cr-space-5)', paddingTop: 'var(--cr-space-4)',
      borderTop: '1px solid var(--cr-color-border)' }}>
      <Button variant="secondary" size="sm" icon={Check} onClick={complete}
        disabled={current?.status === 'completed'}>Mark tests passed</Button>
      <Button variant="secondary" size="sm" icon={TriangleAlert} onClick={fail}
        disabled={current?.status === 'failed'}>Mark tests failed</Button>
      <Button variant="secondary" size="sm" icon={Plus} onClick={addActivity}>Add activity</Button>
      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>Reset</Button>
    </div>
    <Text size="body" style={{ margin: 'var(--cr-space-3) 0 0', color: 'var(--cr-color-muted)',
      fontSize: '.75rem', lineHeight: 1.7 }}>
      These controls update local event state. They do not execute the displayed commands.
    </Text>
  </div>;
}`;

const listCode = `import { AgentActivity, type AgentActivityEvent } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

const events: AgentActivityEvent[] = ${JSON.stringify(listEvents, null, 2)};

export function ActivityListExample() {
  return <AgentActivity variant="list" titleLines="single" events={events} />;
}`;

const recordedCode = `import { AgentActivity, type AgentActivityEvent } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

const recordedEvents: AgentActivityEvent[] = ${JSON.stringify(recordedEvents, null, 2)};

export function RecordedSessionExample() {
  return <AgentActivity label="Recorded session" events={recordedEvents} headerHighlight="hover" />;
}`;

export function AgentActivityDemo() {
  const [events, setEvents] = useState<AgentActivityEvent[]>(initialEvents);
  const [revision, setRevision] = useState(0);
  const current = events.find(event => event.id === 'checks');
  const complete = () => setEvents(previous => previous.map(event => event.id === 'checks' ? { ...event, title: 'Order summary tests passed', status: 'completed', output: '3 tests passed.\nThe fictional order summary is consistent.', durationMs: 1540, exitCode: 0 } : event));
  const fail = () => setEvents(previous => previous.map(event => event.id === 'checks' ? { ...event, title: 'Order summary tests failed', status: 'failed', output: 'Expected total: 149.00\nReceived total: 159.00\nReview the shipping adjustment before continuing.', durationMs: 1540, exitCode: 1 } : event));
  return <ExampleGallery className="agent-activity-demo">
    <Showcase title="Expandable activity events" description="Each event shows its title and status. Expand a row to inspect its command, input, or recorded output." code={exampleCode}>
      <div className="agent-activity-demo-panel"><AgentActivity key={revision} events={events} announce initialVisibleCount={6} />
        <div className="agent-activity-demo-controls"><Button variant="secondary" size="sm" icon={Check} onClick={complete} disabled={current?.status === 'completed'}>Mark tests passed</Button><Button variant="secondary" size="sm" icon={TriangleAlert} onClick={fail} disabled={current?.status === 'failed'}>Mark tests failed</Button><Button variant="secondary" size="sm" icon={Plus} onClick={() => setEvents(previous => [...previous, { id: `update-${previous.length}`, kind: 'tool', title: 'Task update saved', status: 'completed', durationMs: 180, output: 'The local demonstration update was recorded.' }])}>Add activity</Button><Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => { setEvents(initialEvents); setRevision(value => value + 1); }}>Reset</Button></div>
        <Text size="body" className="agent-activity-demo-caption">These controls update local event state. They do not execute the displayed commands.</Text>
      </div>
    </Showcase>
    <Showcase title="Activity list" description="The footer lets you collapse long lists or scroll to their heading. Expand a row to read its full title." code={listCode}>
      <div className="agent-activity-demo-panel"><AgentActivity variant="list" titleLines="single" events={listEvents} /></div>
    </Showcase>
    <Showcase title="Interrupted events and empty output" description="Interrupted events retain their status. An event with no description or output shows its title in the details. The group header highlights on hover." code={recordedCode}>
      <div className="agent-activity-demo-panel"><AgentActivity label="Recorded session" events={recordedEvents} headerHighlight="hover" /></div>
    </Showcase>
  </ExampleGallery>;
}
