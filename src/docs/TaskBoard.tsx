import { useId, useMemo, useRef, useState } from 'react';
import { Activity, Check, CheckCheck, GitBranch, LayoutDashboard, List, MessageSquare, Plus, Search, ShieldCheck } from 'lucide-react';
import { Alert, AvatarGroup, Badge, Button, Dialog, IconButton, SegmentedControl, Select, Swimlane, Tabs, TaskCard, Text, TextArea, TextField, WorkspaceContent, useToast } from '../system';
import type { TaskCardProps } from '../system';
import { BoardTaskList } from './BoardTaskList';
import './task-board.css';

export const taskBoardPreviewTask: TaskCardProps = { taskId: 'TASK-024', title: 'Implement the workspace task board', description: 'Add status lanes, task search, and task detail dialogs.', priority: 'high', status: 'in-progress', branch: 'feat/workspace', completed: 3, total: 5, assignees: ['Alex Morgan', 'Sam Lee'] };

const boardTasks: TaskCardProps[] = [
  taskBoardPreviewTask,
  { taskId: 'TASK-025', title: 'Define shared task types', description: 'Document task status, priority, and assignee fields.', priority: 'medium', status: 'todo', completed: 0, total: 3, assignees: ['Jamie Park'] },
  { taskId: 'TASK-026', title: 'Review responsive task layouts', description: 'Verify card wrapping and keyboard access at each breakpoint.', priority: 'medium', status: 'review', branch: 'fix/refinements', completed: 4, total: 4, assignees: ['Taylor Reed'] },
  { taskId: 'TASK-027', title: 'Publish the design tokens', description: 'Export color, spacing, and typography tokens.', priority: 'low', status: 'done', completed: 6, total: 6, assignees: ['Sam Lee', 'Alex Morgan'] },
  { taskId: 'TASK-028', title: 'Schedule the keyboard walkthrough', description: 'Set aside time to verify the board with keyboard navigation.', priority: 'medium', status: 'todo', completed: 0, total: 3, assignees: ['Taylor Reed'] },
  { taskId: 'TASK-029', title: 'Document the component states', description: 'Add examples for focus, loading, and empty results.', priority: 'medium', status: 'in-progress', branch: 'docs/component-states', completed: 2, total: 4, assignees: ['Jamie Park'] },
  { taskId: 'TASK-030', title: 'Check focus ring contrast', description: 'Review focus indicators on both light and dark surfaces.', priority: 'high', status: 'review', completed: 3, total: 3, assignees: ['Sam Lee'] },
  { taskId: 'TASK-031', title: 'Verify dark mode tokens', description: 'Confirm the workspace resolves the dark color palette.', priority: 'medium', status: 'done', completed: 4, total: 4, assignees: ['Alex Morgan'] },
  { taskId: 'TASK-032', title: 'Archive the prototype notes', description: 'Save the workshop notes with the original sketches.', priority: 'low', status: 'done', completed: 2, total: 2, assignees: ['Taylor Reed', 'Jamie Park'] },
];

const taskStatuses = [
  { id: 'todo', name: 'To do', tone: 'neutral', description: 'Not started' },
  { id: 'in-progress', name: 'In progress', tone: 'info', description: 'Implementation in progress' },
  { id: 'review', name: 'In review', tone: 'warning', description: 'Awaiting code review' },
  { id: 'done', name: 'Done', tone: 'success', description: 'Implementation complete' },
] as const;

type WorkspaceTaskStatus = (typeof taskStatuses)[number]['id'];

const taskViews = [
  { value: 'board', label: 'Board', icon: LayoutDashboard },
  { value: 'list', label: 'List', icon: List },
];

export function CreateTaskDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (task: TaskCardProps) => void }) {
  const notify = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskCardProps['priority']>('medium');
  return <Dialog open={open} onOpenChange={onOpenChange} title="Create task" description="Enter task details. Submit creates a task in local example state." footer={<><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" form="new-demo-task" icon={Plus}>Create task</Button></>}><form id="new-demo-task" className="board-task-stack" onSubmit={event => {
    event.preventDefault(); onCreate({ taskId: `TASK-${Date.now().toString().slice(-5)}`, title: name.trim(), description, priority, status: 'todo', completed: 0, total: 0, assignees: ['Sam Lee'] });
    notify(`“${name.trim()}” created in this example.`); onOpenChange(false); setName(''); setDescription(''); event.currentTarget.reset();
  }}><TextField label="Task name" name="title" value={name} onChange={e => setName(e.target.value)} pattern=".*\S.*" title="Enter a task name that includes text" placeholder="Enter a task title" autoFocus required /><TextArea label="Description" name="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the task scope and acceptance criteria…" rows={3} /><Select label="Priority" name="priority" value={priority} onChange={e => setPriority(e.target.value as TaskCardProps['priority'])}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></form></Dialog>;
}

