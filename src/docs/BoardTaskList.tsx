import { useState } from 'react';
import { Plus, TriangleAlert } from 'lucide-react';
import { AvatarGroup, Badge, Button, IconButton, Table } from '../system';
import type { TableColumn, TaskCardProps, TaskCardStatus, Tone } from '../system';
import './board-task-list.css';

type BoardStatus = TaskCardStatus;

interface BoardTaskListProps {
  groups: readonly {
    id: BoardStatus;
    name: string;
    tone: Tone;
    tasks: readonly TaskCardProps[];
  }[];
  onOpen: (task: TaskCardProps) => void;
  onAdd: (status: BoardStatus) => void;
}

const tasksPerPage = 8;
const priorities = { high: 'High', medium: 'Medium', low: 'Low' };

export function BoardTaskList({ groups, onOpen, onAdd }: BoardTaskListProps) {
  const [page, setPage] = useState(1);
  const taskCount = groups.reduce((count, group) => count + group.tasks.length, 0);
  const pageCount = Math.ceil(taskCount / tasksPerPage);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const pageStart = (currentPage - 1) * tasksPerPage;
  const pageEnd = pageStart + tasksPerPage;

  const columns: TableColumn<TaskCardProps>[] = [
    {
      id: 'task',
      header: 'Task',
      rowHeader: true,
      render: task => <Button className="board-list-task" size="sm" variant="ghost" onClick={() => onOpen(task)}>
        <span className="board-list-task-title">{task.title}</span>
        <span className="board-list-task-id">{task.taskId}</span>
      </Button>,
    },
    {
      id: 'priority',
      header: 'Priority',
      render: ({ priority = 'medium' }) => <Badge tone={priority === 'high' ? 'warning' : 'neutral'}
        icon={priority === 'high' ? TriangleAlert : undefined}>{priorities[priority]}</Badge>,
    },
    {
      id: 'assignees',
      header: 'Assignees',
      render: ({ assignees }) => assignees?.length
        ? <AvatarGroup names={assignees} />
        : <span className="board-list-unassigned">Unassigned</span>,
    },
    {
      id: 'checklist',
      header: 'Checklist',
      align: 'end',
      render: ({ completed = 0, total = 0 }) => <span className="board-list-checklist">
        <span aria-hidden="true">{total > 0 ? `${completed}/${total}` : '—'}</span>
        <span className="cr-sr-only">{total > 0 ? `${completed} of ${total} complete` : 'No checklist'}</span>
      </span>,
    },
  ];

  let groupStart = 0;
  const tableGroups = groups.map(({ id, name, tone, tasks }) => {
    const rows = tasks.slice(Math.max(0, pageStart - groupStart), Math.max(0, pageEnd - groupStart));
    groupStart += tasks.length;

    return {
      id,
      heading: <div className="board-list-group">
        <Badge tone={tone} dot>{name}</Badge>
        <span className="board-list-count">{tasks.length}<span className="cr-sr-only"> {tasks.length === 1 ? 'task' : 'tasks'}</span></span>
        <IconButton className="board-list-add" icon={Plus} size="sm" label={`Add task to ${name}`} onClick={() => onAdd(id)} />
      </div>,
      rows,
      emptyContent: tasks.length ? 'No tasks on this page' : 'No tasks',
    };
  });

  return <div className="board-task-list">
    <Table<TaskCardProps> label="Tasks by status" columns={columns} getRowKey={task => task.taskId} groups={tableGroups}
      pagination={pageCount > 1 ? {
        page: currentPage,
        pageCount,
        onPageChange: setPage,
        'aria-label': 'Task list pages',
      } : undefined} />
  </div>;
}
