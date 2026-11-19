import { useState } from 'react';
import { Activity, ArrowRight, Check, CheckCheck, Clock3, FileText, Folder, GitBranch, LayoutDashboard, MessageSquare, MoreHorizontal, Network, Plus, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { AgentCard, Alert, AvatarGroup, Badge, Button, Checkbox, Dialog, EmptyState, IconButton, Progress, Select, Switch, Tabs, TaskCard, TextArea, TextField, WorkspaceContent, useToast } from '../system';
import type { TaskCardProps } from '../system';
import { Swimlane } from '../system/Swimlane';

export function ButtonDemo({ compact = false }: { compact?: boolean }) {
  const notify = useToast();
  return <div className={`button-demo ${compact ? 'compact' : ''}`}><div className="demo-row">
    <Button icon={Plus} onClick={() => notify('Create task button activated')}>Create task</Button>
    <Button variant="secondary" onClick={() => notify('View details button activated', 'info')}>View details</Button>
    <Button variant="ghost" iconRight={ArrowRight} onClick={() => notify('Continue button activated', 'info')}>Continue</Button>
  </div><div className="demo-row"><Button variant="accent" icon={Sparkles} onClick={() => notify('Start workflow button activated')}>Start workflow</Button><Button variant="secondary" size="sm" icon={Check} onClick={() => notify('Save changes button activated')}>Save changes</Button><IconButton variant="secondary" icon={Plus} label="Add an item" size="sm" onClick={() => notify('Add item button activated')} /><IconButton icon={MoreHorizontal} label="More button options" size="sm" onClick={() => notify('More options button activated', 'info')} /></div></div>;
}

export function FormDemo({ compact = false }: { compact?: boolean }) {
  const notify = useToast();
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('medium');
  const [live, setLive] = useState(true);
  const [saved, setSaved] = useState(false);
  return <form className={`form-demo ${compact ? 'compact' : ''}`} onSubmit={event => {
    event.preventDefault(); setSaved(true); notify(`“${name}” created in this example with ${priority} priority`);
  }} aria-label="Create an example task">
    <TextField label="Task name" name="title" placeholder="Enter a task title" value={name} onChange={e => { setName(e.target.value); setSaved(false); }} required />
    {!compact && <TextArea label="Description" name="description" placeholder="Describe the task scope and acceptance criteria…" rows={3} />}
    <Select label="Priority" name="priority" value={priority} onChange={e => setPriority(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select>
    <div className="form-demo-footer"><Switch label="Live updates" checked={live} onChange={e => setLive(e.target.checked)} /><Button type="submit" size="sm" icon={saved ? Check : Plus}>{saved ? 'Task created' : 'Create task'}</Button></div>
  </form>;
}

const initialTasks: TaskCardProps[] = [
  { taskId: 'TASK-024', title: 'Implement the workspace task board', description: 'Add status lanes, task search, and task detail dialogs.', priority: 'high', status: 'in-progress', branch: 'feat/workspace', completed: 3, total: 5, assignees: ['Alex Morgan', 'Sam Lee'] },
  { taskId: 'TASK-025', title: 'Define shared task types', description: 'Document task status, priority, and assignee fields.', priority: 'medium', status: 'todo', completed: 0, total: 3, assignees: ['Jamie Park'] },
  { taskId: 'TASK-026', title: 'Review responsive task layouts', description: 'Verify card wrapping and keyboard access at each breakpoint.', priority: 'medium', status: 'review', branch: 'fix/refinements', completed: 4, total: 4, assignees: ['Taylor Reed'] },
  { taskId: 'TASK-027', title: 'Publish the design tokens', description: 'Export color, spacing, and typography tokens.', priority: 'low', status: 'done', completed: 6, total: 6, assignees: ['Sam Lee', 'Alex Morgan'] },
];

export function TaskPreview() {
  const [open, setOpen] = useState(false);
  const [checks, setChecks] = useState([true, true, true, false, false]);
  const task = initialTasks[0];
  const completed = checks.filter(Boolean).length;
  return <><TaskCard {...task} completed={completed} onClick={() => setOpen(true)} /><Dialog open={open} onOpenChange={setOpen} title={task.title} description={`${task.taskId} · Sample workspace`} footer={<Button size="sm" onClick={() => setOpen(false)}>Close<Check size={14} aria-hidden="true" /></Button>}><div className="stack"><p>{task.description}</p><div className="demo-row"><Badge tone="info" dot>In progress</Badge><Badge tone="warning">High priority</Badge></div><span className="muted small"><GitBranch size={13} aria-hidden="true" /> {task.branch}</span><Progress value={completed} max={5} label={`${completed} of 5 checklist items complete`} />{['Define the status lanes', 'Implement task search', 'Connect the design tokens', 'Verify task detail interactions', 'Verify the responsive layout'].map((label, index) => <Checkbox key={label} label={label} checked={checks[index]} onChange={e => setChecks(previous => previous.map((checked, i) => i === index ? e.target.checked : checked))} />)}</div></Dialog></>;
}

export function CreateTaskDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (task: TaskCardProps) => void }) {
  const notify = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskCardProps['priority']>('medium');
  return <Dialog open={open} onOpenChange={onOpenChange} title="Create task" description="Enter task details. Submit creates a task in local example state." footer={<><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" form="new-demo-task" icon={Plus}>Create task</Button></>}><form id="new-demo-task" className="stack" onSubmit={event => {
    event.preventDefault(); onCreate({ taskId: `TASK-${Date.now().toString().slice(-5)}`, title: name.trim(), description, priority, status: 'todo', completed: 0, total: 0, assignees: ['Sam Lee'] });
    notify(`“${name.trim()}” created in this example.`); onOpenChange(false); setName(''); setDescription(''); event.currentTarget.reset();
  }}><TextField label="Task name" name="title" value={name} onChange={e => setName(e.target.value)} pattern=".*\S.*" title="Enter a task name that includes text" placeholder="Enter a task title" autoFocus required /><TextArea label="Description" name="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the task scope and acceptance criteria…" rows={3} /><Select label="Priority" name="priority" value={priority} onChange={e => setPriority(e.target.value as TaskCardProps['priority'])}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></form></Dialog>;
}

