import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Plus } from 'lucide-react';
import { IconButton, Table, type TableColumn } from '../../src/system';

type Task = { id: string; title: string };
const columns: TableColumn<Task>[] = [{ id: 'title', header: 'Task', rowHeader: true, render: task => task.title }];
const done = [{ id: 'T-1', title: 'Ship the palette' }, { id: 'T-2', title: 'Write the recipe' }];

function Fixture() {
  const [adds, setAdds] = useState(0);
  const [changes, setChanges] = useState<boolean[]>([]);
  return <main style={{ display: 'grid', gap: 24, padding: 24, maxInlineSize: 640 }}>
    <h1>Table fixture</h1>
    <Table label="Tasks by stage" columns={columns} getRowKey={task => task.id} groups={[
      { id: 'done', heading: 'Done', rows: done, count: done.length, tone: 'success', defaultCollapsed: false,
        onCollapsedChange: next => setChanges(current => [...current, next]),
        collapsedSummary: '2 tasks hidden',
        action: <IconButton icon={Plus} size="sm" label="Add card to Done" onClick={() => setAdds(count => count + 1)} /> },
      { id: 'plain', heading: 'Static group', rows: [{ id: 'T-3', title: 'Not collapsible' }], count: 1 },
    ]} />
    <output data-testid="state">adds:{adds} changes:{changes.join(',')}</output>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
