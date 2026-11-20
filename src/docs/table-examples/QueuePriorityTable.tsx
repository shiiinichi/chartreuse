import { useState } from 'react';
import { Select, Table, type TableColumn } from '../../system';

const priorities = ['Low', 'Normal', 'High'] as const;
type Priority = (typeof priorities)[number];
type Queue = { id: string; name: string; waiting: number; priority: Priority };

const initialQueues: Queue[] = [
  { id: 'preview', name: 'Design previews', waiting: 8, priority: 'Normal' },
  { id: 'publish', name: 'Release publishing', waiting: 2, priority: 'High' },
  { id: 'cleanup', name: 'Artifact cleanup', waiting: 13, priority: 'Low' },
];

export function QueuePriorityTable() {
  const [queues, setQueues] = useState(initialQueues);

  function setPriority(id: string, priority: Priority) {
    setQueues(previous => previous.map(queue => queue.id === id ? { ...queue, priority } : queue));
  }

  const columns: TableColumn<Queue>[] = [
    { id: 'queue', header: 'Queue', rowHeader: true, render: queue => queue.name },
    { id: 'waiting', header: 'Jobs waiting', align: 'end', render: queue => queue.waiting },
    {
      id: 'priority',
      header: 'Priority',
      render: queue => <div style={{ minInlineSize: '6.5rem', maxInlineSize: '10rem' }}>
        <Select label={`Priority for ${queue.name}`} hideLabel size="sm" value={queue.priority}
          onChange={event => setPriority(queue.id, event.currentTarget.value as Priority)}>
          {priorities.map(priority => <option key={priority}>{priority}</option>)}
        </Select>
      </div>,
    },
  ];

  return <Table label="Job queue priorities" columns={columns} rows={queues} getRowKey={queue => queue.id} />;
}
