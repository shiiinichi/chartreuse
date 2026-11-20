import { useState } from 'react';
import { Activity, ArrowRight, Check, Clock3, FileText, Folder, GitBranch, MoreHorizontal, Network, Plus, Sparkles } from 'lucide-react';
import { AgentCard, Badge, Button, Checkbox, Dialog, EmptyState, IconButton, Progress, Select, Switch, Tabs, TaskCard, TextArea, TextField, WorkspaceContent, useToast, Text } from '../system';
import { ActivityFeed, taskBoardPreviewTask } from './TaskBoard';

export { ActivityFeed, CreateTaskDialog, TaskBoard } from './TaskBoard';

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

export function TaskPreview() {
  const [open, setOpen] = useState(false);
  const [checks, setChecks] = useState([true, true, true, false, false]);
  const task = taskBoardPreviewTask;
  const completed = checks.filter(Boolean).length;
  return <><TaskCard {...task} completed={completed} onClick={() => setOpen(true)} /><Dialog open={open} onOpenChange={setOpen} title={task.title} description={`${task.taskId} · Sample workspace`} footer={<Button size="sm" onClick={() => setOpen(false)}>Close<Check size={14} aria-hidden="true" /></Button>}><div className="stack"><Text size="body">{task.description}</Text><div className="demo-row"><Badge tone="info" dot>In progress</Badge><Badge tone="warning">High priority</Badge></div><span className="muted small"><GitBranch size={13} aria-hidden="true" /> {task.branch}</span><Progress value={completed} max={5} label={`${completed} of 5 checklist items complete`} />{['Define the status lanes', 'Implement task search', 'Connect the design tokens', 'Verify task detail interactions', 'Verify the responsive layout'].map((label, index) => <Checkbox key={label} label={label} checked={checks[index]} onChange={e => setChecks(previous => previous.map((checked, i) => i === index ? e.target.checked : checked))} />)}</div></Dialog></>;
}

export function AgentMonitor({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState('Research agent');
  const agents = [
    { name: 'Research agent', task: 'Inspecting the component API and dependencies.', status: 'running' as const, tokens: '2.4k', elapsed: '00:42' },
    { name: 'Builder agent', task: 'Implementing the task board components.', status: 'running' as const, tokens: '8.1k', elapsed: '02:18' },
    { name: 'Review agent', task: 'Waiting for the implementation to finish.', status: 'waiting' as const, tokens: '0', elapsed: '00:00' },
  ];
  const active = agents.find(agent => agent.name === selected)!;
  if (compact) return <div className="agent-compact"><div className="agent-compact-heading"><span className="agent-mini-mark"><Network size={17} aria-hidden="true" /></span><div><Text bold>Research agent</Text><span>Inspecting the component API and dependencies.</span></div><Badge tone="success" dot>Running</Badge></div><div className="agent-compact-progress"><span>Context window<span>24% used</span></span><Progress value={24} label="Context window 24 percent used" /></div><div className="agent-compact-footer"><span><Clock3 size={12} aria-hidden="true" />00:42</span><span>2.4k tokens</span><span><span className="cr-status-dot" /> Connected</span></div></div>;
  const panel = <div className="agent-pattern"><div className="agent-pattern-heading"><div><Badge>EXAMPLE WORKFLOW</Badge><Text size="heading-2">Agent execution</Text></div><Badge tone="success" dot>Connected</Badge></div><div className="agent-pattern-grid"><div className="agent-tree"><div className="agent-orchestrator"><span className="agent-mini-mark"><Sparkles size={17} aria-hidden="true" /></span><div><Text bold>Orchestrator</Text><span>Assigning tasks and tracking execution status.</span></div></div><div className="agent-tree-children">{agents.map(agent => <AgentCard {...agent} key={agent.name} selected={selected === agent.name} onClick={() => setSelected(agent.name)} />)}</div></div><div className="agent-inspector"><div className="inspector-title"><Network size={20} aria-hidden="true" /><Text size="heading-3">{selected}</Text><Badge tone={active.status === 'waiting' ? 'warning' : 'info'} dot>{active.status === 'waiting' ? 'Waiting' : 'Running'}</Badge></div><Text size="body">{active.task}</Text><div className="agent-stat-grid"><div><span>Elapsed</span><Text bold>{active.elapsed}</Text></div><div><span>Tokens used</span><Text bold>{active.tokens}</Text></div></div><div className="agent-compact-progress"><span>Context window<span>{selected === 'Review agent' ? '0' : '24'}% used</span></span><Progress value={selected === 'Review agent' ? 0 : 24} label="Agent context usage" /></div><Tabs label="Agent details" items={[{ value: 'activity', label: 'Activity', icon: Activity, content: selected === 'Review agent' ? <EmptyState icon={Clock3} title="Waiting for implementation" description="Review starts after the implementation completes." /> : <ActivityFeed /> }, { value: 'context', label: 'Context', icon: FileText, content: <div className="context-detail"><span className="eyebrow">CURRENT ASSIGNMENT</span><Text size="body">Implement the workspace task board using shared design tokens and components. Verify filtering, task dialogs, and status updates.</Text><Badge tone="neutral" icon={Folder}>sample-app</Badge></div> }]} /></div></div></div>;
  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">{panel}</WorkspaceContent>;
}