export function TaskBoard({ workspace = false }: { workspace?: boolean }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<TaskCardProps['status']>('todo');
  const [selected, setSelected] = useState<TaskCardProps | null>(null);
  const notify = useToast();
  const columns = [
    { id: 'todo', name: 'To do', tone: 'neutral', description: 'Not started' }, { id: 'in-progress', name: 'In progress', tone: 'info', description: 'Implementation in progress' },
    { id: 'review', name: 'In review', tone: 'warning', description: 'Awaiting code review' }, { id: 'done', name: 'Done', tone: 'success', description: 'Implementation complete' },
  ] as const;
  const visible = tasks.filter(task => `${task.title} ${task.taskId}`.toLowerCase().includes(query.toLowerCase()));
  const board = <><div className="pattern-toolbar"><div><h2>Task board</h2><p>Filter tasks, inspect details, and update status.</p></div><Button icon={Plus} size="sm" onClick={() => { setNewStatus('todo'); setOpen(true); }}>New task</Button></div><div className="board-search"><TextField label="Find a task" name="taskSearch" type="search" icon={Search} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search this board…" /></div><div className="board-scroll" tabIndex={0} role="region" aria-label="Task board columns"><div className="demo-board">{columns.map(column => {
    const cards = visible.filter(task => task.status === column.id);
    const add = () => { setNewStatus(column.id); setOpen(true); };
    return <Swimlane key={column.id} title={column.name} count={cards.length} tone={column.tone} description={column.description} action={<IconButton size="sm" icon={Plus} label={`Add task to ${column.name}`} onClick={add} />} emptyContent={<Button className="board-lane-empty-action" variant="ghost" icon={Plus} onClick={add}>Add a task</Button>}>{cards.map(task => <TaskCard key={task.taskId} {...task} onClick={() => setSelected(task)} />)}</Swimlane>;
  })}</div></div></>;
  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">
    <div className={`pattern-workspace ${workspace ? '' : 'board-only'}`}>{workspace ? <><div className="pattern-workspace-top"><div><Badge>WORKSPACE / 01</Badge><h2>Development workspace</h2><p>Track task status, validation results, and workspace activity.</p></div><AvatarGroup names={['Alex Morgan', 'Sam Lee', 'Jamie Park']} /></div><Tabs label="Demo workspace views" items={[{ value: 'board', label: 'Board', icon: LayoutDashboard, count: tasks.length, content: board }, { value: 'validation', label: 'Validation', icon: ShieldCheck, content: <div className="stack"><Alert tone="success" title="Validation passed">All 12 checks passed in this example.</Alert><Button variant="secondary" size="sm" icon={CheckCheck} onClick={() => notify('Review marked complete')}>Mark reviewed</Button></div> }, { value: 'activity', label: 'Activity', icon: Activity, content: <ActivityFeed /> }]} /></> : board}</div><CreateTaskDialog open={open} onOpenChange={setOpen} onCreate={task => setTasks(previous => [...previous, { ...task, status: newStatus }])} /><Dialog open={!!selected} onOpenChange={next => { if (!next) setSelected(null); }} title={selected?.title || 'Task details'} description={selected?.taskId} footer={<Button onClick={() => setSelected(null)} size="sm">Done<Check size={14} aria-hidden="true" /></Button>}>{selected && <div className="stack"><p className="muted">{selected.description || 'No description provided.'}</p><Select label="Move task to" value={selected.status} onChange={e => {
    const status = e.target.value as TaskCardProps['status']; setTasks(previous => previous.map(task => task.taskId === selected.taskId ? { ...task, status } : task)); setSelected({ ...selected, status }); notify('Task status updated');
  }}>{columns.map(column => <option key={column.id} value={column.id}>{column.name}</option>)}</Select>{selected.branch && <p className="muted small"><GitBranch size={13} aria-hidden="true" /> {selected.branch}</p>}<AvatarGroup names={selected.assignees || []} /></div>}</Dialog>
  </WorkspaceContent>;
}

