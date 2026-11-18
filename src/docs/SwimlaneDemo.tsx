import { useState } from 'react';
import { FolderOpen, RotateCcw } from 'lucide-react';
import { Badge, Button, Card, EmptyState, Grid, GridItem, IconButton, Swimlane } from '../system';
import { TaskBoard } from './Demos';
import { ExampleGallery, Showcase } from './shared';
import './swimlane-demo.css';

const statusLanes = [
  { title: 'In progress', tone: 'info', description: 'Implementation in progress', items: ['Inspect the public props', 'Build the component preview'] },
  { title: 'Awaiting implementation review', tone: 'warning', description: 'The count remains adjacent when the title wraps.', items: ['Compare the preview with its source'] },
] as const;

const boardCode = String.raw`import { useState } from 'react';
import { Check, GitBranch, Plus, Search } from 'lucide-react';
import { AvatarGroup, Button, Dialog, IconButton, Select, Swimlane,
  TaskCard, TextArea, TextField, useToast } from '@chartreuse/ui';
import type { TaskCardProps } from '@chartreuse/ui';

const initialTasks: TaskCardProps[] = [
  { taskId: 'TASK-024', title: 'Implement the workspace task board', description: 'Add status lanes, task search, and task detail dialogs.', priority: 'high', status: 'in-progress', branch: 'feat/workspace', completed: 3, total: 5, assignees: ['Alex Morgan', 'Sam Lee'] },
  { taskId: 'TASK-025', title: 'Define shared task types', description: 'Document task status, priority, and assignee fields.', priority: 'medium', status: 'todo', completed: 0, total: 3, assignees: ['Jamie Park'] },
  { taskId: 'TASK-026', title: 'Review responsive task layouts', description: 'Verify card wrapping and keyboard access at each breakpoint.', priority: 'medium', status: 'review', branch: 'fix/refinements', completed: 4, total: 4, assignees: ['Taylor Reed'] },
  { taskId: 'TASK-027', title: 'Publish the design tokens', description: 'Export color, spacing, and typography tokens.', priority: 'low', status: 'done', completed: 6, total: 6, assignees: ['Sam Lee', 'Alex Morgan'] },
];

function CreateTaskDialog({ open, onOpenChange, onCreate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: TaskCardProps) => void;
}) {
  const notify = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskCardProps['priority']>('medium');
  return <Dialog open={open} onOpenChange={onOpenChange}
    title="Create task"
    description="Enter task details. Submit creates a task in local example state."
    footer={<>
      <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
      <Button type="submit" form="new-demo-task" icon={Plus}>Create task</Button>
    </>}>
    <form id="new-demo-task" className="stack" onSubmit={event => {
      event.preventDefault();
      onCreate({ taskId: 'TASK-' + Date.now().toString().slice(-5),
        title: name.trim(), description, priority, status: 'todo',
        completed: 0, total: 0, assignees: ['Sam Lee'] });
      notify('“' + name.trim() + '” created in this example.');
      onOpenChange(false); setName(''); setDescription('');
      event.currentTarget.reset();
    }}>
      <TextField label="Task name" name="title" value={name}
        onChange={event => setName(event.target.value)} pattern=".*\S.*"
        title="Enter a task name that includes text"
        placeholder="Enter a task title" autoFocus required />
      <TextArea label="Description" name="description" value={description}
        onChange={event => setDescription(event.target.value)}
        placeholder="Describe the task scope and acceptance criteria…" rows={3} />
      <Select label="Priority" name="priority" value={priority}
        onChange={event => setPriority(event.target.value as TaskCardProps['priority'])}>
        <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
      </Select>
    </form>
  </Dialog>;
}

// Render inside your application's ToastProvider.
// The layout classes below belong to the surrounding board, not Swimlane.
export function TaskBoardExample() {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<TaskCardProps['status']>('todo');
  const [selected, setSelected] = useState<TaskCardProps | null>(null);
  const notify = useToast();
  const columns = [
    { id: 'todo', name: 'To do', tone: 'neutral', description: 'Not started' },
    { id: 'in-progress', name: 'In progress', tone: 'info', description: 'Implementation in progress' },
    { id: 'review', name: 'In review', tone: 'warning', description: 'Awaiting code review' },
    { id: 'done', name: 'Done', tone: 'success', description: 'Implementation complete' },
  ] as const;
  const visible = tasks.filter(task =>
    (task.title + ' ' + task.taskId).toLowerCase().includes(query.toLowerCase()));
  return <>
    <div className="pattern-workspace board-only">
      <div className="pattern-toolbar">
        <div><h2>Task board</h2><p>Filter tasks, inspect details, and update status.</p></div>
        <Button icon={Plus} size="sm" onClick={() => { setNewStatus('todo'); setOpen(true); }}>New task</Button>
      </div>
      <div className="board-search"><TextField label="Find a task" name="taskSearch"
        type="search" icon={Search} value={query}
        onChange={event => setQuery(event.target.value)} placeholder="Search this board…" /></div>
      <div className="board-scroll" tabIndex={0} role="region" aria-label="Task board columns">
        <div className="demo-board">{columns.map(column => {
          const cards = visible.filter(task => task.status === column.id);
          const add = () => { setNewStatus(column.id); setOpen(true); };
          return <Swimlane key={column.id} title={column.name} count={cards.length}
            tone={column.tone} description={column.description}
            action={<IconButton size="sm" icon={Plus} label={'Add task to ' + column.name} onClick={add} />}
            emptyContent={<Button className="board-lane-empty-action" variant="ghost" icon={Plus} onClick={add}>Add a task</Button>}>
            {cards.map(task => <TaskCard key={task.taskId} {...task} onClick={() => setSelected(task)} />)}
          </Swimlane>;
        })}</div>
      </div>
    </div>
    <CreateTaskDialog open={open} onOpenChange={setOpen}
      onCreate={task => setTasks(previous => [...previous, { ...task, status: newStatus }])} />
    <Dialog open={!!selected} onOpenChange={next => { if (!next) setSelected(null); }}
      title={selected?.title || 'Task details'} description={selected?.taskId}
      footer={<Button onClick={() => setSelected(null)} size="sm">Done<Check size={14} aria-hidden="true" /></Button>}>
      {selected && <div className="stack">
        <p className="muted">{selected.description || 'No description provided.'}</p>
        <Select label="Move task to" value={selected.status} onChange={event => {
          const status = event.target.value as TaskCardProps['status'];
          setTasks(previous => previous.map(task => task.taskId === selected.taskId ? { ...task, status } : task));
          setSelected({ ...selected, status }); notify('Task status updated');
        }}>{columns.map(column => <option key={column.id} value={column.id}>{column.name}</option>)}</Select>
        {selected.branch && <p className="muted small"><GitBranch size={13} aria-hidden="true" /> {selected.branch}</p>}
        <AvatarGroup names={selected.assignees || []} />
      </div>}
    </Dialog>
  </>;
}`;

