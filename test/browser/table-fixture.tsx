import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Plus } from 'lucide-react';
import { IconButton, Table, type TableColumn } from '../../src/system';

type Task = { id: string; title: string };
const columns: TableColumn<Task>[] = [{ id: 'title', header: 'Task', rowHeader: true, render: task => task.title }];
type Run = { id: string; title: string; agent: string; branch: string };
const runs: Run[] = [{ id: 'R-1', title: 'Reconcile the order summary totals with the shipping adjustments recorded in the review notes', agent: 'Claude Opus reviewer agent', branch: 'feature/order-summary-shipping-adjustments' }];
const runColumns: TableColumn<Run>[] = [
  { id: 'title', header: 'Run', rowHeader: true, truncate: true, render: run => run.title },
  { id: 'agent', header: 'Agent', width: 140, truncate: true, render: run => run.agent },
  { id: 'branch', header: 'Branch', width: 160, truncate: true, render: run => run.branch },
];
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
    <div style={{ inlineSize: 520 }} data-testid="truncate-click">
      <Table label="Runs with row clicks" density="comfortable" columns={runColumns} getRowKey={run => run.id} onRowClick={() => setAdds(count => count + 1)} rows={runs} />
    </div>
    <div style={{ inlineSize: 520 }} data-testid="truncate-href">
      <Table label="Runs with row links" density="comfortable" columns={runColumns} getRowKey={run => run.id} getRowHref={run => `#runs/${run.id}`} rows={runs} />
    </div>
    <output data-testid="state">adds:{adds} changes:{changes.join(',')}</output>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