export function ActivityFeed() {
  return <ol className="activity-feed">{[{ icon: Check, title: 'Design tokens published', detail: 'Color, spacing, and typography tokens are available.', time: 'Just now' }, { icon: GitBranch, title: 'Branch created', detail: 'Created feat/workspace from main.', time: '2 min ago' }, { icon: MessageSquare, title: 'Workspace note added', detail: 'Alex added a note to the workspace.', time: '5 min ago' }].map(({ icon: Icon, title, detail, time }) => <li key={title}><span className="activity-feed-icon"><Icon size={14} aria-hidden="true" /></span><div><strong>{title}</strong><p>{detail}</p></div><time>{time}</time></li>)}</ol>;
}

export function AgentMonitor({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState('Research agent');
  const agents = [
    { name: 'Research agent', task: 'Inspecting the component API and dependencies.', status: 'running' as const, tokens: '2.4k', elapsed: '00:42' },
    { name: 'Builder agent', task: 'Implementing the task board components.', status: 'running' as const, tokens: '8.1k', elapsed: '02:18' },
    { name: 'Review agent', task: 'Waiting for the implementation to finish.', status: 'waiting' as const, tokens: '0', elapsed: '00:00' },
  ];
  const active = agents.find(agent => agent.name === selected)!;
  if (compact) return <div className="agent-compact"><div className="agent-compact-heading"><span className="agent-mini-mark"><Network size={17} aria-hidden="true" /></span><div><strong>Research agent</strong><span>Inspecting the component API and dependencies.</span></div><Badge tone="success" dot>Running</Badge></div><div className="agent-compact-progress"><span>Context window<span>24% used</span></span><Progress value={24} label="Context window 24 percent used" /></div><div className="agent-compact-footer"><span><Clock3 size={12} aria-hidden="true" />00:42</span><span>2.4k tokens</span><span><span className="cr-status-dot" /> Connected</span></div></div>;
  const panel = <div className="agent-pattern"><div className="agent-pattern-heading"><div><Badge>EXAMPLE WORKFLOW</Badge><h2>Agent execution</h2></div><Badge tone="success" dot>Connected</Badge></div><div className="agent-pattern-grid"><div className="agent-tree"><div className="agent-orchestrator"><span className="agent-mini-mark"><Sparkles size={17} aria-hidden="true" /></span><div><strong>Orchestrator</strong><span>Assigning tasks and tracking execution status.</span></div></div><div className="agent-tree-children">{agents.map(agent => <AgentCard {...agent} key={agent.name} selected={selected === agent.name} onClick={() => setSelected(agent.name)} />)}</div></div><div className="agent-inspector"><div className="inspector-title"><Network size={20} aria-hidden="true" /><h3>{selected}</h3><Badge tone={active.status === 'waiting' ? 'warning' : 'info'} dot>{active.status === 'waiting' ? 'Waiting' : 'Running'}</Badge></div><p>{active.task}</p><div className="agent-stat-grid"><div><span>Elapsed</span><strong>{active.elapsed}</strong></div><div><span>Tokens used</span><strong>{active.tokens}</strong></div></div><div className="agent-compact-progress"><span>Context window<span>{selected === 'Review agent' ? '0' : '24'}% used</span></span><Progress value={selected === 'Review agent' ? 0 : 24} label="Agent context usage" /></div><Tabs label="Agent details" items={[{ value: 'activity', label: 'Activity', icon: Activity, content: selected === 'Review agent' ? <EmptyState icon={Clock3} title="Waiting for implementation" description="Review starts after the implementation completes." /> : <ActivityFeed /> }, { value: 'context', label: 'Context', icon: FileText, content: <div className="context-detail"><span className="eyebrow">CURRENT ASSIGNMENT</span><p>Implement the workspace task board using shared design tokens and components. Verify filtering, task dialogs, and status updates.</p><Badge tone="neutral" icon={Folder}>sample-app</Badge></div> }]} /></div></div></div>;
  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">{panel}</WorkspaceContent>;
}