export function SwimlaneDemo() {
  const [hasNote, setHasNote] = useState(false);
  return <ExampleGallery className="swimlane-demo" maxColumns={2}>
    <Showcase title="Status heading and item count" description="The count prop sets the item count. Long titles wrap while the count remains beside the status tag." code={`import { Card, Grid, GridItem, Swimlane } from '@chartreuse/ui';

const lanes = ${JSON.stringify(statusLanes, null, 2)} as const;

<div style={{ width: '100%', maxWidth: 800, margin: 0 }}>
  <Grid columns={{ base: 1, sm: 2 }} gap={4}>
    {lanes.map(lane => <GridItem key={lane.title} span={1}>
      <Swimlane title={lane.title} tone={lane.tone}
        count={lane.items.length} description={lane.description}>
        {lane.items.map(item => <Card key={item} style={{ padding: 16 }}>{item}</Card>)}
      </Swimlane>
    </GridItem>)}
  </Grid>
</div>`}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 2 }} gap={4}>{statusLanes.map(lane => <GridItem key={lane.title} span={1}><Swimlane title={lane.title} tone={lane.tone} count={lane.items.length} description={lane.description}>{lane.items.map(item => <Card key={item} style={{ padding: 16 }}>{item}</Card>)}</Swimlane></GridItem>)}</Grid></div></Showcase>
    <Showcase title="Custom empty state and reference content" description="emptyContent renders when the lane has no children. Add a reference card, then clear it with the header action." code={`import { useState } from 'react';
import { FolderOpen, RotateCcw } from 'lucide-react';
import { Badge, Button, Card, EmptyState, IconButton, Swimlane } from '@chartreuse/ui';

export function ReferenceLane() {
  const [hasNote, setHasNote] = useState(false);
  return <div style={{ width: '100%', maxWidth: 420, margin: 0 }}>
    <Swimlane title="Reference notes" count={hasNote ? 1 : 0}
      description={<p>Review the <strong>definition of done</strong> before closing the task.</p>}
      action={<IconButton icon={RotateCcw} label="Reset reference lane" size="sm"
        disabled={!hasNote} onClick={() => setHasNote(false)} />}
      emptyContent={<EmptyState icon={FolderOpen} title="No reference notes"
        description="Add the acceptance criteria for this review."
        action={<Button variant="secondary" onClick={() => setHasNote(true)}>Add reference note</Button>} />}>
      {hasNote ? <Card style={{ padding: 16 }}>
        <Badge tone="info">Reference</Badge><h4>Definition of done</h4>
        <p>An example is complete when its preview matches the displayed source.</p>
        <ul><li>Use the public component API.</li><li>Verify labels and responsive layout.</li></ul>
      </Card> : null}
    </Swimlane>
  </div>;
}`}><div style={{ width: '100%', maxWidth: 420, margin: 0 }}><Swimlane title="Reference notes" count={hasNote ? 1 : 0} description={<p>Review the <strong>definition of done</strong> before closing the task.</p>} action={<IconButton icon={RotateCcw} label="Reset reference lane" size="sm" disabled={!hasNote} onClick={() => setHasNote(false)} />} emptyContent={<EmptyState icon={FolderOpen} title="No reference notes" description="Add the acceptance criteria for this review." action={<Button variant="secondary" onClick={() => setHasNote(true)}>Add reference note</Button>} />}>{hasNote ? <Card style={{ padding: 16 }}><Badge tone="info">Reference</Badge><h4>Definition of done</h4><p>An example is complete when its preview matches the displayed source.</p><ul><li>Use the public component API.</li><li>Verify labels and responsive layout.</li></ul></Card> : null}</Swimlane></div></Showcase>
    <Showcase span="full" title="Task board with status lanes" description="Filter tasks across all four lanes, create tasks, inspect details, and update their status. The source includes each interaction." code={boardCode}><TaskBoard /></Showcase>
  </ExampleGallery>;
}
