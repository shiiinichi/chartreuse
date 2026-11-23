import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AvatarGroup, Badge, IconButton, Table, type CategoryColor, type TableColumn } from '../../system';

type Task = { id: string; title: string; priority: 'low' | 'medium' | 'high'; assignees: string[] };
type Stage = { id: string; title: string; accent: CategoryColor; tasks: Task[] };

const stages: Stage[] = [
  { id: 'todo', title: 'To do', accent: 'cat-2', tasks: [
    { id: 'TASK-301', title: 'Audit color contrast across every board view and status color', priority: 'high', assignees: ['Sam Lee'] },
  ] },
  { id: 'doing', title: 'In progress', accent: 'cat-3', tasks: [
    { id: 'TASK-302', title: 'Add the comfortable table density', priority: 'medium', assignees: ['Alex Morgan', 'Sam Lee'] },
    { id: 'TASK-303', title: 'Write the grouped table recipe', priority: 'low', assignees: [] },
  ] },
  { id: 'review', title: 'In review', accent: 'cat-1', tasks: [] },
  { id: 'done', title: 'Done', accent: 'cat-6', tasks: [
    { id: 'TASK-304', title: 'Ship the category palette', priority: 'medium', assignees: ['Alex Morgan'] },
  ] },
];

const columns: TableColumn<Task>[] = [
  { id: 'title', header: 'Task', rowHeader: true, truncate: true, width: 320, render: task => task.title },
  { id: 'id', header: 'ID', width: 104, render: task => <span className="cr-mono">{task.id}</span> },
  { id: 'priority', header: 'Priority', width: 112,
    render: task => <Badge tone={task.priority === 'high' ? 'warning' : 'neutral'}>{task.priority}</Badge> },
  { id: 'assignees', header: 'Assignees', render: task => task.assignees.length ? <AvatarGroup names={task.assignees} /> : '—' },
];

export function GroupedTableRecipe() {
  const [collapsed, setCollapsed] = useState<string[]>(['done']);
  return <Table label="Tasks by stage" density="comfortable" columns={columns} getRowKey={task => task.id}
    getRowHref={task => `#tasks/${task.id}`}
    groups={stages.map(stage => ({
      id: stage.id, heading: stage.title, rows: stage.tasks, count: stage.tasks.length, accent: stage.accent,
      emptyContent: 'No tasks in this stage.',
      collapsed: collapsed.includes(stage.id),
      onCollapsedChange: next => setCollapsed(current => next ? [...current, stage.id] : current.filter(id => id !== stage.id)),
      collapsedSummary: `${stage.tasks.length} ${stage.tasks.length === 1 ? 'task' : 'tasks'} hidden`,
      action: <IconButton icon={Plus} size="sm" label={`Add a task to ${stage.title}`} />,
    }))} />;
}