export function TaskBoard({ workspace = false }: { workspace?: boolean }) {
  const [tasks, setTasks] = useState(boardTasks);
  const [view, setView] = useState('board');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<WorkspaceTaskStatus>('todo');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const viewName = useId();
  const viewControl = useRef<HTMLFieldSetElement>(null);
  const notify = useToast();

  const groups = useMemo(() => {
    const statusGroups = taskStatuses.map(status => ({ ...status, tasks: [] as TaskCardProps[] }));
    const groupsByStatus = new Map(statusGroups.map(group => [group.id, group]));
    const search = query.toLowerCase();
    for (const task of tasks) {
      if (`${task.title} ${task.taskId}`.toLowerCase().includes(search)) {
        groupsByStatus.get(task.status ?? 'todo')?.tasks.push(task);
      }
    }
    return statusGroups;
  }, [tasks, query]);

  const selected = selectedTaskId ? tasks.find(task => task.taskId === selectedTaskId) : undefined;
  function openTask(task: TaskCardProps) {
    setSelectedTaskId(task.taskId);
  }
  function closeTask() {
    setSelectedTaskId(null);
    const control = viewControl.current;
    if (!control) return;
    const { activeElement, body } = control.ownerDocument;
    // Moving a task can remove the button that originally opened its dialog.
    if (activeElement === body || activeElement?.closest('dialog:not([open])')) {
      control.querySelector<HTMLInputElement>('input:checked')?.focus();
    }
  }
  function addTask(status: WorkspaceTaskStatus) {
    setNewStatus(status);
    setOpen(true);
  }

  const board = <>
    <div className="pattern-toolbar">
      <div>
        <Text size="heading-2">Task board</Text>
        <Text size="body">Filter tasks, inspect details, and update status.</Text>
      </div>
      <Button icon={Plus} size="sm" onClick={() => addTask('todo')}>New task</Button>
    </div>
    <div className="board-controls">
      <div className="board-search">
        <TextField label="Find a task" name="taskSearch" type="search" icon={Search}
          value={query} onChange={event => setQuery(event.target.value)} placeholder="Search this board…" />
      </div>
      <SegmentedControl label="Task view" name={`task-view-${viewName}`} options={taskViews}
        value={view} onValueChange={setView} ref={viewControl} hideLabel />
    </div>
    {view === 'list' ? <BoardTaskList key={query} groups={groups} onOpen={openTask} onAdd={addTask} /> :
      <div className="board-scroll" tabIndex={0} role="region" aria-label="Task board columns">
        <div className="demo-board">{groups.map(({ id, name, tone, description, tasks: cards }) => {
          const add = () => addTask(id);
          return <Swimlane key={id} title={name} count={cards.length} tone={tone} description={description}
            action={<IconButton size="sm" icon={Plus} label={`Add task to ${name}`} onClick={add} />}
            emptyContent={<Button className="board-lane-empty-action" variant="ghost" icon={Plus} onClick={add}>Add a task</Button>}>
            {cards.map(task => <TaskCard key={task.taskId} {...task} onClick={() => openTask(task)} />)}
          </Swimlane>;
        })}</div>
      </div>}
  </>;

  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">
    <div className={`pattern-workspace ${workspace ? '' : 'board-only'}`}>{workspace ? <>
      <div className="pattern-workspace-top"><div><Badge>WORKSPACE / 01</Badge><Text size="heading-2">Development workspace</Text><Text size="body">Track task status, validation results, and workspace activity.</Text></div><AvatarGroup names={['Alex Morgan', 'Sam Lee', 'Jamie Park']} /></div>
      <Tabs label="Demo workspace views" items={[
        { value: 'board', label: 'Board', icon: LayoutDashboard, count: tasks.length, content: board },
        { value: 'validation', label: 'Validation', icon: ShieldCheck, content: <div className="board-task-stack"><Alert tone="success" title="Validation passed">All 12 checks passed in this example.</Alert><Button variant="secondary" size="sm" icon={CheckCheck} onClick={() => notify('Review marked complete')}>Mark reviewed</Button></div> },
        { value: 'activity', label: 'Activity', icon: Activity, content: <ActivityFeed /> },
      ]} />
    </> : board}</div>
    <CreateTaskDialog open={open} onOpenChange={setOpen}
      onCreate={task => setTasks(previous => [...previous, { ...task, status: newStatus }])} />
    <Dialog open={!!selected} onOpenChange={next => { if (!next) closeTask(); }}
      title={selected?.title || 'Task details'} description={selected?.taskId}
      footer={<Button onClick={() => setSelectedTaskId(null)} size="sm">Done<Check size={14} aria-hidden="true" /></Button>}>
      {selected && <div className="board-task-stack">
        <Text size="body" className="board-task-description">{selected.description || 'No description provided.'}</Text>
        <Select label="Move task to" value={selected.status ?? 'todo'} onChange={event => {
          const status = event.target.value as WorkspaceTaskStatus;
          setTasks(previous => previous.map(task => task.taskId === selected.taskId ? { ...task, status } : task));
          notify('Task status updated');
        }}>
          {taskStatuses.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
        </Select>
        {selected.branch && <Text size="body" className="board-task-branch"><GitBranch size={13} aria-hidden="true" /> {selected.branch}</Text>}
        <AvatarGroup names={selected.assignees || []} />
      </div>}
    </Dialog>
  </WorkspaceContent>;
}

export function ActivityFeed() {
  return <ol className="activity-feed">{[{ icon: Check, title: 'Design tokens published', detail: 'Color, spacing, and typography tokens are available.', time: 'Just now' }, { icon: GitBranch, title: 'Branch created', detail: 'Created feat/workspace from main.', time: '2 min ago' }, { icon: MessageSquare, title: 'Workspace note added', detail: 'Alex added a note to the workspace.', time: '5 min ago' }].map(({ icon: Icon, title, detail, time }) => <li key={title}><span className="activity-feed-icon"><Icon size={14} aria-hidden="true" /></span><div><Text bold>{title}</Text><Text size="body">{detail}</Text></div><time>{time}</time></li>)}</ol>;
}
